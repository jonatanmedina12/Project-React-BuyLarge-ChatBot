// src/services/ConversationService.ts

// API base URL - ASEGURAR QUE SE USA LA URL CORRECTA
const API_BASE_URL = 'https://api.whispererlab.com';

// Interfaces para tipado
export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface APIMessage {
  id: number;
  content: string;
  sender: 'user' | 'bot';
  timestamp: string;
}

interface ConversationResponse {
  id: number;
  session_id: string;
  messages: APIMessage[];
  created_at: string;
}

/**
 * Servicio para gestionar las conversaciones del chatbot
 */
export class ConversationService {
  /**
   * Obtiene el historial de mensajes para un ID de sesión específico
   */
  static async getConversationHistory(sessionId: string): Promise<Message[]> {
    try {
      const url = `${API_BASE_URL}/api/chatbot/conversations/${sessionId}/`;
      console.log('Fetching history from:', url); // Para debugging
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data && data.messages) {
        // Transformar los mensajes de la API al formato requerido por la UI
        return data.messages.map((msg: APIMessage) => ({
          id: msg.id.toString(),
          content: msg.content,
          sender: msg.sender,
          timestamp: new Date(msg.timestamp)
        }));
      }
      
      return [];
    } catch (error) {
      console.error('Error al obtener el historial de conversación:', error);
      return [];
    }
  }

  /**
   * Envía un mensaje al chatbot y retorna la respuesta
   */
  static async sendMessage(message: string, sessionId: string): Promise<Message | null> {
    try {
      const url = `${API_BASE_URL}/api/chatbot/`;
      console.log('Sending message to:', url); // Para debugging
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message,
          session_id: sessionId
        })
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data && data.response) {
        return {
          id: data.message_id ? data.message_id.toString() : Date.now().toString(),
          content: data.response,
          sender: 'bot',
          timestamp: new Date()
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error al enviar mensaje al chatbot:', error);
      throw error;
    }
  }

  /**
   * Crea o recupera un ID de sesión
   */
  static getOrCreateSessionId(): string {
    let sessionId = localStorage.getItem('chatSessionId');
    
    if (!sessionId) {
      sessionId = Date.now().toString();
      localStorage.setItem('chatSessionId', sessionId);
    }
    
    return sessionId;
  }
}

export default ConversationService;