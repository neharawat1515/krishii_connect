import React from 'react';
import { useAppContext } from '../context/AppContext';
import LanguageSelector from './LanguageSelector';
import FarmerDashboard from './FarmerDashboard';
import BuyerDashboard from './BuyerDashboard';

const KrishiConnect = () => {
  const { currentPage } = useAppContext();

  if (currentPage === 'farmerDashboard') return <FarmerDashboard />;
  if (currentPage === 'buyerDashboard') return <BuyerDashboard />;
  
  return <LanguageSelector />;
};

export default KrishiConnect;