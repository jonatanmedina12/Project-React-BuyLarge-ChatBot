// src/components/chatbot/ChatBot.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Input, Button, Spin, Avatar, Typography } from 'antd';
import { SendOutlined, RobotOutlined, UserOutlined } from '@ant-design/icons';

const { Text } = Typography;

// Definición de tipos para los mensajes
interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatBotProps {
  initialMessage?: string;
  placeholder?: string;
  onNewMessage?: (message: Message) => void;
}

const ChatBot: React.FC<ChatBotProps> = ({
  initialMessage = '¡Hola! Soy el asistente virtual de Buy n Large. ¿En qué puedo ayudarte hoy?',
  placeholder = 'Escribe tu mensaje aquí...',
  onNewMessage
}) => {
  // Estado para los mensajes, entrada del usuario y estado de carga
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: initialMessage,
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
    
    // Notificar al componente padre si es necesario
    if (onNewMessage) {
      onNewMessage(userMessage);
    }
    
    try {
      // En un caso real, aquí realizaríamos una llamada a la API del backend
      // const response = await axios.post('http://localhost:8000/api/chatbot/', {
      //   message: userMessage.content,
      // });
      
      // Para esta demo, simularemos respuestas
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simular diferentes respuestas según la consulta del usuario
      let botResponse = '';
      const lowerCaseMessage = userMessage.content.toLowerCase();
      
      if (lowerCaseMessage.includes('computadora') || lowerCaseMessage.includes('laptop')) {
        if (lowerCaseMessage.includes('cuántas') || lowerCaseMessage.includes('disponibles')) {
          botResponse = 'En este momento, tenemos 4 computadoras; 2 son HP, 1 es Dell y otra es Apple. ¿Cuál te gustaría conocer más a fondo?';
        } else if (lowerCaseMessage.includes('dell')) {
          botResponse = 'La laptop Dell Inspiron tiene un procesador Intel Core i3, 8GB de RAM, y 256GB de almacenamiento SSD. Su precio es de $749.99 y tenemos 8 unidades disponibles. ¿Te gustaría conocer más detalles?';
        } else if (lowerCaseMessage.includes('hp')) {
          botResponse = 'Las laptops HP Pavilion tienen procesadores Intel Core i5, 8GB de RAM, y 512GB de almacenamiento SSD. El precio es de $899.99 y tenemos 15 unidades disponibles. Son ideales para trabajo y estudios.';
        } else if (lowerCaseMessage.includes('apple') || lowerCaseMessage.includes('macbook')) {
          botResponse = 'El MacBook Air cuenta con el chip M1 de Apple, 8GB de RAM unificada y 256GB de almacenamiento SSD. Su precio es de $1099.99 y tenemos 5 unidades disponibles. Es ultra ligero y tiene una excelente duración de batería.';
        } else {
          botResponse = 'Tenemos varias computadoras disponibles de marcas como HP, Dell y Apple. ¿De cuál te gustaría saber más información?';
        }
      } else if (lowerCaseMessage.includes('teléfono') || lowerCaseMessage.includes('celular') || lowerCaseMessage.includes('smartphone')) {
        if (lowerCaseMessage.includes('samsung')) {
          botResponse = 'El Samsung Galaxy S22 cuenta con un procesador Snapdragon 8 Gen 1, 8GB de RAM y 128GB de almacenamiento. Su precio es de $799.99 y tenemos 20 unidades disponibles. Tiene una excelente cámara.';
        } else if (lowerCaseMessage.includes('iphone') || lowerCaseMessage.includes('apple')) {
          botResponse = 'El iPhone 14 viene con el chip A16 Bionic, 6GB de RAM y 128GB de almacenamiento. Su precio es de $899.99 y tenemos 12 unidades disponibles. Es uno de nuestros productos más vendidos.';
        } else {
          botResponse = 'Contamos con smartphones de Samsung y Apple. ¿De cuál marca te gustaría más información?';
        }
      } else if (lowerCaseMessage.includes('precio') || lowerCaseMessage.includes('costo') || lowerCaseMessage.includes('valor')) {
        botResponse = 'Los precios de nuestros productos varían según la categoría y marca. Por ejemplo, las laptops van desde $749.99 hasta $1099.99, y los smartphones desde $799.99 hasta $899.99. ¿De qué producto específico te gustaría saber el precio?';
      } else if (lowerCaseMessage.includes('hola') || lowerCaseMessage.includes('buenos días') || lowerCaseMessage.includes('buenas tardes')) {
        botResponse = '¡Hola! Soy el asistente virtual de Buy n Large. Estoy aquí para ayudarte con información sobre nuestros productos tecnológicos. ¿Qué te gustaría saber?';
      } else if (lowerCaseMessage.includes('gracias') || lowerCaseMessage.includes('thank')) {
        botResponse = '¡De nada! Estoy aquí para ayudarte. Si tienes más preguntas, no dudes en consultarme.';
      } else if (lowerCaseMessage.includes('stock') || lowerCaseMessage.includes('inventario') || lowerCaseMessage.includes('disponible')) {
        botResponse = 'Actualmente tenemos en stock: 28 computadoras, 32 teléfonos, 22 tablets y varios accesorios. ¿Te gustaría información sobre algún producto específico?';
      } else {
        botResponse = 'Gracias por tu consulta. Para darte la mejor información, ¿podrías especificar qué tipo de producto te interesa? Tenemos computadoras, teléfonos, tablets y accesorios.';
      }
      
      // Crear mensaje de respuesta del bot
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: botResponse,
        sender: 'bot',
        timestamp: new Date(),
      };
      
      // Agregar respuesta del bot
      setMessages((prevMessages) => [...prevMessages, botMessage]);
      
      // Notificar al componente padre si es necesario
      if (onNewMessage) {
        onNewMessage(botMessage);
      }
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
      
      // Notificar al componente padre si es necesario
      if (onNewMessage) {
        onNewMessage(errorMessage);
      }
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
    <div className="chat-container">
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
        {messages.map((message) => (
          <div
            key={message.id}
            style={{
              display: 'flex',
              justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
              marginBottom: '12px'
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
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="input-container" style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
        <Input
          placeholder={placeholder}
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
    </div>
  );
};

export default ChatBot;