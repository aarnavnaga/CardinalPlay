import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useState } from 'react';
import BottomNav from './components/BottomNav';
import { AppProvider, useApp } from './context/AppContext';
import AuthScreen from './pages/AuthScreen';
import ChatScreen from './pages/ChatScreen';
import FriendFinder from './pages/FriendFinder';
import HomeScreen from './pages/HomeScreen';
import PollsScreen from './pages/PollsScreen';
import RewardsScreen from './pages/RewardsScreen';
import SplashScreen from './pages/SplashScreen';

const slide = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.28, ease: 'easeOut' } },
  exit:    { opacity: 0, y: -8,  transition: { duration: 0.18 } },
};

function AppContent() {
  const { isAuthenticated } = useApp();
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState('home');

  const onSplashDone = useCallback(() => setShowSplash(false), []);
  const goTo        = useCallback((tab) => setActiveTab(tab), []);
  const goHome      = useCallback(() => setActiveTab('home'), []);

  if (showSplash) return <SplashScreen onComplete={onSplashDone} />;
  if (!isAuthenticated) return <AuthScreen />;

  return (
    <>
      <AnimatePresence mode="wait">
        {activeTab === 'home'    && <motion.div key="home"    className="absolute inset-0" {...slide}><HomeScreen    onNavigate={goTo}  /></motion.div>}
        {activeTab === 'finder'  && <motion.div key="finder"  className="absolute inset-0" {...slide}><FriendFinder  onBack={goHome}    /></motion.div>}
        {activeTab === 'chat'    && <motion.div key="chat"    className="absolute inset-0" {...slide}><ChatScreen    onBack={goHome}    /></motion.div>}
        {activeTab === 'rewards' && <motion.div key="rewards" className="absolute inset-0" {...slide}><RewardsScreen onBack={goHome}    /></motion.div>}
        {activeTab === 'polls'   && <motion.div key="polls"   className="absolute inset-0" {...slide}><PollsScreen   onBack={goHome}    /></motion.div>}
      </AnimatePresence>
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <div style={{ position:'relative', width:'100%', height:'100%', background:'#0A0A0A', overflow:'hidden' }}>
        <AppContent />
      </div>
    </AppProvider>
  );
}
