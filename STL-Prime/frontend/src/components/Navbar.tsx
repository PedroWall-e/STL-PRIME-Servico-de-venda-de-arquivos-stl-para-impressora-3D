"use client";

import React from 'react';
import Link from 'next/link';
import { User, ShoppingCart, Menu, X, Rocket } from 'lucide-react';

export default function Navbar() {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-6xl z-50 glass-card rounded-full border-white/10 px-8 py-3 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
                <div className="w-8 h-8 rounded-lg bg-prime-600 flex items-center justify-center text-white shadow-[0_0_15px_rgba(225,29,72,0.5)] group-hover:scale-110 transition-transform">
                    <Rocket size={16} fill="currentColor" />
                </div>
                <span className="text-xl font-black font-outfit text-white tracking-tighter uppercase">STL <span className="text-prime-500">Prime</span></span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-10">
                <NavLink href="/catalog/paid">PREMIUM</NavLink>
                <NavLink href="/catalog/free">FREE</NavLink>
                <NavLink href="/material-designer">LAB</NavLink>
            </div>

            <div className="hidden md:flex items-center gap-6">
                <Link href="/auth/login" className="text-xs font-black text-slate-400 hover:text-white transition-colors uppercase tracking-widest">Login</Link>
                <Link href="/auth/signup" className="px-6 py-2 rounded-full bg-white text-black text-xs font-black transition-all hover:bg-prime-500 hover:text-white uppercase tracking-widest">
                    Join Now
                </Link>
            </div>
            {/* Mobile Toggle */}
            <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? <X /> : <Menu />}
            </button>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="absolute top-20 left-0 right-0 bg-black/95 backdrop-blur-3xl border border-white/10 p-8 rounded-3xl animate-fade-in flex flex-col gap-6 md:hidden">
                    <Link href="/catalog/paid" className="text-sm font-black text-slate-400 hover:text-white uppercase tracking-widest">Premium</Link>
                    <Link href="/catalog/free" className="text-sm font-black text-slate-400 hover:text-white uppercase tracking-widest">Free</Link>
                    <Link href="/material-designer" className="text-sm font-black text-slate-400 hover:text-white uppercase tracking-widest">Lab</Link>
                    <div className="h-[1px] bg-white/10 my-2" />
                    <Link href="/auth/login" className="text-sm font-black text-slate-400 hover:text-white uppercase tracking-widest">Login</Link>
                    <Link href="/auth/signup" className="text-center bg-prime-600 text-white py-4 rounded-full font-black uppercase text-xs tracking-widest">Join Now</Link>
                </div>
            )}
        </nav>
    );
}

function NavLink({ href, children }: { href: string, children: React.ReactNode }) {
    return (
        <Link href={href} className="text-[10px] font-black text-slate-400 hover:text-white transition-colors uppercase tracking-[3px] relative group">
            {children}
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-prime-500 transition-all group-hover:w-full shadow-[0_0_8px_rgba(225,29,72,0.8)]" />
        </Link>
    );
}
