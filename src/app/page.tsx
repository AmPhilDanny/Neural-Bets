import { prisma } from '@/lib/prisma';
import { Game } from '@prisma/client';
import { 
  Target, Zap, Activity, Brain, Clock, ShieldCheck, 
  ChevronRight, Cpu, Database, Shield, Terminal, Globe 
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function LandingPage() {
  let games: Game[] = [];
  let error = null;

  try {
    const allGames = await prisma.game.findMany({
      orderBy: { createdAt: 'desc' },
      take: 40
    });
    games = allGames.filter(g => g.status === 'PENDING');
    const history = allGames.filter(g => g.status !== 'PENDING');

    return (
      <div className="min-h-screen bg-[#020617] text-[#f8fafc] font-sans selection:bg-primary/20 selection:text-primary">
        {/* Ambient background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-500/10 blur-[120px] animate-pulse delay-1000" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          {/* Header */}
          <header className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-6 animate-fade-up">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Neural Network Active
            </div>
            <h1 className="text-5xl sm:text-7xl font-black tracking-tight mb-6 animate-fade-up [animation-delay:200ms]">
              Neural <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-400">Bets</span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed animate-fade-up [animation-delay:400ms]">
              Experience the future of football analytics. Our multi-agent system generates high-precision predictions through neural consensus.
            </p>
          </header>

          {/* Engine Info Box */}
          <div className="mb-20 animate-fade-up [animation-delay:500ms]">
            <div className="p-8 sm:p-10 rounded-[2.5rem] bg-gradient-to-b from-white/[0.05] to-transparent border border-white/10 backdrop-blur-md overflow-hidden relative group shadow-2xl shadow-primary/5">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <Cpu size={120} className="text-primary" />
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-10">
                  <div className="p-2.5 rounded-xl bg-primary shadow-lg shadow-primary/20 text-white">
                    <Terminal size={22} />
                  </div>
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-[0.3em]">Engine Core Architecture</h3>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Real-time Agent Synchronization</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {[
                    { name: 'Crawler-X', desc: 'Harvests real-time odds from 4+ global data gateways.', icon: Globe, status: 'Active', pulse: true },
                    { name: 'Neural-Processor', desc: 'Normalizes and structures raw match telemetry.', icon: Database, status: 'Active', pulse: true },
                    { name: 'Consensus-Analyst', desc: 'Multi-LLM reasoning for precision match picks.', icon: Brain, status: 'Processing', pulse: true },
                    { name: 'Logic-Validator', desc: 'Verifies outcomes against real-world results.', icon: Shield, status: 'Online', pulse: false },
                  ].map((agent, i) => (
                    <div key={i} className="p-6 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-primary/30 transition-all group/agent">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-white/5 text-primary group-hover/agent:scale-110 transition-transform">
                          <agent.icon size={18} />
                        </div>
                        <span className="text-xs font-black uppercase tracking-widest text-slate-100">{agent.name}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed mb-4">{agent.desc}</p>
                      <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                        <span className={`w-2 h-2 rounded-full ${
                          agent.status === 'Active' || agent.status === 'Online' ? 'bg-emerald-500' : 
                          agent.status === 'Processing' ? 'bg-primary' : 'bg-slate-600'
                        } ${agent.pulse ? 'animate-pulse' : ''}`} />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{agent.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Active Slips */}
          <section className="mb-24 space-y-10">
            <div className="flex items-end justify-between border-b border-white/10 pb-6">
              <div>
                <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
                  <Zap className="text-primary" />
                  Active Neural Slips
                </h2>
                <p className="text-sm text-slate-400 mt-2">Current iterations with high-confidence probability</p>
              </div>
            </div>

            {games.length === 0 ? (
              <div className="py-24 text-center card-base bg-white/5 border-dashed border-2 border-white/10">
                <Clock size={48} className="mx-auto text-slate-700 mb-4" />
                <p className="text-slate-500 font-medium tracking-wide">Awaiting next neural cycle. Check back shortly.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {games.map((game) => (
                  <PredictionCard key={game.id} game={game} />
                ))}
              </div>
            )}
          </section>

          {/* History Section */}
          <section className="space-y-10 opacity-80 hover:opacity-100 transition-opacity">
            <div className="flex items-end justify-between border-b border-white/10 pb-6">
              <div>
                <h2 className="text-2xl font-black tracking-tight flex items-center gap-3 text-slate-300">
                  <History className="text-slate-500" />
                  Neural History
                </h2>
                <p className="text-sm text-slate-500 mt-1">Recently concluded predictions and outcomes</p>
              </div>
            </div>

            {history.length === 0 ? (
              <div className="py-12 text-center rounded-3xl bg-white/[0.02] border border-white/5">
                <p className="text-slate-600 text-xs font-bold uppercase tracking-widest">History log initializing...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {history.map((game) => (
                  <HistoryCard key={game.id} game={game} />
                ))}
              </div>
            )}
          </section>
        </div>

        <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-white/10 text-center">
          <p className="text-slate-500 text-sm mb-4 font-medium tracking-wide">Neural-Bets is powered by the AI Prediction Consensus Engine.</p>
          <div className="flex items-center justify-center gap-8 opacity-20">
             <p className="text-[10px] font-black uppercase tracking-[0.4em]">Gemini</p>
             <p className="text-[10px] font-black uppercase tracking-[0.4em]">Mistral</p>
             <p className="text-[10px] font-black uppercase tracking-[0.4em]">OpenRouter</p>
          </div>
        </footer>
      </div>
    );
  } catch (e) {
    console.error("Critical error:", e);
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 text-center">
        <div className="max-w-md">
          <Activity size={48} className="mx-auto text-primary animate-pulse mb-6" />
          <h1 className="text-xl font-black uppercase tracking-widest mb-2">Engine Synchronizing</h1>
          <p className="text-sm text-slate-500">The neural network is initializing its secure database tunnel. Please refresh in a moment.</p>
        </div>
      </div>
    );
  }
}

function PredictionCard({ game }: { game: any }) {
  const matches = JSON.parse(game.matches);
  return (
    <div className="group relative flex flex-col bg-white/5 border border-white/10 rounded-[2rem] overflow-hidden hover:border-primary/40 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1">
      <div className="p-8 border-b border-white/10 bg-white/[0.02]">
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2">Target {game.targetOdds}×</p>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black">{game.totalOdds}</span>
              <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">Odds</span>
            </div>
          </div>
          <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-widest">
            {game.confidence}% Conf.
          </div>
        </div>
        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-primary to-cyan-500" style={{ width: `${game.confidence}%` }} />
        </div>
      </div>

      <div className="p-8 flex-1 space-y-6">
        {matches.map((m: any, idx: number) => (
          <div key={idx} className="relative pl-6 before:absolute before:left-0 before:top-1.5 before:w-1.5 before:bottom-1.5 before:bg-primary/30 before:rounded-full">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{m.league}</span>
              <span className="text-xs font-bold text-primary">{m.odds}×</span>
            </div>
            <p className="font-bold text-slate-200 leading-tight mb-2">{m.match || `${m.homeTeam} vs ${m.awayTeam}`}</p>
            <div className="flex items-center gap-2">
              <span className="px-1.5 py-0.5 rounded bg-primary/10 text-primary text-[8px] font-black uppercase tracking-wider">{m.prediction || m.selection}</span>
              <span className="text-[9px] text-slate-500 italic truncate">{m.reasoning}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="p-6 bg-white/[0.03] flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest">
        <div className="flex items-center gap-2 text-primary/60">
          <Clock size={12} />
          {new Date(game.pushedAt).toLocaleTimeString()}
        </div>
        <span className="flex items-center gap-1">
          <Activity size={10} className="text-emerald-500" />
          Neural v4.5
        </span>
      </div>
    </div>
  );
}

function HistoryCard({ game }: { game: any }) {
  return (
    <div className={`p-5 rounded-2xl border transition-all ${
      game.status === 'WON' ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-white/5 border-white/10 opacity-70'
    }`}>
      <div className="flex justify-between items-start mb-4">
        <span className="text-[10px] font-mono text-slate-500">{new Date(game.pushedAt).toLocaleDateString()}</span>
        <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-widest ${
          game.status === 'WON' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-slate-500/20 text-slate-500'
        }`}>
          {game.status}
        </span>
      </div>
      <p className="text-xl font-black mb-1">{game.totalOdds}×</p>
      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{game.targetOdds}× Target</p>
    </div>
  );
}
