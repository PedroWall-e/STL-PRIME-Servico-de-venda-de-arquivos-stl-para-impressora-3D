"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    FolderPlus, Plus, Folder, Trash2, Edit3, ChevronRight,
    MoreVertical, Package, Lock, Globe, Search
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

interface Collection {
    id: string;
    name: string;
    description: string;
    is_public: boolean;
    created_at: string;
    items_count?: number;
}

export default function MyCollectionsPage() {
    const supabase = createClient();
    const router = useRouter();
    const [collections, setCollections] = useState<Collection[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newCollectionName, setNewCollectionName] = useState('');
    const [newCollectionDesc, setNewCollectionDesc] = useState('');
    const [isPublic, setIsPublic] = useState(false);

    useEffect(() => {
        fetchCollections();
    }, []);

    const fetchCollections = async () => {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            router.push('/auth/login');
            return;
        }

        const { data, error } = await supabase
            .from('collections')
            .select('*, items_count:collection_items(count)')
            .order('created_at', { ascending: false });

        if (data) {
            setCollections(data.map(c => ({
                ...c,
                items_count: c.items_count[0]?.count || 0
            })));
        }
        setLoading(false);
    };

    const handleCreateCollection = async (e: React.FormEvent) => {
        e.preventDefault();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
            .from('collections')
            .insert({
                user_id: user.id,
                name: newCollectionName,
                description: newCollectionDesc,
                is_public: isPublic
            })
            .select()
            .single();

        if (data) {
            setCollections([{ ...data, items_count: 0 }, ...collections]);
            setIsCreateModalOpen(false);
            setNewCollectionName('');
            setNewCollectionDesc('');
            setIsPublic(false);
        }
    };

    const handleDeleteCollection = async (id: string) => {
        if (!confirm('Tem a certeza que deseja excluir esta coleção? Todos os itens associados serão removidos da pasta.')) return;

        const { error } = await supabase
            .from('collections')
            .delete()
            .eq('id', id);

        if (!error) {
            setCollections(collections.filter(c => c.id !== id));
        }
    };

    return (
        <div className="min-h-screen bg-[#F9F8F6] py-12">
            <div className="container mx-auto px-4 max-w-5xl">

                {/* Header Section */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-[#2B2B2B] tracking-tight mb-2">Minhas Coleções</h1>
                        <p className="text-gray-500 font-medium">Organize os seus modelos favoritos em pastas personalizadas.</p>
                    </div>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-[#3347FF] text-white rounded-2xl font-black shadow-lg shadow-[#3347FF]/20 hover:bg-[#2236EE] transition-all hover:scale-105"
                    >
                        <FolderPlus size={20} />
                        Nova Coleção
                    </button>
                </div>

                {/* Stats & Filter Bar (Optional) */}
                <div className="bg-white rounded-3xl p-4 border border-gray-100 shadow-sm flex items-center justify-between mb-8 px-6">
                    <div className="flex items-center gap-6">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Total</span>
                            <span className="text-xl font-black text-[#2B2B2B]">{collections.length} Coleções</span>
                        </div>
                    </div>
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#3347FF] transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Procurar pasta..."
                            className="bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-[#3347FF]/10 py-2.5 pl-12 pr-6 rounded-2xl text-sm outline-none transition-all w-64"
                        />
                    </div>
                </div>

                {/* Collections Grid */}
                {loading ? (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-64 bg-gray-100 rounded-3xl border border-gray-200" />
                        ))}
                    </div>
                ) : collections.length === 0 ? (
                    <div className="text-center py-24 bg-white rounded-[40px] border border-dashed border-gray-200">
                        <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                            <Folder size={40} className="text-gray-300" />
                        </div>
                        <h2 className="text-xl font-black text-[#2B2B2B] mb-2">Ainda não tem coleções</h2>
                        <p className="text-gray-400 font-medium mb-8">Comece a organizar o seu laboratório digital criando a sua primeira pasta.</p>
                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="px-8 py-3 bg-[#2B2B2B] text-white rounded-2xl font-black hover:bg-black transition-all"
                        >
                            Criar Agora
                        </button>
                    </div>
                ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {collections.map(collection => (
                            <div
                                key={collection.id}
                                className="group relative bg-white rounded-[32px] border border-gray-100 p-6 shadow-sm hover:shadow-xl hover:border-[#3347FF]/20 transition-all duration-300 overflow-hidden"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${collection.is_public ? 'bg-[#3347FF]/5 text-[#3347FF]' : 'bg-orange-50 text-orange-600'}`}>
                                        <Folder size={28} />
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <button className="p-2 text-gray-400 hover:text-[#3347FF] hover:bg-gray-50 rounded-xl transition-all">
                                            <Edit3 size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteCollection(collection.id)}
                                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>

                                <h3 className="text-xl font-black text-[#2B2B2B] mb-2 line-clamp-1">{collection.name}</h3>
                                <p className="text-sm text-gray-400 font-medium line-clamp-2 h-10 mb-6">{collection.description || 'Sem descrição.'}</p>

                                <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-50">
                                    <div className="flex items-center gap-4">
                                        <span className="flex items-center gap-1.5 text-xs font-black text-gray-500">
                                            <Package size={14} className="text-gray-300" />
                                            {collection.items_count} Modelos
                                        </span>
                                        <span className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg ${collection.is_public ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
                                            {collection.is_public ? <Globe size={10} /> : <Lock size={10} />}
                                            {collection.is_public ? 'Pública' : 'Privada'}
                                        </span>
                                    </div>
                                    <Link href={`/my-collections/${collection.id}`} className="p-2 rounded-xl bg-gray-50 text-[#2B2B2B] hover:bg-[#3347FF] hover:text-white transition-all">
                                        <ChevronRight size={20} />
                                    </Link>
                                </div>

                                {/* Abstract Background Decoration */}
                                <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform duration-700 pointer-events-none">
                                    <Box size={120} className="text-[#3347FF]" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Create Modal */}
                {isCreateModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-[#2B2B2B]/40 backdrop-blur-sm" onClick={() => setIsCreateModalOpen(false)} />
                        <div className="relative bg-white w-full max-w-md rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                            <form onSubmit={handleCreateCollection} className="p-8">
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-2xl font-black text-[#2B2B2B] tracking-tight">Nova Coleção</h2>
                                    <button
                                        type="button"
                                        onClick={() => setIsCreateModalOpen(false)}
                                        className="p-2 text-gray-400 hover:text-[#2B2B2B] hover:bg-gray-100 rounded-full transition-all"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <label className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2 block">Nome da Pasta</label>
                                        <input
                                            required
                                            value={newCollectionName}
                                            onChange={(e) => setNewCollectionName(e.target.value)}
                                            placeholder="Ex: Projetos IoT, Decorativos..."
                                            className="w-full bg-gray-50 border-2 border-transparent focus:bg-white focus:border-[#3347FF] p-4 rounded-2xl outline-none transition-all font-bold"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2 block">Descrição (Opcional)</label>
                                        <textarea
                                            value={newCollectionDesc}
                                            onChange={(e) => setNewCollectionDesc(e.target.value)}
                                            placeholder="Para que serve esta coleção?"
                                            rows={3}
                                            className="w-full bg-gray-50 border-2 border-transparent focus:bg-white focus:border-[#3347FF] p-4 rounded-2xl outline-none transition-all font-medium text-sm"
                                        />
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-xl ${isPublic ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-500'}`}>
                                                {isPublic ? <Globe size={18} /> : <Lock size={18} />}
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-[#2B2B2B]">Coleção Pública</p>
                                                <p className="text-[10px] text-gray-500 font-medium">Outros membros podem ver esta pasta.</p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setIsPublic(!isPublic)}
                                            className={`relative w-12 h-6 rounded-full transition-colors ${isPublic ? 'bg-[#3347FF]' : 'bg-gray-300'}`}
                                        >
                                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isPublic ? 'left-7' : 'left-1'}`} />
                                        </button>
                                    </div>
                                </div>

                                <div className="mt-10 flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsCreateModalOpen(false)}
                                        className="flex-1 py-4 text-gray-500 font-black hover:bg-gray-50 rounded-2xl transition-all"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 bg-[#3347FF] text-white py-4 rounded-2xl font-black shadow-lg shadow-[#3347FF]/20 hover:bg-[#2236EE] transition-all"
                                    >
                                        Criar Pasta
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}

function Box({ size, className }: { size: number, className: string }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
            <path d="m3.3 7 8.7 5 8.7-5" />
            <path d="M12 22V12" />
        </svg>
    );
}

function X({ size }: { size: number }) {
    return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>;
}
