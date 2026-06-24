import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, FileText, Info, CheckCheck } from 'lucide-react';
import { getNotifications, markAllNotificationsRead, markNotificationRead } from '../api';
import { ListSkeleton, EmptyState } from '../components/ui';
import TabBar from '../components/TabBar';

interface Notification {
  id: number;
  type: string;
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
}

const TYPE_CONFIG: Record<string, { icon: any; bg: string; color: string }> = {
  PAYMENT: { icon: CreditCard, bg: 'bg-[#E6F9F1]', color: 'text-[#00B96B]' },
  CLAIM_STATUS: { icon: FileText, bg: 'bg-[#E6F4FF]', color: 'text-[#1677FF]' },
  SYSTEM: { icon: Info, bg: 'bg-[#F5F5F5]', color: 'text-[#8C8C8C]' },
};

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(() => {
    getNotifications()
      .then((res: any) => setNotifications(res))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const handleMarkAll = async () => {
    await markAllNotificationsRead();
    fetch();
  };

  const handleTap = async (n: Notification) => {
    if (!n.isRead) {
      await markNotificationRead(n.id);
      fetch();
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] pb-20">
      <div className="bg-white px-5 pt-12 pb-4 sticky top-0 z-40 border-b border-[#F0F0F0] flex items-center justify-between">
        <div>
          <h1 className="text-[#1A1A1A] text-xl font-bold">消息通知</h1>
          <p className="text-[#BFBFBF] text-xs mt-0.5">
            {notifications.filter((n) => !n.isRead).length > 0
              ? `${notifications.filter((n) => !n.isRead).length} 条未读`
              : '全部已读'}
          </p>
        </div>
        {notifications.some((n) => !n.isRead) && (
          <button
            className="flex items-center gap-1 text-[#00B96B] text-xs font-medium active:scale-95 transition-transform"
            onClick={handleMarkAll}
          >
            <CheckCheck size={14} />
            全部已读
          </button>
        )}
      </div>

      <div className="px-4 pt-4">
        {loading ? (
          <ListSkeleton count={3} />
        ) : notifications.length === 0 ? (
          <EmptyState icon={<Info size={56} strokeWidth={1.5} />} title="暂无通知" />
        ) : (
          <div className="space-y-2">
            {notifications.map((n, idx) => {
              const config = TYPE_CONFIG[n.type] || TYPE_CONFIG.SYSTEM;
              const Icon = config.icon;
              return (
                <motion.button
                  key={n.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: idx * 0.04 }}
                  className={`w-full text-left bg-white rounded-xl p-4 flex gap-3 active:scale-[0.98] transition-transform relative ${
                    !n.isRead ? 'pl-5' : ''
                  }`}
                  onClick={() => handleTap(n)}
                >
                  {!n.isRead && (
                    <span className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#00B96B]" />
                  )}
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${config.bg}`}>
                    <Icon size={18} className={config.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${!n.isRead ? 'text-[#1A1A1A] font-semibold' : 'text-[#595959] font-medium'}`}>
                      {n.title}
                    </p>
                    <p className="text-[#8C8C8C] text-xs mt-0.5 line-clamp-2">{n.body}</p>
                    <p className="text-[#BFBFBF] text-xs mt-1">{new Date(n.createdAt).toLocaleString('zh-CN')}</p>
                  </div>
                </motion.button>
              );
            })}
          </div>
        )}
      </div>

      <TabBar />
    </div>
  );
}
