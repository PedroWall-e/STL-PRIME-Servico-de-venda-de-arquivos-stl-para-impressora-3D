"use client";

import React from 'react';
import { Settings, Calculator, Database, Save, ArrowRight, Gauge } from 'lucide-react';

export default function MaterialDesigner() {
    const [material, setMaterial] = React.useState('PLA');
    const [weight, setWeight] = React.useState(250);
    const [pricePerKg, setPricePerKg] = React.useState(120);

    const totalCost = (weight / 1000) * pricePerKg;

    return (
        <div className="pt-32 pb-20 min-h-screen">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row gap-12">
                    {/* Left Side: Configurator */}
                    <div className="flex-1">
                        <div className="mb-10">
                            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-sm bg-prime-600/10 border-l-4 border-prime-600 text-prime-500 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                                <Gauge size={14} />
                                <span>Precision Data Engine v2.4</span>
                            </div>
                            <h1 className="text-5xl md:text-7xl font-black font-outfit mb-4 uppercase tracking-tighter leading-none">PRIME <span className="text-prime-600">LAB</span></h1>
                            <p className="text-slate-500 uppercase text-xs font-bold tracking-widest">Otimização de extrusão baseada em custos de mercado.</p>
                        </div>

                        <div className="bg-zinc-950 p-10 rounded-sm border border-white/5 space-y-12">
                            <section>
                                <label className="block text-sm font-medium text-slate-300 mb-4 flex items-center gap-2">
                                    <Database size={16} /> Tipo de Material
                                </label>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    {['PLA', 'PETG', 'ABS', 'Resina'].map((type) => (
                                        <button
                                            key={type}
                                            onClick={() => setMaterial(type)}
                                            className={`py-3 rounded-xl font-bold border transition-all ${material === type
                                                ? 'bg-prime-600 border-prime-500 text-white'
                                                : 'bg-slate-900 border-white/5 text-slate-400 hover:border-white/20'
                                                }`}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </section>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <section>
                                    <label className="block text-sm font-medium text-slate-300 mb-3">Peso do Modelo (g)</label>
                                    <input
                                        type="number"
                                        value={weight}
                                        onChange={(e) => setWeight(Number(e.target.value))}
                                        className="w-full bg-slate-900 border border-white/10 rounded-xl py-3 px-4 text-white outline-none focus:border-prime-500"
                                    />
                                </section>
                                <section>
                                    <label className="block text-sm font-medium text-slate-300 mb-3">Preço por KG (R$)</label>
                                    <input
                                        type="number"
                                        value={pricePerKg}
                                        onChange={(e) => setPricePerKg(Number(e.target.value))}
                                        className="w-full bg-slate-900 border border-white/10 rounded-xl py-3 px-4 text-white outline-none focus:border-prime-500"
                                    />
                                </section>
                            </div>

                            <button className="w-full bg-white text-slate-950 font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-200 transition-colors">
                                <Save size={20} />
                                Salvar Perfil de Material
                            </button>
                        </div>
                    </div>

                    {/* Right Side: Analysis */}
                    <div className="w-full md:w-[400px]">
                        <div className="glass-card p-8 rounded-3xl border border-white/5 bg-gradient-to-br from-slate-900/50 to-prime-900/10 sticky top-32">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-12 h-12 rounded-xl bg-prime-500/10 flex items-center justify-center text-prime-400">
                                    <Calculator size={24} />
                                </div>
                                <h3 className="text-xl font-bold">Resumo Analítico</h3>
                            </div>

                            <div className="space-y-6">
                                <div className="flex justify-between items-end pb-4 border-b border-white/5">
                                    <span className="text-slate-400 text-sm">Custo de Material</span>
                                    <span className="text-2xl font-bold font-outfit text-white">R$ {totalCost.toFixed(2).replace('.', ',')}</span>
                                </div>

                                <div className="flex justify-between items-end pb-4 border-b border-white/5">
                                    <span className="text-slate-400 text-sm">Eficiência Sugerida</span>
                                    <span className="text-green-400 font-bold">94%</span>
                                </div>

                                <div className="p-4 rounded-2xl bg-slate-950/50 border border-white/5">
                                    <p className="text-xs text-slate-500 mb-2 uppercase font-bold tracking-widest">Dica Prime</p>
                                    <p className="text-sm text-slate-400 leading-relaxed">
                                        Baseado no perfil de <span className="text-prime-400">{material}</span>, recomendamos um infill de 15% GYROID para manter a resistência com o menor peso possível.
                                    </p>
                                </div>

                                <button className="w-full py-3 rounded-xl border border-prime-500/30 text-prime-400 font-bold hover:bg-prime-500/10 transition-all flex items-center justify-center gap-2">
                                    Gerar Relatório Completo
                                    <ArrowRight size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
