import { Layout as AntLayout, Menu, Button, theme } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { DashboardOutlined, FileTextOutlined, TeamOutlined, ShopOutlined } from '@ant-design/icons';
import { useAuthStore } from '../stores/auth';

const { Header, Sider, Content } = AntLayout;

const menuItems = [
  { key: '/', icon: <DashboardOutlined />, label: '仪表盘' },
  { key: '/claims', icon: <FileTextOutlined />, label: '理赔审核' },
  { key: '/users', icon: <TeamOutlined />, label: '用户管理' },
  { key: '/shops', icon: <ShopOutlined />, label: '修理厂管理' },
];

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const admin = useAuthStore((s) => s.admin);
  const logout = useAuthStore((s) => s.logout);
  const { token: themeToken } = theme.useToken();

  const selectedKey = menuItems.find((m) => location.pathname === m.key || (m.key !== '/' && location.pathname.startsWith(m.key)))?.key || '/';

  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      <Sider breakpoint="lg" collapsible>
        <div style={{ height: 48, margin: 16, color: '#fff', fontSize: 18, fontWeight: 700, textAlign: 'center', lineHeight: '48px' }}>
          车险理赔
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>
      <AntLayout>
        <Header style={{ background: themeToken.colorBgContainer, padding: '0 24px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 16 }}>
          <span>{admin?.name} ({admin?.role})</span>
          <Button size="small" onClick={() => { logout(); navigate('/login'); }}>退出</Button>
        </Header>
        <Content style={{ margin: 24, padding: 24, background: themeToken.colorBgContainer, borderRadius: 8, minHeight: 360 }}>
          <Outlet />
        </Content>
      </AntLayout>
    </AntLayout>
  );
}
