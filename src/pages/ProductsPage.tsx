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

// Definición de tipos para los productos
interface Product {
  id: number;
  name: string;
  brand: string;
  category: string;
  price: number;
  stock: number;
  image: string;
  description: string;
  specifications: Record<string, string | number>;
  rating: number;
  recommendation: 'high' | 'medium' | 'low';
}

const ProductsPage: React.FC = () => {
  // Estados
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Datos de ejemplo (en un proyecto real, estos vendrían de la API de Django)
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // En una implementación real, esta sería la llamada a la API
        // const response = await axios.get('http://localhost:8000/api/products/');
        // setAllProducts(response.data);
        
        // Datos de ejemplo para la prueba
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
          {
            id: 2,
            name: "Laptop Dell Inspiron",
            brand: "Dell",
            category: "Computadoras",
            price: 749.99,
            stock: 8,
            image: "https://via.placeholder.com/300x200",
            description: "Laptop versátil con buen rendimiento y diseño elegante.",
            specifications: {
              processor: "Intel Core i3",
              ram: "8GB",
              storage: "256GB SSD",
              screen: "14 pulgadas"
            },
            rating: 3.9,
            recommendation: 'medium'
          },
          {
            id: 3,
            name: "MacBook Air",
            brand: "Apple",
            category: "Computadoras",
            price: 1099.99,
            stock: 5,
            image: "https://via.placeholder.com/300x200",
            description: "Laptop ultraligera con chip M1 y gran duración de batería.",
            specifications: {
              processor: "Apple M1",
              ram: "8GB",
              storage: "256GB SSD",
              screen: "13.3 pulgadas"
            },
            rating: 4.8,
            recommendation: 'high'
          },
          {
            id: 4,
            name: "Smartphone Samsung Galaxy S22",
            brand: "Samsung",
            category: "Teléfonos",
            price: 799.99,
            stock: 20,
            image: "https://via.placeholder.com/300x200",
            description: "Smartphone de alta gama con excelente cámara.",
            specifications: {
              processor: "Snapdragon 8 Gen 1",
              ram: "8GB",
              storage: "128GB",
              screen: "6.1 pulgadas"
            },
            rating: 4.5,
            recommendation: 'medium'
          },
          {
            id: 5,
            name: "iPhone 14",
            brand: "Apple",
            category: "Teléfonos",
            price: 899.99,
            stock: 12,
            image: "https://via.placeholder.com/300x200",
            description: "El último iPhone con chip A16 Bionic.",
            specifications: {
              processor: "A16 Bionic",
              ram: "6GB",
              storage: "128GB",
              screen: "6.1 pulgadas"
            },
            rating: 4.7,
            recommendation: 'high'
          },
          {
            id: 6,
            name: "Tablet Samsung Galaxy Tab S8",
            brand: "Samsung",
            category: "Tablets",
            price: 649.99,
            stock: 7,
            image: "https://via.placeholder.com/300x200",
            description: "Tablet potente con S Pen incluido.",
            specifications: {
              processor: "Snapdragon 8 Gen 1",
              ram: "8GB",
              storage: "128GB",
              screen: "11 pulgadas"
            },
            rating: 4.3,
            recommendation: 'low'
          }
        ];
        
        setAllProducts(mockProducts);
        setFilteredProducts(mockProducts);
        
        // Recuperar favoritos del almacenamiento local
        const savedFavorites = localStorage.getItem('favorites');
        if (savedFavorites) {
          setFavorites(JSON.parse(savedFavorites));
        }
      } catch (error) {
        console.error('Error al cargar productos:', error);
        notification.error({
          message: 'Error',
          description: 'No se pudieron cargar los productos. Por favor, intenta de nuevo más tarde.'
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);
  
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