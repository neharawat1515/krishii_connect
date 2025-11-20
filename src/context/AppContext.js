import React, { createContext, useState, useContext, useEffect } from 'react';
import { productAPI } from '../services/api';

const AppContext = createContext();

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [currentPage, setCurrentPage] = useState('language');
  const [userType, setUserType] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [formData, setFormData] = useState({
    name: '', phone: '', location: '', password: '', businessType: ''
  });
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);

  // Check if user is logged in on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('currentUser');
    
    if (token && user) {
      setCurrentUser(JSON.parse(user));
      setIsAuthenticated(true);
      setUserType(JSON.parse(user).userType);
    }
  }, []);

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await productAPI.getAll();
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
        // Fallback to initial products if backend fails
        setProducts(initialProducts);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const initialProducts = [
    { 
      id: 1, 
      name: 'Wheat', 
      nameHi: 'गेहूं',
      namePa: 'ਕਣਕ',
      nameBn: 'গম',
      price: 2100, 
      unit: 'quintal', 
      stock: 50, 
      emoji: '🌾', 
      quality: 'A Grade', 
      farmer: 'Ram Kumar', 
      location: 'Rampur', 
      rating: 4.8 
    },
    { 
      id: 2, 
      name: 'Rice', 
      nameHi: 'धान',
      namePa: 'ਚੌਲ',
      nameBn: 'চাল',
      price: 1950, 
      unit: 'quintal', 
      stock: 30, 
      emoji: '🌾', 
      quality: 'Premium', 
      farmer: 'Shyam Singh', 
      location: 'Meerut', 
      rating: 4.6 
    },
    { 
      id: 3, 
      name: 'Potato', 
      nameHi: 'आलू',
      namePa: 'ਆਲੂ',
      nameBn: 'আলু',
      price: 1200, 
      unit: 'quintal', 
      stock: 100, 
      emoji: '🥔', 
      quality: 'Fresh', 
      farmer: 'Mohan Lal', 
      location: 'Agra', 
      rating: 4.7 
    },
    { 
      id: 4, 
      name: 'Onion', 
      nameHi: 'प्याज',
      namePa: 'ਪਿਆਜ਼',
      nameBn: 'পেঁয়াজ',
      price: 2800, 
      unit: 'quintal', 
      stock: 75, 
      emoji: '🧅', 
      quality: 'Grade A', 
      farmer: 'Krishna Das', 
      location: 'Nashik', 
      rating: 4.9 
    },
    { 
      id: 5, 
      name: 'Tomato', 
      nameHi: 'टमाटर',
      namePa: 'ਟਮਾਟਰ',
      nameBn: 'টমেটো',
      price: 1800, 
      unit: 'quintal', 
      stock: 60, 
      emoji: '🍅', 
      quality: 'Fresh', 
      farmer: 'Ravi Kumar', 
      location: 'Pune', 
      rating: 4.5 
    }
  ];

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    setIsAuthenticated(false);
    setCurrentPage('language');
    setCart([]);
    setOrders([]);
  };

  const value = {
    voiceEnabled, setVoiceEnabled,
    currentPage, setCurrentPage,
    userType, setUserType,
    selectedLanguage, setSelectedLanguage,
    cart, setCart,
    orders, setOrders,
    products, setProducts,
    chatMessages, setChatMessages,
    formData, setFormData,
    currentUser, setCurrentUser,
    isAuthenticated, setIsAuthenticated,
    loading, setLoading,
    logout
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};