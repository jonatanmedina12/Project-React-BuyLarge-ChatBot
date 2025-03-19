// src/pages/ProductsPage.tsx
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  List, 
  Tag, 
  Typography, 
  Rate, 
  Button, 
  Tabs, 
  Image, 
  Skeleton, 
  Input,
  Empty,
  notification
} from 'antd';
import { 
  ShoppingCartOutlined, 
  HeartOutlined, 
  HeartFilled,
  SearchOutlined,
  ThunderboltOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';
import axios from 'axios';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { Search } = Input;

// API Base URL - Debe coincidir con tu backend de Django
const API_BASE_URL = 'https://api.whispererlab.com';

// Definición de interfaces para la API
interface ProductSpecification {
  id: number;
  key: string;
  value: string;
}

interface ProductFromAPI {
  id: number;
  name: string;
  description: string;
  price: string; // Viene como string de la API
  stock: number;
  image: string | null;
  category: number;
  category_name: string;
  brand: number;
  brand_name: string;
  specifications: ProductSpecification[];
  created_at: string;
  updated_at: string;
}

// Definición para uso interno en el componente
interface Product {
  id: number;
  name: string;
  brand: string;
  category: string;
  price: number;
  stock: number;
  image: string;
  description: string;
  specifications: Record<string, string>;
  rating: number; // Este dato lo simulamos por ahora
  recommendation: 'high' | 'medium' | 'low'; // Este dato lo simulamos por ahora
}

const ProductsPage: React.FC = () => {
  // Estados
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Cargar productos desde la API de Django
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // Updated URL to match the actual endpoint structure
        const productsUrl = `${API_BASE_URL}/api/products/products/`;
        console.log(`Fetching products from: ${productsUrl}`);
        
        // API call with updated URL
        const response = await axios.get(productsUrl);
        
        console.log('Products API response:', response.data);
        
        // Rest of the function remains the same
        const processedProducts: Product[] = response.data.map((item: ProductFromAPI) => {
          // Convertir especificaciones a formato de registro
          const specs: Record<string, string> = {};
          item.specifications.forEach(spec => {
            specs[spec.key.toLowerCase()] = spec.value;
          });
          
          // Determinar recomendación basada en stock
          let recommendation: 'high' | 'medium' | 'low' = 'medium';
          if (item.stock > 10) {
            recommendation = 'high';
          } else if (item.stock < 3) {
            recommendation = 'low';
          }
          
          // Generar un rating simulado entre 3 y 5
          const rating = (3 + Math.random() * 2);
          
          return {
            id: item.id,
            name: item.name,
            brand: item.brand_name,
            category: item.category_name,
            price: parseFloat(item.price),
            stock: item.stock,
            image: item.image ? item.image : 'https://via.placeholder.com/300x200?text=Sin+Imagen',
            description: item.description,
            specifications: specs,
            rating: rating,
            recommendation: recommendation
          };
        });
        
        setAllProducts(processedProducts);
        setFilteredProducts(processedProducts);
        
        // Recuperar favoritos del almacenamiento local
        const savedFavorites = localStorage.getItem('favorites');
        if (savedFavorites) {
          setFavorites(JSON.parse(savedFavorites));
        }
      } catch (error) {
        console.error('Error al cargar productos:', error);
        if (axios.isAxiosError(error)) {
          console.error('URL:', error.config?.url);
          console.error('Status:', error.response?.status);
          console.error('Status Text:', error.response?.statusText);
          console.error('Response Data:', error.response?.data);
        }
        
        notification.error({
          message: 'Error',
          description: 'No se pudieron cargar los productos desde el servidor. Por favor, intenta de nuevo más tarde.'
        });
        // Cargar datos de ejemplo en caso de error
        loadMockProducts();
      } finally {
        setLoading(false);
      }
    };
  
    
    fetchProducts();
  }, []);
  
  // Función para cargar datos de ejemplo en caso de error
  const loadMockProducts = () => {
    const mockProducts: Product[] = [
      {
        id: 1,
        name: "Laptop HP Pavilion",
        brand: "HP",
        category: "Computadoras",
        price: 899.99,
        stock: 15,
        image: "https://via.placeholder.com/300x200",
        description: "Laptop potente para trabajo y estudios con procesador i5.",
        specifications: {
          processor: "Intel Core i5",
          ram: "8GB",
          storage: "512GB SSD",
          screen: "15.6 pulgadas"
        },
        rating: 4.2,
        recommendation: 'high'
      },
      // Más productos de ejemplo...
    ];
    
    setAllProducts(mockProducts);
    setFilteredProducts(mockProducts);
  };
  
  // Filtrar productos según la búsqueda
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    if (!value.trim()) {
      setFilteredProducts(allProducts);
      return;
    }
    
    const filtered = allProducts.filter(product => 
      product.name.toLowerCase().includes(value.toLowerCase()) ||
      product.brand.toLowerCase().includes(value.toLowerCase()) ||
      product.category.toLowerCase().includes(value.toLowerCase()) ||
      product.description.toLowerCase().includes(value.toLowerCase())
    );
    
    setFilteredProducts(filtered);
  };
  
  // Gestionar favoritos
  const toggleFavorite = (productId: number) => {
    let newFavorites;
    if (favorites.includes(productId)) {
      newFavorites = favorites.filter(id => id !== productId);
    } else {
      newFavorites = [...favorites, productId];
    }
    
    setFavorites(newFavorites);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
  };
  
  // Obtener productos por recomendación
  const getProductsByRecommendation = (level: 'high' | 'medium' | 'low') => {
    return filteredProducts.filter(product => product.recommendation === level);
  };
  
  // Renderizar tag de stock
  const renderStockTag = (stock: number) => {
    if (stock > 10) {
      return <Tag color="success">En stock</Tag>;
    } else if (stock > 0) {
      return <Tag color="warning">Pocas unidades</Tag>;
    } else {
      return <Tag color="error">Agotado</Tag>;
    }
  };

  // Renderizar producto individual
  const renderProductItem = (product: Product) => {
    const isFavorite = favorites.includes(product.id);
    
    return (
      <List.Item key={product.id}>
        <Card
          hoverable
          style={{ width: '100%' }}
          cover={
            loading ? (
              <Skeleton.Image style={{ width: '100%', height: 200 }} active />
            ) : (
              <div style={{ overflow: 'hidden', height: '200px' }}>
                <Image
                  alt={product.name}
                  src={product.image}
                  style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                  fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj"
                />
              </div>
            )
          }
          actions={[
            <Rate key="rate" defaultValue={product.rating} disabled allowHalf />,
            <Button 
              key="add-to-cart" 
              type="primary" 
              icon={<ShoppingCartOutlined />}
              shape="circle" 
            />,
            <Button
              key="favorite"
              type="text"
              icon={isFavorite ? <HeartFilled style={{ color: '#ff4d4f' }} /> : <HeartOutlined />}
              onClick={() => toggleFavorite(product.id)}
              shape="circle"
            />
          ]}
        >
          <Skeleton loading={loading} active>
            <Card.Meta
              title={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <Text strong style={{ fontSize: '16px' }}>{product.name}</Text>
                  <Text type="danger" strong>${product.price.toFixed(2)}</Text>
                </div>
              }
              description={
                <>
                  <Paragraph ellipsis={{ rows: 2 }}>{product.description}</Paragraph>
                  <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'space-between' }}>
                    <Tag color="blue">{product.brand}</Tag>
                    <Tag color="purple">{product.category}</Tag>
                    {renderStockTag(product.stock)}
                  </div>
                </>
              }
            />
          </Skeleton>
        </Card>
      </List.Item>
    );
  };

  // Renderizar icono de recomendación
  const getRecommendationIcon = (level: string) => {
    switch (level) {
      case 'high':
        return <ThunderboltOutlined />;
      case 'medium':
        return <CheckCircleOutlined />;
      case 'low':
        return <CloseCircleOutlined />;
      default:
        return null;
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <Title level={2}>Catálogo de Productos</Title>
        <Search
          placeholder="Buscar productos..."
          allowClear
          enterButton={<SearchOutlined />}
          size="large"
          onSearch={handleSearch}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ width: 300 }}
        />
      </div>

      <Tabs defaultActiveKey="all">
        <TabPane 
          tab={
            <span>
              <ThunderboltOutlined />
              Altamente Recomendado
            </span>
          } 
          key="highly"
        >
          <List
            grid={{ gutter: 16, xs: 1, sm: 2, md: 2, lg: 3, xl: 4, xxl: 4 }}
            dataSource={getProductsByRecommendation('high')}
            renderItem={renderProductItem}
            locale={{ emptyText: <Empty description="No hay productos altamente recomendados" /> }}
          />
        </TabPane>

        <TabPane 
          tab={
            <span>
              <CheckCircleOutlined />
              Recomendado
            </span>
          } 
          key="recommended"
        >
          <List
            grid={{ gutter: 16, xs: 1, sm: 2, md: 2, lg: 3, xl: 4, xxl: 4 }}
            dataSource={getProductsByRecommendation('medium')}
            renderItem={renderProductItem}
            locale={{ emptyText: <Empty description="No hay productos recomendados" /> }}
          />
        </TabPane>

        <TabPane 
          tab={
            <span>
              <CloseCircleOutlined />
              No Recomendado
            </span>
          }
          key="not-recommended"
        >
          <List
            grid={{ gutter: 16, xs: 1, sm: 2, md: 2, lg: 3, xl: 4, xxl: 4 }}
            dataSource={getProductsByRecommendation('low')}
            renderItem={renderProductItem}
            locale={{ emptyText: <Empty description="No hay productos no recomendados" /> }}
          />
        </TabPane>

        <TabPane tab="Todos los Productos" key="all">
          <List
            grid={{ gutter: 16, xs: 1, sm: 2, md: 2, lg: 3, xl: 4, xxl: 4 }}
            dataSource={filteredProducts}
            renderItem={renderProductItem}
            locale={{ emptyText: <Empty description="No se encontraron productos" /> }}
          />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default ProductsPage;