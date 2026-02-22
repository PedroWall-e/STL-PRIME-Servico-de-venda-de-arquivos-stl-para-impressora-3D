import React from 'react';
import { Download, ShoppingCart, Star, Box } from 'lucide-react';

interface ModelCardProps {
    title: string;
    price: number;
    imageUrl: string;
    isFree?: boolean;
}

export default function ModelCard({ title, price, imageUrl, isFree }: ModelCardProps) {
    return (
        <div className="group relative aspect-[2/3] rounded-xl overflow-hidden bg-zinc-900 border border-white/5 hover:border-prime-500/50 transition-all duration-500 shadow-2xl">
            {/* Background Image */}
            <img
                src={imageUrl}
                alt={title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />

            {/* Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />

            {/* Badge */}
            {isFree && (
                <div className="absolute top-4 left-4 z-20 px-3 py-1 rounded-sm bg-prime-600 text-white text-[10px] font-black uppercase tracking-[0.2em]">
                    Free
                </div>
            )}

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-6 z-20 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="text-xl font-black text-white mb-2 leading-tight uppercase font-outfit shadow-black drop-shadow-lg">{title}</h3>
                <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity delay-100">
                    <p className="text-prime-400 font-black text-lg font-outfit">
                        {isFree ? 'R$ 0,00' : `R$ ${price.toFixed(2).replace('.', ',')}`}
                    </p>
                    <button className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-widest hover:text-prime-400 transition-colors">
                        {isFree ? <><Download size={16} /> Baixar</> : <><ShoppingCart size={16} /> Adquirir</>}
                    </button>
                </div>
            </div>

            {/* Border Glow for Prime Models */}
            {!isFree && (
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-prime-500/30 transition-all rounded-xl pointer-events-none" />
            )}
        </div>
    );
}
