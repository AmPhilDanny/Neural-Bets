import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Brain, Lock } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#020617] text-[#f8fafc] font-sans flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <Link href="/" className="text-primary hover:text-primary/80 transition-colors mb-8 inline-block text-sm font-bold uppercase tracking-widest">
          <ArrowLeft size={16} className="inline mr-2" /> Back to Home
        </Link>
        
        <div className="card-base p-8 border-primary/20 shadow-2xl">
          <div className="flex justify-center mb-6">
            <div className="p-3 rounded-2xl bg-primary/10 text-primary border border-primary/20">
              <Brain size={32} />
            </div>
          </div>
          
          <h1 className="text-2xl font-black uppercase tracking-tight text-center mb-2">
            Access Neural<span className="text-primary">Bets</span>
          </h1>
          <p className="text-slate-400 text-center text-sm mb-8">Sign in to view your premium AI predictions</p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Email Address</label>
              <input type="email" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors" placeholder="user@example.com" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Password</label>
              <input type="password" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors" placeholder="••••••••" />
            </div>
            
            <button className="w-full py-3 mt-4 rounded-xl bg-primary text-white font-black uppercase tracking-widest hover:bg-primary/90 transition-all flex items-center justify-center gap-2">
              <Lock size={16} /> Authenticate
            </button>
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-400">
              Don&apos;t have an account? <Link href="/register" className="text-primary font-bold hover:underline">Join VIP</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
