import { useEffect, useState } from 'react';
import { getNotifications, markAllNotificationsRead } from '../api';
import TabBar from '../components/TabBar';

interface Notification {
  id: number;
  type: string;
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = () => {
    getNotifications()
      .then((res: any) => setNotifications(res))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, []);

  return (
    <div className="min-h-screen bg-black pb-20">
      <header className="px-6 pt-12 pb-6 border-b-2 border-neutral-800 flex justify-between items-center">
        <h1 className="text-white text-2xl font-black">消息通知</h1>
        <button
          className="text-neutral-400 text-xs border border-neutral-700 px-3 py-1"
          onClick={() => { markAllNotificationsRead().then(fetch); }}
        >
          全部已读
        </button>
      </header>

      <div className="px-6 py-4">
        {loading ? (
          <p className="text-neutral-600 text-sm">加载中...</p>
        ) : notifications.length === 0 ? (
          <p className="text-neutral-600 text-sm text-center py-20">暂无通知</p>
        ) : (
          <div className="space-y-3">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`border-2 p-4 ${n.isRead ? 'border-neutral-800' : 'border-white'}`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="text-white font-bold text-sm">{n.title}</span>
                  {!n.isRead && <span className="w-2 h-2 bg-white rounded-full" />}
                </div>
                <p className="text-neutral-400 text-sm mb-2">{n.body}</p>
                <span className="text-neutral-600 text-xs">{new Date(n.createdAt).toLocaleString('zh-CN')}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <TabBar />
    </div>
  );
}
