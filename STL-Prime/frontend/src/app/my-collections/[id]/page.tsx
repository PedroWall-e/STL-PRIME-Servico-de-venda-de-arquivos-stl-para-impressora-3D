"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    ArrowLeft, Package, Trash2, Heart, Download,
    ExternalLink, MoreVertical, LayoutGrid, List
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

interface Collection {
    id: string;
    name: string;
    description: string;
    is_public: boolean;
}

interface CollectionItem {
    id: string;
    title: string;
    slug: string;
    thumbnail_url: string;
    price: number;
    format: string;
}

export default function CollectionDetailPage({ params }: { params: { id: string } }) {
    const supabase = createClient();
    const router = useRouter();
    const [collection, setCollection] = useState<Collection | null>(null);
    const [items, setItems] = useState<CollectionItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCollectionAndItems();
    }, [params.id]);

    const fetchCollectionAndItems = async () => {
        setLoading(true);

        // 1. Fetch Collection Info
        const { data: coll } = await supabase
            .from('collections')
            .select('*')
            .eq('id', params.id)
            .single();

        if (!coll) {
            router.push('/my-collections');
            return;
        }
        setCollection(coll);

        // 2. Fetch Items
        // Joined query to get model details via collection_items
        const { data: itemsData } = await supabase
            .from('collection_items')
            .select(`
                model:models (
                    id, title, slug, thumbnail_url, price, format
                )
            `)
            .eq('collection_id', params.id);

        if (itemsData) {
            setItems(itemsData.map((d: any) => d.model));
        }
        setLoading(false);
    };

    const handleRemoveItem = async (modelId: string) => {
        const { error } = await supabase
            .from('collection_items')
            .delete()
            .eq('collection_id', params.id)
            .eq('model_id', modelId);

        if (!error) {
            setItems(items.filter(item => item.id !== modelId));
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F9F8F6] flex items-center justify-center">
                <div className="text-gray-400 font-bold animate-pulse uppercase tracking-widest text-xs">A abrir laboratório...</div>
            </div>
        );
    }

    if (!collection) return null;

    return (
        <div className="min-h-screen bg-[#F9F8F6] py-12">
            <div className="container mx-auto px-4 max-w-6xl">

                {/* Navigation & Header */}
                <Link href="/my-collections" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#3347FF] font-black text-xs uppercase tracking-widest mb-8 transition-colors group">
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    Voltar para Coleções
                </Link>

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${collection.is_public ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-gray-100 text-gray-500 border border-gray-200'}`}>
                                {collection.is_public ? 'Pública' : 'Privada'}
                            </span>
                            <span className="text-gray-300">·</span>
                            <span className="text-xs font-bold text-gray-400">{items.length} Modelos salvos</span>
                        </div>
                        <h1 className="text-4xl font-black text-[#2B2B2B] tracking-tight mb-3">{collection.name}</h1>
                        <p className="text-gray-500 font-medium max-w-2xl">{collection.description || 'Nenhuma descrição fornecida para esta coleção.'}</p>
                    </div>
                </div>

                {/* Items Grid */}
                {items.length === 0 ? (
                    <div className="text-center py-24 bg-white rounded-[40px] border border-gray-100 shadow-sm">
                        <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                            <Package size={40} className="text-gray-300" />
                        </div>
                        <h2 className="text-xl font-black text-[#2B2B2B] mb-2">Esta pasta está vazia</h2>
                        <p className="text-gray-400 font-medium mb-8">Comece a explorar e adicione modelos incríveis aqui.</p>
                        <Link href="/" className="px-8 py-3 bg-[#3347FF] text-white rounded-2xl font-black hover:bg-[#2236EE] transition-all">
                            Explorar Catálogo
                        </Link>
                    </div>
                ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {items.map(item => (
                            <div key={item.id} className="group bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                                <div className="relative aspect-[4/3] overflow-hidden">
                                    <img src={item.thumbnail_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => handleRemoveItem(item.id)}
                                            className="p-2 bg-white/90 backdrop-blur-md text-red-500 rounded-xl shadow-md hover:bg-red-500 hover:text-white transition-all"
                                            title="Remover da Coleção"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                    <div className="absolute bottom-3 left-3 px-2 py-0.5 bg-white/90 backdrop-blur-md rounded-md text-[10px] font-black text-gray-700">
                                        {item.format}
                                    </div>
                                </div>
                                <div className="p-5">
                                    <Link href={`/models/${item.slug}`}>
                                        <h3 className="font-bold text-[#2B2B2B] group-hover:text-[#3347FF] transition-colors line-clamp-1 mb-2">
                                            {item.title}
                                        </h3>
                                    </Link>
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-black text-[#2B2B2B]">
                                            {item.price === 0 ? (
                                                <span className="text-green-500">Grátis</span>
                                            ) : (
                                                `R$ ${item.price.toFixed(2)}`
                                            )}
                                        </p>
                                        <Link href={`/models/${item.slug}`} className="text-gray-400 hover:text-[#3347FF] transition-colors">
                                            <ExternalLink size={16} />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
}
