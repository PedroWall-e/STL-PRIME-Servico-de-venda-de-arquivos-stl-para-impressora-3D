import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    try {
        const cookieStore = cookies();
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    get(name: string) {
                        return cookieStore.get(name)?.value
                    },
                },
            }
        );

        // 1. Authenticate Admin
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { data: profile } = await supabase
            .from('users')
            .select('role')
            .eq('id', user.id)
            .single();

        if (profile?.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // Initialize Admin Client to bypass RLS for aggregate counts
        const supabaseAdmin = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!,
            {
                cookies: {
                    get(name: string) { return cookieStore.get(name)?.value }
                }
            }
        );

        // 2. Fetch Metrics
        // Total Users
        const { count: totalUsers } = await supabaseAdmin
            .from('users')
            .select('*', { count: 'exact', head: true });

        // Total Sales (Purchases count)
        const { count: totalSales } = await supabaseAdmin
            .from('purchases')
            .select('*', { count: 'exact', head: true });

        // Gross Revenue (Sum of amount_paid)
        // Note: Supabase JS doesn't have a direct SUM function in JS client without RPC.
        // We will fetch all amount_paid and reduce, or we can use RPC. 
        // Given typically low volume for MVP, fetching is fine, but RPC is better.
        // Let's fetch the amounts.
        const { data: purchases } = await supabaseAdmin
            .from('purchases')
            .select('amount_paid');

        const grossRevenue = (purchases || []).reduce((sum, p) => sum + (Number(p.amount_paid) || 0), 0);

        return NextResponse.json({
            totalUsers: totalUsers || 0,
            totalSales: totalSales || 0,
            grossRevenue: grossRevenue
        });

    } catch (error: any) {
        console.error('[Admin Metrics Error]', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
