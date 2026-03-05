import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { Metadata } from 'next';
import { Search, SlidersHorizontal, Package } from 'lucide-react';
import ModelsClient from './ModelsClient';

export const metadata: Metadata = {
    title: 'Catálogo de Modelos 3D | STL Prime',
    description: 'Explore milhares de arquivos STL e 3MF premium para sua impressora 3D. Filtre por categoria, preço e formato.',
};

const CATEGORIES = [
    { label: 'Todos', value: '' },
    { label: 'Personagens', value: 'Personagens' },
    { label: 'Arquitetura', value: 'Arquitetura' },
    { label: 'Ferramentas', value: 'Ferramentas' },
    { label: 'Jogos', value: 'Jogos' },
    { label: 'Decoração', value: 'Decoração' },
    { label: 'Veículos', value: 'Veículos' },
    { label: 'Natureza', value: 'Natureza' },
    { label: 'Gadgets', value: 'Gadgets' },
];

export default async function ModelsPage({
    searchParams,
}: {
    searchParams: { q?: string; category?: string; price?: string; format?: string; sort?: string };
}) {
    const supabase = createClient();

    let query = supabase
        .from('models')
        .select('id, title, price, thumbnail_url, category, format, downloads_count, likes_count, author:users(username), slug')
        .eq('is_published', true)
        .eq('status', 'approved');

    // Full-text search
    if (searchParams.q) {
        query = query.ilike('title', `%${searchParams.q}%`);
    }

    // Category filter
    if (searchParams.category) {
        query = query.eq('category', searchParams.category);
    }

    // Price filter
    if (searchParams.price === 'free') {
        query = query.eq('is_free', true);
    } else if (searchParams.price === 'paid') {
        query = query.eq('is_free', false);
    }

    // Format filter
    if (searchParams.format) {
        query = query.ilike('format', `%${searchParams.format}%`);
    }

    // Sort
    if (searchParams.sort === 'trending') {
        query = query.order('downloads_count', { ascending: false });
    } else if (searchParams.sort === 'newest') {
        query = query.order('created_at', { ascending: false });
    } else if (searchParams.sort === 'price_asc') {
        query = query.order('price', { ascending: true });
    } else {
        query = query.order('created_at', { ascending: false });
    }

    const { data: models } = await query.limit(48);

    const activeCategory = searchParams.category ?? '';
    const activePrice = searchParams.price ?? '';
    const activeFormat = searchParams.format ?? '';
    const activeSort = searchParams.sort ?? '';
    const searchQuery = searchParams.q ?? '';

    return (
        <div className="min-h-screen bg-[#F9F8F6]">
            {/* Page Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="container mx-auto px-4 md:px-6 py-8">
                    <h1 className="text-3xl font-black text-[#2B2B2B] mb-1">Catálogo de Modelos 3D</h1>
                    <p className="text-gray-500 font-medium">
                        {models?.length ?? 0} modelos encontrados
                        {searchQuery ? ` para "${searchQuery}"` : ''}
                        {activeCategory ? ` em ${activeCategory}` : ''}
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-6 py-8 flex gap-8 items-start">
                {/* Sidebar - hidden on mobile, shown on md+ */}
                <aside className="hidden md:block w-60 flex-shrink-0 sticky top-24">
                    <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-6">
                        {/* Category */}
                        <div>
                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Categoria</p>
                            <div className="space-y-1">
                                {CATEGORIES.map(cat => (
                                    <Link
                                        key={cat.value}
                                        href={`/models?${new URLSearchParams({
                                            ...(searchQuery && { q: searchQuery }),
                                            ...(cat.value && { category: cat.value }),
                                            ...(activePrice && { price: activePrice }),
                                            ...(activeFormat && { format: activeFormat }),
                                        }).toString()}`}
                                        className={`block w-full text-left px-3 py-2 rounded-xl text-sm font-bold transition-colors ${activeCategory === cat.value ? 'bg-[#3347FF] text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-[#3347FF]'}`}
                                    >
                                        {cat.label}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Price */}
                        <div>
                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Preço</p>
                            <div className="space-y-1">
                                {[
                                    { label: 'Todos', value: '' },
                                    { label: 'Gratuitos', value: 'free' },
                                    { label: 'Pagos', value: 'paid' },
                                ].map(opt => (
                                    <Link
                                        key={opt.value}
                                        href={`/models?${new URLSearchParams({
                                            ...(searchQuery && { q: searchQuery }),
                                            ...(activeCategory && { category: activeCategory }),
                                            ...(opt.value && { price: opt.value }),
                                            ...(activeFormat && { format: activeFormat }),
                                        }).toString()}`}
                                        className={`block w-full text-left px-3 py-2 rounded-xl text-sm font-bold transition-colors ${activePrice === opt.value ? 'bg-[#3347FF] text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-[#3347FF]'}`}
                                    >
                                        {opt.label}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Format */}
                        <div>
                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Formato</p>
                            <div className="space-y-1">
                                {[
                                    { label: 'Todos', value: '' },
                                    { label: 'STL', value: 'STL' },
                                    { label: '3MF', value: '3MF' },
                                    { label: 'OBJ', value: 'OBJ' },
                                ].map(opt => (
                                    <Link
                                        key={opt.value}
                                        href={`/models?${new URLSearchParams({
                                            ...(searchQuery && { q: searchQuery }),
                                            ...(activeCategory && { category: activeCategory }),
                                            ...(activePrice && { price: activePrice }),
                                            ...(opt.value && { format: opt.value }),
                                        }).toString()}`}
                                        className={`block w-full text-left px-3 py-2 rounded-xl text-sm font-bold transition-colors ${activeFormat === opt.value ? 'bg-[#3347FF] text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-[#3347FF]'}`}
                                    >
                                        {opt.label}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Clear Filters */}
                        {(activeCategory || activePrice || activeFormat || searchQuery) && (
                            <Link
                                href="/models"
                                className="block w-full text-center py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-bold transition-colors"
                            >
                                Limpar Filtros
                            </Link>
                        )}
                    </div>
                </aside>

                {/* Main area */}
                <div className="flex-1 min-w-0">
                    {/* Top bar: search + sort + mobile filter button */}
                    <ModelsClient
                        initialQuery={searchQuery}
                        activeCategory={activeCategory}
                        activePrice={activePrice}
                        activeFormat={activeFormat}
                        activeSort={activeSort}
                        categories={CATEGORIES}
                    />

                    {/* Results Grid */}
                    {!models || models.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-24 text-center">
                            <div className="w-20 h-20 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center mb-6">
                                <Package className="w-10 h-10 text-gray-400" />
                            </div>
                            <h2 className="text-xl font-black text-[#2B2B2B] mb-2">Nenhum modelo encontrado</h2>
                            <p className="text-gray-500 text-sm max-w-xs mb-6">
                                Tente ajustar os seus filtros ou usar um termo de busca diferente.
                            </p>
                            <Link href="/models" className="text-[#3347FF] font-bold hover:underline text-sm">
                                Limpar todos os filtros →
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                            {models.map((model: any) => (
                                <Link key={model.id} href={`/models/${model.slug}`} className="group block">
                                    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:border-[#3347FF]/30 hover:shadow-lg transition-all duration-200">
                                        {/* Thumbnail */}
                                        <div className="relative aspect-square bg-gray-100 overflow-hidden">
                                            {model.thumbnail_url ? (
                                                <img
                                                    src={model.thumbnail_url}
                                                    alt={model.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                    loading="lazy"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <Package className="w-12 h-12 text-gray-300" />
                                                </div>
                                            )}
                                            {model.format && (
                                                <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider text-gray-700 shadow-sm">
                                                    {model.format}
                                                </span>
                                            )}
                                            {model.is_free && (
                                                <span className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider">
                                                    Grátis
                                                </span>
                                            )}
                                        </div>

                                        {/* Info */}
                                        <div className="p-4">
                                            <h3 className="font-bold text-[#2B2B2B] text-sm leading-tight line-clamp-2 mb-1 group-hover:text-[#3347FF] transition-colors">
                                                {model.title}
                                            </h3>
                                            <p className="text-xs text-gray-400 font-medium mb-3">
                                                @{model.author?.username ?? 'maker'}
                                            </p>
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs text-gray-400 font-medium">
                                                    {model.downloads_count ?? 0} downloads
                                                </span>
                                                <span className={`font-black text-base ${model.is_free ? 'text-green-500' : 'text-[#2B2B2B]'}`}>
                                                    {model.is_free ? 'Grátis' : `R$ ${Number(model.price ?? 0).toFixed(2)}`}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
