import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ChevronRight, Globe, Hash, MapPin, Plus, Send, Users, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useApp } from '../context/AppContext';

const CHANNELS = [
  { id:'global',  label:'Global',      Icon:Globe, desc:'Everyone with Cardinal Play' },
  { id:'stadium', label:'Stadium',     Icon:MapPin, desc:'Students at the stadium'    },
  { id:'section', label:'Section 104', Icon:Hash,   desc:'Your section chat'          },
];

/* ─── Message bubble ────────────────────────────── */
function Bubble({ msg }) {
  return (
    <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
      style={{ display:'flex', gap:8, flexDirection: msg.isOwn ? 'row-reverse' : 'row', marginBottom:10 }}>
      {!msg.isOwn && (
        <div style={{ width:30, height:30, borderRadius:'50%', background:'rgba(140,21,21,0.3)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:18 }}>
          <span style={{ fontSize:9, fontWeight:800, color:'#B83A3A' }}>
            {msg.user.split(' ').map(n => n[0]).join('')}
          </span>
        </div>
      )}
      <div style={{ maxWidth:'75%' }}>
        {!msg.isOwn && <p style={{ fontSize:10, color:'rgba(255,255,255,0.3)', marginBottom:3, marginLeft:2 }}>{msg.user}</p>}
        <div style={{
          padding:'9px 13px', borderRadius:16,
          background: msg.isOwn ? 'linear-gradient(135deg,#8C1515,#B83A3A)' : 'rgba(255,255,255,0.07)',
          borderBottomRightRadius: msg.isOwn ? 4 : 16,
          borderBottomLeftRadius:  msg.isOwn ? 16 : 4,
        }}>
          <p style={{ fontSize:14, color:'#fff', lineHeight:1.4 }}>{msg.text}</p>
        </div>
        <p style={{ fontSize:10, color:'rgba(255,255,255,0.2)', marginTop:3, textAlign: msg.isOwn ? 'right' : 'left', marginLeft:2, marginRight:2 }}>
          {msg.time}
        </p>
      </div>
    </motion.div>
  );
}

/* ─── Chat view (fixed flex-column layout) ──────── */
function ChatView({ title, subtitle, messages, onSend, onBack }) {
  const [text, setText] = useState('');
  const scrollRef = useRef(null);
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const send = () => {
    if (!text.trim()) return;
    onSend(text.trim());
    setText('');
  };

  return (
    <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column' }}>
      {/* Header */}
      <div style={{
        paddingTop:60, paddingLeft:20, paddingRight:20, paddingBottom:12,
        background:'rgba(10,10,10,0.9)', backdropFilter:'blur(16px)',
        borderBottom:'1px solid rgba(255,255,255,0.06)',
        flexShrink:0, display:'flex', alignItems:'center', gap:12,
      }}>
        <motion.button onClick={onBack} whileTap={{ scale:0.9 }}
          style={{ width:40, height:40, borderRadius:'50%', background:'rgba(255,255,255,0.06)', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
          <ArrowLeft size={18} color="rgba(255,255,255,0.7)" />
        </motion.button>
        <div style={{ flex:1, minWidth:0 }}>
          <p style={{ fontSize:17, fontWeight:800, color:'#fff', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{title}</p>
          <p style={{ fontSize:13, color:'rgba(255,255,255,0.4)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{subtitle}</p>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef}
        style={{ flex:1, overflowY:'auto', overflowX:'hidden', padding:'16px 16px 8px' }}
        className="hide-scrollbar">
        {messages.map(m => <Bubble key={m.id} msg={m} />)}
      </div>

      {/* Input — paddingBottom clears the BottomNav */}
      <div style={{ flexShrink:0, padding:'8px 16px 82px' }}>
        <div style={{
          display:'flex', alignItems:'center', gap:10,
          background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.09)',
          borderRadius:20, padding:'8px 8px 8px 16px',
        }}>
          <input
            type="text" value={text} onChange={e => setText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            placeholder="Type a message…"
            style={{ flex:1, background:'transparent', border:'none', outline:'none', color:'#fff', fontSize:14 }}
          />
          <motion.button onClick={send} disabled={!text.trim()} whileTap={{ scale:0.9 }}
            style={{
              width:38, height:38, borderRadius:'50%', border:'none', cursor:'pointer',
              background:'linear-gradient(135deg,#8C1515,#B83A3A)',
              display:'flex', alignItems:'center', justifyContent:'center',
              opacity: text.trim() ? 1 : 0.3, flexShrink:0,
            }}>
            <Send size={16} color="#fff" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}

/* ─── Create group modal ────────────────────────── */
function CreateGroupModal({ friends, onClose, onCreate }) {
  const [name,     setName]     = useState('');
  const [selected, setSelected] = useState([]);
  const toggle = (n) => setSelected(p => p.includes(n) ? p.filter(x => x !== n) : [...p, n]);

  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.65)', zIndex:60, display:'flex', alignItems:'flex-end' }}
      onClick={onClose}>
      <motion.div
        initial={{ y:'100%' }} animate={{ y:0 }} exit={{ y:'100%' }}
        transition={{ type:'spring', damping:26 }}
        style={{ width:'100%', background:'#1A1A1A', borderRadius:'24px 24px 0 0', padding:'24px 20px 48px', maxHeight:'80%', overflowY:'auto' }}
        className="hide-scrollbar"
        onClick={e => e.stopPropagation()}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:18 }}>
          <p style={{ fontSize:18, fontWeight:800, color:'#fff' }}>New Group Chat</p>
          <button onClick={onClose}
            style={{ width:32, height:32, borderRadius:'50%', background:'rgba(255,255,255,0.1)', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <X size={15} color="rgba(255,255,255,0.6)" />
          </button>
        </div>
        <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Group name…"
          style={{ width:'100%', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.09)', borderRadius:14, padding:'13px 16px', color:'#fff', fontSize:14, outline:'none', marginBottom:18 }} />
        <p style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.4)', letterSpacing:0.8, marginBottom:10 }}>ADD FRIENDS</p>
        {friends.map(f => (
          <button key={f.id} onClick={() => toggle(f.name)}
            style={{
              width:'100%', display:'flex', alignItems:'center', gap:12, padding:'12px 14px',
              borderRadius:14, border: selected.includes(f.name) ? '1px solid rgba(140,21,21,0.35)' : '1px solid transparent',
              background: selected.includes(f.name) ? 'rgba(140,21,21,0.15)' : 'rgba(255,255,255,0.03)',
              cursor:'pointer', marginBottom:8,
            }}>
            <div style={{ width:36, height:36, borderRadius:'50%', background:f.avatarColor, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:800, color:'#fff' }}>
              {f.name.split(' ').map(n => n[0]).join('')}
            </div>
            <span style={{ flex:1, textAlign:'left', fontSize:14, fontWeight:600, color:'#fff' }}>{f.name}</span>
            {selected.includes(f.name) && (
              <div style={{ width:20, height:20, borderRadius:'50%', background:'#8C1515', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <span style={{ fontSize:11, color:'#fff' }}>✓</span>
              </div>
            )}
          </button>
        ))}
        <motion.button
          onClick={() => { if (name.trim() && selected.length) { onCreate(name.trim(), selected); onClose(); } }}
          disabled={!name.trim() || !selected.length}
          whileTap={{ scale:0.97 }}
          style={{
            width:'100%', padding:'14px', borderRadius:16, border:'none', cursor:'pointer', marginTop:8,
            background:'linear-gradient(135deg,#8C1515,#B83A3A)', color:'#fff', fontSize:15, fontWeight:700,
            opacity: name.trim() && selected.length ? 1 : 0.35,
          }}>
          Create Group ({selected.length} selected)
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

/* ─── ChatScreen ────────────────────────────────── */
export default function ChatScreen({ onBack }) {
  const { messages, friendChats, friends, sendMessage, sendFriendMessage, createGroupChat } = useApp();
  const [activeCh,      setActiveCh]      = useState('global');
  const [activeFriendCh, setActiveFriendCh] = useState(null);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [view,           setView]           = useState('list');

  const inChat = view === 'chat';
  const currentMsgs = activeFriendCh
    ? friendChats.find(c => c.id === activeFriendCh)?.messages ?? []
    : messages[activeCh] ?? [];
  const chatTitle = activeFriendCh
    ? friendChats.find(c => c.id === activeFriendCh)?.name
    : CHANNELS.find(c => c.id === activeCh)?.label;
  const chatSub = activeFriendCh
    ? `${friendChats.find(c => c.id === activeFriendCh)?.members.length ?? 0} members`
    : CHANNELS.find(c => c.id === activeCh)?.desc;

  const handleSend = (text) => {
    if (activeFriendCh) sendFriendMessage(activeFriendCh, text);
    else sendMessage(activeCh, text);
  };

  const goBack = () => { setView('list'); setActiveFriendCh(null); };

  /* Chat view */
  if (inChat) {
    return (
      <ChatView
        title={chatTitle}
        subtitle={chatSub}
        messages={currentMsgs}
        onSend={handleSend}
        onBack={goBack}
      />
    );
  }

  /* Channel list view */
  return (
    <div style={{ position:'absolute', inset:0, overflowY:'auto', overflowX:'hidden' }} className="hide-scrollbar">
      <div style={{ padding:'60px 20px 88px' }}>

        {/* Header */}
        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:24 }}>
          <motion.button onClick={onBack} whileTap={{ scale:0.9 }}
            style={{ width:44, height:44, borderRadius:'50%', background:'rgba(255,255,255,0.06)', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <span style={{ fontSize:22, color:'rgba(255,255,255,0.7)', lineHeight:1 }}>‹</span>
          </motion.button>
          <div>
            <h1 style={{ fontSize:24, fontWeight:900, color:'#fff', lineHeight:1.1 }}>Live Chat</h1>
            <p style={{ fontSize:13, color:'rgba(255,255,255,0.4)', marginTop:2 }}>Connect with fellow fans</p>
          </div>
        </div>

        {/* Channels */}
        <p style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.35)', letterSpacing:1, textTransform:'uppercase', marginBottom:10 }}>
          Channels
        </p>
        {CHANNELS.map(ch => {
          const { Icon } = ch;
          const last = messages[ch.id]?.[messages[ch.id].length - 1];
          return (
            <motion.button key={ch.id}
              onClick={() => { setActiveCh(ch.id); setActiveFriendCh(null); setView('chat'); }}
              whileTap={{ scale:0.97 }}
              style={{
                width:'100%', display:'flex', alignItems:'center', gap:12, padding:'14px 14px',
                borderRadius:16, border:'1px solid rgba(255,255,255,0.07)',
                background:'rgba(255,255,255,0.04)', cursor:'pointer', marginBottom:8, textAlign:'left',
              }}>
              <div style={{ width:44, height:44, borderRadius:12, background:'rgba(140,21,21,0.15)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <Icon size={20} color="#B83A3A" />
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <p style={{ fontSize:15, fontWeight:700, color:'#fff', marginBottom:3 }}>{ch.label}</p>
                {last && <p style={{ fontSize:12, color:'rgba(255,255,255,0.3)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{last.user}: {last.text}</p>}
              </div>
              <ChevronRight size={18} color="rgba(255,255,255,0.2)" />
            </motion.button>
          );
        })}

        {/* Group chats */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:20, marginBottom:10 }}>
          <p style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.35)', letterSpacing:1, textTransform:'uppercase' }}>Group Chats</p>
          <motion.button onClick={() => setShowCreateGroup(true)} whileTap={{ scale:0.95 }}
            style={{ display:'flex', alignItems:'center', gap:4, background:'none', border:'none', cursor:'pointer', padding:'4px 0' }}>
            <Plus size={15} color="#B83A3A" />
            <span style={{ fontSize:13, fontWeight:700, color:'#B83A3A' }}>New</span>
          </motion.button>
        </div>

        {friendChats.map(chat => {
          const last = chat.messages[chat.messages.length - 1];
          return (
            <motion.button key={chat.id}
              onClick={() => { setActiveFriendCh(chat.id); setView('chat'); }}
              whileTap={{ scale:0.97 }}
              style={{
                width:'100%', display:'flex', alignItems:'center', gap:12, padding:'14px 14px',
                borderRadius:16, border:'1px solid rgba(255,255,255,0.07)',
                background:'rgba(255,255,255,0.04)', cursor:'pointer', marginBottom:8, textAlign:'left',
              }}>
              <div style={{ width:44, height:44, borderRadius:12, background:'rgba(176,141,87,0.12)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <Users size={20} color="#D4AF37" />
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <p style={{ fontSize:15, fontWeight:700, color:'#fff', marginBottom:3 }}>{chat.name}</p>
                {last
                  ? <p style={{ fontSize:12, color:'rgba(255,255,255,0.3)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{last.user}: {last.text}</p>
                  : <p style={{ fontSize:12, color:'rgba(255,255,255,0.2)' }}>No messages yet</p>
                }
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:6, flexShrink:0 }}>
                <span style={{ fontSize:12, color:'rgba(255,255,255,0.2)' }}>{chat.members.length}</span>
                <ChevronRight size={16} color="rgba(255,255,255,0.2)" />
              </div>
            </motion.button>
          );
        })}

      </div>

      {/* Create group modal */}
      <AnimatePresence>
        {showCreateGroup && (
          <CreateGroupModal friends={friends} onClose={() => setShowCreateGroup(false)} onCreate={createGroupChat} />
        )}
      </AnimatePresence>
    </div>
  );
}
