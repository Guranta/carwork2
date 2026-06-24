import { useNavigate, useLocation } from 'react-router-dom';
import { FileText, Wrench, MapPin, User, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { getUnreadCount } from '../api';

const tabs = [
  { key: '/policies', label: '首页', icon: FileText },
  { key: '/claims', label: '理赔', icon: Wrench },
  { key: '/shops/nearby', label: '门店', icon: MapPin },
  { key: '/agent', label: 'Agent', icon: Sparkles },
  { key: '/profile', label: '我的', icon: User },
];

export default function TabBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    getUnreadCount()
      .then((res: any) => setUnread(res || 0))
      .catch(() => {});
    const interval = setInterval(() => {
      getUnreadCount()
        .then((res: any) => setUnread(res || 0))
        .catch(() => {});
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-[#F0F0F0] flex safe-bottom z-50">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const active = location.pathname === tab.key || (tab.key !== '/policies' && location.pathname.startsWith(tab.key));
        return (
          <button
            key={tab.key}
            className={`flex-1 py-2 flex flex-col items-center gap-0.5 relative ${active ? 'text-[#00B96B]' : 'text-[#BFBFBF]'}`}
            onClick={() => navigate(tab.key)}
          >
            <div className="relative">
              <Icon size={22} strokeWidth={active ? 2.5 : 2} />
              {tab.key === '/profile' && unread > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-[#FF4D4F] text-white text-[10px] min-w-4 h-4 px-1 rounded-full flex items-center justify-center font-medium">
                  {unread > 9 ? '9+' : unread}
                </span>
              )}
            </div>
            <span className="text-[10px] font-medium">{tab.label}</span>
            {active && (
              <motion.div
                layoutId="tab-indicator"
                className="absolute top-0 w-8 h-0.5 bg-[#00B96B] rounded-full"
              />
            )}
          </button>
        );
      })}
    </nav>
  );
}
