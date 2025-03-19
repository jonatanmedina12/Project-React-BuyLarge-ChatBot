// src/pages/ChatbotPage.tsx
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Card, Input, Button, List, Avatar, Typography, Spin, message } from 'antd';
import { SendOutlined, RobotOutlined, UserOutlined } from '@ant-design/icons';
// Eliminamos la importación de axios
// import axios from 'axios';

const { Text } = Typography;

// Define environment variables in a centralized config
const API_CONFIG = {
  BASE_URL: 'https://api.whispererlab.com', // URL fija a producción
  ENDPOINTS: {
    CHATBOT: '/api/chatbot/'
  }
};

// Improved types definitions with proper documentation
/**
 * Represents a chat message in the conversation
 */
interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

/**
 * API response interface for type safety
 */
interface ChatbotResponse {
  response: string;
  session_id?: string;
  message_id?: number;
}

/**
 * Chatbot Page Component
 */
const ChatbotPage: React.FC = () => {
  // State management with descriptive names
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: '¡Hola! Soy el asistente virtual de Buy n Large. ¿En qué puedo ayudarte hoy? Puedes preguntarme sobre nuestros productos, inventario o precios.',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Create a unique session ID or use an existing one with proper type
  const [sessionId] = useState<string>(() => {
    const storedSessionId = localStorage.getItem('chatSessionId');
    return storedSessionId || Date.now().toString();
  });

  // Store sessionId in localStorage
  useEffect(() => {
    localStorage.setItem('chatSessionId', sessionId);
  }, [sessionId]);
  
  // Reference for automatic scrolling with proper typing
  const messagesEndRef = useRef<HTMLDivElement>(null);

  /**
   * Sends the user message to the API using fetch instead of axios
   */
  const sendMessage = useCallback(async () => {
    if (inputValue.trim() === '') return;
    
    // Create new user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };
    
    // Update messages state and reset input
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const chatbotUrl = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CHATBOT}`;
      console.log('Sending request to:', chatbotUrl); // Para debugging
      
      // Usar fetch en lugar de axios
      const response = await fetch(chatbotUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: userMessage.content,
          session_id: sessionId,
        })
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data: ChatbotResponse = await response.json();
      
      // Create bot response message
      const botMessage: Message = {
        id: data.message_id ? data.message_id.toString() : (Date.now() + 1).toString(),
        content: data.response,
        sender: 'bot',
        timestamp: new Date(),
      };
      
      // Add bot response
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error('Error communicating with chatbot:', error);
      
      // Show error message to user
      message.error('Error al comunicarse con el asistente virtual');
      
      // Error message in case of failure
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
  }, [inputValue, sessionId]);
  
  // Handle user input changes
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  }, []);
  
  // Handle submission with Enter key
  const handleKeyPress = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  }, [sendMessage]);
  
  // Automatic scrolling when receiving new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Styles as constants for better organization and reuse
  const styles = {
    chatContainer: { 
      maxWidth: '800px', 
      margin: '0 auto', 
      padding: '20px' 
    },
    cardTitle: { 
      display: 'flex', 
      alignItems: 'center' 
    },
    titleIcon: { 
      fontSize: '24px', 
      marginRight: '10px', 
      color: '#1890ff' 
    },
    card: { 
      width: '100%', 
      height: '70vh', 
      display: 'flex', 
      flexDirection: 'column' as const
    },
    cardBody: { 
      flex: 1, 
      display: 'flex', 
      flexDirection: 'column' as const, 
      padding: '10px', 
      overflow: 'hidden' 
    },
    messagesContainer: { 
      flex: 1, 
      overflowY: 'auto' as const, 
      padding: '10px',
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '8px',
      maxHeight: 'calc(70vh - 120px)'
    },
    messageList: { 
      overflowY: 'auto' as const, 
      maxHeight: '100%' 
    },
    inputContainer: { 
      marginTop: '10px', 
      display: 'flex', 
      gap: '10px' 
    }
  };
  
  // Message styling function for DRY principle
  const getMessageStyle = (sender: 'user' | 'bot') => ({
    maxWidth: '80%',
    backgroundColor: sender === 'user' ? '#e6f7ff' : '#f5f5f5',
    padding: '12px 16px',
    borderRadius: sender === 'user' ? '15px 15px 0 15px' : '15px 15px 15px 0',
    position: 'relative' as const,
    boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
  });

  const getAvatarStyle = (sender: 'user' | 'bot') => ({
    backgroundColor: sender === 'user' ? '#1890ff' : '#52c41a',
    marginRight: '8px'
  });
  
  return (
    <div className="chat-container" style={styles.chatContainer}>
      <Card 
        title={
          <div style={styles.cardTitle}>
            <RobotOutlined style={styles.titleIcon} />
            <span>Asistente Virtual de Buy n Large</span>
          </div>
        }
        bordered={true}
        style={styles.card}
        bodyStyle={styles.cardBody}
      >
        <div className="messages-container" style={styles.messagesContainer}>
          <List
            itemLayout="horizontal"
            dataSource={messages}
            style={styles.messageList}
            renderItem={(message) => (
              <List.Item
                style={{
                  padding: '8px',
                  display: 'flex',
                  justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                  border: 'none'
                }}
              >
                <div style={getMessageStyle(message.sender)}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                    <Avatar 
                      icon={message.sender === 'user' ? <UserOutlined /> : <RobotOutlined />} 
                      size="small"
                      style={getAvatarStyle(message.sender)}
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
        
        <div className="input-container" style={styles.inputContainer}>
          <Input
            placeholder="Escribe tu mensaje aquí..."
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            size="large"
            style={{ flex: 1 }}
            data-testid="chat-input"
          />
          <Button
            type="primary"
            icon={isLoading ? <Spin size="small" /> : <SendOutlined />}
            onClick={sendMessage}
            disabled={isLoading || inputValue.trim() === ''}
            size="large"
            data-testid="send-button"
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