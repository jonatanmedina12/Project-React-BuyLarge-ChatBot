import axios from 'axios';

// Resetear cualquier configuración global que pudiera existir
axios.defaults.baseURL = undefined;

// Configurar correctamente la URL base para las peticiones
export const configureAxios = () => {
  // Asegurarnos de que no hay una baseURL configurada globalmente
  if (axios.defaults.baseURL) {
    console.warn('Se detectó una baseURL global en axios:', axios.defaults.baseURL);
    console.warn('Reseteando a undefined para evitar redirecciones no deseadas');
    axios.defaults.baseURL = undefined;
  }
  
  // Configurar un interceptor para loguear y depurar las peticiones
  axios.interceptors.request.use(
    (config) => {
      console.log('Axios Request:', {
        url: config.url,
        method: config.method,
        baseURL: config.baseURL
      });
      return config;
    },
    (error) => {
      console.error('Axios Request Error:', error);
      return Promise.reject(error);
    }
  );
  
  // Interceptor para depurar respuestas
  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      console.error('Axios Response Error:', {
        error,
        config: error.config
      });
      return Promise.reject(error);
    }
  );
};

export default axios;