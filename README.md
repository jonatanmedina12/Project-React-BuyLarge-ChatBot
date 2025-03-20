# Buy n Large - Aplicación Web Responsive

Este repositorio contiene una aplicación web responsive desarrollada con React, TypeScript y Ant Design. La aplicación incluye un dashboard de administración, un catálogo de productos y un chatbot virtual.

## Características

- 📱 Diseño completamente responsive (móvil, tablet, escritorio)
- 🤖 Chatbot virtual interactivo
- 📊 Dashboard con visualización de datos
- 🛍️ Catálogo de productos con filtros y búsqueda
- 🔍 Funcionalidad de búsqueda en tiempo real
- 🎨 Interfaz moderna con Ant Design
- 📝 Desarrollado con TypeScript para mayor seguridad de tipos

## Tecnologías Utilizadas

- React 18
- TypeScript
- Ant Design 5
- React Router 6
- Recharts (para visualizaciones)
- CSS Modules
- Axios

## Estructura del Proyecto

```
src/
├── components/
│   ├── chatbot/
│   │   ├── ChatBot.tsx
│   │   ├── ChatBot.module.css
│   │   └── ChatBot.styles.ts
│   └── layout/
│       ├── ResponsiveLayout.tsx
│       └── ResponsiveLayout.css
├── pages/
│   ├── ChatbotPage.tsx
│   ├── ChatbotPage.css
│   ├── DashboardPage.tsx
│   ├── ProductsPage.tsx
│   └── NotFoundPage.tsx
├── services/
│   └── ConversationService.ts
├── App.tsx
├── App.css
└── index.tsx
```

## Instalación

1. Clona este repositorio:
   ```bash
   git clone https://github.com/tu-usuario/buy-n-large-app.git
   cd buy-n-large-app
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Inicia el servidor de desarrollo:
   ```bash
   npm start
   ```

4. Abre http://localhost:3000 en tu navegador.

## Scripts Disponibles

- `npm start` - Inicia el servidor de desarrollo
- `npm test` - Ejecuta las pruebas
- `npm run build` - Compila la aplicación para producción
- `npm run lint` - Ejecuta ESLint para verificar el código

## Componentes Principales

### ResponsiveLayout

El componente `ResponsiveLayout` proporciona un diseño adaptable para toda la aplicación. Incluye:

- Menú lateral colapsable para escritorio
- Menú de cajón para dispositivos móviles
- Cabecera con opciones de usuario
- Área de contenido principal

### ChatBot

El componente `ChatBot` implementa una interfaz de chat interactiva con las siguientes características:

- Mensajes con diferentes estilos para usuario y bot
- Historial de conversación persistente
- Indicador de carga durante la comunicación con el servidor
- Diseño responsive para diferentes tamaños de pantalla

### Páginas

- `DashboardPage`: Muestra gráficos y estadísticas de inventario y ventas
- `ProductsPage`: Catálogo de productos con filtros y búsqueda
- `ChatbotPage`: Interfaz de chat con el asistente virtual
- `NotFoundPage`: Página 404 para rutas no encontradas

## API y Servicios

La aplicación se comunica con una API backend a través de varios servicios:

- `ConversationService`: Gestiona la comunicación con el chatbot
- `ProductService`: Obtiene información de productos (no incluido en este ejemplo)
- `AnalyticsService`: Obtiene datos para el dashboard (no incluido en este ejemplo)

## Estilos Responsive

El diseño responsive se implementa a través de:

- CSS Modules para componentes específicos
- Media queries para adaptarse a diferentes tamaños de pantalla
- Flexbox y Grid para layouts flexibles
- Variables CSS para mantener consistencia en colores y espaciados

## Consideraciones para Móviles

- Menú de navegación adaptado para pantallas pequeñas
- Ajustes de tamaño de fuente y espaciado para mejor legibilidad
- Interfaces de usuario optimizadas para interacción táctil
- Dirección de flexbox ajustada para vistas en columna en móviles

## Mejores Prácticas Implementadas

- Componentes tipados con TypeScript
- Estilos modulares y reutilizables
- Separación de lógica y presentación
- Gestión eficiente de estados
- Comentarios JSDoc para documentación
- Código limpio y bien organizado

