import { motion } from 'framer-motion';
import { Home, MapPin, MessageCircle, TrendingUp, Trophy } from 'lucide-react';

const TABS = [
  { id: 'home',    label: 'Home',    Icon: Home },
  { id: 'finder',  label: 'Find',    Icon: MapPin },
  { id: 'chat',    label: 'Chat',    Icon: MessageCircle },
  { id: 'rewards', label: 'Rewards', Icon: Trophy },
  { id: 'polls',   label: 'Wagers',  Icon: TrendingUp },
];

export default function BottomNav({ activeTab, onTabChange }) {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: 'rgba(10,10,10,0.92)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderTop: '1px solid rgba(255,255,255,0.07)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-around', height: 64 }}>
        {TABS.map(({ id, label, Icon }) => {
          const active = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4,
                padding: '8px 0',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                position: 'relative',
              }}
            >
              {active && (
                <motion.div
                  layoutId="nav-pip"
                  style={{
                    position: 'absolute',
                    top: 0,
                    width: 32,
                    height: 3,
                    borderRadius: 2,
                    background: 'linear-gradient(135deg,#8C1515,#B83A3A)',
                  }}
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
              <Icon
                size={22}
                strokeWidth={active ? 2.5 : 1.8}
                color={active ? '#B83A3A' : 'rgba(255,255,255,0.35)'}
              />
              <span style={{
                fontSize: 10,
                fontWeight: active ? 700 : 500,
                color: active ? '#B83A3A' : 'rgba(255,255,255,0.35)',
                letterSpacing: 0.2,
              }}>
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
