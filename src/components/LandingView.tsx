'use client';

import React, { useState } from 'react';
import { Target, Zap, Activity, Brain, Clock, ShieldCheck, ChevronRight, Crown, Star, Flame } from 'lucide-react';
import { OddsCard } from '@/components/OddsCard';
import { SecurityShield } from '@/components/SecurityShield';
import { SubscriptionModal } from '@/components/SubscriptionModal';
import Link from 'next/link';

export function LandingView({ games, session, error }: { games: any[], session: any, error: string | null }) {
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const userTier = session?.user?.tier || 'FREE';
  
  // Filter games into categories
  const freeGames = games.filter(g => !g.isPremium);
  const safeGames = games.filter(g => g.category === '2x' && g.isPremium);
  const mediumGames = games.filter(g => g.category === '5x' && g.isPremium);
  const highRiskGames = games.filter(g => g.category === '10x' && g.isPremium);

  const onUnlock = () => setIsSubModalOpen(true);

  return (
    <div className="min-h-screen bg-[#020617] text-[#f8fafc] font-sans selection:bg-primary/20 selection:text-primary">
      <SecurityShield />
      <SubscriptionModal 
        isOpen={isSubModalOpen} 
        onClose={() => setIsSubModalOpen(false)} 
        userEmail={session?.user?.email} 
      />
      
      {/* Ambient background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-500/10 blur-[120px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        {/* Navigation / User Bar */}
        <nav className="flex justify-between items-center mb-20 animate-fade-up">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-primary/20 border border-primary/20">
              <Brain className="text-primary" size={24} />
            </div>
            <span className="text-xl font-black tracking-tighter uppercase">Neural<span className="text-primary">Bets</span></span>
          </div>
          <div className="flex items-center gap-4">
            {session ? (
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-slate-400">Welcome, <span className="text-white">{session.user.email}</span></span>
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                  userTier === 'VIP' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                  userTier === 'PREMIUM' ? 'bg-primary/10 text-primary border border-primary/20' :
                  'bg-slate-500/10 text-slate-400'
                }`}>
                  {userTier} Member
                </span>
                <Link href="/api/auth/logout" className="text-xs font-bold text-slate-500 hover:text-white transition-colors">Logout</Link>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/login" className="text-xs font-bold text-slate-400 hover:text-white transition-colors">Login</Link>
                <Link href="/register" className="px-5 py-2 rounded-full bg-primary text-white text-xs font-black uppercase tracking-widest hover:bg-primary/90 transition-all">Join VIP</Link>
              </div>
            )}
          </div>
        </nav>

        {/* Header */}
        <header className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Neural Network v4.8 Active
          </div>
          <h1 className="text-5xl sm:text-7xl font-black tracking-tight mb-6">
            Daily <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-400">2x+ Winning</span> Odds
          </h1>
          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Experience precision analytics. Our system generates high-probability slips through multi-agent consensus.
          </p>
        </header>

        {/* Main Content Sections */}
        <div className="space-y-32">
          
          {/* Section 1: Free Access */}
          <section>
            <div className="flex items-end justify-between border-b border-white/10 pb-6 mb-10">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Star className="text-slate-400" size={16} />
                  <h2 className="text-2xl font-black uppercase tracking-tight">Free Neural Consensus</h2>
                </div>
                <p className="text-sm text-slate-400">Daily sample predictions for the public</p>
              </div>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{freeGames.length} Available</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {freeGames.map(game => (
                <OddsCard key={game.id} game={game} isUnlocked={true} />
              ))}
              {freeGames.length === 0 && !error && (
                <div className="col-span-full py-20 text-center bg-white/5 border-dashed border-2 border-white/10 rounded-3xl">
                  <p className="text-slate-500">Awaiting today&apos;s free consensus slips...</p>
                </div>
              )}
            </div>
          </section>

          {/* Section 2: Premium Tiers */}
          <section>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-black mb-4 uppercase tracking-tighter">Premium Odds Tiers</h2>
              <div className="flex justify-center gap-4 flex-wrap">
                <span className="px-4 py-2 bg-primary/10 text-primary border border-primary/20 text-xs font-bold uppercase tracking-widest rounded-full">🔵 Safe (2x+)</span>
                <span className="px-4 py-2 bg-amber-500/10 text-amber-500 border border-amber-500/20 text-xs font-bold uppercase tracking-widest rounded-full">🟡 Medium (5x+)</span>
                <span className="px-4 py-2 bg-rose-500/10 text-rose-500 border border-rose-500/20 text-xs font-bold uppercase tracking-widest rounded-full">🔴 High Risk (10x+)</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...safeGames, ...mediumGames, ...highRiskGames].map(game => (
                <OddsCard 
                  key={game.id} 
                  game={game} 
                  isUnlocked={userTier === 'VIP' || (userTier === 'PREMIUM' && game.category !== '10x')} 
                  onUnlock={onUnlock}
                />
              ))}
            </div>
          </section>

          {/* Proof System / Accuracy */}
          <section className="py-20 rounded-[3rem] bg-gradient-to-b from-primary/10 to-transparent border border-white/5 px-8 text-center">
            <h2 className="text-3xl font-black mb-10 uppercase tracking-tight">System Performance (Verified)</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { label: 'Overall Accuracy', value: '78.4%', icon: Activity, color: 'text-emerald-500' },
                { label: '2x Safe Rate', value: '91.2%', icon: ShieldCheck, color: 'text-primary' },
                { label: '5x Medium Rate', value: '64.5%', icon: Zap, color: 'text-amber-500' },
                { label: 'Total Won (30d)', value: '142', icon: Crown, color: 'text-cyan-500' },
              ].map((stat, i) => (
                <div key={i}>
                  <p className={`text-4xl font-black mb-2 ${stat.color}`}>{stat.value}</p>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</p>
                </div>
              ))}
            </div>
            <div className="mt-16">
              <Link href="/history" className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white text-xs font-black uppercase tracking-[0.3em] hover:bg-white/10 transition-all">
                View Winning History <ChevronRight size={16} />
              </Link>
            </div>
          </section>

        </div>
      </div>

      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-white/10 text-center">
        <p className="text-slate-500 text-sm mb-4">Neural-Bets is powered by the DeepMind Prediction Engine.</p>
        <div className="flex items-center justify-center gap-8 opacity-40">
           <p className="text-[10px] font-black uppercase tracking-[0.4em]">Gemini</p>
           <p className="text-[10px] font-black uppercase tracking-[0.4em]">Mistral</p>
           <p className="text-[10px] font-black uppercase tracking-[0.4em]">OpenRouter</p>
        </div>
      </footer>
    </div>
  );
}
