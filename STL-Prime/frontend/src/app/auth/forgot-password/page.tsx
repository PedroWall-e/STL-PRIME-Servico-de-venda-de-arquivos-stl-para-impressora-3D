"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

export default function ForgotPasswordPage() {
    const supabase = createClient();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const redirectTo = `${process.env.NEXT_PUBLIC_BASE_URL ?? window.location.origin}/auth/reset-password`;

        const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });

        setLoading(false);

        if (resetError) {
            setError(resetError.message || 'Não foi possível enviar o link. Tente novamente.');
        } else {
            setSuccess(true);
        }
    };

    return (
        <div className="min-h-screen flex bg-[#F9F8F6]">
            {/* Left panel */}
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
                        <p className="text-blue-200 text-sm font-bold uppercase tracking-widest mb-4">Recuperação de Acesso</p>
                        <h2 className="text-white text-4xl font-black leading-tight mb-6">
                            Sem stress.<br />Recuperamos juntos.
                        </h2>
                        <p className="text-blue-100/80 text-lg font-medium">
                            Enviaremos um link seguro para o seu e-mail assim que confirmar.
                        </p>
                    </div>
                    <p className="text-blue-200/60 text-sm">© 2024 Data Frontier Labs</p>
                </div>
            </div>

            {/* Right panel - form */}
            <div className="flex-1 flex items-center justify-center px-6 py-12">
                <div className="w-full max-w-md">
                    {/* Mobile logo */}
                    <Link href="/" className="flex items-center gap-3 mb-10 lg:hidden">
                        <img src="/logo.svg" alt="STL Prime" className="w-10 h-10" />
                        <span className="font-black text-2xl text-[#2B2B2B] tracking-tight">stl<span className="text-[#3347FF]">prime</span></span>
                    </Link>

                    {success ? (
                        <div className="text-center">
                            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                                <CheckCircle2 className="w-10 h-10 text-green-500" />
                            </div>
                            <h1 className="text-2xl font-black text-[#2B2B2B] mb-3">Link enviado!</h1>
                            <p className="text-gray-500 mb-8">
                                Verifique a caixa de entrada de <strong>{email}</strong>. O link expira em 1 hora.
                            </p>
                            <Link href="/auth/login" className="inline-flex items-center gap-2 text-[#3347FF] font-bold hover:underline">
                                <ArrowLeft className="w-4 h-4" />
                                Voltar ao Login
                            </Link>
                        </div>
                    ) : (
                        <>
                            <Link href="/auth/login" className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-[#3347FF] transition-colors mb-8">
                                <ArrowLeft className="w-4 h-4" />
                                Voltar ao login
                            </Link>

                            <h1 className="text-3xl font-black text-[#2B2B2B] mb-2">Esqueceu a senha?</h1>
                            <p className="text-gray-500 font-medium mb-10">Informe seu e-mail e enviamos o link de redefinição.</p>

                            {error && (
                                <div className="flex items-center gap-3 p-4 mb-6 bg-red-50 border border-red-200 rounded-2xl text-sm text-red-700 font-medium">
                                    <AlertCircle className="w-5 h-5 shrink-0" />
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Seu e-mail</label>
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

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-4 rounded-2xl bg-[#3347FF] text-white font-bold flex items-center justify-center gap-2 hover:bg-[#2236ee] transition-colors disabled:opacity-60 shadow-lg shadow-[#3347FF]/20 hover:-translate-y-0.5 transform duration-200"
                                >
                                    {loading ? (
                                        <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <><span>Enviar Link de Recuperação</span><ArrowRight className="w-4 h-4" /></>
                                    )}
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
