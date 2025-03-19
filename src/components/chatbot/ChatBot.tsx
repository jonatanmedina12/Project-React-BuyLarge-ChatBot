// src/components/chatbot/ChatBot.tsx
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Input, Button, Spin, Avatar, Typography, message } from 'antd';
import { SendOutlined, RobotOutlined, UserOutlined } from '@ant-design/icons';
import ConversationService, { Message } from '../services/ConversationService';

const { Text } = Typography;

/**
 * Props interface for the ChatBot component
 */
interface ChatBotProps {
  /** Initial greeting message shown to the user */
  initialMessage?: string;
  /** Placeholder text for the input field */
  placeholder?: string;
  /** Callback that fires when a new message is added to the conversation */
  onNewMessage?: (message: Message) => void;
  /** Custom class name for the container */
  className?: string;
  /** Maximum height for the messages container */
  maxHeight?: number;
  /** Minimum height for the messages container */
  minHeight?: number;
}

/**
 * ChatBot component that integrates with Django backend and manages conversations
 * 
 * @param props - Component props
 * @returns React component
 */
const ChatBot: React.FC<ChatBotProps> = ({
  initialMessage = '¡Hola! Soy el asistente virtual de Buy n Large. ¿En qué puedo ayudarte hoy?',
  placeholder = 'Escribe tu mensaje aquí...',
  onNewMessage,
  className = '',
  maxHeight = 500,
  minHeight = 300
}) => {
  // State management with proper typing
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFetchingHistory, setIsFetchingHistory] = useState<boolean>(true);
  
  // Create or retrieve session ID
  const [sessionId] = useState<string>(
    ConversationService.getOrCreateSessionId()
  );

  // Reference for automatic scrolling
  const messagesEndRef = useRef<HTMLDivElement>(null);

  /**
   * Creates the initial welcome message
   * @returns Initial bot message
   */
  const createInitialMessage = useCallback((): Message => {
    return {
      id: '1',
      content: initialMessage,
      sender: 'bot',
      timestamp: new Date()
    };
  }, [initialMessage]);

  /**
   * Load conversation history from the service
   */
  useEffect(() => {
    let isMounted = true;

    async function loadConversationHistory(): Promise<void> {
      if (!isMounted) return;
      
      setIsFetchingHistory(true);
      try {
        const history = await ConversationService.getConversationHistory(sessionId);
        
        if (isMounted) {
          if (history && history.length > 0) {
            setMessages(history);
          } else {
            // If no history exists, show initial message
            setMessages([createInitialMessage()]);
          }
        }
      } catch (error) {
        console.error('Error loading conversation history:', error);
        
        if (isMounted) {
          // Show initial message if there's an error
          setMessages([createInitialMessage()]);
          message.error('No se pudo cargar el historial de conversación');
        }
      } finally {
        if (isMounted) {
          setIsFetchingHistory(false);
        }
      }
    }
    
    loadConversationHistory();

    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false;
    };
  }, [sessionId, createInitialMessage]);

  /**
   * Sends the user message to the backend for ChatGPT processing
   */
  const sendMessage = useCallback(async (): Promise<void> => {
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
    
    // Notify parent component if needed
    onNewMessage?.(userMessage);
    
    try {
      // Send message through the service
      const botResponse = await ConversationService.sendMessage(userMessage.content, sessionId);
      
      if (botResponse) {
        // Add bot response
        setMessages((prevMessages) => [...prevMessages, botResponse]);
        
        // Notify parent component if needed
        onNewMessage?.(botResponse);
      } else {
        throw new Error('No se recibió respuesta del chatbot');
      }
    } catch (error) {
      console.error('Error communicating with chatbot:', error);
      
      // Error message in case of failure
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Lo siento, tuve un problema para procesar tu consulta. Por favor, intenta de nuevo más tarde.',
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
      
      // Notify parent component if needed
      onNewMessage?.(errorMessage);
      
      message.error('Error al comunicarse con el chatbot');
    } finally {
      setIsLoading(false);
    }
  }, [inputValue, sessionId, onNewMessage]);
  
  /**
   * Handle user input changes
   */
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>): void => {
    setInputValue(e.target.value);
  }, []);
  
  /**
   * Handle submission with Enter key
   */
  const handleKeyPress = useCallback((e: React.KeyboardEvent<HTMLInputElement>): void => {
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
      display: 'flex',
      flexDirection: 'column' as const,
      height: '100%'
    },
    messagesContainer: { 
      flex: 1, 
      overflowY: 'auto' as const, 
      padding: '10px',
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '8px',
      minHeight: `${minHeight}px`, 
      maxHeight: `${maxHeight}px`
    },
    loadingContainer: {
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100%'
    },
    messageWrapper: (sender: 'user' | 'bot') => ({
      display: 'flex',
      justifyContent: sender === 'user' ? 'flex-end' : 'flex-start',
      marginBottom: '12px'
    }),
    messageBox: (sender: 'user' | 'bot') => ({
      maxWidth: '80%',
      backgroundColor: sender === 'user' ? '#e6f7ff' : '#f5f5f5',
      padding: '12px 16px',
      borderRadius: sender === 'user' ? '15px 15px 0 15px' : '15px 15px 15px 0',
      position: 'relative' as const,
      boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
    }),
    messageHeader: {
      display: 'flex', 
      alignItems: 'center', 
      marginBottom: '4px'
    },
    avatar: (sender: 'user' | 'bot') => ({ 
      backgroundColor: sender === 'user' ? '#1890ff' : '#52c41a',
      marginRight: '8px'
    }),
    messageContent: {
      whiteSpace: 'pre-line' as const
    },
    timestamp: {
      fontSize: '12px', 
      display: 'block', 
      marginTop: '4px'
    },
    inputContainer: {
      marginTop: '10px', 
      display: 'flex', 
      gap: '10px'
    }
  };
  
  return (
    <div className={`chat-container ${className}`} style={styles.chatContainer} data-testid="chat-container">
      <div 
        className="messages-container"
        style={styles.messagesContainer}
        data-testid="messages-container"
      >
        {isFetchingHistory ? (
          <div style={styles.loadingContainer}>
            <Spin tip="Cargando conversación..." />
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              style={styles.messageWrapper(message.sender)}
              data-testid={`message-${message.id}`}
            >
              <div style={styles.messageBox(message.sender)}>
                <div style={styles.messageHeader}>
                  <Avatar 
                    icon={message.sender === 'user' ? <UserOutlined /> : <RobotOutlined />} 
                    size="small"
                    style={styles.avatar(message.sender)}
                  />
                  <Text strong style={{ fontSize: '14px' }}>
                    {message.sender === 'user' ? 'Tú' : 'Asistente BnL'}
                  </Text>
                </div>
                <div style={styles.messageContent}>{message.content}</div>
                <Text type="secondary" style={styles.timestamp}>
                  {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="input-container" style={styles.inputContainer}>
        <Input
          placeholder={placeholder}
          value={inputValue}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          disabled={isLoading || isFetchingHistory}
          size="large"
          style={{ flex: 1 }}
          data-testid="chat-input"
          aria-label="Message input"
        />
        <Button
          type="primary"
          icon={isLoading ? <Spin size="small" /> : <SendOutlined />}
          onClick={sendMessage}
          disabled={isLoading || inputValue.trim() === '' || isFetchingHistory}
          size="large"
          data-testid="send-button"
          aria-label="Send message"
        >
          Enviar
        </Button>
      </div>
    </div>
  );
};

export default ChatBot;