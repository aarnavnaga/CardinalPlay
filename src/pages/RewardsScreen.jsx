import { AnimatePresence, motion } from 'framer-motion';
import { Award, BarChart3, Check, Crown, Medal, ShoppingBag, Sparkles } from 'lucide-react';
import { useState } from 'react';
import CardinalCoin from '../components/CardinalCoin';
import { useApp } from '../context/AppContext';

/* ─── Shared style tokens ───────────────────────── */
const P = 20;          // horizontal page padding
const GOLD = '#D4AF37';
const RED  = '#B83A3A';

const CATEGORIES = [
  { id:'all',        label:'All'         },
  { id:'food',       label:'Food'        },
  { id:'merch',      label:'Merch'       },
  { id:'seating',    label:'Seating'     },
  { id:'experience', label:'Experiences' },
];

/* ─── RewardCard ────────────────────────────────── */
function RewardCard({ reward, coins, onRedeem }) {
  const [redeemed, setRedeemed] = useState(false);
  const canAfford = coins >= reward.cost;

  const redeem = () => {
    if (!canAfford || redeemed) return;
    onRedeem(reward.cost);
    setRedeemed(true);
  };

  return (
    <motion.div
      layout
      initial={{ opacity:0, y:10 }}
      animate={{ opacity:1, y:0 }}
      style={{
        background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)',
        borderRadius:16, padding:16, marginBottom:10,
      }}>
      <div style={{ display:'flex', alignItems:'center', gap:12 }}>
        {/* Emoji icon */}
        <div style={{
          width:52, height:52, borderRadius:14,
          background:'rgba(255,255,255,0.05)',
          display:'flex', alignItems:'center', justifyContent:'center',
          fontSize:26, flexShrink:0,
        }}>{reward.emoji}</div>

        {/* Text */}
        <div style={{ flex:1, minWidth:0 }}>
          <p style={{ fontSize:15, fontWeight:700, color:'#fff', marginBottom:3 }}>{reward.name}</p>
          <p style={{ fontSize:12, color:'rgba(255,255,255,0.35)', marginBottom:6 }}>{reward.description}</p>
          <div style={{ display:'flex', alignItems:'center', gap:5 }}>
            <CardinalCoin size={15} />
            <span style={{ fontSize:13, fontWeight:700, color:GOLD }}>{reward.cost.toLocaleString()}</span>
          </div>
        </div>

        {/* Redeem button */}
        <motion.button
          onClick={redeem}
          whileTap={canAfford && !redeemed ? { scale:0.95 } : {}}
          style={{
            flexShrink:0, padding:'9px 14px', borderRadius:12, border:'none', cursor:'pointer',
            fontSize:13, fontWeight:700,
            background: redeemed
              ? 'rgba(74,222,128,0.15)'
              : canAfford
                ? 'linear-gradient(135deg,#8C1515,#B83A3A)'
                : 'rgba(255,255,255,0.05)',
            color: redeemed ? '#4ADE80' : canAfford ? '#fff' : 'rgba(255,255,255,0.2)',
          }}>
          {redeemed ? '✓ Got it' : 'Redeem'}
        </motion.button>
      </div>
    </motion.div>
  );
}

/* ─── LeaderboardView ───────────────────────────── */
function LeaderboardView({ leaderboard, userId }) {
  const top3 = leaderboard.slice(0, 3);
  const rest  = leaderboard.slice(3);
  const rankBadge = (rank) => {
    if (rank === 1) return <Crown size={18} color={GOLD} />;
    if (rank === 2) return <Medal size={18} color="#CBD5E1" />;
    if (rank === 3) return <Award size={18} color="#92400E" />;
    return <span style={{ fontSize:13, fontWeight:700, color:'rgba(255,255,255,0.3)' }}>#{rank}</span>;
  };

  /* Podium order: 2nd, 1st, 3rd */
  const podium = [top3[1], top3[0], top3[2]];
  const podiumH = [80, 112, 64]; // px heights for the bars

  return (
    <div>
      {/* Jackpot banner */}
      <div style={{
        borderRadius:16, padding:18, marginBottom:24,
        background:'linear-gradient(135deg,rgba(212,175,55,0.12),rgba(140,21,21,0.12))',
        border:'1px solid rgba(212,175,55,0.2)', position:'relative',
      }}>
        <Sparkles size={18} color={GOLD} style={{ position:'absolute', top:14, right:14, opacity:0.4 }} />
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
          <Crown size={20} color={GOLD} />
          <span style={{ fontSize:17, fontWeight:900, background:'linear-gradient(135deg,#D4AF37,#B08D57)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
            Season Jackpot
          </span>
        </div>
        <p style={{ fontSize:13, color:'rgba(255,255,255,0.5)', marginBottom:6 }}>Top of the leaderboard at season end wins:</p>
        <p style={{ fontSize:18, fontWeight:900, color:'#fff', marginBottom:4 }}>VIP Season Pass + Signed Jersey</p>
        <p style={{ fontSize:12, color:'rgba(255,255,255,0.3)' }}>Plus exclusive sideline access for the Bowl Game</p>
      </div>

      {/* Podium */}
      <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'center', gap:16, marginBottom:24, paddingTop:8 }}>
        {podium.map((entry, i) => {
          if (!entry) return null;
          const isMe = entry.id === userId;
          const barColor = i === 1
            ? 'linear-gradient(to bottom,rgba(212,175,55,0.3),rgba(212,175,55,0.05))'
            : i === 0
              ? 'linear-gradient(to bottom,rgba(148,163,184,0.2),rgba(148,163,184,0.03))'
              : 'linear-gradient(to bottom,rgba(146,64,14,0.2),rgba(146,64,14,0.03))';
          const avatarBg = i === 1 ? 'linear-gradient(135deg,#D4AF37,#B08D57)'
            : i === 0 ? '#6B7280' : '#92400E';
          return (
            <div key={entry.id} style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
              <div style={{
                width:46, height:46, borderRadius:'50%',
                background: avatarBg, display:'flex', alignItems:'center',
                justifyContent:'center', fontSize:13, fontWeight:800, color:'#fff', marginBottom:6,
                outline: isMe ? '2px solid #8C1515' : 'none', outlineOffset:2,
              }}>
                {entry.name.split(' ').map(n => n[0]).join('')}
              </div>
              <p style={{ fontSize:11, fontWeight:700, color:'#fff', marginBottom:3, maxWidth:70, textAlign:'center', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                {entry.name.split(' ')[0]}
              </p>
              <div style={{ display:'flex', alignItems:'center', gap:3, marginBottom:6 }}>
                <CardinalCoin size={11} />
                <span style={{ fontSize:10, fontWeight:700, color:GOLD }}>{(entry.coins/1000).toFixed(1)}k</span>
              </div>
              <div style={{ width:60, height:podiumH[i], borderRadius:'8px 8px 0 0', background:barColor, display:'flex', alignItems:'flex-start', justifyContent:'center', paddingTop:6 }}>
                {rankBadge(entry.rank)}
              </div>
            </div>
          );
        })}
      </div>

      {/* Rest of leaderboard */}
      {rest.map((entry, i) => {
        const isMe = entry.id === userId;
        return (
          <motion.div
            key={entry.id}
            initial={{ opacity:0, x:-16 }}
            animate={{ opacity:1, x:0 }}
            transition={{ delay: i * 0.04 }}
            style={{
              display:'flex', alignItems:'center', gap:12,
              padding:'12px 14px', borderRadius:14, marginBottom:8,
              background: isMe ? 'rgba(140,21,21,0.12)' : 'rgba(255,255,255,0.02)',
              border: isMe ? '1px solid rgba(140,21,21,0.25)' : '1px solid rgba(255,255,255,0.04)',
            }}>
            <div style={{ width:28, display:'flex', justifyContent:'center' }}>{rankBadge(entry.rank)}</div>
            <div style={{
              width:36, height:36, borderRadius:'50%', flexShrink:0,
              background: isMe ? '#8C1515' : 'rgba(255,255,255,0.1)',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:12, fontWeight:800, color:'#fff',
            }}>
              {entry.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <p style={{ fontSize:14, fontWeight:600, color: isMe ? RED : '#fff', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                {entry.name} {isMe && <span style={{ fontSize:11, color:RED }}>(You)</span>}
              </p>
              <p style={{ fontSize:11, color:'rgba(255,255,255,0.3)' }}>{entry.year}</p>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:4 }}>
              <CardinalCoin size={13} />
              <span style={{ fontSize:13, fontWeight:700, color:GOLD }}>{entry.coins.toLocaleString()}</span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

/* ─── RewardsScreen ─────────────────────────────── */
export default function RewardsScreen({ onBack }) {
  const { user, rewards, leaderboard, spendCoins } = useApp();
  const [tab,      setTab]      = useState('store');
  const [category, setCategory] = useState('all');

  const filtered = category === 'all' ? rewards : rewards.filter(r => r.category === category);

  return (
    <div className="page hide-scrollbar">
      <div className="page-inner">

        {/* Header */}
        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:24 }}>
          <motion.button onClick={onBack} whileTap={{ scale:0.9 }}
            style={{ width:44, height:44, borderRadius:'50%', background:'rgba(255,255,255,0.06)', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            ‹ <span style={{ fontSize:20, color:'rgba(255,255,255,0.7)', lineHeight:1 }}></span>
          </motion.button>
          <div style={{ flex:1 }}>
            <h1 style={{ fontSize:24, fontWeight:900, color:'#fff', lineHeight:1.1 }}>Rewards</h1>
            <p style={{ fontSize:13, color:'rgba(255,255,255,0.4)', marginTop:2 }}>Redeem your Cardinal Coins</p>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:6, background:'rgba(255,255,255,0.06)', borderRadius:20, padding:'7px 12px' }}>
            <CardinalCoin size={18} />
            <span style={{ fontSize:14, fontWeight:700, color:GOLD }}>{user.coins.toLocaleString()}</span>
          </div>
        </div>

        {/* Tab switcher */}
        <div style={{ display:'flex', background:'rgba(255,255,255,0.04)', borderRadius:14, padding:4, marginBottom:20, gap:4 }}>
          {[
            { id:'store',       label:'Store',       Icon:ShoppingBag },
            { id:'leaderboard', label:'Leaderboard', Icon:BarChart3   },
          ].map(({ id, label, Icon }) => (
            <button key={id} onClick={() => setTab(id)}
              style={{
                flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:6,
                padding:'11px 0', borderRadius:10, border:'none', cursor:'pointer', fontSize:14, fontWeight:600,
                background: tab === id ? 'linear-gradient(135deg,#8C1515,#B83A3A)' : 'transparent',
                color: tab === id ? '#fff' : 'rgba(255,255,255,0.35)',
                transition:'all 0.25s',
              }}>
              <Icon size={15} />
              {label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {tab === 'store' ? (
            <motion.div key="store"
              initial={{ opacity:0, x:-16 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:16 }}>
              {/* Category pills */}
              <div style={{ display:'flex', gap:8, overflowX:'auto', paddingBottom:4, marginBottom:16 }} className="hide-scrollbar">
                {CATEGORIES.map(cat => (
                  <button key={cat.id} onClick={() => setCategory(cat.id)}
                    style={{
                      padding:'7px 14px', borderRadius:20, border:'none', cursor:'pointer',
                      fontSize:13, fontWeight:600, whiteSpace:'nowrap',
                      background: category === cat.id ? 'linear-gradient(135deg,#8C1515,#B83A3A)' : 'rgba(255,255,255,0.06)',
                      color: category === cat.id ? '#fff' : 'rgba(255,255,255,0.45)',
                    }}>
                    {cat.label}
                  </button>
                ))}
              </div>
              {filtered.map(r => <RewardCard key={r.id} reward={r} coins={user.coins} onRedeem={spendCoins} />)}
            </motion.div>
          ) : (
            <motion.div key="leaderboard"
              initial={{ opacity:0, x:16 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-16 }}>
              <LeaderboardView leaderboard={leaderboard} userId={user.id} />
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
