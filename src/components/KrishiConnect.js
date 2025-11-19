import React from 'react';
import { useAppContext } from '../context/AppContext';
import LanguageSelector from './LanguageSelector';
import Login from './Login';
import Register from './Register';
import FarmerDashboard from './FarmerDashboard';
import BuyerDashboard from './BuyerDashboard';

const KrishiConnect = () => {
  const { currentPage } = useAppContext();

  if (currentPage === 'login') return <Login />;
  if (currentPage === 'register') return <Register />;
  if (currentPage === 'farmerDashboard') return <FarmerDashboard />;
  if (currentPage === 'buyerDashboard') return <BuyerDashboard />;
  
  return <LanguageSelector />;
};

export default KrishiConnect;