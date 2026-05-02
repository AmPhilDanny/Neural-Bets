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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <Link 
              href="/admin/dashboard" 
              className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/50 transition-all group"
            >
              <div className="p-3 rounded-xl bg-primary/10 text-primary mb-3 group-hover:scale-110 transition-transform">
                <Database size={24} />
              </div>
              <p className="font-black uppercase tracking-tighter text-sm">Site Dashboard</p>
              <p className="text-[10px] text-slate-500 uppercase font-bold mt-1">Manage Users & Sales</p>
            </Link>

            <a 
              href="https://ai-pred-app.vercel.app/admin" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-500/50 transition-all group"
            >
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500 mb-3 group-hover:scale-110 transition-transform">
                <Brain size={24} />
              </div>
              <p className="font-black uppercase tracking-tighter text-sm">AI Engine</p>
              <p className="text-[10px] text-slate-500 uppercase font-bold mt-1">Configure Predictions</p>
            </a>
          </div>
          
          <div className="flex items-center justify-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">
            <Lock size={12} /> Neural Security Protocol Active
          </div>

        </div>
      </div>
    </div>
  );
}
