import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Input, Button, Typography, Space } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useAuthStore } from '../stores/auth';
import { adminLogin } from '../api';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username || !password) return;
    setLoading(true);
    try {
      const res: any = await adminLogin(username, password);
      setAuth(res.token, res.admin);
      navigate('/', { replace: true });
    } catch {} finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f2f5' }}>
      <Card style={{ width: 360 }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Typography.Title level={3} style={{ textAlign: 'center', marginBottom: 0 }}>
            车险理赔管理后台
          </Typography.Title>
          <Input
            size="large"
            prefix={<UserOutlined />}
            placeholder="用户名"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onPressEnter={handleLogin}
          />
          <Input.Password
            size="large"
            prefix={<LockOutlined />}
            placeholder="密码"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onPressEnter={handleLogin}
          />
          <Button type="primary" size="large" block loading={loading} onClick={handleLogin}>
            登 录
          </Button>
          <Typography.Text type="secondary" style={{ textAlign: 'center', display: 'block', fontSize: 12 }}>
            管理员: admin / admin123 · 理赔员: adjuster / adjuster123
          </Typography.Text>
        </Space>
      </Card>
    </div>
  );
}
