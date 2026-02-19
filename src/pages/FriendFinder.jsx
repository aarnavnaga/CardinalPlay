import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, MapPin, Navigation, Signal, X } from 'lucide-react';
import { useState } from 'react';
import { useApp } from '../context/AppContext';

/* ─── Stadium SVG map ───────────────────────────── */
function StadiumMap({ friends, selectedFriend, onSelect }) {
  return (
    <div style={{ position:'relative', width:'100%', paddingBottom:'72%' }}>
      <div style={{ position:'absolute', inset:0 }}>
        <svg viewBox="0 0 400 288" width="100%" height="100%" fill="none" preserveAspectRatio="xMidYMid meet">
          {/* Outer stadium */}
          <ellipse cx="200" cy="144" rx="188" ry="132" fill="rgba(255,255,255,0.015)" stroke="rgba(255,255,255,0.07)" strokeWidth="2" />
          <ellipse cx="200" cy="144" rx="168" ry="118" fill="rgba(255,255,255,0.015)" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
          {/* Section labels */}
          {[
            {l:'102',x:72, y:78}, {l:'104',x:138,y:46}, {l:'106',x:228,y:42},
            {l:'108',x:308,y:64}, {l:'110',x:340,y:136},{l:'112',x:308,y:208},
            {l:'114',x:228,y:240},{l:'116',x:138,y:240},{l:'118',x:56, y:208},
            {l:'120',x:46, y:136},
          ].map(s => (
            <text key={s.l} x={s.x} y={s.y} fill="rgba(255,255,255,0.13)"
              fontSize="9.5" fontWeight="600" textAnchor="middle">{s.l}</text>
          ))}
          {/* Field */}
          <rect x="112" y="88" width="176" height="112" rx="6"
            fill="rgba(34,120,60,0.18)" stroke="rgba(34,120,60,0.25)" strokeWidth="1" />
          <line x1="200" y1="88" x2="200" y2="200" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
          <text x="200" y="150" fill="rgba(255,255,255,0.08)" fontSize="7" textAnchor="middle" fontWeight="700">STANFORD</text>
        </svg>

        {/* "You" marker */}
        <motion.div style={{ position:'absolute', left:'40%', top:'37%', transform:'translate(-50%,-50%)', zIndex:20 }}
          animate={{ scale:[1,1.08,1] }} transition={{ duration:2.5, repeat:Infinity }}>
          <div style={{ width:36, height:36, borderRadius:'50%', background:'#8C1515', border:'2.5px solid #fff', display:'flex', alignItems:'center', justifyContent:'center', position:'relative' }}>
            <span style={{ fontSize:9, fontWeight:800, color:'#fff' }}>You</span>
            <div style={{ position:'absolute', inset:-4, borderRadius:'50%', border:'1.5px solid rgba(140,21,21,0.4)', animation:'ping 1.8s ease-in-out infinite' }} />
          </div>
        </motion.div>

        {/* Friend markers */}
        {friends.map(f => {
          const sel = selectedFriend?.id === f.id;
          return (
            <motion.button key={f.id}
              onClick={() => onSelect(sel ? null : f)}
              whileTap={{ scale:0.88 }}
              animate={sel ? { scale:[1,1.12,1] } : {}}
              transition={sel ? { duration:1.4, repeat:Infinity } : {}}
              style={{
                position:'absolute', left:`${f.x}%`, top:`${f.y}%`,
                transform:'translate(-50%,-50%)', zIndex:10,
                background:'none', border:'none', cursor:'pointer', padding:0,
              }}>
              <div style={{
                width:34, height:34, borderRadius:'50%',
                background: f.avatarColor,
                border: sel ? '2.5px solid #D4AF37' : f.online ? '2px solid rgba(255,255,255,0.4)' : '2px solid rgba(255,255,255,0.2)',
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:9, fontWeight:800, color:'#fff', opacity: f.online ? 1 : 0.5,
              }}>
                {f.name.split(' ').map(n => n[0]).join('')}
              </div>
              {f.online && (
                <div style={{ position:'absolute', bottom:-1, right:-1, width:10, height:10, borderRadius:'50%', background:'#4ADE80', border:'1.5px solid #0A0A0A' }} />
              )}
            </motion.button>
          );
        })}

        {/* Dashed line to selected friend */}
        {selectedFriend && (
          <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', pointerEvents:'none', zIndex:5 }}>
            <motion.line
              x1="40%" y1="37%"
              x2={`${selectedFriend.x}%`} y2={`${selectedFriend.y}%`}
              stroke="rgba(212,175,55,0.55)" strokeWidth="2" strokeDasharray="6 4"
              initial={{ pathLength:0 }} animate={{ pathLength:1 }} transition={{ duration:0.5 }}
            />
          </svg>
        )}
      </div>
    </div>
  );
}

/* ─── Nav panel (slides up from bottom) ────────── */
function NavPanel({ friend, onClose }) {
  const dx = friend.x - 40, dy = friend.y - 37;
  const dist = Math.round(Math.sqrt(dx*dx + dy*dy) * 3);
  const mins = Math.max(1, Math.round(dist / 30));
  let dir = 'Head straight', DirIcon = ChevronUp;
  if (Math.abs(dx) > Math.abs(dy)) { dir = dx > 0 ? 'Head right' : 'Head left'; DirIcon = dx > 0 ? ChevronRight : ChevronLeft; }
  else { dir = dy > 0 ? 'Head down' : 'Head up'; DirIcon = dy > 0 ? ChevronDown : ChevronUp; }

  return (
    <motion.div
      initial={{ y:'100%', opacity:0 }} animate={{ y:0, opacity:1 }} exit={{ y:'100%', opacity:0 }}
      transition={{ type:'spring', damping:26, stiffness:280 }}
      style={{
        position:'absolute', bottom:0, left:0, right:0, zIndex:50,
        background:'rgba(18,18,18,0.97)', backdropFilter:'blur(24px)',
        borderRadius:'24px 24px 0 0', border:'1px solid rgba(255,255,255,0.08)',
        padding:'20px 20px 100px', /* 100px bottom clears BottomNav */
      }}>
      {/* Friend info + close */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ width:52, height:52, borderRadius:'50%', background:friend.avatarColor, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, fontWeight:800, color:'#fff' }}>
            {friend.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <p style={{ fontSize:17, fontWeight:800, color:'#fff', marginBottom:2 }}>{friend.name}</p>
            <p style={{ fontSize:13, color:'rgba(255,255,255,0.4)' }}>{friend.section} · Row {friend.row}, Seat {friend.seat}</p>
          </div>
        </div>
        <button onClick={onClose}
          style={{ width:34, height:34, borderRadius:'50%', background:'rgba(255,255,255,0.1)', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <X size={16} color="rgba(255,255,255,0.6)" />
        </button>
      </div>

      {/* Distance + time */}
      <div style={{ display:'flex', gap:10, marginBottom:14 }}>
        {[
          { Icon:MapPin,  color:'#B83A3A', label:'Distance',  val:`~${dist}m`      },
          { Icon:Signal,  color:'#4ADE80', label:'Walk time',  val:`~${mins} min`   },
        ].map(({ Icon, color, label, val }) => (
          <div key={label} style={{ flex:1, background:'rgba(255,255,255,0.04)', borderRadius:14, padding:'12px 14px', display:'flex', alignItems:'center', gap:10 }}>
            <Icon size={18} color={color} />
            <div>
              <p style={{ fontSize:11, color:'rgba(255,255,255,0.4)', marginBottom:2 }}>{label}</p>
              <p style={{ fontSize:15, fontWeight:700, color:'#fff' }}>{val}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Direction */}
      <div style={{ background:'rgba(140,21,21,0.1)', border:'1px solid rgba(140,21,21,0.2)', borderRadius:16, padding:'14px 16px', display:'flex', alignItems:'center', gap:14, marginBottom:14 }}>
        <motion.div
          animate={{ scale:[1,1.06,1] }} transition={{ duration:1.5, repeat:Infinity }}
          style={{ width:52, height:52, borderRadius:'50%', background:'linear-gradient(135deg,#8C1515,#B83A3A)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
          <DirIcon size={26} color="#fff" />
        </motion.div>
        <div>
          <p style={{ fontSize:16, fontWeight:800, color:'#fff', marginBottom:3 }}>{dir}</p>
          <p style={{ fontSize:13, color:'rgba(255,255,255,0.4)' }}>
            {friend.section !== 'Section 104' ? `Navigate to ${friend.section}` : `Same section! Row ${friend.row}, Seat ${friend.seat}`}
          </p>
        </div>
      </div>

      <motion.button whileTap={{ scale:0.97 }}
        style={{ width:'100%', padding:'14px', borderRadius:16, border:'none', cursor:'pointer', background:'linear-gradient(135deg,#8C1515,#B83A3A)', color:'#fff', fontSize:16, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
        <Navigation size={18} /> Start Navigation
      </motion.button>
    </motion.div>
  );
}

/* ─── FriendFinder ──────────────────────────────── */
export default function FriendFinder({ onBack }) {
  const { friends } = useApp();
  const [selected, setSelected] = useState(null);
  const online = friends.filter(f => f.online);

  return (
    <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', overflow:'hidden' }}>

      {/* Header (fixed top portion) */}
      <div style={{ paddingTop:60, paddingLeft:20, paddingRight:20, paddingBottom:12, flexShrink:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:10 }}>
          <motion.button onClick={onBack} whileTap={{ scale:0.9 }}
            style={{ width:44, height:44, borderRadius:'50%', background:'rgba(255,255,255,0.06)', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <span style={{ fontSize:22, color:'rgba(255,255,255,0.7)', lineHeight:1 }}>‹</span>
          </motion.button>
          <div>
            <h1 style={{ fontSize:22, fontWeight:900, color:'#fff', lineHeight:1.15 }}>Friend Finder</h1>
            <p style={{ fontSize:13, color:'rgba(255,255,255,0.4)' }}>Stanford Stadium · {online.length} friends nearby</p>
          </div>
        </div>
        {/* Legend */}
        <div style={{ display:'flex', gap:16 }}>
          {[
            { bg:'#8C1515', label:'You' },
            { bg:'#B83A3A', label:'Friends' },
            { bg:'#4ADE80', label:'Online', circle:true },
          ].map(({ bg, label, circle }) => (
            <div key={label} style={{ display:'flex', alignItems:'center', gap:5 }}>
              <div style={{ width: circle ? 10 : 12, height: circle ? 10 : 12, borderRadius:'50%', background:bg }} />
              <span style={{ fontSize:12, color:'rgba(255,255,255,0.4)' }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Map (fills remaining vertical space) */}
      <div style={{ flex:1, minHeight:0, padding:'0 16px', position:'relative' }}>
        <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:18, overflow:'hidden', padding:8, height:'100%', position:'relative' }}>
          <StadiumMap friends={friends} selectedFriend={selected} onSelect={setSelected} />
        </div>
        {/* Nav panel overlays the map and BottomNav area, with padding-bottom to prevent covering nav */}
        <AnimatePresence>
          {selected && <NavPanel friend={selected} onClose={() => setSelected(null)} />}
        </AnimatePresence>
      </div>

      {/* Friends strip (bottom) */}
      <div style={{ paddingLeft:20, paddingRight:20, paddingTop:12, paddingBottom:82, flexShrink:0 }}>
        <p style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.3)', letterSpacing:1, textTransform:'uppercase', marginBottom:10 }}>At the game</p>
        <div style={{ display:'flex', gap:16, overflowX:'auto' }} className="hide-scrollbar">
          {online.map(f => (
            <motion.button key={f.id} onClick={() => setSelected(f)}
              whileTap={{ scale:0.94 }}
              style={{
                flexShrink:0, display:'flex', flexDirection:'column', alignItems:'center', gap:6,
                background:'none', border:'none', cursor:'pointer',
                opacity: selected?.id === f.id ? 1 : 0.65,
              }}>
              <div style={{
                width:52, height:52, borderRadius:'50%', background:f.avatarColor,
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:13, fontWeight:800, color:'#fff', position:'relative',
                outline: selected?.id === f.id ? '2.5px solid #8C1515' : 'none', outlineOffset:2,
              }}>
                {f.name.split(' ').map(n => n[0]).join('')}
                <div style={{ position:'absolute', bottom:0, right:0, width:13, height:13, borderRadius:'50%', background:'#4ADE80', border:'2px solid #0A0A0A' }} />
              </div>
              <span style={{ fontSize:12, color:'rgba(255,255,255,0.65)', fontWeight:500 }}>{f.name.split(' ')[0]}</span>
            </motion.button>
          ))}
        </div>
      </div>

    </div>
  );
}
