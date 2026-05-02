import React from 'react';
import Link from 'next/link';
import { ArrowRight, Brain, Activity, Database, Lock } from 'lucide-react';

export default function AdminRedirect() {
  return (
    <div className="min-h-screen bg-[#020617] text-[#f8fafc] font-sans flex items-center justify-center p-4">
      <div className="max-w-xl w-full">
        <Link href="/" className="text-primary hover:text-primary/80 transition-colors mb-8 inline-block text-sm font-bold uppercase tracking-widest">
          &larr; Back to Platform
        </Link>
        
        <div className="card-base p-8 border-primary/20 bg-primary/5 text-center shadow-2xl">
          <div className="inline-flex p-4 rounded-2xl bg-primary/20 text-primary mb-6">
            <Brain size={48} />
          </div>
          
          <h1 className="text-3xl font-black uppercase tracking-tight mb-4">
            AI Engine Admin Gateway
          </h1>
          
          <p className="text-slate-400 mb-8 leading-relaxed">
            The Neural-Bets platform is powered by an independent, multi-agent AI Prediction Engine. 
            All scraping, data processing, and prediction logic is managed from the secure Intelligence Dashboard.
          </p>
          
          <div className="space-y-4 mb-8 text-left">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center gap-4">
              <Activity className="text-emerald-500" />
              <div>
                <p className="font-bold text-sm">Agent Management</p>
                <p className="text-xs text-slate-400">Configure Scraper, Processor, and Analyst Agents</p>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center gap-4">
              <Database className="text-cyan-500" />
              <div>
                <p className="font-bold text-sm">Data Vault</p>
                <p className="text-xs text-slate-400">Manage Football API & Neural Model API Keys</p>
              </div>
            </div>
          </div>
          
          <a 
            href="https://ai-pred-app.vercel.app/admin" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-primary text-white font-black uppercase tracking-widest hover:bg-primary/90 transition-all shadow-[0_0_40px_rgba(var(--primary),0.3)]"
          >
            Access Intelligence Dashboard <ArrowRight size={18} />
          </a>
          
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500">
            <Lock size={12} /> Secure Connection Required
          </div>
        </div>
      </div>
    </div>
  );
}
