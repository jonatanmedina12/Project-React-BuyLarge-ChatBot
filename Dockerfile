FROM node:16-alpine

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar archivos de paquetes primero para mejor caché
COPY package*.json ./

# Instalar dependencias con --legacy-peer-deps para evitar problemas de compatibilidad
RUN npm install --legacy-peer-deps
RUN npm install ajv@8.12.0 ajv-keywords@5.1.0 
RUN npm install react-router-dom@6.22.0 
RUN npm install axios@1.0.0 
RUN npm install recharts@2.12.2 --legacy-peer-deps
RUN npm install @ant-design/icons@5.2.6 - --legacy-peer-deps
# Copiar el resto del proyecto
COPY . .

# Exponer puerto para la aplicación React
EXPOSE 3000

# Iniciar la aplicación React
CMD ["npm", "start"]