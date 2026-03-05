"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Box, Search, UploadCloud, User, Menu, X, ShoppingBag, FolderHeart, LayoutDashboard, Settings, Bell, Rss } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { NotificationBell } from '@/components/NotificationBell';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);
    const supabase = createClient();

    useEffect(() => {
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user ?? null);

            if (session?.user) {
                const { data: prof } = await supabase
                    .from('users')
                    .select('role, full_name, avatar_url')
                    .eq('id', session.user.id)
                    .single();
                setProfile(prof);
            }
        };

        getSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            if (session?.user) {
                // Fetch profile on login
                supabase.from('users').select('role, full_name, avatar_url').eq('id', session.user.id).single()
                    .then(({ data }) => setProfile(data));
            } else {
                setProfile(null);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    return (
        <>
            <nav className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm text-prime-dark">
                <div className="container mx-auto px-4 md:px-6 h-20 flex items-center justify-between">

                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 cursor-pointer group">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-prime-blue group-hover:scale-105 transition-transform">
                            <Box className="text-white w-6 h-6" />
                        </div>
                        <div className="flex flex-col leading-none">
                            <span className="font-black text-xl tracking-tight text-prime-dark">stl<span className="text-prime-blue">prime</span></span>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">by Data Frontier</span>
                        </div>
                    </Link>

                    {/* Search Desktop */}
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            const q = (e.currentTarget.elements.namedItem('q') as HTMLInputElement).value.trim();
                            if (q) window.location.href = `/models?q=${encodeURIComponent(q)}`;
                            else window.location.href = '/models';
                        }}
                        className="hidden md:flex flex-1 max-w-md mx-8 relative"
                    >
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                            <Search className="w-4 h-4 text-gray-400" />
                        </div>
                        <input
                            name="q"
                            type="text"
                            placeholder="Pesquisar modelos 3D..."
                            className="w-full bg-gray-100 border-transparent focus:bg-white focus:border-prime-blue focus:ring-2 focus:ring-prime-blue/20 rounded-full py-2.5 pl-10 pr-4 text-sm transition-all outline-none"
                        />
                    </form>

                    {/* Ações Desktop */}
                    <div className="hidden md:flex items-center gap-4">
                        <Link href="/models" className="text-gray-600 hover:text-prime-blue font-bold text-sm transition-colors">Descobrir</Link>
                        <Link href="/models?price=free" className="text-gray-600 hover:text-prime-blue font-bold text-sm transition-colors">Grátis</Link>
                        <Link href="/community" className="text-gray-600 hover:text-prime-blue font-bold text-sm transition-colors">Comunidade</Link>
                        <a href="https://www.datafrontier3d.com.br" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-prime-blue font-bold text-sm transition-colors flex items-center gap-1">
                            Loja Oficial DF <Box size={14} />
                        </a>

                        <div className="h-6 w-px bg-gray-200 mx-2"></div>

                        {user ? (
                            <div className="flex items-center gap-4">
                                {profile?.role === 'admin' && (
                                    <Link href="/admin" className="flex items-center gap-1.5 text-red-600 hover:text-red-700 font-bold text-sm transition-colors">
                                        <LayoutDashboard className="w-4 h-4" />
                                        Admin
                                    </Link>
                                )}
                                <Link href="/my-collections" className="text-gray-600 hover:text-prime-blue font-bold text-sm transition-colors flex items-center gap-1.5">
                                    <FolderHeart className="w-4 h-4" />
                                    Coleções
                                </Link>
                                <NotificationBell />
                                <Link href="/upload" className="flex items-center gap-2 text-sm font-bold text-gray-700 hover:text-prime-blue transition-colors">
                                    <UploadCloud className="w-4 h-4" />
                                    Carregar
                                </Link>
                                <Link href="/profile/settings" className="w-10 h-10 rounded-full border border-gray-200 overflow-hidden bg-gray-100 flex items-center justify-center hover:ring-2 hover:ring-[#3347FF]/20 transition-all" title="Área do Cliente">
                                    {profile?.avatar_url ? (
                                        <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="w-5 h-5 text-gray-400" />
                                    )}
                                </Link>
                            </div>
                        ) : (
                            <Link href="/auth/signup" className="flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-white transition-transform hover:scale-105 bg-prime-blue">
                                <User className="w-4 h-4" />
                                Entrar
                            </Link>
                        )}
                    </div>

                    {/* Toggle Mobile */}
                    <button
                        className="md:hidden p-2 text-gray-600 hover:text-prime-blue"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </nav>

            {/* Menu Mobile */}
            {isOpen && (
                <div className="md:hidden fixed inset-0 top-20 z-40 bg-white p-6 flex flex-col gap-4 border-b border-gray-200 overflow-y-auto">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            const q = (e.currentTarget.elements.namedItem('q') as HTMLInputElement).value.trim();
                            setIsOpen(false);
                            window.location.href = q ? `/models?q=${encodeURIComponent(q)}` : '/models';
                        }}
                    >
                        <input
                            name="q"
                            type="text"
                            placeholder="Pesquisar modelos 3D..."
                            className="w-full bg-gray-100 border-transparent focus:border-prime-blue rounded-xl py-3 px-4 text-sm outline-none"
                        />
                    </form>

                    <Link href="/models" className="font-bold text-lg text-gray-800" onClick={() => setIsOpen(false)}>Descobrir</Link>
                    <Link href="/models?price=free" className="font-bold text-lg text-gray-800" onClick={() => setIsOpen(false)}>Grátis</Link>
                    <Link href="/community" className="font-bold text-lg text-gray-800" onClick={() => setIsOpen(false)}>Comunidade</Link>

                    <div className="border-t border-gray-100 pt-4 mt-2 flex flex-col gap-4">
                        {user ? (
                            <>
                                {profile?.role === 'admin' && (
                                    <Link href="/admin" className="font-bold text-lg text-red-600" onClick={() => setIsOpen(false)}>Painel Admin</Link>
                                )}
                                <Link href="/my-collections" className="font-bold text-lg text-gray-800 flex items-center gap-2" onClick={() => setIsOpen(false)}>
                                    <FolderHeart className="w-5 h-5" /> Coleções
                                </Link>
                                <Link href="/upload" className="font-bold text-lg text-prime-blue flex items-center gap-2" onClick={() => setIsOpen(false)}>
                                    <UploadCloud className="w-5 h-5" /> Carregar Modelo
                                </Link>
                                <Link href="/profile/settings" className="font-bold text-lg text-gray-800 flex items-center gap-2" onClick={() => setIsOpen(false)}>
                                    <Settings className="w-5 h-5" /> Área do Cliente
                                </Link>
                                <button onClick={handleLogout} className="mt-2 py-4 rounded-xl font-bold text-white text-center bg-gray-800">Sair</button>
                            </>
                        ) : (
                            <Link href="/auth/signup" className="py-4 rounded-xl font-bold text-white text-center bg-prime-blue" onClick={() => setIsOpen(false)}>
                                Entrar / Registar
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}

