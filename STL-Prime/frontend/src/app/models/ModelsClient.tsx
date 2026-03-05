"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState, useTransition } from 'react';
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import Link from 'next/link';

interface Category { label: string; value: string; }

interface ModelsClientProps {
    initialQuery: string;
    activeCategory: string;
    activePrice: string;
    activeFormat: string;
    activeSort: string;
    categories: Category[];
}

export default function ModelsClient({
    initialQuery,
    activeCategory,
    activePrice,
    activeFormat,
    activeSort,
    categories,
}: ModelsClientProps) {
    const router = useRouter();
    const [query, setQuery] = useState(initialQuery);
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
    const [, startTransition] = useTransition();

    const buildUrl = (overrides: Record<string, string>) => {
        const params = new URLSearchParams({
            ...(query && { q: query }),
            ...(activeCategory && { category: activeCategory }),
            ...(activePrice && { price: activePrice }),
            ...(activeFormat && { format: activeFormat }),
            ...(activeSort && { sort: activeSort }),
            ...overrides,
        });
        // Remove empty
        const clean = new URLSearchParams();
        params.forEach((v, k) => { if (v) clean.set(k, v); });
        return `/models?${clean.toString()}`;
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        startTransition(() => {
            router.push(buildUrl({ q: query }));
        });
    };

    const handleSort = (sort: string) => {
        router.push(buildUrl({ sort }));
    };

    return (
        <>
            {/* Search + Sort + Mobile Filter Toggle */}
            <div className="flex flex-wrap gap-3 items-center mb-6">
                {/* Search */}
                <form onSubmit={handleSearch} className="flex-1 min-w-[200px] relative">
                    <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none">
                        <Search className="w-4 h-4 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        placeholder="Buscar modelos..."
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-[#3347FF] focus:ring-2 focus:ring-[#3347FF]/20 transition-all"
                    />
                </form>

                {/* Sort */}
                <div className="relative">
                    <select
                        value={activeSort}
                        onChange={e => handleSort(e.target.value)}
                        className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2.5 pr-8 text-sm font-bold text-gray-700 focus:outline-none focus:border-[#3347FF] cursor-pointer"
                    >
                        <option value="">Mais Recentes</option>
                        <option value="trending">Mais Populares</option>
                        <option value="price_asc">Menor Preço</option>
                        <option value="newest">Mais Novos</option>
                    </select>
                    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>

                {/* Mobile filter button */}
                <button
                    onClick={() => setIsMobileFilterOpen(true)}
                    className="md:hidden flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-700 hover:border-[#3347FF] transition-colors"
                >
                    <SlidersHorizontal className="w-4 h-4" />
                    Filtrar
                    {(activeCategory || activePrice || activeFormat) && (
                        <span className="w-2 h-2 rounded-full bg-[#3347FF]" />
                    )}
                </button>
            </div>

            {/* Active filter tags */}
            {(activeCategory || activePrice || activeFormat || activeSort) && (
                <div className="flex flex-wrap gap-2 mb-5">
                    {activeCategory && (
                        <Link href={buildUrl({ category: '' })} className="flex items-center gap-1.5 bg-[#3347FF]/10 text-[#3347FF] text-xs font-bold px-3 py-1.5 rounded-full hover:bg-[#3347FF]/20 transition-colors">
                            {activeCategory} <X className="w-3 h-3" />
                        </Link>
                    )}
                    {activePrice && (
                        <Link href={buildUrl({ price: '' })} className="flex items-center gap-1.5 bg-[#3347FF]/10 text-[#3347FF] text-xs font-bold px-3 py-1.5 rounded-full hover:bg-[#3347FF]/20 transition-colors">
                            {activePrice === 'free' ? 'Grátis' : 'Pagos'} <X className="w-3 h-3" />
                        </Link>
                    )}
                    {activeFormat && (
                        <Link href={buildUrl({ format: '' })} className="flex items-center gap-1.5 bg-[#3347FF]/10 text-[#3347FF] text-xs font-bold px-3 py-1.5 rounded-full hover:bg-[#3347FF]/20 transition-colors">
                            {activeFormat} <X className="w-3 h-3" />
                        </Link>
                    )}
                </div>
            )}

            {/* Mobile Filter Drawer */}
            {isMobileFilterOpen && (
                <>
                    {/* Overlay */}
                    <div
                        className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm md:hidden"
                        onClick={() => setIsMobileFilterOpen(false)}
                    />
                    {/* Drawer */}
                    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl p-6 md:hidden max-h-[85vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-black text-[#2B2B2B] text-lg">Filtros</h3>
                            <button onClick={() => setIsMobileFilterOpen(false)} className="p-2 rounded-full hover:bg-gray-100">
                                <X className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Categoria</p>
                                <div className="grid grid-cols-2 gap-2">
                                    {categories.map(cat => (
                                        <button
                                            key={cat.value}
                                            onClick={() => { router.push(buildUrl({ category: cat.value })); setIsMobileFilterOpen(false); }}
                                            className={`py-2.5 px-3 rounded-xl text-sm font-bold text-left transition-colors ${activeCategory === cat.value ? 'bg-[#3347FF] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                        >
                                            {cat.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Preço</p>
                                <div className="grid grid-cols-3 gap-2">
                                    {[{ label: 'Todos', value: '' }, { label: 'Grátis', value: 'free' }, { label: 'Pagos', value: 'paid' }].map(opt => (
                                        <button
                                            key={opt.value}
                                            onClick={() => { router.push(buildUrl({ price: opt.value })); setIsMobileFilterOpen(false); }}
                                            className={`py-2.5 px-3 rounded-xl text-sm font-bold transition-colors ${activePrice === opt.value ? 'bg-[#3347FF] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Formato</p>
                                <div className="grid grid-cols-4 gap-2">
                                    {[{ label: 'Todos', value: '' }, { label: 'STL', value: 'STL' }, { label: '3MF', value: '3MF' }, { label: 'OBJ', value: 'OBJ' }].map(opt => (
                                        <button
                                            key={opt.value}
                                            onClick={() => { router.push(buildUrl({ format: opt.value })); setIsMobileFilterOpen(false); }}
                                            className={`py-2.5 px-3 rounded-xl text-sm font-bold transition-colors ${activeFormat === opt.value ? 'bg-[#3347FF] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {(activeCategory || activePrice || activeFormat) && (
                                <button
                                    onClick={() => { router.push('/models'); setIsMobileFilterOpen(false); }}
                                    className="w-full py-3 bg-gray-100 hover:bg-gray-200 rounded-2xl text-gray-600 font-bold text-sm transition-colors"
                                >
                                    Limpar Filtros
                                </button>
                            )}
                        </div>
                    </div>
                </>
            )}
        </>
    );
}
