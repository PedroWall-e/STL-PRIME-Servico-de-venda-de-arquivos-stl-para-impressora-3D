import React from 'react';
import ModelCard from '@/components/ModelCard';
import { Search, Filter } from 'lucide-react';

const MOCK_MODELS = [
    { title: 'Articulated Dragon V3', price: 45.0, imageUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=400' },
    { title: 'Cyberpunk Helmet Full Wearable', price: 89.9, imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=400' },
    { title: 'Fantasy Tavern Diorama', price: 35.0, imageUrl: 'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&q=80&w=400' },
    { title: 'Mechanical Watch Stand', price: 25.0, imageUrl: 'https://images.unsplash.com/photo-1542491595-3bc5aaec927c?auto=format&fit=crop&q=80&w=400' },
];

export default function PaidCatalog() {
    return (
        <div className="pt-32 pb-20 min-h-screen">
            <div className="container mx-auto px-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                    <div>
                        <div className="flex items-center gap-2 text-prime-500 font-black text-xs uppercase tracking-[0.3em] mb-4">
                            <span className="w-10 h-[2px] bg-prime-600" /> Original Content
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black font-outfit mb-4 uppercase tracking-tighter">PRIME <span className="text-prime-600">COLLECTION</span></h1>
                        <p className="text-slate-500 uppercase text-xs font-bold tracking-widest">Os designs mais lucrativos da fronteira de dados.</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="PROCURAR MODELO..."
                                className="w-full md:w-80 bg-zinc-900 border border-white/5 rounded-full py-4 px-12 text-white text-xs font-bold outline-none focus:border-prime-500 transition-all"
                            />
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                        </div>
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {MOCK_MODELS.map((model, i) => (
                        <ModelCard key={i} {...model} />
                    ))}
                </div>
            </div>
        </div>
    );
}
