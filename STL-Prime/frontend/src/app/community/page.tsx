"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    MessageSquare, Heart, Search, Filter,
    PlusCircle, ChevronRight, Share2,
    ThumbsUp, Flame, Image as ImageIcon, MapPin, X, Award
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

interface Post {
    id: string;
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    category: string;
    created_at: string;
    images: string[];
    author: {
        username: string;
        full_name: string;
        avatar_url: string;
        subscription_status: string;
        is_creator: boolean;
    };
    likes_count: number;
    useful_count: number;
    fire_count: number;
    comments_count: number;
}

interface Category {
    id: string;
    label: string;
}

function SubscriberBadge({ level }: { level?: number }) {
    if (!level) return null;
    const badges = [
        { label: 'Bronze', icon: '🥉', color: 'text-orange-600', bg: 'bg-orange-50' },
        { label: 'Silver', icon: '🥈', color: 'text-gray-400', bg: 'bg-gray-50' },
        { label: 'Gold', icon: '🥇', color: 'text-yellow-600', bg: 'bg-yellow-50' }
    ];
    const b = badges[level - 1];
    return (
        <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-black ${b.bg} ${b.color} border border-current/20 shadow-sm`} title={`Membro ${b.label}`}>
            {b.icon} {b.label}
        </span>
    );
}

export default function CommunityFeedPage() {
    const supabase = createClient();
    const [user, setUser] = useState<any>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [activeTab, setActiveTab] = useState('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    // Form state
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('showcase');
    const [content, setContent] = useState('');

    useEffect(() => {
        const init = async () => {
            setLoading(true);
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user || null);

            // Fetch categories
            const { data: catData } = await supabase.from('post_categories').select('*').order('created_at', { ascending: true });
            if (catData) setCategories([{ id: 'all', label: 'Tudo' }, ...catData]);

            // Fetch posts
            fetchPosts('all');
        };
        init();
    }, []);

    const fetchPosts = async (catId: string) => {
        setLoading(true);
        let query = supabase
            .from('posts')
            .select(`
                *,
                author:users (
                    username,
                    full_name,
                    avatar_url,
                    subscription_status,
                    is_creator
                )
            `)
            .order('created_at', { ascending: false });

        if (catId !== 'all') {
            query = query.eq('category', catId);
        }

        const { data } = await query;
        if (data) setPosts(data as any);
        setLoading(false);
    };

    useEffect(() => {
        if (categories.length > 0) {
            fetchPosts(activeTab);
        }
    }, [activeTab]);

    const handleNewPostClick = () => {
        if (!user) {
            alert("🔒 Você precisa estar logado para criar um post na comunidade.");
            return;
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Math.random().toString(36).substring(2, 7);
        const excerpt = content.substring(0, 150) + (content.length > 150 ? '...' : '');

        const { error } = await supabase.from('posts').insert({
            title,
            slug,
            content,
            excerpt,
            category,
            author_id: user.id
        });

        if (error) {
            alert("Erro ao criar post: " + error.message);
        } else {
            setIsModalOpen(false);
            setTitle('');
            setContent('');
            fetchPosts(activeTab);
        }
    };

    const handleReaction = async (postId: string, type: 'like' | 'useful' | 'fire') => {
        if (!user) {
            alert("🔒 Você precisa estar logado para reagir.");
            return;
        }

        const { data: existing } = await supabase
            .from('post_reactions')
            .select('*')
            .eq('post_id', postId)
            .eq('user_id', user.id)
            .eq('type', type)
            .single();

        if (existing) {
            await supabase.from('post_reactions').delete().eq('post_id', postId).eq('user_id', user.id).eq('type', type);
        } else {
            await supabase.from('post_reactions').insert({ post_id: postId, user_id: user.id, type });
        }

        // Refresh local state for this post
        fetchPosts(activeTab);
    };

    return (
        <div className="min-h-screen bg-[#F9F8F6]">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 py-10">
                <div className="container mx-auto px-4 md:px-8">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#3347FF]/10 text-[#3347FF] text-xs font-black uppercase tracking-wider mb-3">
                                <MessageSquare size={14} /> Fórum Comunitário
                            </div>
                            <h1 className="text-4xl font-black text-[#2B2B2B] mb-2">Comunidade Maker</h1>
                            <p className="text-gray-600 font-medium">Lugar para aprender, partilhar e resolver problemas em conjunto.</p>
                        </div>
                        <div className="flex gap-3">
                            <button className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition-colors shadow-sm">
                                <Search size={18} /> Pesquisar
                            </button>
                            <button
                                onClick={handleNewPostClick}
                                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#3347FF] text-white font-bold hover:bg-[#2236ee] transition-colors shadow-lg shadow-[#3347FF]/25"
                            >
                                <PlusCircle size={18} /> Novo Post
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 md:px-8 py-8 flex flex-col lg:flex-row gap-8 items-start">

                {/* Fixed Sidebar */}
                <div className="w-full lg:w-64 shrink-0 lg:sticky top-24">
                    <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
                        <h3 className="text-xs font-black uppercase tracking-wider text-gray-500 mb-4 px-2">Categorias</h3>
                        <div className="space-y-1">
                            {categories.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveTab(cat.id)}
                                    className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === cat.id
                                        ? 'bg-[#3347FF] text-white shadow-md'
                                        : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mt-6 bg-[#2B2B2B] rounded-2xl p-5 border border-gray-800 text-white shadow-xl">
                        <h3 className="font-black mb-2 flex items-center gap-2">
                            <Flame size={18} className="text-orange-500" /> Makers da Semana
                        </h3>
                        <div className="space-y-4 mt-4">
                            {[
                                { name: 'MakerPro', points: '1.2k', dp: 'https://i.pravatar.cc/150?u=maker' },
                                { name: 'EngenhariaDF', points: '980', dp: 'https://i.pravatar.cc/150?u=df' },
                                { name: 'JohnDoe', points: '450', dp: 'https://i.pravatar.cc/150?u=jd' },
                            ].map((user, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <span className="text-gray-500 font-black text-xs w-4">{i + 1}</span>
                                    <img src={user.dp} alt="" className="w-8 h-8 rounded-full border border-gray-700" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold truncate">{user.name}</p>
                                        <p className="text-xs font-bold text-gray-400">{user.points} rep</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Feed */}
                <div className="flex-1 space-y-6">
                    {loading ? (
                        <div className="py-20 text-center text-gray-400 font-bold animate-pulse">Carregando feed...</div>
                    ) : posts.length === 0 ? (
                        <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-gray-300">
                            <MessageSquare className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                            <p className="text-gray-400 font-bold">Nenhum post encontrado nesta categoria.</p>
                        </div>
                    ) : (
                        posts.map(post => (
                            <article key={post.id} className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:border-[#3347FF]/30 transition-all group">
                                <div className="p-6">
                                    {/* Post Header */}
                                    <div className="flex items-center gap-3 mb-4">
                                        <Link href={`/creator/${post.author.username}`}>
                                            <div className="w-10 h-10 rounded-full border border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden">
                                                {post.author.avatar_url ? (
                                                    <img src={post.author.avatar_url} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="text-xs font-black text-gray-400">{post.author.username.charAt(0).toUpperCase()}</span>
                                                )}
                                            </div>
                                        </Link>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <Link href={`/creator/${post.author.username}`} className="text-sm font-black text-[#2B2B2B] hover:text-[#3347FF]">
                                                    {post.author.full_name}
                                                </Link>
                                                {post.author.subscription_status !== 'free' && (
                                                    <SubscriberBadge level={post.author.subscription_status === 'pro' ? 2 : 3} />
                                                )}
                                                {post.author.is_creator && (
                                                    <span className="text-[9px] font-black px-1.5 py-0.5 rounded-md bg-[#3347FF] text-white">PRO</span>
                                                )}
                                            </div>
                                            <p className="text-xs font-bold text-gray-500">
                                                {new Date(post.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="ml-auto">
                                            <span className="text-xs font-bold px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 border border-gray-200">
                                                {categories.find(c => c.id === post.category)?.label.split(' ')[1] || post.category}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Post Body */}
                                    <Link href={`/community/${post.slug}`}>
                                        <h2 className="text-xl font-black text-[#2B2B2B] mb-2 group-hover:text-[#3347FF] transition-colors">
                                            {post.title}
                                        </h2>
                                        <p className="text-gray-600 font-medium text-sm leading-relaxed mb-4">
                                            {post.excerpt}
                                        </p>

                                        {/* Images Grid preview */}
                                        {post.images && post.images.length > 0 && (
                                            <div className="flex gap-2 mb-4">
                                                {post.images.slice(0, 2).map((img, i) => (
                                                    <div key={i} className="relative h-32 flex-1 rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                                                        <img src={img} alt="" className="w-full h-full object-cover" />
                                                    </div>
                                                ))}
                                                {post.images.length > 2 && (
                                                    <div className="relative h-32 w-1/3 rounded-xl overflow-hidden bg-[#2B2B2B] flex items-center justify-center">
                                                        <span className="text-white font-black">+{post.images.length - 2}</span>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </Link>

                                    {/* Post Footer (Reactions/Comments) */}
                                    <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-2">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleReaction(post.id, 'like')}
                                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-gray-100 transition-colors text-xs font-bold text-gray-600"
                                            >
                                                <Heart size={14} className="text-red-500" /> {post.likes_count}
                                            </button>
                                            <button
                                                onClick={() => handleReaction(post.id, 'useful')}
                                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-gray-100 transition-colors text-xs font-bold text-gray-600"
                                            >
                                                <ThumbsUp size={14} className="text-[#3347FF]" /> {post.useful_count} útil
                                            </button>
                                            <button
                                                onClick={() => handleReaction(post.id, 'fire')}
                                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-gray-100 transition-colors text-xs font-bold text-gray-600"
                                            >
                                                <Flame size={14} className="text-orange-500" /> {post.fire_count}
                                            </button>
                                        </div>
                                        <Link href={`/community/${post.slug}`} className="flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-[#3347FF]">
                                            <MessageSquare size={14} /> {post.comments_count} Comentários
                                        </Link>
                                    </div>
                                </div>
                            </article>
                        ))
                    )}

                    <div className="text-center pt-8">
                        <button className="px-6 py-3 rounded-full border-2 border-gray-200 text-gray-700 font-bold text-sm hover:bg-gray-50 transition-colors">
                            Carregar mais...
                        </button>
                    </div>
                </div>
            </main>

            {/* New Post Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#2B2B2B]/40 backdrop-blur-sm animate-fadein">
                    <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden border border-gray-100">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                            <h2 className="text-xl font-black text-[#2B2B2B]">Criar Novo Post</h2>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Título do Post</label>
                                <input
                                    type="text"
                                    required
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                    placeholder="Ex: Como configurar o timelapse..."
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm font-bold focus:bg-white focus:border-[#3347FF] focus:ring-2 focus:ring-[#3347FF]/20 outline-none transition-all placeholder:text-gray-400"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Categoria</label>
                                <select
                                    value={category}
                                    onChange={e => setCategory(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm font-bold focus:bg-white focus:border-[#3347FF] focus:ring-2 focus:ring-[#3347FF]/20 outline-none transition-all appearance-none"
                                >
                                    {categories.filter(c => c.id !== 'all').map(c => (
                                        <option key={c.id} value={c.id}>{c.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Conteúdo</label>
                                <textarea
                                    required
                                    value={content}
                                    onChange={e => setContent(e.target.value)}
                                    placeholder="Escreva aqui o que quer partilhar com a comunidade..."
                                    className="w-full min-h-[150px] px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm font-medium focus:bg-white focus:border-[#3347FF] focus:ring-2 focus:ring-[#3347FF]/20 outline-none transition-all resize-none placeholder:text-gray-400"
                                />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-3.5 rounded-2xl border border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-3.5 rounded-2xl bg-[#3347FF] text-white font-black text-sm hover:bg-[#2236ee] shadow-lg shadow-[#3347FF]/25 transition-all"
                                >
                                    Publicar Post
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
