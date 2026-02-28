"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { notFound, useRouter } from 'next/navigation';
import {
    ArrowLeft, Heart, MessageSquare, Share2,
    ThumbsUp, Flame, MoreHorizontal, User,
    Send
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

interface Post {
    id: string;
    title: string;
    slug: string;
    content: string;
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

interface Comment {
    id: string;
    content: string;
    created_at: string;
    author: {
        full_name: string;
        avatar_url: string;
        is_creator: boolean;
    };
    likes_count?: number;
}

// ─── Simple Markdown renderer ─────────────────────────────────────────────
function SimpleMarkdown({ text }: { text: string }) {
    const lines = text.split('\n');
    return (
        <div className="prose prose-sm md:prose-base max-w-none text-gray-700">
            {lines.map((line, i) => {
                if (line.startsWith('## ')) return <h2 key={i} className="text-xl font-black text-[#2B2B2B] mt-8 mb-4">{line.replace('## ', '')}</h2>;
                if (line.startsWith('# ')) return <h1 key={i} className="text-2xl font-black text-[#2B2B2B] mb-4">{line.replace('# ', '')}</h1>;
                if (/^[0-9]+\. /.test(line)) return <li key={i} className="ml-4 list-decimal text-base leading-7 text-gray-600 mb-2">{line.replace(/^[0-9]+\. /, '').replace(/\*\*(.*?)\*\*/g, '$1')}</li>;
                if (line.trim() === '') return <br key={i} />;
                const formatted = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                return <p key={i} className="text-base leading-7 text-gray-600 mb-4" dangerouslySetInnerHTML={{ __html: formatted }} />;
            })}
        </div>
    );
}

// ─── Mock Comments ────────────────────────────────────────────────────────
const MOCK_COMMENTS = [
    {
        id: 'c1',
        author: { display_name: 'TechMaker', avatar: 'https://i.pravatar.cc/150?u=techm', is_official: false },
        content: 'Muito bom trabalho! Qual foi a espessura de parede que usaste para garantir o IP67?',
        created_at: 'Há 2 horas',
        likes: 4
    },
    {
        id: 'c2',
        author: { display_name: 'Data Frontier Labs', avatar: 'https://i.pravatar.cc/150?u=dflab', is_official: true },
        content: 'Excelente montagem @MakerPro! É ótimo ver o nosso design em ação nesse ambiente hostil. Parabéns pelo projeto.',
        created_at: 'Há 45 minutos',
        likes: 12
    }
];

export default function PostPage({ params }: { params: { slug: string } }) {
    const supabase = createClient();
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [post, setPost] = useState<Post | null>(null);
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);

    React.useEffect(() => {
        const init = async () => {
            setLoading(true);
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user || null);

            // Fetch post
            const { data: postData } = await supabase
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
                .eq('slug', params.slug)
                .single();

            if (!postData) {
                setLoading(false);
                return;
            }

            setPost(postData as any);

            // Fetch comments
            const { data: commentsData } = await supabase
                .from('post_comments')
                .select(`
                    *,
                    author:users (
                        full_name,
                        avatar_url,
                        is_creator
                    )
                `)
                .eq('post_id', postData.id)
                .order('created_at', { ascending: true });

            if (commentsData) setComments(commentsData as any);
            setLoading(false);
        };
        init();
    }, [params.slug]);

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !post || !comment.trim()) return;

        const { error } = await supabase.from('post_comments').insert({
            post_id: post.id,
            author_id: user.id,
            content: comment
        });

        if (error) {
            alert("Erro ao comentar: " + error.message);
        } else {
            setComment('');
            // Refresh comments
            const { data } = await supabase
                .from('post_comments')
                .select(`
                    *,
                    author:users (full_name, avatar_url, is_creator)
                `)
                .eq('post_id', post.id)
                .order('created_at', { ascending: true });
            if (data) setComments(data as any);

            // Update local count
            if (post) setPost({ ...post, comments_count: post.comments_count + 1 });
        }
    };

    const handleReaction = async (type: 'like' | 'useful' | 'fire') => {
        if (!user || !post) {
            alert("🔒 Você precisa estar logado para reagir.");
            return;
        }

        const { data: existing } = await supabase
            .from('post_reactions')
            .select('*')
            .eq('post_id', post.id)
            .eq('user_id', user.id)
            .eq('type', type)
            .single();

        if (existing) {
            await supabase.from('post_reactions').delete().eq('post_id', post.id).eq('user_id', user.id).eq('type', type);
            // Local update
            setPost({
                ...post,
                [`${type}_count`]: (post as any)[`${type}_count`] - 1
            });
        } else {
            await supabase.from('post_reactions').insert({ post_id: post.id, user_id: user.id, type });
            // Local update
            setPost({
                ...post,
                [`${type}_count`]: (post as any)[`${type}_count`] + 1
            });
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F9F8F6] flex items-center justify-center">
                <div className="text-gray-400 font-bold animate-pulse">Carregando post...</div>
            </div>
        );
    }

    if (!post) {
        return notFound();
    }

    return (
        <div className="min-h-screen bg-[#F9F8F6]">
            {/* Header Mini */}
            <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-100 shadow-sm h-14 flex items-center px-4 md:px-8">
                <button onClick={() => router.back()} className="text-gray-400 hover:text-[#2B2B2B] transition-colors flex items-center gap-2 text-sm font-bold">
                    <ArrowLeft className="w-4 h-4" /> Voltar
                </button>
            </div>

            <main className="container mx-auto px-4 md:px-8 py-8 max-w-4xl">

                {/* ── Post Content ────────────────────────────────────── */}
                <article className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden mb-6">
                    <div className="p-6 md:p-10">
                        {/* Meta */}
                        <div className="flex items-center gap-4 mb-8">
                            <Link href={`/creator/${post.author.username}`}>
                                <div className="w-12 h-12 rounded-2xl border border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden">
                                    {post.author.avatar_url ? (
                                        <img src={post.author.avatar_url} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-sm font-black text-gray-400">{post.author.username.charAt(0).toUpperCase()}</span>
                                    )}
                                </div>
                            </Link>
                            <div>
                                <div className="flex items-center gap-2">
                                    <Link href={`/creator/${post.author.username}`} className="font-black text-[#2B2B2B] text-lg hover:text-[#3347FF] transition-colors">
                                        {post.author.full_name}
                                    </Link>
                                    {post.author.is_creator && (
                                        <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-[#3347FF] text-white">PRO</span>
                                    )}
                                </div>
                                <p className="text-sm font-medium text-gray-400">
                                    Publicado em {new Date(post.created_at).toLocaleDateString('pt-BR')}
                                </p>
                            </div>
                            <button className="ml-auto p-2 text-gray-400 hover:text-[#2B2B2B] hover:bg-gray-100 rounded-full">
                                <MoreHorizontal size={20} />
                            </button>
                        </div>

                        {/* Title & Body */}
                        <h1 className="text-3xl md:text-4xl font-black text-[#2B2B2B] mb-8 leading-tight">
                            {post.title}
                        </h1>

                        <div className="mb-10">
                            <SimpleMarkdown text={post.content} />
                        </div>

                        {/* Images Gallery */}
                        {post.images.length > 0 && (
                            <div className={`grid gap-4 mb-10 ${post.images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                                {post.images.map((img, i) => (
                                    <div key={i} className="relative rounded-2xl overflow-hidden bg-gray-100 border border-gray-100">
                                        <img src={img} alt="" className="w-full h-auto object-cover" />
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Reactions Bar */}
                        <div className="flex items-center justify-between py-4 border-t border-b border-gray-100 mb-8 flex-wrap gap-4">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => handleReaction('like')}
                                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 hover:bg-red-50 hover:border-red-200 hover:text-red-500 transition-colors font-bold text-sm text-gray-500 group"
                                >
                                    <Heart size={16} className="group-hover:fill-current" /> {post.likes_count}
                                </button>
                                <button
                                    onClick={() => handleReaction('useful')}
                                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 hover:bg-[#3347FF]/10 hover:border-[#3347FF]/30 hover:text-[#3347FF] transition-colors font-bold text-sm text-gray-500"
                                >
                                    <ThumbsUp size={16} /> Útil ({post.useful_count})
                                </button>
                                <button
                                    onClick={() => handleReaction('fire')}
                                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 hover:bg-orange-50 hover:border-orange-200 hover:text-orange-500 transition-colors font-bold text-sm text-gray-500"
                                >
                                    <Flame size={16} /> {post.fire_count}
                                </button>
                            </div>
                            <button className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-[#2B2B2B] px-4 py-2 rounded-xl hover:bg-gray-100 transition-colors">
                                <Share2 size={16} /> Partilhar
                            </button>
                        </div>

                        {/* ── Comments Section ────────────────────────────── */}
                        <div>
                            <h3 className="text-xl font-black text-[#2B2B2B] mb-6 flex items-center gap-2">
                                <MessageSquare size={20} className="text-[#3347FF]" />
                                Todos os Comentários ({post.comments_count})
                            </h3>

                            {/* Comment Box */}
                            <form onSubmit={handleCommentSubmit} className="flex gap-4 mb-10">
                                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                                    <User size={20} className="text-gray-400" />
                                </div>
                                <div className="flex-1 relative">
                                    <textarea
                                        value={comment}
                                        onChange={e => setComment(e.target.value)}
                                        placeholder="Adicionar um comentário..."
                                        className="w-full min-h-[100px] p-4 pr-12 rounded-2xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#3347FF] focus:ring-2 focus:ring-[#3347FF]/20 outline-none resize-none transition-all text-sm font-medium text-gray-700"
                                    />
                                    <button
                                        type="submit"
                                        disabled={!comment.trim()}
                                        className="absolute bottom-3 right-3 p-2 rounded-xl bg-[#3347FF] text-white disabled:opacity-50 disabled:bg-gray-300 transition-colors"
                                    >
                                        <Send size={16} />
                                    </button>
                                </div>
                            </form>

                            {/* Comments List */}
                            <div className="space-y-6">
                                {comments.map(c => (
                                    <div key={c.id} className="flex gap-4">
                                        <div className="w-10 h-10 rounded-full border border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden shrink-0">
                                            {c.author.avatar_url ? (
                                                <img src={c.author.avatar_url} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <User size={20} className="text-gray-400" />
                                            )}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-bold text-sm text-[#2B2B2B]">{c.author.full_name}</span>
                                                {c.author.is_creator && (
                                                    <span className="text-[8px] font-black px-1.5 py-0.5 rounded-full bg-[#3347FF] text-white">PRO</span>
                                                )}
                                                <span className="text-xs text-gray-400 font-medium">· {new Date(c.created_at).toLocaleDateString()}</span>
                                            </div>
                                            <p className="text-sm text-gray-600 leading-relaxed font-medium mb-2">{c.content}</p>
                                            <div className="flex items-center gap-4 text-xs font-bold text-gray-400">
                                                <button className="flex items-center gap-1 hover:text-[#2B2B2B] transition-colors">
                                                    <Heart size={12} /> {c.likes_count || 0}
                                                </button>
                                                <button className="hover:text-[#2B2B2B] transition-colors">Responder</button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </article>
            </main>
        </div>
    );
}
