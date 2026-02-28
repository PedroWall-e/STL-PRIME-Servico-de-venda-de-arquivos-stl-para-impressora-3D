import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export const dynamic = 'force-dynamic';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2026-02-25.clover',
});

const PLANS = {
    pro: {
        name: 'STL Prime Pro',
        priceId: process.env.STRIPE_PRO_PRICE_ID, // Deve ser configurado no env
        amount: 29.90
    },
    premium: {
        name: 'STL Prime Premium',
        priceId: process.env.STRIPE_PREMIUM_PRICE_ID, // Deve ser configurado no env
        amount: 49.90
    }
};

export async function POST(req: NextRequest) {
    try {
        const { plan, userId } = await req.json();

        if (!plan || !PLANS[plan as keyof typeof PLANS]) {
            return NextResponse.json({ error: 'Plano inválido' }, { status: 400 });
        }

        const selectedPlan = PLANS[plan as keyof typeof PLANS];
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3050';

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'brl',
                        product_data: {
                            name: selectedPlan.name,
                            description: `Assinatura mensal para acesso a modelos e benefícios exclusivos.`,
                        },
                        unit_amount: Math.round(selectedPlan.amount * 100),
                        recurring: { interval: 'month' },
                    },
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: `${appUrl}/dashboard?payment=success&plan=${plan}`,
            cancel_url: `${appUrl}/dashboard?payment=cancelled`,
            metadata: {
                user_id: userId,
                plan_type: plan,
            },
        });

        return NextResponse.json({ url: session.url });
    } catch (error: any) {
        console.error('[Stripe Subscription Error]', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
