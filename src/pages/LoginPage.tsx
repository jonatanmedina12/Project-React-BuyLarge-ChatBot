// src/pages/LoginPage.tsx
import React, { useState } from 'react';
import { 
  Form, 
  Input, 
  Button, 
  Card, 
  Typography, 
  Alert, 
  Divider, 
  notification
} from 'antd';
import { 
  UserOutlined, 
  LockOutlined, 
  ShoppingCartOutlined,
  RobotOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const { Title, Text } = Typography;

const LoginPage: React.FC = () => {
  const { login, error, isLoading } = useAuth();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loginError, setLoginError] = useState<string | null>(null);

  // Manejar el envío del formulario
  const handleSubmit = async (values: { email: string; password: string }) => {
    setLoginError(null);
    
    try {
      const success = await login(values.email, values.password);
      if (success) {
        notification.success({
          message: 'Inicio de sesión exitoso',
          description: 'Bienvenido al sistema Buy n Large.',
        });
        navigate('/');
      } else {
        setLoginError('Credenciales incorrectas. Por favor, intenta de nuevo.');
      }
    } catch (err) {
      console.error('Error en inicio de sesión:', err);
      setLoginError('Error al iniciar sesión. Por favor, intenta de nuevo más tarde.');
    }
  };

  // Para propósitos de demostración - inicio rápido como usuario de prueba
  const loginAsDemo = async (role: 'admin' | 'user') => {
    const credentials = role === 'admin' 
      ? { email: 'admin@buynlarge.com', password: 'admin123' }
      : { email: 'user@buynlarge.com', password: 'user123' };
    
    try {
      const success = await login(credentials.email, credentials.password);
      if (success) {
        notification.success({
          message: 'Inicio de sesión exitoso',
          description: `Has ingresado como ${role === 'admin' ? 'administrador' : 'usuario'} de demostración.`,
        });
        navigate('/');
      }
    } catch (err) {
      console.error('Error en inicio de sesión demo:', err);
    }
  };

  return (
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      background: 'linear-gradient(135deg, #1890ff 0%, #722ed1 100%)'
    }}>
      <Card 
        style={{ 
          width: 400, 
          borderRadius: '8px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ fontSize: '48px', margin: '16px 0' }}>
            <ShoppingCartOutlined style={{ color: '#1890ff' }} />
          </div>
          <Title level={2} style={{ margin: 0 }}>Buy n Large</Title>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '8px' }}>
            <RobotOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
            <Text type="secondary">Sistema de ChatBot Inteligente</Text>
          </div>
        </div>

        {(loginError || error) && (
          <Alert 
            message="Error de autenticación" 
            description={loginError || error} 
            type="error" 
            showIcon 
            style={{ marginBottom: '16px' }}
          />
        )}

        <Form
          form={form}
          name="login"
          initialValues={{ remember: true }}
          onFinish={handleSubmit}
          layout="vertical"
        >
          <Form.Item
            name="email"
            rules={[{ required: true, message: 'Por favor ingresa tu correo electrónico' }]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="Correo electrónico" 
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Por favor ingresa tu contraseña' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Contraseña"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={isLoading}
              block
              size="large"
            >
              Iniciar Sesión
            </Button>
          </Form.Item>
        </Form>

        <Divider>Acceso rápido para demostración</Divider>

        <div style={{ display: 'flex', gap: '8px' }}>
          <Button 
            onClick={() => loginAsDemo('admin')} 
            block
            type="default"
          >
            Administrador
          </Button>
          <Button 
            onClick={() => loginAsDemo('user')} 
            block
            type="default"
          >
            Usuario
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;