import { AnimatePresence, motion } from 'framer-motion';
import { Clock, Flame, Target, TrendingUp, Trophy, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';
import CardinalCoin from '../components/CardinalCoin';
import { useApp } from '../context/AppContext';

const GOLD = '#D4AF37';

function formatTime(s) {
  return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;
}

const CAT_ICON = { drive:Zap, stats:TrendingUp, play:Target, game:Flame };

/* ─── PollCard ──────────────────────────────────── */
function PollCard({ poll, onBet, activeBets }) {
  const [selected,    setSelected]    = useState(null);
  const [betAmt,      setBetAmt]      = useState(50);
  const [showBetting, setShowBetting] = useState(false);
  const [timeLeft,    setTimeLeft]    = useState(poll.timeLeft);
  const existing = activeBets.find(b => b.pollId === poll.id);
  const totalVotes = poll.votesA + poll.votesB;
  const pctA = totalVotes > 0 ? Math.round(poll.votesA / totalVotes * 100) : 50;
  const CatIcon = CAT_ICON[poll.category] || Zap;

  useEffect(() => {
    const t = setInterval(() => setTimeLeft(v => Math.max(0, v - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  const placeBet = () => {
    if (!selected || betAmt <= 0) return;
    onBet(poll.id, selected, betAmt);
    setShowBetting(false);
    setSelected(null);
  };

  const opts = [
    { key:'A', label:poll.optionA, pct:pctA,       odds:poll.oddsA, votes:poll.votesA },
    { key:'B', label:poll.optionB, pct:100 - pctA, odds:poll.oddsB, votes:poll.votesB },
  ];

  return (
    <div style={{
      background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)',
      borderRadius:18, overflow:'hidden', marginBottom:14,
    }}>
      {/* Header */}
      <div style={{ padding:'14px 16px 12px' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <div style={{ width:28, height:28, borderRadius:8, background:'rgba(140,21,21,0.15)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <CatIcon size={14} color="#B83A3A" />
            </div>
            <span style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.3)', letterSpacing:0.8, textTransform:'uppercase' }}>{poll.category}</span>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:5 }}>
            <Clock size={13} color="rgba(255,255,255,0.3)" />
            <span style={{ fontSize:13, fontFamily:'monospace', fontWeight:700, color: timeLeft < 30 ? '#B83A3A' : 'rgba(255,255,255,0.4)' }}>
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>
        <p style={{ fontSize:15, fontWeight:700, color:'#fff', lineHeight:1.35, marginBottom:12 }}>{poll.question}</p>

        {/* Options */}
        {opts.map(opt => {
          const isSelected = selected === opt.key;
          const isBetOn    = existing?.option === opt.key;
          return (
            <motion.button
              key={opt.key}
              onClick={() => {
                if (existing) return;
                if (isSelected) { setSelected(null); setShowBetting(false); }
                else { setSelected(opt.key); setShowBetting(true); }
              }}
              disabled={!!existing}
              whileTap={!existing ? { scale:0.98 } : {}}
              style={{
                width:'100%', position:'relative', overflow:'hidden',
                borderRadius:12, border: isBetOn ? '1px solid rgba(212,175,55,0.3)' : isSelected ? '1px solid rgba(140,21,21,0.5)' : '1px solid rgba(255,255,255,0.07)',
                background: isBetOn ? 'rgba(212,175,55,0.08)' : isSelected ? 'rgba(140,21,21,0.12)' : 'rgba(255,255,255,0.02)',
                padding:'11px 12px', marginBottom:8, cursor: existing ? 'default' : 'pointer', textAlign:'left',
              }}>
              {/* Progress bar */}
              <motion.div
                initial={{ width:0 }}
                animate={{ width: `${opt.pct}%` }}
                transition={{ duration:0.8 }}
                style={{
                  position:'absolute', top:0, left:0, bottom:0, borderRadius:12,
                  background: isBetOn ? 'rgba(212,175,55,0.08)' : 'rgba(255,255,255,0.03)',
                  zIndex:0,
                }}
              />
              <div style={{ position:'relative', zIndex:1, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <div style={{ flex:1, minWidth:0, marginRight:12 }}>
                  <p style={{ fontSize:14, fontWeight:600, color:'#fff' }}>{opt.label}</p>
                  <p style={{ fontSize:11, color:'rgba(255,255,255,0.3)', marginTop:2 }}>{opt.votes} votes</p>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:8, flexShrink:0 }}>
                  <span style={{ fontSize:13, fontWeight:700, color:'rgba(255,255,255,0.5)' }}>{opt.pct}%</span>
                  <span style={{ background:'rgba(255,255,255,0.08)', borderRadius:8, padding:'3px 7px', fontSize:12, fontWeight:700, color:GOLD }}>{opt.odds}x</span>
                </div>
              </div>
              {isBetOn && existing && (
                <div style={{ position:'relative', zIndex:1, display:'flex', alignItems:'center', gap:5, marginTop:6 }}>
                  <CardinalCoin size={11} />
                  <span style={{ fontSize:12, fontWeight:700, color:GOLD }}>
                    {existing.amount} wagered · Potential: {Math.round(existing.amount * opt.odds)}
                  </span>
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Betting panel */}
      <AnimatePresence>
        {showBetting && selected && !existing && (
          <motion.div
            initial={{ height:0, opacity:0 }} animate={{ height:'auto', opacity:1 }}
            exit={{ height:0, opacity:0 }} style={{ overflow:'hidden' }}>
            <div style={{ padding:'12px 16px 16px', borderTop:'1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
                <span style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.4)', letterSpacing:0.8 }}>WAGER AMOUNT</span>
                <div style={{ display:'flex', alignItems:'center', gap:4 }}>
                  <CardinalCoin size={14} />
                  <span style={{ fontSize:14, fontWeight:700, color:GOLD }}>{betAmt}</span>
                </div>
              </div>
              {/* Quick amounts */}
              <div style={{ display:'flex', gap:8, marginBottom:10 }}>
                {[25,50,100,250].map(a => (
                  <button key={a} onClick={() => setBetAmt(a)}
                    style={{
                      flex:1, padding:'8px 0', borderRadius:10, border:'none', cursor:'pointer',
                      fontSize:13, fontWeight:700,
                      background: betAmt === a ? 'linear-gradient(135deg,#8C1515,#B83A3A)' : 'rgba(255,255,255,0.06)',
                      color: betAmt === a ? '#fff' : 'rgba(255,255,255,0.4)',
                    }}>{a}</button>
                ))}
              </div>
              {/* Slider */}
              <input type="range" min={10} max={500} step={10} value={betAmt}
                onChange={e => setBetAmt(Number(e.target.value))}
                style={{ width:'100%', marginBottom:10, accentColor:'#8C1515' }} />
              {/* Potential return */}
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', background:'rgba(255,255,255,0.03)', borderRadius:12, padding:'10px 12px', marginBottom:10 }}>
                <span style={{ fontSize:13, color:'rgba(255,255,255,0.4)' }}>Potential return</span>
                <div style={{ display:'flex', alignItems:'center', gap:5 }}>
                  <CardinalCoin size={14} />
                  <span style={{ fontSize:14, fontWeight:700, color:GOLD }}>
                    {Math.round(betAmt * (selected === 'A' ? poll.oddsA : poll.oddsB))}
                  </span>
                </div>
              </div>
              {/* Actions */}
              <div style={{ display:'flex', gap:8 }}>
                <button onClick={() => { setShowBetting(false); setSelected(null); }}
                  style={{ flex:1, padding:'12px 0', borderRadius:12, border:'none', background:'rgba(255,255,255,0.06)', color:'rgba(255,255,255,0.5)', fontSize:14, fontWeight:600, cursor:'pointer' }}>
                  Cancel
                </button>
                <motion.button onClick={placeBet} whileTap={{ scale:0.97 }}
                  style={{ flex:2, padding:'12px 0', borderRadius:12, border:'none', background:'linear-gradient(135deg,#8C1515,#B83A3A)', color:'#fff', fontSize:14, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
                  <Zap size={15} /> Place Wager
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <div style={{ padding:'9px 16px', background:'rgba(255,255,255,0.015)', borderTop:'1px solid rgba(255,255,255,0.04)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ display:'flex', alignItems:'center', gap:5 }}>
          <CardinalCoin size={12} />
          <span style={{ fontSize:12, color:'rgba(255,255,255,0.3)' }}>{poll.totalPool.toLocaleString()} pool</span>
        </div>
        <span style={{ fontSize:12, color:'rgba(255,255,255,0.2)' }}>{totalVotes} participants</span>
      </div>
    </div>
  );
}

/* ─── PollsScreen ───────────────────────────────── */
export default function PollsScreen({ onBack }) {
  const { user, polls, activeBets, placeBet } = useApp();

  return (
    <div className="page hide-scrollbar">
      <div className="page-inner">

        {/* Header */}
        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
          <motion.button onClick={onBack} whileTap={{ scale:0.9 }}
            style={{ width:44, height:44, borderRadius:'50%', background:'rgba(255,255,255,0.06)', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <span style={{ fontSize:22, color:'rgba(255,255,255,0.7)', lineHeight:1 }}>‹</span>
          </motion.button>
          <div style={{ flex:1 }}>
            <h1 style={{ fontSize:24, fontWeight:900, color:'#fff', lineHeight:1.1 }}>Live Wagers</h1>
            <p style={{ fontSize:13, color:'rgba(255,255,255,0.4)', marginTop:2 }}>Predict. Win. Dominate.</p>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:6, background:'rgba(255,255,255,0.06)', borderRadius:20, padding:'7px 12px' }}>
            <CardinalCoin size={18} />
            <span style={{ fontSize:14, fontWeight:700, color:GOLD }}>{user.coins.toLocaleString()}</span>
          </div>
        </div>

        {/* Active bets banner */}
        {activeBets.length > 0 && (
          <motion.div initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }}
            style={{ background:'rgba(212,175,55,0.06)', border:'1px solid rgba(212,175,55,0.12)', borderRadius:14, padding:'12px 16px', display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
            <Trophy size={18} color={GOLD} style={{ flexShrink:0 }} />
            <div>
              <p style={{ fontSize:13, fontWeight:700, color:'#fff' }}>{activeBets.length} Active Wager{activeBets.length !== 1 ? 's' : ''}</p>
              <p style={{ fontSize:12, color:'rgba(255,255,255,0.3)' }}>{activeBets.reduce((s, b) => s + b.amount, 0)} coins at stake</p>
            </div>
          </motion.div>
        )}

        {/* Live indicator */}
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:16 }}>
          <span style={{ width:10, height:10, borderRadius:'50%', background:'#4ADE80', display:'inline-block', boxShadow:'0 0 6px #4ADE80' }} />
          <span style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.4)', letterSpacing:1, textTransform:'uppercase' }}>Live Predictions</span>
        </div>

        {polls.map(poll => <PollCard key={poll.id} poll={poll} onBet={placeBet} activeBets={activeBets} />)}

        {/* How it works */}
        <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:16, padding:20, marginTop:8 }}>
          <p style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.35)', letterSpacing:1, textTransform:'uppercase', marginBottom:14 }}>
            How It Works
          </p>
          {[
            { icon:'🎯', text:'Pick your prediction on live game events' },
            { icon:'💰', text:'Wager Cardinal Coins on your pick' },
            { icon:'⚡', text:'Odds update in real-time as votes come in' },
            { icon:'🏆', text:'Win coins based on the odds at time of bet' },
          ].map((s, i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:12, marginBottom: i < 3 ? 12 : 0 }}>
              <span style={{ fontSize:18 }}>{s.icon}</span>
              <p style={{ fontSize:13, color:'rgba(255,255,255,0.5)', lineHeight:1.4 }}>{s.text}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
