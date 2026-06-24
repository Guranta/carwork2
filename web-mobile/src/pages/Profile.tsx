import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bell, Car, FileText, ChevronRight, LogOut, Shield, HelpCircle, Settings } from 'lucide-react';
import { useAuthStore } from '../stores/auth';
import { getMe, getMyVehicles, getUnreadCount } from '../api';
import TabBar from '../components/TabBar';

export default function Profile() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  const [vehicleCount, setVehicleCount] = useState(0);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    getMe().catch(() => {});
    getMyVehicles().then((res: any) => setVehicleCount(res?.length || 0)).catch(() => {});
    getUnreadCount().then((res: any) => setUnread(res || 0)).catch(() => {});
  }, []);

  const menuItems = [
    { icon: Car, label: '我的车辆', value: `${vehicleCount} 辆`, action: () => {} },
    { icon: FileText, label: '我的保单', value: '', action: () => navigate('/policies') },
    { icon: Bell, label: '消息通知', value: unread > 0 ? `${unread} 条未读` : '', action: () => navigate('/notifications'), badge: unread },
  ];

  const settingsItems = [
    { icon: Shield, label: '安全中心', action: () => {} },
    { icon: HelpCircle, label: '帮助与反馈', action: () => {} },
    { icon: Settings, label: '设置', action: () => {} },
  ];

  return (
    <div className="min-h-screen bg-[#F5F7FA] pb-20">
      {/* Header */}
      <div className="bg-gradient-to-b from-[#00B96B] to-[#00A35E] px-5 pt-14 pb-10 rounded-b-3xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-white/25 backdrop-blur-sm flex items-center justify-center text-white text-2xl font-bold">
            {user?.name?.[0] || '车'}
          </div>
          <div className="flex-1">
            <h1 className="text-white text-xl font-bold">{user?.name || '用户'}</h1>
            <p className="text-white/70 text-sm mt-0.5">{user?.phone}</p>
          </div>
        </div>
        {/* Stats */}
        <div className="flex gap-4 mt-6">
          <div className="flex-1 bg-white/15 backdrop-blur-sm rounded-xl py-3 text-center">
            <p className="text-white text-xl font-bold">{vehicleCount}</p>
            <p className="text-white/70 text-xs">车辆</p>
          </div>
          <div className="flex-1 bg-white/15 backdrop-blur-sm rounded-xl py-3 text-center">
            <p className="text-white text-xl font-bold">{unread}</p>
            <p className="text-white/70 text-xs">未读消息</p>
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className="px-4 -mt-5">
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-[0_1px_4px_rgba(0,0,0,0.06)] divide-y divide-[#F0F0F0] overflow-hidden"
        >
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                onClick={item.action}
                className="flex items-center gap-3 w-full px-4 py-3.5 active:bg-[#F5F7FA] transition-colors"
              >
                <div className="w-9 h-9 rounded-lg bg-[#E6F9F1] flex items-center justify-center">
                  <Icon size={18} className="text-[#00B96B]" />
                </div>
                <span className="flex-1 text-left text-sm text-[#1A1A1A] font-medium">{item.label}</span>
                {item.badge && item.badge > 0 ? (
                  <span className="bg-[#FF4D4F] text-white text-[10px] min-w-4 h-4 px-1 rounded-full flex items-center justify-center font-medium">
                    {item.badge}
                  </span>
                ) : null}
                {item.value && <span className="text-xs text-[#8C8C8C]">{item.value}</span>}
                <ChevronRight size={16} className="text-[#BFBFBF]" />
              </button>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="bg-white rounded-2xl shadow-[0_1px_4px_rgba(0,0,0,0.06)] divide-y divide-[#F0F0F0] overflow-hidden mt-3"
        >
          {settingsItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                onClick={item.action}
                className="flex items-center gap-3 w-full px-4 py-3.5 active:bg-[#F5F7FA] transition-colors"
              >
                <div className="w-9 h-9 rounded-lg bg-[#F5F5F5] flex items-center justify-center">
                  <Icon size={18} className="text-[#8C8C8C]" />
                </div>
                <span className="flex-1 text-left text-sm text-[#1A1A1A] font-medium">{item.label}</span>
                <ChevronRight size={16} className="text-[#BFBFBF]" />
              </button>
            );
          })}
        </motion.div>

        {/* Logout */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-[0_1px_4px_rgba(0,0,0,0.06)] mt-3"
        >
          <button
            onClick={() => { logout(); navigate('/login', { replace: true }); }}
            className="flex items-center justify-center gap-2 w-full py-3.5 active:bg-[#F5F7FA] transition-colors"
          >
            <LogOut size={16} className="text-[#FF4D4F]" />
            <span className="text-sm text-[#FF4D4F] font-medium">退出登录</span>
          </button>
        </motion.div>

        <p className="text-center text-[#BFBFBF] text-xs mt-6">车险理赔 v1.0.0</p>
      </div>

      <TabBar />
    </div>
  );
}
