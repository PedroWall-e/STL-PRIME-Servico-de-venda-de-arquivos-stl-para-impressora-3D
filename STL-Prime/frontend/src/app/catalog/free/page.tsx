import React from 'react';
import ModelCard from '@/components/ModelCard';
import { Lock } from 'lucide-react';

const FREE_MODELS = [
    { title: 'Calibration Cube Prime', price: 0, imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=400' },
    { title: 'Mini Planter Geometric', price: 0, imageUrl: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&q=80&w=400' },
    { title: 'Cable Organizer Clip', price: 0, imageUrl: 'https://images.unsplash.com/photo-1544006659-f0b21f04cb1d?auto=format&fit=crop&q=80&w=400' },
    { title: 'Smartphone Stand Lite', price: 0, imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=400' },
];

export default function FreeCatalog() {
    const isUserLoggedIn = true; // Placeholder para validação real

    return (
        <div className="pt-32 pb-20 min-h-screen">
            <div className="container mx-auto px-6 text-center">
                {!isUserLoggedIn ? (
                    <div className="glass-card max-w-2xl mx-auto p-12 rounded-3xl border border-white/5">
                        <div className="w-16 h-16 bg-prime-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <Lock className="text-prime-400" size={32} />
                        </div>
                        <h2 className="text-3xl font-bold mb-4 font-outfit">Acesso Restrito</h2>
                        <p className="text-slate-400 mb-8">
                            Os modelos gratuitos são exclusivos para membros da comunidade STL Prime.
                            Crie sua conta agora para desbloquear centenas de arquivos sem custo.
                        </p>
                        <div className="flex justify-center gap-4">
                            <button className="px-8 py-3 rounded-xl bg-prime-600 font-bold hover:bg-prime-500 transition-all shadow-lg shadow-prime-600/20">
                                Criar Conta Gratuita
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="text-left mb-16">
                            <div className="flex items-center gap-2 text-prime-500 font-black text-xs uppercase tracking-[0.3em] mb-4">
                                <span className="w-10 h-[2px] bg-prime-600" /> Community Vault
                            </div>
                            <h1 className="text-5xl md:text-7xl font-black font-outfit mb-4 uppercase tracking-tighter">FREE <span className="text-white">ACCESS</span></h1>
                            <p className="text-slate-500 uppercase text-xs font-bold tracking-widest">Modelos utilitários para membros registrados.</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {FREE_MODELS.map((model, i) => (
                                <ModelCard key={i} {...model} isFree={true} />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
