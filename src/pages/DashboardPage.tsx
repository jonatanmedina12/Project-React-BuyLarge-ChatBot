// src/pages/DashboardPage.tsx
import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Select, Spin, Typography, Divider } from 'antd';
import { 
  ShoppingOutlined, 
  DollarCircleOutlined, 
  BarChartOutlined, 
  PieChartOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined
} from '@ant-design/icons';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';

const { Title, Text } = Typography;
const { Option } = Select;

// Colores para los gráficos
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

// Datos de ejemplo para inventario (en un caso real, vendrían de la API de Django)
const inventoryData = [
  { name: 'HP', value: 15 },
  { name: 'Dell', value: 8 },
  { name: 'Apple', value: 5 },
  { name: 'Samsung', value: 32 },
  { name: 'Lenovo', value: 12 },
  { name: 'Asus', value: 9 }
];

// Datos de ejemplo para ventas mensuales
const salesData = [
  { name: 'Ene', computadoras: 45, telefonos: 32, tablets: 18 },
  { name: 'Feb', computadoras: 38, telefonos: 30, tablets: 23 },
  { name: 'Mar', computadoras: 52, telefonos: 35, tablets: 28 },
  { name: 'Abr', computadoras: 48, telefonos: 42, tablets: 20 },
  { name: 'May', computadoras: 61, telefonos: 48, tablets: 25 },
  { name: 'Jun', computadoras: 55, telefonos: 53, tablets: 30 },
];

// Datos de ejemplo para productos por categoría
const categoryData = [
  { categoria: 'Computadoras', cantidad: 28, valor: 32500 },
  { categoria: 'Teléfonos', cantidad: 32, valor: 25600 },
  { categoria: 'Tablets', cantidad: 22, valor: 14300 },
  { categoria: 'Accesorios', cantidad: 45, valor: 8500 },
  { categoria: 'Audio', cantidad: 28, valor: 9800 },
];

// Datos de ventas por período
const periodSalesData = [
  { name: 'Semana 1', value: 12500 },
  { name: 'Semana 2', value: 14800 },
  { name: 'Semana 3', value: 13200 },
  { name: 'Semana 4', value: 15900 },
];

const DashboardPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [timeFrame, setTimeFrame] = useState('month');
  
  // Simulación de carga de datos
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Función para formatear valores grandes
  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num;
  };
  
  // Cambiar el período de tiempo
  const handleTimeFrameChange = (value: string) => {
    setTimeFrame(value);
    // En una implementación real, aquí cargaríamos datos diferentes según el período
  };
  
  // Renderizar valor con flecha según tendencia
  const renderStatisticValue = (value: number, prevValue: number) => {
    const percentChange = ((value - prevValue) / prevValue) * 100;
    const isPositive = percentChange >= 0;
    
    return (
      <div>
        {value}
        <div>
          <Text 
            type={isPositive ? "success" : "danger"}
            style={{ fontSize: '14px', marginLeft: '8px' }}
          >
            {isPositive ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
            {Math.abs(percentChange).toFixed(1)}%
          </Text>
        </div>
      </div>
    );
  };
  
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <Title level={2}>Dashboard de Inventario</Title>
        <Select 
          defaultValue="month" 
          style={{ width: 120 }} 
          onChange={handleTimeFrameChange}
        >
          <Option value="week">Semanal</Option>
          <Option value="month">Mensual</Option>
          <Option value="quarter">Trimestral</Option>
          <Option value="year">Anual</Option>
        </Select>
      </div>
      
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
          <Spin size="large" />
        </div>
      ) : (
        <>
          {/* Fila de tarjetas de estadísticas */}
          <Row gutter={16}>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Total de Productos"
                  value={132}
                  precision={0}
                  valueStyle={{ color: '#3f8600' }}
                  prefix={<ShoppingOutlined />}
                  suffix={renderStatisticValue(132, 120)}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Valor Inventario"
                  value={95800}
                  precision={0}
                  valueStyle={{ color: '#1890ff' }}
                  prefix={<DollarCircleOutlined />}
                  formatter={(value) => `$${value}`}
                  suffix={renderStatisticValue(95800, 92500)}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Ventas del Mes"
                  value={24500}
                  precision={0}
                  valueStyle={{ color: '#cf1322' }}
                  prefix={<BarChartOutlined />}
                  formatter={(value) => `$${value}`}
                  suffix={renderStatisticValue(24500, 27800)}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Unidades Vendidas"
                  value={85}
                  precision={0}
                  valueStyle={{ color: '#722ed1' }}
                  prefix={<PieChartOutlined />}
                  suffix={renderStatisticValue(85, 72)}
                />
              </Card>
            </Col>
          </Row>
          
          <Divider />
          
          {/* Gráficos */}
          <Row gutter={16}>
            {/* Gráfico de Inventario por Marca */}
            <Col xs={24} lg={12} style={{ marginBottom: '20px' }}>
              <Card title="Inventario por Marca">
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={inventoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {inventoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} unidades`, 'Cantidad']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </Col>
            
            {/* Gráfico de Ventas por Categoría */}
            <Col xs={24} lg={12} style={{ marginBottom: '20px' }}>
              <Card title="Productos por Categoría">
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer>
                    <BarChart
                      data={categoryData}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="categoria" />
                      <YAxis />
                      <Tooltip formatter={(value, name) => [value, name === 'valor' ? 'Valor ($)' : 'Cantidad']} />
                      <Legend />
                      <Bar dataKey="cantidad" fill="#0088FE" name="Cantidad" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </Col>
          </Row>
          
          <Row gutter={16}>
            {/* Gráfico de Tendencias */}
            <Col xs={24} lg={24} style={{ marginBottom: '20px' }}>
              <Card title="Tendencia de Ventas Mensuales por Categoría">
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer>
                    <LineChart
                      data={salesData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="computadoras" 
                        stroke="#8884d8" 
                        activeDot={{ r: 8 }} 
                        name="Computadoras"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="telefonos" 
                        stroke="#82ca9d" 
                        name="Teléfonos"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="tablets" 
                        stroke="#ffc658" 
                        name="Tablets"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

export default DashboardPage;