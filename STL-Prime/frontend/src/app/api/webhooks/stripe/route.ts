import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Tell Next.js this is always dynamic (never statically collected)
export const dynamic = 'force-dynamic';


// Guard: Stripe webhook requires real credentials to function.
// The module-level init is deferred to inside the handler to avoid build-time crashes.

export async function POST(req: NextRequest) {
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!stripeKey || !webhookSecret || !supabaseUrl || !serviceRoleKey) {
        console.error('[Webhook] Missing required environment variables.');
        return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
    }

    const stripe = new Stripe(stripeKey, { apiVersion: '2026-02-25.clover' });
    const { createClient } = await import('@supabase/supabase-js');
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

    const body = await req.text();
    const sig = req.headers.get('stripe-signature');

    let event: Stripe.Event;
    try {
        event = stripe.webhooks.constructEvent(body, sig!, webhookSecret);
    } catch (err: any) {
        console.error('[Webhook Error]', err.message);
        return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.user_id;

        if (session.mode === 'payment') {
            const itemIds = session.metadata?.item_ids?.split(',') || [];
            const purchases = itemIds.map((modelId) => ({
                user_id: userId,
                model_id: modelId,
                stripe_payment_id: session.payment_intent as string,
                amount_paid: session.amount_total ? session.amount_total / 100 : 0,
            }));

            if (purchases.length > 0) {
                const { error } = await supabaseAdmin.from('purchases').insert(purchases);
                if (error) console.error('[Webhook DB Error - Purchase]', error);
            }
        } else if (session.mode === 'subscription') {
            const planType = session.metadata?.plan_type;
            const subscriptionId = session.subscription as string;

            // Update user profile
            const { error: userError } = await supabaseAdmin
                .from('users')
                .update({
                    subscription_status: planType,
                    subscription_id: subscriptionId,
                    stripe_customer_id: session.customer as string
                })
                .eq('id', userId);

            if (userError) console.error('[Webhook DB Error - User Sub]', userError);

            // Fetch subscription details
            const subscription = await stripe.subscriptions.retrieve(subscriptionId) as any;

            // Insert into user_subscriptions
            const { error: subError } = await supabaseAdmin.from('user_subscriptions').insert({
                user_id: userId,
                stripe_subscription_id: subscriptionId,
                plan_type: planType,
                status: subscription.status,
                current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
                current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            });

            if (subError) console.error('[Webhook DB Error - Sub Log]', subError);
        }
    }

    if (event.type === 'customer.subscription.deleted' || event.type === 'customer.subscription.updated') {
        const subscription = event.data.object as any;
        const status = subscription.status;

        // Update user profile status
        const { error } = await supabaseAdmin
            .from('users')
            .update({
                subscription_status: status === 'active' ? undefined : 'free' // Simplified
            })
            .eq('subscription_id', subscription.id);

        // Update user_subscriptions table
        await supabaseAdmin
            .from('user_subscriptions')
            .update({
                status: status,
                current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
                cancel_at_period_end: subscription.cancel_at_period_end
            })
            .eq('stripe_subscription_id', subscription.id);
    }

    return NextResponse.json({ received: true });
}
