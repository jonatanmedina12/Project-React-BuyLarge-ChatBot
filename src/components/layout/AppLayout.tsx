// src/components/layout/AppLayout.tsx
import React, { useState, useEffect } from 'react';
import { Layout, Menu, Button, Avatar, Dropdown, Badge, Typography } from 'antd';
import { 
  MenuFoldOutlined, 
  MenuUnfoldOutlined, 
  RobotOutlined,
  ShoppingCartOutlined,
  DashboardOutlined,
  UserOutlined,
  LogoutOutlined,
  BellOutlined
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

// Logo de Buy n Large
const Logo = () => (
  <div className="logo" style={{ 
    display: 'flex', 
    alignItems: 'center', 
    padding: '16px', 
    justifyContent: 'center'
  }}>
    <ShoppingCartOutlined style={{ fontSize: '28px', color: '#1890ff', marginRight: '8px' }} />
    <span style={{ color: 'white', fontSize: '18px', fontWeight: 'bold' }}>Buy n Large</span>
  </div>
);

const AppLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Verificar autenticación
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Determinar la clave de menú seleccionada basada en la ruta actual
  const getSelectedKey = () => {
    const path = location.pathname;
    if (path === '/') return '1';
    if (path === '/productos') return '2';
    if (path === '/dashboard') return '3';
    return '1';
  };

  // Opciones del menú de usuario
  const userMenuItems = [
    {
      key: '1',
      label: 'Perfil',
      icon: <UserOutlined />,
      onClick: () => console.log('Perfil'),
    },
    {
      key: '2',
      label: 'Cerrar sesión',
      icon: <LogoutOutlined />,
      onClick: () => logout(),
    },
  ];

  if (!user) {
    return null; // No renderizar nada si no hay usuario autenticado
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        theme="dark"
        width={250}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <Logo />
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[getSelectedKey()]}
          items={[
            {
              key: '1',
              icon: <RobotOutlined />,
              label: 'ChatBot',
              onClick: () => navigate('/'),
            },
            {
              key: '2',
              icon: <ShoppingCartOutlined />,
              label: 'Productos',
              onClick: () => navigate('/productos'),
            },
            {
              key: '3',
              icon: <DashboardOutlined />,
              label: 'Dashboard',
              onClick: () => navigate('/dashboard'),
            },
          ]}
        />
      </Sider>
      <Layout style={{ marginLeft: collapsed ? 80 : 250, transition: 'all 0.2s' }}>
        <Header style={{ 
          padding: '0 16px', 
          background: '#fff', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          boxShadow: '0 1px 4px rgba(0,21,41,.08)'
        }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: '16px', width: 64, height: 64 }}
          />
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Badge count={5} size="small">
              <Button type="text" icon={<BellOutlined />} style={{ fontSize: '16px' }} />
            </Badge>
            
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                <Avatar icon={<UserOutlined />} />
                <Text style={{ marginLeft: '8px' }}>{user?.name || 'Usuario'}</Text>
              </div>
            </Dropdown>
          </div>
        </Header>
        <Content style={{ 
          margin: '24px 16px', 
          padding: 24, 
          background: '#fff', 
          borderRadius: '4px',
          minHeight: 'auto' 
        }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;