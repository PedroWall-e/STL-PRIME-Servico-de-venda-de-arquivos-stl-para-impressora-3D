import React from 'react';
import { ArrowRight, BarChart3, Binary, Rocket, ShieldCheck, Zap } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
    return (
        <main className="min-h-screen">
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-prime-950/20 via-black to-black" />
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80')] bg-cover bg-center mix-blend-overlay opacity-20" />
                </div>

                <div className="container mx-auto px-6 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-prime-950/50 border border-prime-500/30 text-prime-400 text-sm font-bold mb-8 animate-fade-in uppercase tracking-tighter">
                        <span className="w-2 h-2 rounded-full bg-prime-500 animate-pulse" />
                        Nova Fronteira de Dados
                    </div>

                    <h1 className="text-6xl md:text-8xl font-black font-outfit mb-8 leading-tight tracking-tighter animate-fade-in">
                        CRIAR. IMPRIMIR. <br />
                        <span className="text-gradient drop-shadow-[0_0_15px_rgba(225,29,72,0.4)]">DOMINAR.</span>
                    </h1>

                    <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto mb-12 animate-fade-in leading-relaxed">
                        A primeira plataforma de arquivos STL orquestrada por dados reais de mercado.
                        Não apenas imprima, evolua seu negócio 3D com a <span className="text-white font-bold">STL Prime</span>.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-fade-in">
                        <Link href="/catalog/paid" className="w-full sm:w-auto px-10 py-5 rounded-full bg-prime-600 hover:bg-prime-500 text-white font-black text-lg transition-all shadow-2xl shadow-prime-600/40 hover:scale-105 flex items-center justify-center gap-3">
                            EXPLORAR CATÁLOGO <Rocket size={24} />
                        </Link>
                        <Link href="/auth/signup" className="w-full sm:w-auto px-10 py-5 rounded-full glass-card hover:bg-white/5 text-white font-bold text-lg transition-all border-white/20">
                            Assinar Plano Prime
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-24 bg-slate-950">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold font-outfit mb-4">O que define a <span className="text-prime-400">STL Prime</span>?</h2>
                        <p className="text-slate-400 max-w-xl mx-auto">Tecnologia de ponta para quem não aceita o básico na impressão 3D.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<Binary className="text-prime-400" />}
                            title="Modelos Inteligentes"
                            description="Arquivos 3MF com metadados reais de sucesso global e perfis já configurados para sua máquina."
                        />
                        <FeatureCard
                            icon={<BarChart3 className="text-prime-400" />}
                            title="Analytics de Mercado"
                            description="Saiba o que está vendendo agora. Radar de tendências para assinantes comerciais."
                        />
                        <FeatureCard
                            icon={<Zap className="text-prime-400" />}
                            title="Otimização Máxima"
                            description="Designs pensados para economizar filamento e reduzir o tempo de impressão em até 30%."
                        />
                    </div>
                </div>
            </section>

            {/* Dynamic CTA */}
            <section className="py-20">
                <div className="container mx-auto px-6">
                    <div className="glass-card rounded-3xl p-12 text-center border border-white/5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-prime-600/10 blur-[80px] -z-10" />
                        <h2 className="text-4xl font-bold font-outfit mb-6">Pronto para a Fronteira Digital?</h2>
                        <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
                            Junte-se à elite dos makers. Acesse ferramentas de precificação, marketing e modelos exclusivos.
                        </p>
                        <button className="bg-white text-slate-950 px-10 py-4 rounded-xl font-bold text-lg hover:bg-slate-200 transition-colors">
                            Garantir Acesso Prime
                        </button>
                    </div>
                </div>
            </section>
        </main>
    );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <div className="glass-card p-8 rounded-2xl border border-white/5 hover:border-prime-500/30 transition-all group">
            <div className="w-14 h-14 rounded-xl bg-prime-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <h3 className="text-xl font-bold mb-3">{title}</h3>
            <p className="text-slate-400 leading-relaxed text-sm">
                {description}
            </p>
        </div>
    );
}
