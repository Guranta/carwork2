import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
        setCountdown((c) => {
          if (c <= 1) { clearInterval(t); return 0; }
          return c - 1;
        });
      }, 1000);
    } catch { setError('发送失败'); }
  };

  const handleLogin = async () => {
    if (!phone || !code) { setError('请输入手机号和验证码'); return; }
    setError('');
    setLoading(true);
    try {
      const res: any = await login(phone, code);
      setAuth(res.token, res.user);
      navigate('/policies', { replace: true });
    } catch { setError('登录失败'); } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-8">
      <h1 className="text-white text-4xl font-black tracking-tight mb-2">车险理赔</h1>
      <p className="text-neutral-500 text-sm mb-12">CAR INSURANCE CLAIMS</p>

      {error && <p className="text-red-500 text-sm mb-4 font-bold">{error}</p>}

      <div className="w-full max-w-xs space-y-4">
        <div className="border-2 border-white bg-transparent px-4 py-3">
          <input
            className="w-full bg-transparent text-white text-lg outline-none placeholder-neutral-600"
            placeholder="手机号"
            maxLength={11}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <div className="flex-1 border-2 border-white bg-transparent px-4 py-3">
            <input
              className="w-full bg-transparent text-white text-lg outline-none placeholder-neutral-600"
              placeholder="验证码"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>
          <button
            className="border-2 border-white text-white px-4 py-3 text-sm font-bold whitespace-nowrap disabled:opacity-30"
            onClick={handleSendCode}
            disabled={countdown > 0}
          >
            {countdown > 0 ? `${countdown}s` : '获取验证码'}
          </button>
        </div>

        <button
          className="w-full bg-white text-black py-4 text-lg font-black tracking-wide disabled:opacity-50"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? '登录中...' : '登 录'}
        </button>

        <p className="text-neutral-600 text-xs text-center mt-8">
          演示账号：13800000001 / 验证码 1234
        </p>
      </div>
    </div>
  );
}
