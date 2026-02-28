"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowRight, AlertCircle, Box } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

export default function LoginPage() {
    const router = useRouter();
    const supabase = createClient();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isSimulationMode = () => {
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
        return !url || url.includes('SEU_PROJETO') || url.includes('mockup') || url === 'https://mockup.supabase.co';
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Simulation mode: se as credenciais do Supabase são placeholder, finge o login
        if (isSimulationMode()) {
            await new Promise(r => setTimeout(r, 1200));
            router.push('/dashboard');
            return;
        }

        try {
            const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
            if (signInError) throw signInError;
            router.push('/');
            router.refresh();
        } catch (err: any) {
            setError(err.message || 'E-mail ou senha incorretos.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-[#F9F8F6]">
            {/* Left side - visual */}
            <div className="hidden lg:flex flex-1 relative overflow-hidden bg-[#3347FF]">
                <div className="absolute inset-0">
                    <div className="absolute top-[-20%] left-[-20%] w-[70%] h-[70%] bg-white/10 rounded-full blur-[80px]"></div>
                    <div className="absolute bottom-[-20%] right-[-20%] w-[70%] h-[70%] bg-[#B2624F]/30 rounded-full blur-[80px]"></div>
                </div>
                <div className="relative z-10 flex flex-col justify-between p-14 w-full">
                    <Link href="/" className="flex items-center gap-3">
                        <img src="/logo.svg" alt="STL Prime" className="w-10 h-10" />
                        <span className="font-black text-2xl text-white tracking-tight">stl<span className="text-blue-200">prime</span></span>
                    </Link>
                    <div>
                        <p className="text-blue-200 text-sm font-bold uppercase tracking-widest mb-4">Para criadores e makers</p>
                        <h2 className="text-white text-4xl font-black leading-tight mb-6">
                            Publique o seu design.<br />Ganhe com ele.
                        </h2>
                        <p className="text-blue-100/80 text-lg font-medium">
                            Aceda ao maior marketplace de ficheiros STL e 3MF de Portugal.
                        </p>
                    </div>
                    <p className="text-blue-200/60 text-sm">© 2024 Data Frontier Labs</p>
                </div>
            </div>

            {/* Right side - form */}
            <div className="flex-1 flex items-center justify-center px-6 py-12">
                <div className="w-full max-w-md">
                    {/* Mobile logo */}
                    <Link href="/" className="flex items-center gap-3 mb-10 lg:hidden">
                        <img src="/logo.svg" alt="STL Prime" className="w-10 h-10" />
                        <span className="font-black text-2xl text-[#2B2B2B] tracking-tight">stl<span className="text-[#3347FF]">prime</span></span>
                    </Link>

                    <h1 className="text-3xl font-black text-[#2B2B2B] mb-2">Bem-vindo de volta</h1>
                    <p className="text-gray-500 font-medium mb-10">Entre na sua conta para continuar.</p>

                    {error && (
                        <div className="flex items-center gap-3 p-4 mb-6 bg-red-50 border border-red-200 rounded-2xl text-sm text-red-700 font-medium">
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">E-mail</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                    <Mail className="w-4 h-4 text-gray-400" />
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="seu@email.com"
                                    required
                                    className="w-full pl-10 pr-4 py-3.5 rounded-2xl border border-gray-200 bg-gray-50 text-gray-900 text-sm font-bold focus:bg-white focus:border-[#3347FF] focus:ring-2 focus:ring-[#3347FF]/20 outline-none transition-all placeholder:text-gray-400"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-bold text-gray-700">Senha</label>
                                <a href="#" className="text-xs font-bold text-[#3347FF] hover:underline">Esqueceu a senha?</a>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                    <Lock className="w-4 h-4 text-gray-400" />
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="w-full pl-10 pr-4 py-3.5 rounded-2xl border border-gray-200 bg-gray-50 text-gray-900 text-sm font-bold focus:bg-white focus:border-[#3347FF] focus:ring-2 focus:ring-[#3347FF]/20 outline-none transition-all placeholder:text-gray-400"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 rounded-2xl bg-[#3347FF] text-white font-bold flex items-center justify-center gap-2 hover:bg-[#2236ee] transition-colors disabled:opacity-60 shadow-lg shadow-[#3347FF]/20 hover:shadow-[#3347FF]/30 hover:-translate-y-0.5 transform duration-200"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                            ) : (
                                <><span>Entrar</span><ArrowRight className="w-4 h-4" /></>
                            )}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm font-medium text-gray-500">
                        Ainda não tem conta?{' '}
                        <Link href="/auth/signup" className="text-[#3347FF] font-bold hover:underline">
                            Criar conta gratuita
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
