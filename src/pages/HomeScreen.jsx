import { motion } from 'framer-motion';
import { CheckCircle2, ChevronRight, MapPin, MessageCircle, TrendingUp, Trophy, Users } from 'lucide-react';
import CardinalCoin from '../components/CardinalCoin';
import { useApp } from '../context/AppContext';

const stagger = {
  hidden: { opacity: 0 },
  show:   { opacity: 1, transition: { staggerChildren: 0.07 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show:   { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 26 } },
};

const FEATURES = [
  { id:'finder',  title:'Friend Finder',  icon:MapPin,          iconColor:'#B83A3A', iconBg:'rgba(140,21,21,0.18)' },
  { id:'chat',    title:'Live Chat',      icon:MessageCircle,   iconColor:'#60A5FA', iconBg:'rgba(96,165,250,0.15)' },
  { id:'rewards', title:'Rewards',        icon:Trophy,          iconColor:'#D4AF37', iconBg:'rgba(212,175,55,0.15)' },
  { id:'polls',   title:'Live Wagers',    icon:TrendingUp,      iconColor:'#34D399', iconBg:'rgba(52,211,153,0.15)' },
];

export default function HomeScreen({ onNavigate }) {
  const { user, friends } = useApp();
  const onlineFriends = friends.filter(f => f.online).length;

  return (
    <div className="page hide-scrollbar">
      <motion.div className="page-inner" variants={stagger} initial="hidden" animate="show">

        {/* ── Header ── */}
        <motion.div variants={fadeUp} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24 }}>
          <div>
            <p style={{ fontSize:13, color:'rgba(255,255,255,0.45)', fontWeight:500, marginBottom:2 }}>Welcome back,</p>
            <h1 style={{ fontSize:28, fontWeight:900, color:'#fff', letterSpacing:-0.5, lineHeight:1.1 }}>
              {user.name} <span style={{ color:'#B83A3A' }}>👋</span>
            </h1>
          </div>
          <div style={{
            width:48, height:48, borderRadius:'50%', flexShrink:0, marginLeft:12,
            background:'linear-gradient(135deg,#8C1515,#B83A3A)',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:18, fontWeight:900, color:'#fff',
            boxShadow:'0 0 16px rgba(140,21,21,0.4)',
          }}>
            {user.name[0]}
          </div>
        </motion.div>

        {/* ── Live Game Banner ── */}
        <motion.div variants={fadeUp} style={{
          borderRadius:20, overflow:'hidden', marginBottom:20,
          background:'linear-gradient(135deg,#8C1515,#B83A3A)',
          boxShadow:'0 0 28px rgba(140,21,21,0.35)',
        }}>
          <div style={{ padding:'20px 20px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
              <span style={{ position:'relative', display:'flex', width:10, height:10 }}>
                <span style={{
                  position:'absolute', inset:0, borderRadius:'50%', background:'#4ADE80',
                  animation:'ping 1.5s cubic-bezier(0,0,0.2,1) infinite', opacity:0.75,
                }} />
                <span style={{ width:10, height:10, borderRadius:'50%', background:'#4ADE80', display:'block' }} />
              </span>
              <span style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.85)', letterSpacing:1, textTransform:'uppercase' }}>
                Live Now
              </span>
            </div>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <div>
                <h2 style={{ fontSize:20, fontWeight:900, color:'#fff', lineHeight:1.2 }}>Stanford vs. Cal</h2>
                <p style={{ fontSize:13, color:'rgba(255,255,255,0.6)', marginTop:3 }}>Q3 · 8:42 remaining</p>
              </div>
              <div style={{ textAlign:'right' }}>
                <p style={{ fontSize:30, fontWeight:900, color:'#fff', lineHeight:1 }}>24–17</p>
                <p style={{ fontSize:12, color:'rgba(255,255,255,0.5)', marginTop:3 }}>Stanford Stadium</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Coins & Status ── */}
        <motion.div variants={fadeUp} style={{ display:'flex', gap:12, marginBottom:16 }}>
          {/* Coins */}
          <div className="glass-card" style={{ flex:1, borderRadius:16, padding:16, display:'flex', alignItems:'center', gap:12 }}>
            <CardinalCoin size={40} />
            <div>
              <p style={{ fontSize:11, color:'rgba(255,255,255,0.4)', fontWeight:600, marginBottom:2 }}>Your Coins</p>
              <p style={{ fontSize:22, fontWeight:900, color:'#fff', lineHeight:1 }}>{user.coins.toLocaleString()}</p>
            </div>
          </div>
          {/* Status */}
          <div className="glass-card" style={{ flex:1, borderRadius:16, padding:16, display:'flex', alignItems:'center', gap:12 }}>
            <div style={{
              width:40, height:40, borderRadius:12, flexShrink:0,
              background: user.isInStadium ? 'rgba(74,222,128,0.15)' : 'rgba(255,255,255,0.07)',
              display:'flex', alignItems:'center', justifyContent:'center',
            }}>
              {user.isInStadium
                ? <CheckCircle2 size={20} color="#4ADE80" />
                : <MapPin size={20} color="rgba(255,255,255,0.3)" />}
            </div>
            <div>
              <p style={{ fontSize:11, color:'rgba(255,255,255,0.4)', fontWeight:600, marginBottom:2 }}>Status</p>
              <p style={{ fontSize:14, fontWeight:700, color: user.isInStadium ? '#4ADE80' : 'rgba(255,255,255,0.5)', lineHeight:1 }}>
                {user.isInStadium ? 'In Stadium · 5×' : 'Remote'}
              </p>
            </div>
          </div>
        </motion.div>

        {/* ── Friends Row ── */}
        <motion.div variants={fadeUp}
          className="glass-card"
          style={{ borderRadius:16, padding:16, marginBottom:24, display:'flex', alignItems:'center', justifyContent:'space-between', cursor:'pointer' }}
          onClick={() => onNavigate('finder')}
          whileTap={{ scale:0.98 }}>
          <div style={{ display:'flex', alignItems:'center', gap:14 }}>
            <div style={{ width:42, height:42, borderRadius:12, background:'rgba(140,21,21,0.18)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <Users size={20} color="#B83A3A" />
            </div>
            <div>
              <p style={{ fontSize:15, fontWeight:700, color:'#fff', marginBottom:2 }}>{onlineFriends} Friends at the Game</p>
              <p style={{ fontSize:12, color:'rgba(255,255,255,0.4)' }}>Tap to find them in the stadium</p>
            </div>
          </div>
          <ChevronRight size={20} color="rgba(255,255,255,0.25)" />
        </motion.div>

        {/* ── Feature Grid ── */}
        <p style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.35)', letterSpacing:1, textTransform:'uppercase', marginBottom:14 }}>
          Features
        </p>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          {FEATURES.map(({ id, title, icon: Icon, iconColor, iconBg }) => (
            <motion.button
              key={id}
              variants={fadeUp}
              className="glass-card"
              onClick={() => onNavigate(id)}
              whileTap={{ scale:0.96 }}
              style={{
                borderRadius:16, padding:18, textAlign:'left',
                background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)',
                cursor:'pointer',
              }}>
              <div style={{ width:44, height:44, borderRadius:12, background:iconBg, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:14 }}>
                <Icon size={22} color={iconColor} />
              </div>
              <p style={{ fontSize:15, fontWeight:700, color:'#fff', marginBottom:4 }}>{title}</p>
              <p style={{ fontSize:12, color:'rgba(255,255,255,0.35)' }}>
                {id === 'finder'  && `${onlineFriends} nearby`}
                {id === 'chat'    && 'Game chat buzzing'}
                {id === 'rewards' && 'New rewards live'}
                {id === 'polls'   && '4 active wagers'}
              </p>
            </motion.button>
          ))}
        </div>

      </motion.div>
    </div>
  );
}
