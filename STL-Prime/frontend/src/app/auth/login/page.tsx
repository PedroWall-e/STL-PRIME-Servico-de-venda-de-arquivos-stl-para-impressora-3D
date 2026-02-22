"use client";

import React from 'react';
import Link from 'next/link';
import { Lock, Mail, ArrowRight } from 'lucide-react';

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-slate-950 relative overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-prime-600/10 blur-[120px] -z-10" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 blur-[120px] -z-10" />

            <div className="w-full max-w-md">
                <div className="text-center mb-10">
                    <Link href="/" className="text-3xl font-bold font-outfit text-gradient mb-2 inline-block">
                        STL Prime
                    </Link>
                    <h2 className="text-2xl font-bold font-outfit text-white">Bem-vindo de volta</h2>
                    <p className="text-slate-400 mt-2">Entre na sua conta Data Frontier</p>
                </div>

                <div className="glass-card p-8 rounded-2xl border border-white/5 shadow-2xl">
                    <form className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">E-mail</label>
                            <div className="relative">
                                <input
                                    type="email"
                                    className="w-full bg-slate-900 border border-white/10 rounded-xl py-3 px-11 text-white focus:border-prime-500 focus:ring-1 focus:ring-prime-500 transition-all outline-none"
                                    placeholder="seu@email.com"
                                />
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Senha</label>
                            <div className="relative">
                                <input
                                    type="password"
                                    className="w-full bg-slate-900 border border-white/10 rounded-xl py-3 px-11 text-white focus:border-prime-500 focus:ring-1 focus:ring-prime-500 transition-all outline-none"
                                    placeholder="••••••••"
                                />
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
                                <input type="checkbox" className="rounded border-white/10 bg-slate-900 text-prime-500 focus:ring-prime-500" />
                                Lembrar de mim
                            </label>
                            <a href="#" className="text-prime-400 hover:text-prime-300 transition-colors">Esqueceu a senha?</a>
                        </div>

                        <button className="w-full bg-prime-600 hover:bg-prime-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-prime-600/20 flex items-center justify-center gap-2 group">
                            Entrar
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-white/5 text-center">
                        <p className="text-slate-400">
                            Não tem uma conta?{' '}
                            <Link href="/auth/signup" className="text-prime-400 font-bold hover:text-prime-300 transition-colors">
                                Criar conta gratuita
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
