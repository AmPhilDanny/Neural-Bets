import { prisma } from '@/lib/prisma';
import { Target, CheckCircle2, XCircle, Brain, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function HistoryPage() {
  const games = await prisma.game.findMany({
    where: { status: { in: ['WON', 'LOST'] } },
    orderBy: { createdAt: 'desc' },
    take: 50
  });

  const stats = {
    total: games.length,
    won: games.filter(g => g.status === 'WON').length,
    lost: games.filter(g => g.status === 'LOST').length,
  };

  const accuracy = stats.total > 0 ? ((stats.won / stats.total) * 100).toFixed(1) : '0';

  return (
    <div className="min-h-screen bg-[#020617] text-[#f8fafc] py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="text-primary text-xs font-black uppercase tracking-widest mb-12 inline-block hover:underline">← Back to Live Odds</Link>
        
        <header className="mb-16">
          <h1 className="text-4xl font-black mb-4 tracking-tight uppercase">Verified Performance</h1>
          <p className="text-slate-400">Our results are transparent and updated daily by the Neural Network.</p>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
          {[
            { label: 'Overall Accuracy', value: `${accuracy}%`, icon: TrendingUp, color: 'text-emerald-500' },
            { label: 'Total Won', value: stats.won, icon: CheckCircle2, color: 'text-primary' },
            { label: 'Total Lost', value: stats.lost, icon: XCircle, color: 'text-rose-500' },
          ].map((s, i) => (
            <div key={i} className="p-8 rounded-[2rem] bg-white/5 border border-white/10">
              <div className="flex justify-between items-start mb-4">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{s.label}</p>
                <s.icon size={16} className={s.color} />
              </div>
              <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Results List */}
        <div className="space-y-4">
          {games.map(game => (
            <div key={game.id} className="flex items-center justify-between p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/5 transition-all">
              <div className="flex items-center gap-6">
                <div className={`p-3 rounded-xl ${game.status === 'WON' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                  {game.status === 'WON' ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-200">{game.targetOdds}× Odds Slip</p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Category: {game.category}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-black text-white">{game.totalOdds.toFixed(2)}×</p>
                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter">{new Date(game.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          ))}

          {games.length === 0 && (
            <div className="py-20 text-center border-2 border-dashed border-white/10 rounded-[2rem]">
              <p className="text-slate-500 italic">No historical data available yet. Our network is compiling results.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
