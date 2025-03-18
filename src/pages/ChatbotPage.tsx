// src/pages/ChatbotPage.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Card, Input, Button, List, Avatar, Typography, Spin } from 'antd';
import { SendOutlined, RobotOutlined, UserOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Text } = Typography;

// Definición de tipos para los mensajes
interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

// Componente principal del chatbot
const ChatbotPage: React.FC = () => {
  // Estado para los mensajes, entrada del usuario y estado de carga
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: '¡Hola! Soy el asistente virtual de Buy n Large. ¿En qué puedo ayudarte hoy? Puedes preguntarme sobre nuestros productos, inventario o precios.',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Referencia para hacer scroll automático
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Función para enviar mensajes al backend
  const sendMessage = async () => {
    if (inputValue.trim() === '') return;
    
    // Crear nuevo mensaje del usuario
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };
    
    // Actualizar estado de mensajes
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputValue('');
    setIsLoading(true);
    
    try {
      // Llamada a la API del backend (Django)
      const response = await axios.post('http://localhost:8000/api/chatbot/', {
        message: userMessage.content,
      });
      
      // Crear mensaje de respuesta del bot
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.data.response,
        sender: 'bot',
        timestamp: new Date(),
      };
      
      // Agregar respuesta del bot
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error('Error al comunicarse con el chatbot:', error);
      
      // Mensaje de error en caso de fallo
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Lo siento, tuve un problema para procesar tu consulta. Por favor, intenta de nuevo más tarde.',
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Manejar entrada del usuario
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };
  
  // Manejar envío con Enter
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };
  
  // Scroll automático al recibir nuevos mensajes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  return (
    <div className="chat-container" style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <Card 
        title={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <RobotOutlined style={{ fontSize: '24px', marginRight: '10px', color: '#1890ff' }} />
            <span>Asistente Virtual de Buy n Large</span>
          </div>
        }
        bordered={true}
        style={{ width: '100%', height: '70vh', display: 'flex', flexDirection: 'column' }}
        bodyStyle={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '10px' }}
      >
        <div 
          className="messages-container"
          style={{ 
            flex: 1, 
            overflowY: 'auto', 
            padding: '10px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}
        >
          <List
            itemLayout="horizontal"
            dataSource={messages}
            renderItem={(message) => (
              <List.Item
                style={{
                  padding: '8px',
                  display: 'flex',
                  justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                  border: 'none'
                }}
              >
                <div
                  style={{
                    maxWidth: '80%',
                    backgroundColor: message.sender === 'user' ? '#e6f7ff' : '#f5f5f5',
                    padding: '12px 16px',
                    borderRadius: message.sender === 'user' ? '15px 15px 0 15px' : '15px 15px 15px 0',
                    position: 'relative',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                    <Avatar 
                      icon={message.sender === 'user' ? <UserOutlined /> : <RobotOutlined />} 
                      size="small"
                      style={{ 
                        backgroundColor: message.sender === 'user' ? '#1890ff' : '#52c41a',
                        marginRight: '8px'
                      }}
                    />
                    <Text strong style={{ fontSize: '14px' }}>
                      {message.sender === 'user' ? 'Tú' : 'Asistente BnL'}
                    </Text>
                  </div>
                  <div>{message.content}</div>
                  <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginTop: '4px' }}>
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </div>
              </List.Item>
            )}
          />
          <div ref={messagesEndRef} />
        </div>
        
        <div className="input-container" style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
          <Input
            placeholder="Escribe tu mensaje aquí..."
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            size="large"
            style={{ flex: 1 }}
          />
          <Button
            type="primary"
            icon={isLoading ? <Spin size="small" /> : <SendOutlined />}
            onClick={sendMessage}
            disabled={isLoading || inputValue.trim() === ''}
            size="large"
          >
            Enviar
          </Button>
        </div>
      </Card>
      
      <Card 
        style={{ marginTop: '20px' }}
        size="small"
        title="Ejemplos de preguntas"
      >
        <ul style={{ paddingLeft: '20px' }}>
          <li>¿Cuántas computadoras hay disponibles actualmente?</li>
          <li>¿Cuáles son los precios de los teléfonos móviles?</li>
          <li>¿Qué características tiene la laptop HP?</li>
          <li>Estoy buscando auriculares inalámbricos</li>
        </ul>
      </Card>
    </div>
  );
};

export default ChatbotPage;