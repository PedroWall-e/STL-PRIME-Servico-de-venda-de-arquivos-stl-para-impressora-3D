"use client";

import React, { useState, useEffect } from 'react';
import {
    User, Mail, MapPin, CreditCard, Shield,
    CheckCircle2, AlertCircle, Save, ArrowLeft,
    Clock, Globe, Building, Landmark
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

export default function ProfileSettingsPage() {
    const supabase = createClient();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<any>({
        full_name: '',
        username: '',
        bio: '',
        address_street: '',
        address_city: '',
        address_state: '',
        address_zip: '',
        address_country: 'Brasil'
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        setLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            router.push('/auth/login');
            return;
        }
        setUser(session.user);

        const { data } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();

        if (data) {
            setProfile({
                full_name: data.full_name || '',
                username: data.username || '',
                bio: data.bio || '',
                address_street: data.address_street || '',
                address_city: data.address_city || '',
                address_state: data.address_state || '',
                address_zip: data.address_zip || '',
                address_country: data.address_country || 'Brasil',
                role: data.role,
                subscription_status: data.subscription_status
            });
        }
        setLoading(false);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        const { error } = await supabase
            .from('users')
            .update({
                full_name: profile.full_name,
                username: profile.username,
                bio: profile.bio,
                address_street: profile.address_street,
                address_city: profile.address_city,
                address_state: profile.address_state,
                address_zip: profile.address_zip,
                address_country: profile.address_country,
                updated_at: new Date().toISOString()
            })
            .eq('id', user.id);

        if (error) {
            alert("Erro ao salvar: " + error.message);
        } else {
            // Success feedback
        }
        setSaving(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F9F8F6] flex items-center justify-center">
                <div className="text-gray-400 font-bold animate-pulse text-xs uppercase tracking-widest">A carregar laboratório...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F9F8F6] py-12">
            <div className="container mx-auto px-4 max-w-4xl">

                {/* Header */}
                <div className="mb-10 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-black text-[#2B2B2B] tracking-tight">Área do Cliente</h1>
                        <p className="text-gray-500 font-medium">Gerencie suas informações, endereço e assinatura.</p>
                    </div>
                    <button
                        onClick={() => router.back()}
                        className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-[#3347FF] shadow-sm transition-all"
                    >
                        <ArrowLeft size={20} />
                    </button>
                </div>

                <div className="grid md:grid-cols-[1fr_300px] gap-8">

                    {/* Main Form */}
                    <div className="bg-white rounded-[40px] border border-gray-100 p-8 shadow-sm">
                        <form onSubmit={handleSave} className="space-y-10">

                            {/* Profile Info */}
                            <section>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-xl bg-[#3347FF]/5 flex items-center justify-center text-[#3347FF]">
                                        <User size={20} />
                                    </div>
                                    <h2 className="text-xl font-black text-[#2B2B2B]">Informações Básicas</h2>
                                </div>
                                <div className="grid sm:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Nome Completo</label>
                                        <input
                                            value={profile.full_name}
                                            onChange={e => setProfile({ ...profile, full_name: e.target.value })}
                                            className="w-full bg-gray-50 border-2 border-transparent focus:bg-white focus:border-[#3347FF] p-4 rounded-2xl outline-none transition-all font-bold text-sm"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Username</label>
                                        <input
                                            value={profile.username}
                                            onChange={e => setProfile({ ...profile, username: e.target.value })}
                                            className="w-full bg-gray-50 border-2 border-transparent focus:bg-white focus:border-[#3347FF] p-4 rounded-2xl outline-none transition-all font-bold text-sm"
                                        />
                                    </div>
                                    <div className="sm:col-span-2 space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Bio</label>
                                        <textarea
                                            value={profile.bio}
                                            onChange={e => setProfile({ ...profile, bio: e.target.value })}
                                            rows={3}
                                            className="w-full bg-gray-50 border-2 border-transparent focus:bg-white focus:border-[#3347FF] p-4 rounded-2xl outline-none transition-all font-medium text-sm"
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* Address Section */}
                            <section>
                                <div className="flex items-center gap-3 mb-6 pt-4 border-t border-gray-50">
                                    <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
                                        <MapPin size={20} />
                                    </div>
                                    <h2 className="text-xl font-black text-[#2B2B2B]">Endereço & Entrega</h2>
                                </div>
                                <div className="grid sm:grid-cols-2 gap-6">
                                    <div className="sm:col-span-2 space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Rua / Logradouro</label>
                                        <input
                                            value={profile.address_street}
                                            onChange={e => setProfile({ ...profile, address_street: e.target.value })}
                                            placeholder="Rua, número, complemento..."
                                            className="w-full bg-gray-50 border-2 border-transparent focus:bg-white focus:border-[#3347FF] p-4 rounded-2xl outline-none transition-all font-bold text-sm"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Cidade</label>
                                        <input
                                            value={profile.address_city}
                                            onChange={e => setProfile({ ...profile, address_city: e.target.value })}
                                            className="w-full bg-gray-50 border-2 border-transparent focus:bg-white focus:border-[#3347FF] p-4 rounded-2xl outline-none transition-all font-bold text-sm"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Estado</label>
                                        <input
                                            value={profile.address_state}
                                            onChange={e => setProfile({ ...profile, address_state: e.target.value })}
                                            className="w-full bg-gray-50 border-2 border-transparent focus:bg-white focus:border-[#3347FF] p-4 rounded-2xl outline-none transition-all font-bold text-sm"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">CEP</label>
                                        <input
                                            value={profile.address_zip}
                                            onChange={e => setProfile({ ...profile, address_zip: e.target.value })}
                                            className="w-full bg-gray-50 border-2 border-transparent focus:bg-white focus:border-[#3347FF] p-4 rounded-2xl outline-none transition-all font-bold text-sm"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">País</label>
                                        <select
                                            value={profile.address_country}
                                            onChange={e => setProfile({ ...profile, address_country: e.target.value })}
                                            className="w-full bg-gray-50 border-2 border-transparent focus:bg-white focus:border-[#3347FF] p-4 rounded-2xl outline-none transition-all font-bold text-sm appearance-none"
                                        >
                                            <option value="Brasil">Brasil</option>
                                            <option value="Portugal">Portugal</option>
                                            <option value="Angola">Angola</option>
                                            <option value="Other">Outro</option>
                                        </select>
                                    </div>
                                </div>
                            </section>

                            <div className="pt-6">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="w-full sm:w-auto px-10 py-4 bg-[#3347FF] text-white rounded-3xl font-black shadow-xl shadow-[#3347FF]/20 hover:bg-[#2236EE] hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
                                >
                                    {saving ? 'A salvar...' : <><Save size={18} /> Salvar Alterações</>}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Sidebar Info */}
                    <div className="space-y-6">
                        {/* Subscription Status Wrap */}
                        <div className="bg-white rounded-[32px] border border-gray-100 p-6 shadow-sm overflow-hidden relative">
                            <div className="relative z-10">
                                <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">Plano Vigente</h3>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${profile.subscription_status === 'free' ? 'bg-gray-100 text-gray-500' : 'bg-[#3347FF] text-white shadow-lg shadow-[#3347FF]/20'}`}>
                                        <Shield size={24} />
                                    </div>
                                    <div>
                                        <p className="text-lg font-black text-[#2B2B2B] capitalize">{profile.subscription_status || 'Free'}</p>
                                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-tight">Assinante STL Prime</p>
                                    </div>
                                </div>

                                <div className="space-y-3 mb-6">
                                    {profile.subscription_status === 'free' ? (
                                        <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                                            <AlertCircle size={14} className="text-orange-400" />
                                            Acesso limitado a modelos grátis.
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 text-xs text-green-600 font-bold">
                                            <CheckCircle2 size={14} />
                                            Downloads premium ilimitados.
                                        </div>
                                    )}
                                </div>

                                <button className="w-full py-3 rounded-2xl bg-gray-50 hover:bg-gray-100 text-[#2B2B2B] font-black text-xs uppercase tracking-widest transition-all">
                                    Gerenciar Plano
                                </button>
                            </div>
                            {/* Visual Decor */}
                            <div className="absolute -right-6 -bottom-6 opacity-[0.03] rotate-12">
                                <Landmark size={150} />
                            </div>
                        </div>

                        {/* Account Stats / Tips */}
                        <div className="bg-[#2B2B2B] rounded-[32px] p-6 text-white overflow-hidden relative">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-4">Dica de Segurança</h3>
                            <p className="text-xs leading-relaxed font-bold text-white/80 mb-6">Certifique-se de que o seu endereço de entrega está correto para encomendas futuras de impressões físicas.</p>
                            <div className="flex items-center gap-2 text-[#3347FF] font-black text-xs uppercase tracking-widest cursor-pointer hover:translate-x-1 transition-transform">
                                Saiba Mais <ChevronRight size={14} />
                            </div>

                            {/* Abstract Pattern */}
                            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#3347FF]/20 to-transparent rounded-full -mr-10 -mt-10 blur-xl" />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

function ChevronRight({ size, className }: { size: number, className?: string }) {
    return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m9 18 6-6-6-6" /></svg>;
}
