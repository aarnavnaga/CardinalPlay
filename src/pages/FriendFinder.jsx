import { AnimatePresence, motion } from 'framer-motion';
import { MapPin, Signal, Users, X } from 'lucide-react';
import { useState } from 'react';
import { useApp } from '../context/AppContext';
import StanfordTreeChibi from '../components/StanfordTreeChibi';

/* ═══════════════════════════════════════════════════
   STADIUM MAP  —  portrait, Stanford-styled
   ViewBox 300 × 440, center (150, 215)
═══════════════════════════════════════════════════ */

// Section labels placed around the outer seating ring
const SECTIONS = [
  { id:'101', angle:  30 }, { id:'103', angle:  60 },
  { id:'104', angle:  90 }, { id:'106', angle: 120 },
  { id:'108', angle: 150 }, { id:'110', angle: 210 },
  { id:'112', angle: 240 }, { id:'114', angle: 270 },
  { id:'116', angle: 300 }, { id:'118', angle: 330 },
  { id:'N',   angle:   0 }, { id:'S',   angle: 180 },
];

function sectionPos(angleDeg, rx = 118, ry = 172) {
  const r = angleDeg * Math.PI / 180;
  return { x: 150 + rx * Math.sin(r), y: 215 - ry * Math.cos(r) };
}

// Yard line y positions inside the playing field (136–298, 162 px for 100 yards)
const YARD_LINES = Array.from({ length: 9 }, (_, i) => 136 + (i + 1) * (162 / 10));
const YARD_NUMS  = [10,20,30,40,50,40,30,20,10];

function StadiumSVG() {
  return (
    <svg viewBox="0 0 300 440" width="100%" height="100%" fill="none" preserveAspectRatio="xMidYMid meet">

      {/* ── Outer glow ── */}
      <ellipse cx="150" cy="215" rx="137" ry="197"
        fill="none" stroke="rgba(140,21,21,0.35)" strokeWidth="4"
        filter="url(#glow)" />
      <defs>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* ── Stadium walls (outermost) ── */}
      <ellipse cx="150" cy="215" rx="133" ry="193" fill="#0F0303" stroke="rgba(140,21,21,0.6)" strokeWidth="2" />

      {/* ── Upper deck seating ── */}
      <ellipse cx="150" cy="215" rx="122" ry="178" fill="#2D0707" />

      {/* ── Mid-deck concourse divider ── */}
      <ellipse cx="150" cy="215" rx="106" ry="156" fill="#1A0404" stroke="rgba(80,20,20,0.4)" strokeWidth="1" />

      {/* ── Lower deck seating ── */}
      <ellipse cx="150" cy="215" rx="96" ry="142" fill="#3A0D0D" />

      {/* ── Concrete concourse ring ── */}
      <ellipse cx="150" cy="215" rx="82" ry="124" fill="#1C1410" stroke="rgba(90,60,30,0.3)" strokeWidth="1" />

      {/* ── Running track (tan) ── */}
      <ellipse cx="150" cy="215" rx="74" ry="114" fill="rgba(155,100,45,0.22)" stroke="rgba(180,120,55,0.45)" strokeWidth="2" />

      {/* ── Field base ── */}
      <rect x="82" y="100" width="136" height="230" rx="5" fill="#1A5C28" />

      {/* ── End zones ── */}
      <rect x="82" y="100" width="136" height="36" rx="5" fill="#8C1515" />
      <rect x="82" y="294" width="136" height="36" rx="5" fill="#8C1515" />

      {/* End zone text */}
      <text x="150" y="123" fill="rgba(255,255,255,0.55)" fontSize="7.5" fontWeight="800"
        textAnchor="middle" letterSpacing="2.5">STANFORD</text>
      <text x="150" y="318" fill="rgba(255,255,255,0.55)" fontSize="7.5" fontWeight="800"
        textAnchor="middle" letterSpacing="2.5">STANFORD</text>

      {/* ── Playing field border ── */}
      <rect x="82" y="136" width="136" height="158" fill="none"
        stroke="rgba(255,255,255,0.3)" strokeWidth="1" />

      {/* ── Yard lines ── */}
      {YARD_LINES.map((y, i) => (
        <line key={i} x1="82" y1={y} x2="218" y2={y}
          stroke="rgba(255,255,255,0.35)" strokeWidth="0.8" />
      ))}

      {/* ── Yard numbers ── */}
      {YARD_LINES.map((y, i) => (
        <text key={i} x="91" y={y + 4} fill="rgba(255,255,255,0.22)"
          fontSize="5.5" textAnchor="middle" fontWeight="600">{YARD_NUMS[i]}</text>
      ))}

      {/* ── Hash marks ── */}
      {YARD_LINES.map((y, i) => (
        <g key={i}>
          <line x1="108" y1={y - 3} x2="108" y2={y + 3} stroke="rgba(255,255,255,0.25)" strokeWidth="0.8" />
          <line x1="192" y1={y - 3} x2="192" y2={y + 3} stroke="rgba(255,255,255,0.25)" strokeWidth="0.8" />
        </g>
      ))}

      {/* ── Midfield "S" logo ── */}
      <text x="150" y="221" fill="rgba(255,255,255,0.07)" fontSize="22"
        fontWeight="900" textAnchor="middle">S</text>

      {/* ── Goal posts ── */}
      {/* North */}
      <line x1="150" y1="86" x2="150" y2="102" stroke="rgba(255,210,80,0.7)" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="139" y1="90" x2="161" y2="90" stroke="rgba(255,210,80,0.7)" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="139" y1="90" x2="139" y2="86" stroke="rgba(255,210,80,0.5)" strokeWidth="1.2" />
      <line x1="161" y1="90" x2="161" y2="86" stroke="rgba(255,210,80,0.5)" strokeWidth="1.2" />
      {/* South */}
      <line x1="150" y1="354" x2="150" y2="338" stroke="rgba(255,210,80,0.7)" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="139" y1="350" x2="161" y2="350" stroke="rgba(255,210,80,0.7)" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="139" y1="354" x2="139" y2="350" stroke="rgba(255,210,80,0.5)" strokeWidth="1.2" />
      <line x1="161" y1="354" x2="161" y2="350" stroke="rgba(255,210,80,0.5)" strokeWidth="1.2" />

      {/* ── Section labels ── */}
      {SECTIONS.map(({ id, angle }) => {
        const { x, y } = sectionPos(angle, 118, 172);
        return (
          <text key={id} x={x} y={y} fill="rgba(255,255,255,0.2)"
            fontSize="8.5" fontWeight="700" textAnchor="middle" dominantBaseline="middle">
            {id}
          </text>
        );
      })}

      {/* ── Press box indicator (West side) ── */}
      <rect x="8" y="178" width="18" height="74" rx="4"
        fill="rgba(140,21,21,0.2)" stroke="rgba(140,21,21,0.4)" strokeWidth="1" />
      <text x="17" y="219" fill="rgba(140,21,21,0.7)" fontSize="5.5" fontWeight="700"
        textAnchor="middle" dominantBaseline="middle" transform="rotate(-90,17,219)">PRESS</text>

      {/* ── Scoreboard indicator (North) ── */}
      <rect x="118" y="4" width="64" height="14" rx="4"
        fill="rgba(30,30,30,0.8)" stroke="rgba(100,100,100,0.3)" strokeWidth="1" />
      <text x="150" y="13" fill="rgba(255,255,255,0.3)" fontSize="6" fontWeight="700"
        textAnchor="middle">SCOREBOARD</text>

      {/* ── Student Section zone (East side — right half of lower deck) ── */}
      <path
        d="M 150 73 A 96 142 0 0 1 150 357 A 96 142 0 0 1 150 73 Z"
        fill="rgba(212,175,55,0.14)"
        stroke="rgba(212,175,55,0.5)"
        strokeWidth="2"
      />
      <text x="218" y="210" fill="rgba(212,175,55,0.7)" fontSize="7.5" fontWeight="800"
        textAnchor="middle" dominantBaseline="middle">STUDENT</text>
      <text x="218" y="220" fill="rgba(212,175,55,0.7)" fontSize="7.5" fontWeight="800"
        textAnchor="middle" dominantBaseline="middle">SECTION</text>

    </svg>
  );
}

/* ═══════════════════════════════════════════════════
   STADIUM MAP CONTAINER (with friend markers)
═══════════════════════════════════════════════════ */
function StadiumMap({ friends, selectedFriend, onSelect, onSelectStudentSection, studentSectionHighlight }) {
  return (
    <div style={{ position:'relative', width:'100%', height:'100%' }}>
      <StadiumSVG />
      {/* Tappable overlay for Student Section (east side) — fix first-tap by using onPointerDown */}
      <button
        type="button"
        aria-label="Navigate to Student Section"
        onPointerDown={(e) => { e.preventDefault(); e.stopPropagation(); onSelectStudentSection?.(); }}
        style={{
          position:'absolute', right:'4%', top:'20%', bottom:'20%', width:'32%',
          background: studentSectionHighlight ? 'rgba(212,175,55,0.2)' : 'transparent',
          border:'none', cursor:'pointer', borderRadius:12, zIndex:8,
        }}
      />

      {/* "You" marker — pulsing ring */}
      <motion.div
        style={{ position:'absolute', left:'40%', top:'42%', transform:'translate(-50%,-50%)', zIndex:20 }}>
        {/* Outer pulse ring */}
        <motion.div
          animate={{ scale:[1, 2.2], opacity:[0.6, 0] }}
          transition={{ duration:2, repeat:Infinity, ease:'easeOut' }}
          style={{ position:'absolute', inset:-4, borderRadius:'50%', background:'rgba(140,21,21,0.5)' }}
        />
        <motion.div
          animate={{ scale:[1, 1.8], opacity:[0.5, 0] }}
          transition={{ duration:2, repeat:Infinity, ease:'easeOut', delay:0.4 }}
          style={{ position:'absolute', inset:-4, borderRadius:'50%', background:'rgba(140,21,21,0.4)' }}
        />
        <div style={{
          width:32, height:32, borderRadius:'50%',
          background:'linear-gradient(135deg,#8C1515,#B83A3A)',
          border:'2.5px solid #fff',
          display:'flex', alignItems:'center', justifyContent:'center',
          boxShadow:'0 0 12px rgba(140,21,21,0.8)',
          position:'relative', zIndex:2,
        }}>
          <span style={{ fontSize:8, fontWeight:900, color:'#fff' }}>YOU</span>
        </div>
      </motion.div>

      {/* Friend markers — use onPointerDown so first tap registers */}
      {friends.map(f => {
        const sel = selectedFriend?.id === f.id;
        return (
          <motion.div
            key={f.id}
            role="button"
            tabIndex={0}
            onPointerDown={(e) => { e.preventDefault(); e.stopPropagation(); onSelect(sel ? null : f); }}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(sel ? null : f); } }}
            whileTap={{ scale:0.85 }}
            style={{
              position:'absolute', left:`${f.x}%`, top:`${f.y}%`,
              transform:'translate(-50%,-50%)', zIndex: sel ? 15 : 10,
              cursor:'pointer', padding:8, margin:-8,
              background:'none', border:'none',
            }}
          >
            {sel && (
              <motion.div
                animate={{ scale:[1, 2.5], opacity:[0.7, 0] }}
                transition={{ duration:1.5, repeat:Infinity }}
                style={{ position:'absolute', inset:-6, borderRadius:'50%', background:f.avatarColor }}
              />
            )}
            <div style={{
              width:30, height:30, borderRadius:'50%',
              background: sel
                ? `linear-gradient(135deg, ${f.avatarColor}, ${f.avatarColor}cc)`
                : f.avatarColor,
              border: sel ? '2.5px solid #D4AF37' : f.online ? '2px solid rgba(255,255,255,0.5)' : '2px solid rgba(255,255,255,0.2)',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:8.5, fontWeight:900, color:'#fff',
              opacity: f.online ? 1 : 0.45,
              boxShadow: sel ? `0 0 10px ${f.avatarColor}` : 'none',
              position:'relative', zIndex:2,
            }}>
              {f.name.split(' ').map(n => n[0]).join('')}
            </div>
            {f.online && (
              <div style={{ position:'absolute', bottom:0, right:0, width:9, height:9, borderRadius:'50%', background:'#4ADE80', border:'1.5px solid #0A0A0A', zIndex:3 }} />
            )}
          </motion.div>
        );
      })}

      {/* Dashed connector line */}
      {selectedFriend && (
        <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', pointerEvents:'none', zIndex:5 }}>
          <motion.line
            x1="40%" y1="42%"
            x2={`${selectedFriend.x}%`} y2={`${selectedFriend.y}%`}
            stroke="rgba(212,175,55,0.7)" strokeWidth="1.8"
            strokeDasharray="5 4"
            initial={{ pathLength:0 }} animate={{ pathLength:1 }}
            transition={{ duration:0.45 }}
          />
        </svg>
      )}
    </div>
  );
}

/* ─── Student Section panel (tap zone on map) ─── */
const STUDENT_SECTION_TARGET = { id: 'student', name: 'Student Section', section: 'Sections 104–108', x: 50, y: 25, row: '—', seat: '—' };

function StudentSectionPanel({ onClose, onStartNav }) {
  return (
    <motion.div
      initial={{ y:'100%', opacity:0 }} animate={{ y:0, opacity:1 }} exit={{ y:'100%', opacity:0 }}
      transition={{ type:'spring', damping:28, stiffness:300 }}
      style={{
        position:'absolute', bottom:0, left:0, right:0, zIndex:60,
        background:'rgba(12,4,4,0.96)', backdropFilter:'blur(28px)',
        borderRadius:'22px 22px 0 0', border:'1px solid rgba(212,175,55,0.3)', borderBottom:'none',
        padding:'18px 20px 98px',
      }}>
      <div style={{ width:38, height:4, borderRadius:2, background:'rgba(255,255,255,0.12)', margin:'0 auto 16px' }} />
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ width:48, height:48, borderRadius:14, background:'linear-gradient(135deg,rgba(212,175,55,0.4),rgba(140,21,21,0.3))', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <Users size={24} color="#D4AF37" />
          </div>
          <div>
            <p style={{ fontSize:17, fontWeight:800, color:'#fff', marginBottom:2 }}>Student Section</p>
            <p style={{ fontSize:12, color:'rgba(255,255,255,0.4)' }}>Sections 104–108 · East side</p>
          </div>
        </div>
        <button onClick={onClose} style={{ width:32, height:32, borderRadius:'50%', background:'rgba(255,255,255,0.08)', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <X size={15} color="rgba(255,255,255,0.5)" />
        </button>
      </div>
      <p style={{ fontSize:13, color:'rgba(255,255,255,0.5)', marginBottom:14 }}>
        Navigate to the loudest section in the house. Go Card!
      </p>
      <motion.button onClick={onStartNav} whileTap={{ scale:0.97 }}
        style={{ width:'100%', padding:'15px', borderRadius:16, border:'none', cursor:'pointer', background:'linear-gradient(135deg,#8C1515,#B83A3A)', color:'#fff', fontSize:16, fontWeight:800, display:'flex', alignItems:'center', justifyContent:'center', gap:10, boxShadow:'0 0 24px rgba(140,21,21,0.5)' }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 2L19 21L12 17L5 21L12 2Z" fill="white" /></svg>
        Start Navigation
      </motion.button>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════
   FRIEND INFO PANEL  (slides up after tap)
═══════════════════════════════════════════════════ */
function FriendPanel({ friend, onClose, onStartNav }) {
  const dx   = friend.x - 40;
  const dy   = friend.y - 42;
  const dist = Math.round(Math.sqrt(dx * dx + dy * dy) * 3.5);
  const mins = Math.max(1, Math.round(dist / 28));

  return (
    <motion.div
      initial={{ y:'100%', opacity:0 }} animate={{ y:0, opacity:1 }} exit={{ y:'100%', opacity:0 }}
      transition={{ type:'spring', damping:28, stiffness:300 }}
      style={{
        position:'absolute', bottom:0, left:0, right:0, zIndex:60,
        background:'rgba(12,4,4,0.96)', backdropFilter:'blur(28px)',
        borderRadius:'22px 22px 0 0',
        border:'1px solid rgba(140,21,21,0.25)',
        borderBottom:'none',
        padding:'18px 20px 98px',
      }}>

      {/* Drag handle */}
      <div style={{ width:38, height:4, borderRadius:2, background:'rgba(255,255,255,0.12)', margin:'0 auto 16px' }} />

      {/* Friend row + close */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <div style={{
            width:48, height:48, borderRadius:'50%', background:friend.avatarColor,
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:15, fontWeight:900, color:'#fff',
            boxShadow:`0 0 14px ${friend.avatarColor}60`,
          }}>
            {friend.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <p style={{ fontSize:17, fontWeight:800, color:'#fff', marginBottom:2 }}>{friend.name}</p>
            <p style={{ fontSize:12, color:'rgba(255,255,255,0.4)' }}>
              {friend.section} · Row {friend.row}, Seat {friend.seat}
            </p>
          </div>
        </div>
        <button onClick={onClose}
          style={{ width:32, height:32, borderRadius:'50%', background:'rgba(255,255,255,0.08)', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <X size={15} color="rgba(255,255,255,0.5)" />
        </button>
      </div>

      {/* Stats row */}
      <div style={{ display:'flex', gap:10, marginBottom:14 }}>
        {[
          { Icon:MapPin, color:'#B83A3A', label:'Distance',  val:`~${dist}m`    },
          { Icon:Signal, color:'#4ADE80', label:'Walk time', val:`~${mins} min` },
        ].map(({ Icon, color, label, val }) => (
          <div key={label} style={{
            flex:1, background:'rgba(255,255,255,0.04)', borderRadius:14,
            padding:'11px 13px', display:'flex', alignItems:'center', gap:10,
            border:'1px solid rgba(255,255,255,0.05)',
          }}>
            <Icon size={17} color={color} />
            <div>
              <p style={{ fontSize:10, color:'rgba(255,255,255,0.38)', marginBottom:2 }}>{label}</p>
              <p style={{ fontSize:14, fontWeight:700, color:'#fff' }}>{val}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Start Navigation CTA */}
      <motion.button
        onClick={onStartNav}
        whileTap={{ scale:0.97 }}
        style={{
          width:'100%', padding:'15px', borderRadius:16, border:'none', cursor:'pointer',
          background:'linear-gradient(135deg,#8C1515,#B83A3A)',
          color:'#fff', fontSize:16, fontWeight:800,
          display:'flex', alignItems:'center', justifyContent:'center', gap:10,
          boxShadow:'0 0 24px rgba(140,21,21,0.5)',
        }}>
        {/* Custom arrow icon */}
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L19 21L12 17L5 21L12 2Z" fill="white" />
        </svg>
        Start Navigation
      </motion.button>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════
   NAVIGATION MODE  —  Find My-style compass (friend or student section)
═══════════════════════════════════════════════════ */
function NavigationMode({ target, onClose }) {
  const dx   = target.x - 40;
  const dy   = target.y - 42;
  const dist = Math.round(Math.sqrt(dx * dx + dy * dy) * 3.5);
  const mins = Math.max(1, Math.round(dist / 28));

  // Angle: atan2(dy, dx), offset +90° because our SVG arrow points up at 0°
  const arrowAngle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;

  const dirLabel = (() => {
    const a = ((arrowAngle % 360) + 360) % 360;
    if (a < 22.5 || a >= 337.5)  return 'Head North';
    if (a < 67.5)                 return 'Head Northeast';
    if (a < 112.5)                return 'Head East';
    if (a < 157.5)                return 'Head Southeast';
    if (a < 202.5)                return 'Head South';
    if (a < 247.5)                return 'Head Southwest';
    if (a < 292.5)                return 'Head West';
    return                               'Head Northwest';
  })();

  const sameSection = target.section === 'Section 104' || target.section?.includes('104');

  return (
    <motion.div
      initial={{ opacity:0, scale:0.96 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0, scale:0.96 }}
      transition={{ duration:0.3, ease:'easeOut' }}
      style={{
        position:'absolute', inset:0, zIndex:100,
        background:'linear-gradient(180deg,#060101 0%,#120303 40%,#0A0101 100%)',
        display:'flex', flexDirection:'column', alignItems:'center',
      }}>

      {/* Top bar */}
      <div style={{ width:'100%', padding:'60px 20px 0', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{
            width:42, height:42, borderRadius:'50%', background: target.avatarColor || 'linear-gradient(135deg,#D4AF37,#8C1515)',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:14, fontWeight:900, color:'#fff',
            boxShadow: `0 0 12px ${target.avatarColor ? `${target.avatarColor}80` : 'rgba(212,175,55,0.5)'}`,
          }}>
            {target.id === 'student' ? '§' : target.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <p style={{ fontSize:16, fontWeight:800, color:'#fff' }}>{target.name}</p>
            <p style={{ fontSize:12, color:'rgba(255,255,255,0.4)' }}>{target.section}</p>
          </div>
        </div>
        <motion.button onClick={onClose} whileTap={{ scale:0.9 }}
          style={{ width:38, height:38, borderRadius:'50%', background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.1)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <X size={16} color="rgba(255,255,255,0.6)" />
        </motion.button>
      </div>

      {/* Distance */}
      <div style={{ marginTop:28, textAlign:'center' }}>
        <p style={{ fontSize:52, fontWeight:900, color:'#fff', lineHeight:1, letterSpacing:-2 }}>{dist}</p>
        <p style={{ fontSize:16, color:'rgba(255,255,255,0.4)', fontWeight:600, marginTop:2 }}>meters away · ~{mins} min walk</p>
      </div>

      {/* ── Compass ── */}
      <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', position:'relative', width:'100%' }}>

        {/* Outer pulsing rings */}
        {[1, 2, 3].map(i => (
          <motion.div key={i}
            animate={{ scale:[1, 1 + i*0.18], opacity:[0.35, 0] }}
            transition={{ duration:2.2, repeat:Infinity, delay:i*0.45, ease:'easeOut' }}
            style={{
              position:'absolute', width:200, height:200, borderRadius:'50%',
              border:`1.5px solid rgba(140,21,21,${0.6 - i*0.15})`,
              pointerEvents:'none',
            }}
          />
        ))}

        {/* Compass ring */}
        <div style={{
          width:200, height:200, borderRadius:'50%', position:'relative',
          background:'radial-gradient(circle at center, rgba(20,5,5,0.9), rgba(10,2,2,0.95))',
          border:'1.5px solid rgba(140,21,21,0.5)',
          boxShadow:'0 0 40px rgba(140,21,21,0.3), inset 0 0 30px rgba(0,0,0,0.8)',
          display:'flex', alignItems:'center', justifyContent:'center',
        }}>

          {/* Cardinal direction markers */}
          {[
            { label:'N', top:8,   left:'50%', transform:'translateX(-50%)' },
            { label:'S', bottom:8, left:'50%', transform:'translateX(-50%)' },
            { label:'E', right:8,  top:'50%',  transform:'translateY(-50%)' },
            { label:'W', left:8,   top:'50%',  transform:'translateY(-50%)' },
          ].map(({ label, ...style }) => (
            <span key={label} style={{
              position:'absolute', fontSize:11, fontWeight:800, color: label === 'N' ? '#B83A3A' : 'rgba(255,255,255,0.25)',
              ...style,
            }}>{label}</span>
          ))}

          {/* Tick marks */}
          {Array.from({ length: 36 }, (_, i) => {
            const a = i * 10 * Math.PI / 180;
            const isMajor = i % 9 === 0;
            const r1 = 88, r2 = isMajor ? 78 : 83;
            return (
              <line key={i}
                x1={100 + r1 * Math.sin(a)} y1={100 - r1 * Math.cos(a)}
                x2={100 + r2 * Math.sin(a)} y2={100 - r2 * Math.cos(a)}
                stroke={`rgba(255,255,255,${isMajor ? 0.25 : 0.1})`} strokeWidth={isMajor ? 1.5 : 0.8}
                style={{ position:'absolute' }}
              />
            );
          }).map((line, i) => (
            <svg key={i} style={{ position:'absolute', inset:0 }} width="200" height="200" viewBox="0 0 200 200">
              {line}
            </svg>
          ))}

          {/* ── Navigation arrow  (Find My teardrop shape) ── */}
          <motion.div
            animate={{ rotate: arrowAngle }}
            transition={{ type:'spring', stiffness:120, damping:18 }}
            style={{ position:'absolute', width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <svg width="56" height="72" viewBox="0 0 56 72" fill="none">
              {/* Shadow / glow layer */}
              <path d="M28 4 L46 66 L28 56 L10 66 Z" fill="rgba(140,21,21,0.35)" transform="translate(1,2)" />
              {/* Main arrow body — cardinal gradient */}
              <defs>
                <linearGradient id="arrowGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#E54545" />
                  <stop offset="100%" stopColor="#6B0F0F" />
                </linearGradient>
              </defs>
              <path d="M28 4 L46 66 L28 56 L10 66 Z" fill="url(#arrowGrad)" />
              {/* Center white dot */}
              <circle cx="28" cy="42" r="4" fill="rgba(255,255,255,0.9)" />
              {/* Inner highlight */}
              <path d="M28 4 L36 40 L28 35 L20 40 Z" fill="rgba(255,255,255,0.15)" />
            </svg>
          </motion.div>
        </div>
      </div>

      {/* Direction label */}
      <div style={{ width:'100%', padding:'0 20px 32px', textAlign:'center' }}>
        <p style={{ fontSize:26, fontWeight:900, color:'#fff', marginBottom:6, letterSpacing:-0.5 }}>{dirLabel}</p>
        <p style={{ fontSize:14, color:'rgba(255,255,255,0.4)', marginBottom:24 }}>
          {sameSection && target.row !== '—'
            ? `Same section! Row ${target.row}, Seat ${target.seat}`
            : target.section?.includes('104') ? 'Head to the Student Section' : `Navigate to ${target.section} · Row ${target.row}`}
        </p>

        {/* Status pills */}
        <div style={{ display:'flex', gap:12, justifyContent:'center', marginBottom:24 }}>
          {[
            { label:`${dist}m`,      sub:'Distance' },
            { label:`${mins} min`,   sub:'Walk time' },
            { label: sameSection ? 'Same' : (target.section || '').replace('Section ','§').slice(0, 12), sub:'Section' },
          ].map(({ label, sub }) => (
            <div key={sub} style={{
              background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)',
              borderRadius:14, padding:'10px 14px', textAlign:'center', minWidth:72,
            }}>
              <p style={{ fontSize:15, fontWeight:800, color:'#fff', marginBottom:2 }}>{label}</p>
              <p style={{ fontSize:10, color:'rgba(255,255,255,0.35)' }}>{sub}</p>
            </div>
          ))}
        </div>

        <motion.button onClick={onClose} whileTap={{ scale:0.97 }}
          style={{
            width:'100%', padding:'14px', borderRadius:16, border:'none', cursor:'pointer',
            background:'rgba(255,255,255,0.07)', color:'rgba(255,255,255,0.6)',
            fontSize:15, fontWeight:700,
          }}>
          End Navigation
        </motion.button>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════
   FRIEND FINDER  —  main screen
═══════════════════════════════════════════════════ */
export default function FriendFinder({ onBack }) {
  const { friends }     = useApp();
  const [selected,    setSelected]    = useState(null);
  const [navigating,  setNavigating]  = useState(false);
  const [studentSectionSelected, setStudentSectionSelected] = useState(false);
  const [navigatingToStudentSection, setNavigatingToStudentSection] = useState(false);
  const online = friends.filter(f => f.online);

  const openStudentSection = () => { setSelected(null); setStudentSectionSelected(true); };
  const closeStudentSection = () => setStudentSectionSelected(false);
  const openFriend = (f) => { setStudentSectionSelected(false); setSelected(f); };

  return (
    <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', overflow:'hidden', background:'#080101' }}>

      {/* Header */}
      <div style={{ paddingTop:56, paddingLeft:20, paddingRight:20, paddingBottom:10, flexShrink:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:10 }}>
          <motion.button onClick={onBack} whileTap={{ scale:0.9 }}
            style={{ width:42, height:42, borderRadius:'50%', background:'rgba(255,255,255,0.06)', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <span style={{ fontSize:22, color:'rgba(255,255,255,0.7)', lineHeight:1 }}>‹</span>
          </motion.button>
          <div style={{ flex:1 }}>
            <h1 style={{ fontSize:22, fontWeight:900, color:'#fff', lineHeight:1.15 }}>Friend Finder</h1>
            <p style={{ fontSize:12, color:'rgba(255,255,255,0.4)' }}>Stanford Stadium · {online.length} friends at the game</p>
          </div>
          <StanfordTreeChibi size={32} />
          {/* Live indicator */}
          <div style={{ display:'flex', alignItems:'center', gap:5, background:'rgba(74,222,128,0.1)', borderRadius:20, padding:'5px 10px', border:'1px solid rgba(74,222,128,0.2)' }}>
            <span style={{ width:7, height:7, borderRadius:'50%', background:'#4ADE80', display:'block', boxShadow:'0 0 5px #4ADE80' }} />
            <span style={{ fontSize:11, fontWeight:700, color:'#4ADE80' }}>LIVE</span>
          </div>
        </div>
        {/* Legend */}
        <div style={{ display:'flex', gap:14 }}>
          {[
            { bg:'linear-gradient(135deg,#8C1515,#B83A3A)', label:'You',     isGrad:true },
            { bg:'#B83A3A',                                  label:'Friends'             },
            { bg:'#4ADE80',                                  label:'Online'              },
          ].map(({ bg, label, isGrad }) => (
            <div key={label} style={{ display:'flex', alignItems:'center', gap:5 }}>
              <div style={{ width:10, height:10, borderRadius:'50%', background:bg }} />
              <span style={{ fontSize:11, color:'rgba(255,255,255,0.4)', fontWeight:500 }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Stadium map — fills remaining space */}
      <div style={{ flex:1, minHeight:0, paddingLeft:12, paddingRight:12, position:'relative' }}>
        <div style={{
          height:'100%', borderRadius:18, overflow:'hidden', position:'relative',
          background:'#0A0202',
          border:'1px solid rgba(140,21,21,0.2)',
          boxShadow:'inset 0 0 40px rgba(0,0,0,0.6)',
        }}>
          <StadiumMap
            friends={friends}
            selectedFriend={selected}
            onSelect={openFriend}
            onSelectStudentSection={openStudentSection}
            studentSectionHighlight={studentSectionSelected}
          />
        </div>

        {/* Friend info panel */}
        <AnimatePresence>
          {selected && !navigating && !navigatingToStudentSection && (
            <FriendPanel
              friend={selected}
              onClose={() => setSelected(null)}
              onStartNav={() => setNavigating(true)}
            />
          )}
        </AnimatePresence>
        {/* Student Section panel */}
        <AnimatePresence>
          {studentSectionSelected && !navigatingToStudentSection && (
            <StudentSectionPanel
              onClose={closeStudentSection}
              onStartNav={() => setNavigatingToStudentSection(true)}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Friends strip */}
      <div style={{ flexShrink:0, paddingLeft:20, paddingRight:20, paddingTop:12, paddingBottom:80 }}>
        <p style={{ fontSize:10, fontWeight:700, color:'rgba(255,255,255,0.28)', letterSpacing:1, textTransform:'uppercase', marginBottom:10 }}>
          At the game
        </p>
        <div style={{ display:'flex', gap:14, overflowX:'auto' }} className="hide-scrollbar">
          {online.map(f => (
            <motion.button key={f.id} onClick={() => openFriend(f)} whileTap={{ scale:0.92 }}
              style={{
                flexShrink:0, display:'flex', flexDirection:'column', alignItems:'center', gap:5,
                background:'none', border:'none', cursor:'pointer',
                opacity: selected?.id === f.id ? 1 : 0.6,
              }}>
              <div style={{
                width:48, height:48, borderRadius:'50%', background:f.avatarColor,
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:12, fontWeight:900, color:'#fff', position:'relative',
                outline: selected?.id === f.id ? `2.5px solid ${f.avatarColor}` : 'none', outlineOffset:3,
                boxShadow: selected?.id === f.id ? `0 0 12px ${f.avatarColor}80` : 'none',
              }}>
                {f.name.split(' ').map(n => n[0]).join('')}
                <div style={{ position:'absolute', bottom:1, right:1, width:11, height:11, borderRadius:'50%', background:'#4ADE80', border:'1.5px solid #080101' }} />
              </div>
              <span style={{ fontSize:11, color:'rgba(255,255,255,0.6)', fontWeight:500 }}>{f.name.split(' ')[0]}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Navigation overlay (friend or student section) */}
      <AnimatePresence>
        {(navigating && selected) && (
          <NavigationMode target={selected} onClose={() => { setNavigating(false); setSelected(null); }} />
        )}
        {navigatingToStudentSection && (
          <NavigationMode target={STUDENT_SECTION_TARGET} onClose={() => { setNavigatingToStudentSection(false); setStudentSectionSelected(false); }} />
        )}
      </AnimatePresence>

    </div>
  );
}
