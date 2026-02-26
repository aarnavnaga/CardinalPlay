import { createContext, useCallback, useContext, useState } from 'react';

const AppContext = createContext();

const MOCK_USER = {
  id: 'usr_001',
  name: 'Aarnav',
  fullName: 'Aarnav Nagabhirava',
  email: 'aarnav@stanford.edu',
  year: 'Sophomore',
  section: 'Section 104',
  sectionId: 104,
  coins: 2450,
  totalCoinsEarned: 8200,
  isInStadium: true,
  avatarColor: '#8C1515',
  checkedIn: true,
};

// x,y are % in seating areas only (not on field): left 18–26%, right 74–82%, top 14–22%, bottom 78–86%
const MOCK_FRIENDS = [
  { id: 'f1', name: 'Karis Chen', section: 'Section 104', row: 12, seat: 8, x: 22, y: 18, online: true, avatarColor: '#B83A3A' },
  { id: 'f2', name: 'Mahi Jariwala', section: 'Section 106', row: 5, seat: 15, x: 78, y: 18, online: true, avatarColor: '#D4AF37' },
  { id: 'f3', name: 'Jordan Huang', section: 'Section 102', row: 20, seat: 3, x: 22, y: 82, online: true, avatarColor: '#6B0F0F' },
  { id: 'f4', name: 'Zayd Patel', section: 'Section 108', row: 8, seat: 22, x: 78, y: 82, online: false, avatarColor: '#B08D57' },
  { id: 'f5', name: 'Caroline Driscoll', section: 'Section 104', row: 14, seat: 5, x: 22, y: 50, online: true, avatarColor: '#E54545' },
  { id: 'f6', name: 'Sonia Dholakia', section: 'Section 110', row: 3, seat: 18, x: 78, y: 50, online: true, avatarColor: '#8C1515' },
  { id: 'f7', name: 'Aakrisht Mehra', section: 'Section 104', row: 6, seat: 12, x: 50, y: 14, online: true, avatarColor: '#9C27B0' },
  { id: 'f8', name: 'Sam Fisher', section: 'Section 112', row: 18, seat: 7, x: 50, y: 86, online: true, avatarColor: '#1976D2' },
  { id: 'f9', name: 'Andrew Luck', section: 'Section 106', row: 10, seat: 1, x: 26, y: 28, online: true, avatarColor: '#2E7D32' },
];

const MOCK_LEADERBOARD = [
  { id: 'lb1', name: 'Andrew Luck', coins: 15200, rank: 1, year: 'Senior' },
  { id: 'lb2', name: 'Mahi Jariwala', coins: 12800, rank: 2, year: 'Junior' },
  { id: 'lb3', name: 'Jordan Huang', coins: 11500, rank: 3, year: 'Senior' },
  { id: 'lb4', name: 'Karis Chen', coins: 9800, rank: 4, year: 'Sophomore' },
  { id: 'lb5', name: 'Sonia Dholakia', coins: 9200, rank: 5, year: 'Junior' },
  { id: 'usr_001', name: 'Aarnav Nagabhirava', coins: 8200, rank: 6, year: 'Sophomore' },
  { id: 'lb7', name: 'Caroline Driscoll', coins: 7600, rank: 7, year: 'Freshman' },
  { id: 'lb8', name: 'Zayd Patel', coins: 6900, rank: 8, year: 'Sophomore' },
  { id: 'lb9', name: 'Aakrisht Mehra', coins: 5400, rank: 9, year: 'Junior' },
  { id: 'lb10', name: 'Sam Fisher', coins: 4800, rank: 10, year: 'Freshman' },
];

const MOCK_REWARDS = [
  { id: 'r1', name: 'Free Nachos & Drink', description: 'Redeem at any stadium concession stand', cost: 500, category: 'food', emoji: '🌮', available: true },
  { id: 'r2', name: 'Cardinal T-Shirt', description: 'Official Stanford Athletics merch', cost: 1500, category: 'merch', emoji: '👕', available: true },
  { id: 'r3', name: 'Front Row Seats', description: 'Guaranteed front row for next home game', cost: 3000, category: 'seating', emoji: '🏟️', available: true },
  { id: 'r4', name: 'Free Pizza Slice', description: 'Any pizza vendor in the stadium', cost: 300, category: 'food', emoji: '🍕', available: true },
  { id: 'r5', name: 'Stanford Cap', description: 'Embroidered Stanford Athletics cap', cost: 1200, category: 'merch', emoji: '🧢', available: true },
  { id: 'r6', name: 'VIP Sideline Pass', description: 'Watch one quarter from the sideline', cost: 5000, category: 'experience', emoji: '⭐', available: true },
  { id: 'r7', name: 'Free Hot Dog Combo', description: 'Hot dog + fries + drink combo', cost: 400, category: 'food', emoji: '🌭', available: true },
  { id: 'r8', name: 'Signed Football', description: 'Football signed by the team', cost: 8000, category: 'merch', emoji: '🏈', available: true },
];

const MOCK_POLLS = [
  { id: 'p1', question: 'Will Stanford score on this drive?', optionA: 'Yes - Touchdown!', optionB: 'No - Defense holds', oddsA: 2.1, oddsB: 1.7, totalPool: 4500, votesA: 145, votesB: 98, status: 'active', timeLeft: 120, category: 'drive' },
  { id: 'p2', question: 'Total passing yards by halftime?', optionA: 'Over 150 yards', optionB: 'Under 150 yards', oddsA: 1.8, oddsB: 2.0, totalPool: 3200, votesA: 87, votesB: 112, status: 'active', timeLeft: 300, category: 'stats' },
  { id: 'p3', question: 'Next big play will be...', optionA: 'A run play 10+ yds', optionB: 'A pass play 15+ yds', oddsA: 2.5, oddsB: 1.5, totalPool: 2800, votesA: 56, votesB: 134, status: 'active', timeLeft: 60, category: 'play' },
  { id: 'p4', question: 'Will there be a turnover this quarter?', optionA: 'Yes', optionB: 'No', oddsA: 3.2, oddsB: 1.3, totalPool: 5100, votesA: 42, votesB: 201, status: 'active', timeLeft: 450, category: 'game' },
];

const MOCK_MESSAGES = {
  global: [
    { id: 'm1', user: 'Karis Chen', text: 'Lets go Cardinal!! 🌲🔴', time: '2:34 PM', isOwn: false },
    { id: 'm2', user: 'Mahi Jariwala', text: 'That last play was insane', time: '2:35 PM', isOwn: false },
    { id: 'm3', user: 'You', text: 'Stanford by 20 today 💪', time: '2:36 PM', isOwn: true },
    { id: 'm4', user: 'Caroline Driscoll', text: 'Defense is locked in right now', time: '2:37 PM', isOwn: false },
    { id: 'm5', user: 'Sonia Dholakia', text: 'Anyone know if there are nachos left at stand 3?', time: '2:38 PM', isOwn: false },
    { id: 'm6', user: 'Jordan Huang', text: 'Just checked in, 5x coins lets gooo', time: '2:39 PM', isOwn: false },
  ],
  stadium: [
    { id: 's1', user: 'Jordan Huang', text: 'The energy in here is CRAZY', time: '2:35 PM', isOwn: false },
    { id: 's2', user: 'You', text: 'Loudest game this season for sure', time: '2:36 PM', isOwn: true },
    { id: 's3', user: 'Caroline Driscoll', text: 'Wave starting on the east side!', time: '2:37 PM', isOwn: false },
  ],
  section: [
    { id: 'sec1', user: 'Karis Chen', text: 'Our section is the loudest section no debate', time: '2:36 PM', isOwn: false },
    { id: 'sec2', user: 'Caroline Driscoll', text: 'Facts 104 is different 🔥', time: '2:37 PM', isOwn: false },
    { id: 'sec3', user: 'You', text: 'We need to start a chant next timeout', time: '2:38 PM', isOwn: true },
  ],
};

export function AppProvider({ children }) {
  const [user, setUser] = useState(MOCK_USER);
  const [friends] = useState(MOCK_FRIENDS);
  const [leaderboard] = useState(MOCK_LEADERBOARD);
  const [rewards] = useState(MOCK_REWARDS);
  const [polls, setPolls] = useState(MOCK_POLLS);
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeBets, setActiveBets] = useState([]);
  const [friendChats, setFriendChats] = useState([
    {
      id: 'gc1', name: 'Tailgate Crew 🎉', members: ['Karis Chen', 'Jordan Huang', 'Caroline Driscoll'], messages: [
        { id: 'gc1m1', user: 'Karis Chen', text: 'Pregame at 4?', time: '1:00 PM', isOwn: false },
        { id: 'gc1m2', user: 'You', text: 'Im down, meet at the usual spot', time: '1:02 PM', isOwn: true },
      ]
    },
    {
      id: 'gc2', name: 'Study Break Squad', members: ['Mahi Jariwala', 'Sonia Dholakia'], messages: [
        { id: 'gc2m1', user: 'Mahi Jariwala', text: 'This game is so much better than studying lol', time: '2:30 PM', isOwn: false },
      ]
    },
  ]);

  const login = useCallback((email, password) => {
    setIsAuthenticated(true);
  }, []);

  const signup = useCallback((data) => {
    setUser(prev => ({ ...prev, name: data.name, fullName: data.name, email: data.email }));
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
  }, []);

  const spendCoins = useCallback((amount) => {
    setUser(prev => ({ ...prev, coins: prev.coins - amount }));
  }, []);

  const earnCoins = useCallback((amount) => {
    setUser(prev => ({ ...prev, coins: prev.coins + amount, totalCoinsEarned: prev.totalCoinsEarned + amount }));
  }, []);

  const placeBet = useCallback((pollId, option, amount) => {
    spendCoins(amount);
    setActiveBets(prev => [...prev, { pollId, option, amount, timestamp: Date.now() }]);
    setPolls(prev => prev.map(p => {
      if (p.id === pollId) {
        return {
          ...p,
          totalPool: p.totalPool + amount,
          votesA: option === 'A' ? p.votesA + 1 : p.votesA,
          votesB: option === 'B' ? p.votesB + 1 : p.votesB,
        };
      }
      return p;
    }));
  }, [spendCoins]);

  const sendMessage = useCallback((channel, text) => {
    const newMsg = {
      id: `msg_${Date.now()}`,
      user: 'You',
      text,
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      isOwn: true,
    };
    setMessages(prev => ({
      ...prev,
      [channel]: [...(prev[channel] || []), newMsg],
    }));
  }, []);

  const sendFriendMessage = useCallback((chatId, text) => {
    const newMsg = {
      id: `fmsg_${Date.now()}`,
      user: 'You',
      text,
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      isOwn: true,
    };
    setFriendChats(prev => prev.map(c =>
      c.id === chatId ? { ...c, messages: [...c.messages, newMsg] } : c
    ));
  }, []);

  const createGroupChat = useCallback((name, memberNames) => {
    const newChat = {
      id: `gc_${Date.now()}`,
      name,
      members: memberNames,
      messages: [],
    };
    setFriendChats(prev => [...prev, newChat]);
    return newChat.id;
  }, []);

  return (
    <AppContext.Provider value={{
      user, friends, leaderboard, rewards, polls, messages, friendChats,
      isAuthenticated, activeBets,
      login, signup, logout, spendCoins, earnCoins, placeBet,
      sendMessage, sendFriendMessage, createGroupChat,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
