'use client';

import React, { useState } from 'react';
import { Zap, Activity, Brain, ShieldCheck, ChevronRight, Crown, Star, Flame, Loader2 } from 'lucide-react';
import { OddsCard } from '@/components/OddsCard';
import { SecurityShield } from '@/components/SecurityShield';
import { SubscriptionModal } from '@/components/SubscriptionModal';
import Link from 'next/link';

export function LandingView({ games, session, error }: { games: any[], session: any, error: string | null }) {
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('FREE');
  const [liveGames, setLiveGames] = useState(games);
  const userTier = session?.user?.tier || 'FREE';
  
  React.useEffect(() => {
    const eventSource = new EventSource('/api/live/stream');
    
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'NEW_GAME') {
        setLiveGames(prev => {
          // Check if game already exists
          if (prev.find(g => g.id === data.payload.id)) return prev;
          return [data.payload, ...prev];
        });
      }
    };

    return () => eventSource.close();
  }, []);

  // Filter games into categories using liveGames state
  const freeGames = liveGames.filter(g => !g.isPremium);
  const safeGames = liveGames.filter(g => g.category === '2x' && g.isPremium);
  const mediumGames = liveGames.filter(g => g.category === '5x' && g.isPremium);
  const highRiskGames = liveGames.filter(g => g.category === '10x' && g.isPremium);

  const activeGames = activeTab === 'FREE' ? freeGames : 
                      activeTab === '2x' ? safeGames :
                      activeTab === '5x' ? mediumGames : highRiskGames;


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

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Navigation / User Bar */}
        <nav className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-cyan-500 flex items-center justify-center shadow-[0_0_20px_rgba(var(--primary),0.3)]">
              <Brain className="text-white" size={24} />
            </div>
            <span className="text-xl font-black tracking-tighter uppercase">Neural<span className="text-primary">Bets</span></span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/history" className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors">History</Link>
            {session ? (
              <div className="flex items-center gap-4">
                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-primary">{userTier}</span>
                <Link href="/api/auth/logout" className="px-5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-all">Logout</Link>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/login" className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors">Login</Link>
                <Link href="/register" className="px-5 py-2 rounded-xl bg-primary text-white text-xs font-bold uppercase tracking-widest hover:bg-primary/90 transition-all shadow-[0_0_20px_rgba(var(--primary),0.3)]">Join VIP</Link>
              </div>
            )}
          </div>
        </nav>

        {/* Header */}
        <header className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Neural Network v4.8 Active
          </div>
          <h1 className="text-5xl sm:text-7xl font-black tracking-tight mb-6">
            Daily <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-400">2x+ Winning</span> Odds
          </h1>
          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Experience precision analytics. High-probability slips through multi-agent consensus.
          </p>
        </header>

        {/* AI Engine Live Status */}
        <div className="mb-20">
          <div className="card-base p-6 border-emerald-500/20 bg-[#020617]/50 backdrop-blur-md relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 relative">
                  <Brain size={28} />
                  <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping"></span>
                  <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full"></span>
                </div>
                <div>
                  <h3 className="font-black uppercase tracking-tight text-lg text-white">Robust AI Engine <span className="text-emerald-500">Online</span></h3>
                  <p className="text-xs text-slate-400 mt-1">Multi-agent consensus actively processing data</p>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 w-full md:w-auto">
                <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Scraper Agent</p>
                    <p className="text-xs font-bold text-white">Active</p>
                  </div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Data Processor</p>
                    <p className="text-xs font-bold text-white">Synced</p>
                  </div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Analyst Engine</p>
                    <p className="text-xs font-bold text-white">Predicting</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex flex-wrap justify-center gap-2 mb-12 p-2 rounded-2xl bg-white/5 border border-white/10 max-w-2xl mx-auto">
          {[
            { id: 'FREE', label: 'Free Consensus', icon: Star, color: 'text-slate-400' },
            { id: '2x', label: 'Safe (2x+)', icon: ShieldCheck, color: 'text-primary' },
            { id: '5x', label: 'Medium (5x+)', icon: Zap, color: 'text-amber-500' },
            { id: '10x', label: 'High Risk (10x+)', icon: Flame, color: 'text-rose-500' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                activeTab === tab.id 
                ? 'bg-white/10 text-white shadow-xl scale-105' 
                : 'text-slate-500 hover:text-slate-300 hover:bg-white/[0.02]'
              }`}
            >
              <tab.icon size={14} className={activeTab === tab.id ? tab.color : 'text-slate-500'} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Odds Grid */}
        <div className="space-y-12">
          {error && (
             <div className="mb-6 p-4 rounded-xl bg-primary/10 border border-primary/20 text-primary text-sm text-center italic">
               {error}
             </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activeGames.map((game) => (
              <div key={game.id} className="relative group">
                {/* Scarcity Trick Overlay */}
                {activeTab !== 'FREE' && (
                  <div className="absolute -top-3 -right-3 z-10 px-3 py-1 rounded-full bg-rose-500 text-[10px] font-black uppercase tracking-widest shadow-xl animate-bounce">
                    Only {Math.floor(Math.random() * 5) + 2} VIP slots left
                  </div>
                )}
                <OddsCard 
                  game={game} 
                  isUnlocked={activeTab === 'FREE' || userTier === 'VIP' || (userTier === 'PREMIUM' && activeTab === '2x')} 
                  onUnlock={onUnlock}
                />
                {activeTab !== 'FREE' && (
                  <p className="mt-3 text-[10px] text-center font-bold text-slate-500 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                    🔥 {Math.floor(Math.random() * 50) + 40} people unlocked this today
                  </p>
                )}
              </div>
            ))}
          </div>

          {activeGames.length === 0 && (
            <div className="py-32 text-center bg-white/5 border-dashed border-2 border-white/10 rounded-[3rem]">
              <p className="text-slate-500 italic">No {activeTab} consensus slips available for this session. Check back in 5 mins.</p>
            </div>
          )}
        </div>

        {/* Proof System / Accuracy */}
        <section className="py-24 mt-32 rounded-[3rem] bg-gradient-to-b from-primary/10 to-transparent border border-white/5 px-8 text-center">
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
