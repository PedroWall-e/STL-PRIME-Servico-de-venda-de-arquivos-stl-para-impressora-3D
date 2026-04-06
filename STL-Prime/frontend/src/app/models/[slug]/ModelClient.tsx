"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    ShoppingCart, Download, Star, Heart, Camera, X,
    Package, ChevronRight, ImageIcon, User, CheckCircle2
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { useCart } from '@/context/CartContext';

interface ModelClientPageProps {
    params: { slug: string };
}

export default function ModelClientPage({ params }: ModelClientPageProps) {
    const supabase = createClient();
    const router = useRouter();
    const { addItem } = useCart();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [model, setModel] = useState<any>(null);
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeSection, setActiveSection] = useState<'details' | 'reviews' | 'makes'>('details');
    const [currentUser, setCurrentUser] = useState<any>(null);

    // Review form state
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAll = async () => {
            setLoading(true);

            const { data: { user } } = await supabase.auth.getUser();
            setCurrentUser(user);

            const { data: modelData } = await supabase
                .from('models')
                .select(`
                    *,
                    author:users(id, username, full_name, avatar_url)
                `)
                .eq('slug', params.slug)
                .single();

            if (!modelData) { router.push('/'); return; }
            setModel(modelData);

            const { data: reviewsData } = await supabase
                .from('reviews')
                .select(`
                    *,
                    user:users(username, full_name, avatar_url)
                `)
                .eq('model_id', modelData.id)
                .order('created_at', { ascending: false });

            setReviews(reviewsData ?? []);
            setLoading(false);
        };

        fetchAll();
    }, [params.slug]);

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setPhotoFile(file);
        setPhotoPreview(URL.createObjectURL(file));
    };

    const removePhoto = () => {
        setPhotoFile(null);
        setPhotoPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleReviewSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser) { router.push('/auth/login'); return; }
        if (!comment.trim()) return;

        setSubmitting(true);
        setSubmitError(null);

        let printPhotoUrl: string | null = null;

        // Upload photo to makes-photos bucket if provided
        if (photoFile) {
            const fileExt = photoFile.name.split('.').pop();
            const fileName = `${currentUser.id}/${model.id}-${Date.now()}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from('makes-photos')
                .upload(fileName, photoFile, { upsert: true });

            if (uploadError) {
                setSubmitError('Erro ao enviar a foto. Tente novamente.');
                setSubmitting(false);
                return;
            }

            const { data: urlData } = supabase.storage
                .from('makes-photos')
                .getPublicUrl(fileName);

            printPhotoUrl = urlData.publicUrl;
        }

        const { error: insertError } = await supabase
            .from('reviews')
            .insert({
                model_id: model.id,
                user_id: currentUser.id,
                rating,
                comment: comment.trim(),
                print_photo_url: printPhotoUrl,
            });

        setSubmitting(false);

        if (insertError) {
            setSubmitError('Erro ao publicar comentário. Tente novamente.');
        } else {
            setSubmitSuccess(true);
            setComment('');
            setRating(5);
            removePhoto();
            // Refresh reviews
            const { data: reviewsData } = await supabase
                .from('reviews')
                .select('*, user:users(username, full_name, avatar_url)')
                .eq('model_id', model.id)
                .order('created_at', { ascending: false });
            setReviews(reviewsData ?? []);
            setTimeout(() => setSubmitSuccess(false), 3000);
        }
    };

    const averageRating = reviews.length
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : '—';

    const makes = reviews.filter(r => r.print_photo_url);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F9F8F6] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-[#3347FF]/20 border-t-[#3347FF] rounded-full animate-spin" />
                    <p className="text-sm font-black text-gray-400 uppercase tracking-widest">A carregar modelo...</p>
                </div>
            </div>
        );
    }

    if (!model) return null;

    return (
        <div className="min-h-screen bg-[#F9F8F6]">
            <div className="container mx-auto px-4 md:px-6 py-8">

                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-8">
                    <Link href="/" className="hover:text-[#3347FF] transition-colors">Início</Link>
                    <ChevronRight size={14} />
                    <Link href="/models" className="hover:text-[#3347FF] transition-colors">Catálogo</Link>
                    <ChevronRight size={14} />
                    <span className="text-[#2B2B2B] font-bold line-clamp-1">{model.title}</span>
                </nav>

                <div className="grid lg:grid-cols-2 gap-10 mb-12">
                    {/* Thumbnail */}
                    <div className="aspect-square rounded-3xl overflow-hidden bg-gray-100 shadow-xl">
                        {model.thumbnail_url ? (
                            <img src={model.thumbnail_url} alt={model.title} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <Package className="w-20 h-20 text-gray-300" />
                            </div>
                        )}
                    </div>

                    {/* Info */}
                    <div>
                        {model.format && (
                            <span className="inline-block bg-[#3347FF]/10 text-[#3347FF] text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-full mb-4">
                                {model.format}
                            </span>
                        )}
                        <h1 className="text-3xl md:text-4xl font-black text-[#2B2B2B] mb-3">{model.title}</h1>

                        <div className="flex items-center gap-4 mb-4">
                            <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map(s => (
                                    <Star key={s} size={16} className={Number(averageRating) >= s ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} />
                                ))}
                                <span className="text-sm font-bold text-gray-600 ml-1">{averageRating} ({reviews.length})</span>
                            </div>
                            {makes.length > 0 && (
                                <button onClick={() => setActiveSection('makes')} className="flex items-center gap-1.5 text-sm font-bold text-[#3347FF] hover:underline">
                                    <Camera size={14} /> {makes.length} Makes
                                </button>
                            )}
                        </div>

                        {model.author && (
                            <Link href={`/creator/${model.author.username}`} className="flex items-center gap-2 mb-6 text-sm font-bold text-gray-500 hover:text-[#3347FF] transition-colors">
                                <div className="w-7 h-7 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
                                    {model.author.avatar_url ? <img src={model.author.avatar_url} className="w-full h-full object-cover" /> : <User size={14} />}
                                </div>
                                @{model.author.username}
                            </Link>
                        )}

                        <p className="text-gray-600 mb-8 leading-relaxed">{model.description}</p>

                        <div className="flex items-center justify-between mb-6">
                            <span className={`text-4xl font-black ${model.is_free ? 'text-green-500' : 'text-[#2B2B2B]'}`}>
                                {model.is_free ? 'Grátis' : `R$ ${Number(model.price ?? 0).toFixed(2)}`}
                            </span>
                        </div>

                        <div className="flex gap-3">
                            {model.is_free ? (
                                <button className="flex-1 py-4 bg-green-500 hover:bg-green-600 text-white font-black rounded-2xl flex items-center justify-center gap-2 transition-colors shadow-md">
                                    <Download size={20} /> Download Grátis
                                </button>
                            ) : (
                                <button
                                    onClick={() => addItem({ 
                                        id: model.id, 
                                        title: model.title, 
                                        price: model.price, 
                                        thumbnail_url: model.thumbnail_url, 
                                        slug: model.slug,
                                        format: model.format ?? null,
                                        author_username: model.author?.username ?? 'anon'
                                    })}
                                    className="flex-1 py-4 bg-[#3347FF] hover:bg-[#2236ee] text-white font-black rounded-2xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-[#3347FF]/20"
                                >
                                    <ShoppingCart size={20} /> Adicionar ao Carrinho
                                </button>
                            )}
                            <button className="p-4 rounded-2xl border border-gray-200 bg-white text-gray-400 hover:text-red-500 hover:border-red-200 transition-all">
                                <Heart size={20} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200 mb-8 flex gap-8">
                    {(['details', 'reviews', 'makes'] as const).map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveSection(tab)}
                            className={`pb-3 text-sm font-black uppercase tracking-widest capitalize transition-colors border-b-2 -mb-px ${activeSection === tab ? 'border-[#3347FF] text-[#3347FF]' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                        >
                            {tab === 'details' ? 'Detalhes' : tab === 'reviews' ? `Avaliações (${reviews.length})` : `Makes ${makes.length > 0 ? `(${makes.length})` : ''}`}
                        </button>
                    ))}
                </div>

                {/* Details Tab */}
                {activeSection === 'details' && (
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-white rounded-3xl border border-gray-100 p-6">
                            <h3 className="font-black text-[#2B2B2B] mb-4">Especificações Técnicas</h3>
                            <div className="space-y-3">
                                {[
                                    { label: 'Formato', value: model.format ?? '—' },
                                    { label: 'Categoria', value: model.category ?? '—' },
                                    { label: 'Downloads', value: model.downloads_count ?? 0 },
                                    { label: 'Licença', value: model.license ?? 'Uso Pessoal' },
                                ].map(row => (
                                    <div key={row.label} className="flex items-center justify-between py-2 border-b border-gray-50">
                                        <span className="text-sm font-bold text-gray-500">{row.label}</span>
                                        <span className="text-sm font-black text-[#2B2B2B]">{row.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Reviews Tab */}
                {activeSection === 'reviews' && (
                    <div className="space-y-8">
                        {/* Submit form */}
                        {currentUser ? (
                            <form onSubmit={handleReviewSubmit} className="bg-white rounded-3xl border border-gray-100 p-6">
                                <h3 className="font-black text-[#2B2B2B] mb-5">Deixe sua avaliação</h3>

                                {/* Star Rating */}
                                <div className="flex items-center gap-1 mb-5">
                                    {[1, 2, 3, 4, 5].map(s => (
                                        <button key={s} type="button" onClick={() => setRating(s)}>
                                            <Star size={28} className={rating >= s ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'} />
                                        </button>
                                    ))}
                                </div>

                                <textarea
                                    value={comment}
                                    onChange={e => setComment(e.target.value)}
                                    placeholder="Compartilhe sua experiência com este modelo..."
                                    rows={3}
                                    required
                                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl text-sm font-medium text-gray-700 focus:outline-none focus:border-[#3347FF] focus:ring-2 focus:ring-[#3347FF]/20 resize-none mb-4"
                                />

                                {/* Photo upload - Makes */}
                                <div className="mb-5">
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                                        📸 Foto da Impressão (Makes — opcional)
                                    </p>
                                    {photoPreview ? (
                                        <div className="relative w-32 h-32 rounded-2xl overflow-hidden border-2 border-[#3347FF]/30">
                                            <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                                            <button type="button" onClick={removePhoto}
                                                className="absolute top-1 right-1 p-1 bg-black/60 rounded-full text-white hover:bg-black/80">
                                                <X size={12} />
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-gray-200 rounded-2xl text-sm font-bold text-gray-400 hover:border-[#3347FF] hover:text-[#3347FF] transition-colors"
                                        >
                                            <Camera size={18} /> Adicionar foto da impressão
                                        </button>
                                    )}
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handlePhotoChange}
                                        className="hidden"
                                    />
                                </div>

                                {submitError && (
                                    <p className="text-sm text-red-600 font-bold mb-3">{submitError}</p>
                                )}
                                {submitSuccess && (
                                    <div className="flex items-center gap-2 text-sm text-green-600 font-bold mb-3">
                                        <CheckCircle2 size={16} /> Avaliação publicada com sucesso!
                                    </div>
                                )}

                                <button type="submit" disabled={submitting}
                                    className="px-8 py-3 bg-[#3347FF] text-white font-bold rounded-2xl hover:bg-[#2236ee] transition-colors disabled:opacity-60 shadow-md shadow-[#3347FF]/20">
                                    {submitting ? 'A publicar...' : 'Publicar Avaliação'}
                                </button>
                            </form>
                        ) : (
                            <div className="bg-white rounded-3xl border border-gray-100 p-6 text-center">
                                <p className="text-gray-500 font-medium mb-4">Faça login para deixar uma avaliação.</p>
                                <Link href="/auth/login" className="px-6 py-2.5 bg-[#3347FF] text-white font-bold rounded-xl text-sm hover:bg-[#2236ee] transition-colors">
                                    Entrar
                                </Link>
                            </div>
                        )}

                        {/* Reviews list */}
                        {reviews.length === 0 ? (
                            <p className="text-center text-gray-400 font-medium py-8">Nenhuma avaliação ainda. Seja o primeiro!</p>
                        ) : (
                            <div className="space-y-4">
                                {reviews.map(review => (
                                    <div key={review.id} className="bg-white rounded-3xl border border-gray-100 p-5 flex gap-4">
                                        <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden shrink-0 flex items-center justify-center">
                                            {review.user?.avatar_url ? <img src={review.user.avatar_url} className="w-full h-full object-cover" /> : <User size={18} className="text-gray-400" />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="font-black text-[#2B2B2B] text-sm">@{review.user?.username ?? 'anon'}</span>
                                                <div className="flex gap-0.5">
                                                    {[1, 2, 3, 4, 5].map(s => <Star key={s} size={12} className={review.rating >= s ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'} />)}
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-600 font-medium">{review.comment}</p>
                                            {review.print_photo_url && (
                                                <div className="mt-3 w-24 h-24 rounded-xl overflow-hidden border border-gray-100 cursor-pointer" onClick={() => setActiveSection('makes')}>
                                                    <img src={review.print_photo_url} alt="Make" className="w-full h-full object-cover hover:scale-105 transition-transform" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Makes Tab */}
                {activeSection === 'makes' && (
                    <div>
                        {makes.length === 0 ? (
                            <div className="text-center py-20">
                                <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-5">
                                    <ImageIcon className="w-10 h-10 text-gray-300" />
                                </div>
                                <h3 className="font-black text-[#2B2B2B] text-xl mb-2">Nenhum Make ainda</h3>
                                <p className="text-gray-500 text-sm mb-6">Compre este modelo, imprima e volte para partilhar a sua impressão!</p>
                                <button onClick={() => setActiveSection('reviews')} className="px-6 py-3 bg-[#3347FF] text-white font-bold rounded-2xl text-sm hover:bg-[#2236ee] transition-colors">
                                    Partilhar o meu Make
                                </button>
                            </div>
                        ) : (
                            <>
                                <p className="text-sm font-bold text-gray-400 mb-6">{makes.length} make{makes.length !== 1 ? 's' : ''} partilhados pela comunidade</p>
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {makes.map(make => (
                                        <div key={make.id} className="group relative rounded-2xl overflow-hidden aspect-square bg-gray-100 shadow-sm hover:shadow-lg transition-shadow">
                                            <img
                                                src={make.print_photo_url}
                                                alt={`Make por @${make.user?.username}`}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                                <div className="absolute bottom-0 left-0 right-0 p-3">
                                                    <p className="text-white font-black text-xs">@{make.user?.username ?? 'anon'}</p>
                                                    {make.comment && (
                                                        <p className="text-white/80 text-xs font-medium line-clamp-2 mt-1">{make.comment}</p>
                                                    )}
                                                    <div className="flex gap-0.5 mt-1">
                                                        {[1, 2, 3, 4, 5].map(s => <Star key={s} size={10} className={make.rating >= s ? 'text-yellow-400 fill-yellow-400' : 'text-white/30'} />)}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
