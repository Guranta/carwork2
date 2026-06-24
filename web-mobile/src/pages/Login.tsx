import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Phone, Lock } from 'lucide-react';
import { useAuthStore } from '../stores/auth';
import { sendCode, login } from '../api';

export default function Login() {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();

  const handleSendCode = async () => {
    if (!/^1\d{10}$/.test(phone)) { setError('请输入正确手机号'); return; }
    setError('');
    try {
      await sendCode(phone);
      setCountdown(60);
      const t = setInterval(() => {
        setCountdown((c) => { if (c <= 1) { clearInterval(t); return 0; } return c - 1; });
      }, 1000);
    } catch { setError('发送失败，请重试'); }
  };

  const handleLogin = async () => {
    if (!phone || !code) { setError('请输入手机号和验证码'); return; }
    setError('');
    setLoading(true);
    try {
      const res: any = await login(phone, code);
      setAuth(res.token, res.user);
      navigate('/policies', { replace: true });
    } catch { setError('登录失败，请重试'); } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex flex-col">
      {/* Brand header */}
      <div className="flex-1 flex flex-col items-center justify-center pt-20">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00B96B] to-[#009456] flex items-center justify-center mb-5 shadow-lg shadow-[#00B96B]/30"
        >
          <ShieldCheck size={32} className="text-white" strokeWidth={2.5} />
        </motion.div>
        <h1 className="text-[#1A1A1A] text-2xl font-bold tracking-tight">车险理赔</h1>
        <p className="text-[#BFBFBF] text-sm mt-1">让理赔更简单</p>
      </div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="px-6 pb-16"
      >
        <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-6 space-y-5">
          {error && (
            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-[#FF4D4F] text-xs font-medium text-center"
            >
              {error}
            </motion.p>
          )}

          {/* Phone input */}
          <div className="flex items-center gap-3 border-b border-[#F0F0F0] pb-3">
            <Phone size={20} className="text-[#BFBFBF] shrink-0" />
            <input
              className="flex-1 bg-transparent text-[#1A1A1A] text-base outline-none placeholder:text-[#BFBFBF]"
              placeholder="请输入手机号"
              maxLength={11}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          {/* Code input */}
          <div className="flex items-center gap-3 border-b border-[#F0F0F0] pb-3">
            <Lock size={20} className="text-[#BFBFBF] shrink-0" />
            <input
              className="flex-1 bg-transparent text-[#1A1A1A] text-base outline-none placeholder:text-[#BFBFBF]"
              placeholder="验证码"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <button
              className={`text-sm font-medium whitespace-nowrap ${countdown > 0 ? 'text-[#BFBFBF]' : 'text-[#00B96B]'}`}
              onClick={handleSendCode}
              disabled={countdown > 0}
            >
              {countdown > 0 ? `${countdown}s` : '获取验证码'}
            </button>
          </div>

          {/* Login button */}
          <motion.button
            whileTap={{ scale: loading ? 1 : 0.97 }}
            className="w-full bg-[#00B96B] text-white py-3.5 rounded-xl text-base font-semibold shadow-lg shadow-[#00B96B]/20 disabled:opacity-50 transition-opacity"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? '登录中...' : '登 录'}
          </motion.button>
        </div>

        <p className="text-center text-[#BFBFBF] text-xs mt-6">
          演示账号：13800000001 · 验证码 1234
        </p>
      </motion.div>
    </div>
  );
}
