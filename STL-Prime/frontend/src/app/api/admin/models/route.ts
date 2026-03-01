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
                cookies: { get(name: string) { return cookieStore.get(name)?.value } }
            }
        );

        // 1. Authenticate Admin
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { data: profile } = await supabase.from('users').select('role').eq('id', user.id).single();
        if (profile?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

        // Initialize Admin Client
        const supabaseAdmin = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!,
            { cookies: { get(name: string) { return cookieStore.get(name)?.value } } }
        );

        // Fetch Pending Models
        const { data: models, error } = await supabaseAdmin
            .from('models')
            .select(`
                id, title, thumbnail_url, format, price, is_free, status, created_at,
                author:users!author_id(full_name, username, trust_level, subscription_status)
            `)
            .eq('status', 'pending')
            .order('created_at', { ascending: false });

        if (error) throw error;

        return NextResponse.json(models);
    } catch (error: any) {
        console.error('[Admin Models GET Error]', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const { id, status } = await req.json();

        if (!id || !['approved', 'rejected'].includes(status)) {
            return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
        }

        const cookieStore = cookies();
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            { cookies: { get(name: string) { return cookieStore.get(name)?.value } } }
        );

        // 1. Authenticate Admin
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { data: profile } = await supabase.from('users').select('role').eq('id', user.id).single();
        if (profile?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

        // Initialize Admin Client
        const supabaseAdmin = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!,
            { cookies: { get(name: string) { return cookieStore.get(name)?.value } } }
        );

        // Update Model Status
        const { data, error } = await supabaseAdmin
            .from('models')
            .update({ status: status })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json(data);
    } catch (error: any) {
        console.error('[Admin Models PATCH Error]', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
