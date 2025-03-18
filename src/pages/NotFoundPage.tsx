// src/pages/NotFoundPage.tsx
import React from 'react';
import { Result, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center'
    }}>
      <Result
        status="404"
        title="404"
        subTitle="Lo sentimos, la página que estás buscando no existe."
        extra={
          <Button type="primary" onClick={() => navigate('/')}>
            Volver al inicio
          </Button>
        }
      />
    </div>
  );
};

export default NotFoundPage;