import React from 'react';
import { Clock, ShieldCheck, Zap, Brain, Lock, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface Match {
  league: string;
  match: string;
  prediction: string;
  odds: number;
  reasoning: string;
}

interface OddsCardProps {
  game: {
    id: string;
    totalOdds: number;
    confidence: number;
    targetOdds: number;
    category: string;
    isPremium: boolean;
    matches: string | Match[];
    pushedAt: string | Date;
  };
  isUnlocked: boolean;
  onUnlock?: (id: string) => void;
}

export function OddsCard({ game, isUnlocked, onUnlock }: OddsCardProps) {
  const matches: Match[] = typeof game.matches === 'string' ? JSON.parse(game.matches) : game.matches;

  return (
    <div className={`group relative flex flex-col bg-white/5 border border-white/10 rounded-3xl overflow-hidden transition-all duration-500 ${isUnlocked ? 'hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1' : ''}`}>
      {/* Header */}
      <div className="p-8 border-b border-white/10 bg-white/[0.02]">
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-2 ${
              game.category === '10x' ? 'text-rose-500' : 
              game.category === '5x' ? 'text-amber-500' : 'text-primary'
            }`}>
              Target {game.targetOdds}× ({game.category})
            </p>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black">{game.totalOdds}</span>
              <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">Odds</span>
            </div>
          </div>
          <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-widest">
            {game.confidence}% Conf.
          </div>
        </div>
        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-primary to-cyan-500" style={{ width: `${game.confidence}%` }} />
        </div>
      </div>

      {/* Matches List */}
      <div className="p-8 flex-1 space-y-6 relative">
        {!isUnlocked && (
          <div className="absolute inset-0 z-10 backdrop-blur-md bg-[#020617]/40 flex flex-col items-center justify-center p-8 text-center">
            <div className="p-4 rounded-full bg-white/10 mb-4">
              <Lock size={32} className="text-primary" />
            </div>
            <h3 className="text-xl font-black mb-2 uppercase tracking-tight">Premium Analysis</h3>
            <p className="text-sm text-slate-400 mb-6">This {game.category} slip is exclusive to VIP members.</p>
            <button 
              onClick={() => onUnlock && onUnlock(game.id)}
              className="px-6 py-3 rounded-full bg-primary hover:bg-primary/90 text-white text-xs font-black uppercase tracking-[0.2em] transition-all transform hover:scale-105 active:scale-95"
            >
              Unlock Now
            </button>
          </div>
        )}

        <div className={isUnlocked ? '' : 'filter blur-sm select-none pointer-events-none opacity-30'}>
          {matches.map((m, idx) => (
            <div key={idx} className="relative pl-6 before:absolute before:left-0 before:top-1.5 before:w-1.5 before:bottom-1.5 before:bg-primary/30 before:rounded-full mb-6 last:mb-0">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{m.league}</span>
                <span className="text-xs font-bold text-primary">{m.odds}×</span>
              </div>
              <p className="font-bold text-slate-200 leading-tight mb-2">{m.match}</p>
              <div className="flex items-center gap-2">
                <span className="px-1.5 py-0.5 rounded bg-primary/10 text-primary text-[8px] font-black uppercase tracking-wider">{m.prediction}</span>
                <span className="text-[9px] text-slate-500 italic truncate">{m.reasoning}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 bg-white/[0.03] flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest">
        <div className="flex items-center gap-2">
          <Clock size={12} />
          {new Date(game.pushedAt).toLocaleTimeString()}
        </div>
        <div className="flex items-center gap-1">
          <Brain size={12} className="text-primary" />
          <span>v4.8 Deep Learning</span>
        </div>
      </div>
    </div>
  );
}
