// src/context/AuthContext.tsx
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

// Tipo para el usuario
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

// Tipo para el contexto de autenticación
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}

// Crear el contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Props para el proveedor de autenticación
interface AuthProviderProps {
  children: ReactNode;
}

// Componente proveedor
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Comprobar si hay un usuario en localStorage al cargar
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // Función de inicio de sesión
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {

      
      // Simulación de inicio de sesión para esta prueba
      if (email === 'admin@buynlarge.com' && password === 'admin123') {
        const userData: User = {
          id: '1',
          name: 'Administrador',
          email: 'admin@buynlarge.com',
          role: 'admin'
        };
        
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        setIsLoading(false);
        return true;
      } else if (email === 'user@buynlarge.com' && password === 'user123') {
        const userData: User = {
          id: '2',
          name: 'Usuario',
          email: 'user@buynlarge.com',
          role: 'user'
        };
        
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        setIsLoading(false);
        return true;
      } else {
        setError('Credenciales incorrectas');
        setIsLoading(false);
        return false;
      }
    } catch (err) {
      console.error('Error de inicio de sesión:', err);
      setError('Error al iniciar sesión. Por favor, intenta de nuevo.');
      setIsLoading(false);
      return false;
    }
  };

  // Función de cierre de sesión
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // Valores del contexto
  const value = {
    user,
    login,
    logout,
    isLoading,
    error
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook personalizado para usar el contexto
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};