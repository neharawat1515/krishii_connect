import React, { useState } from 'react';
import { Sprout, Package, ShoppingCart, DollarSign, Users, MessageSquare, Edit, Trash2, Plus } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { getTranslation } from '../utils/translations';
import ProductManagement from './ProductManagement';
import Chat from './Chat';

const FarmerDashboard = () => {
  const { products, setProducts, orders, selectedLanguage, setCurrentPage } = useAppContext();
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showChat, setShowChat] = useState(false);

  const t = (key) => getTranslation(key, selectedLanguage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <nav className="bg-white shadow-lg border-b-4 border-green-500 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sprout className="w-8 h-8 text-green-600" />
            <h1 className="text-xl font-bold">Farmer Dashboard</h1>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setShowChat(true)} className="p-2 bg-green-100 rounded-lg">
              <MessageSquare className="w-5 h-5 text-green-600" />
            </button>
            <button onClick={() => setCurrentPage('language')} className="px-4 py-2 bg-red-500 text-white rounded-lg">
              {t('logout')}
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-5 shadow-lg">
            <Package className="w-12 h-12 bg-green-500 text-white p-2 rounded-xl mb-3" />
            <p className="text-gray-600 text-sm">{t('products')}</p>
            <p className="text-2xl font-bold">{products.length}</p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-lg">
            <ShoppingCart className="w-12 h-12 bg-blue-500 text-white p-2 rounded-xl mb-3" />
            <p className="text-gray-600 text-sm">{t('orders')}</p>
            <p className="text-2xl font-bold">{orders.length}</p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-lg">
            <DollarSign className="w-12 h-12 bg-purple-500 text-white p-2 rounded-xl mb-3" />
            <p className="text-gray-600 text-sm">{t('earnings')}</p>
            <p className="text-2xl font-bold">₹{orders.reduce((sum, o) => sum + o.total, 0)}</p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-lg">
            <Users className="w-12 h-12 bg-orange-500 text-white p-2 rounded-xl mb-3" />
            <p className="text-gray-600 text-sm">Buyers</p>
            <p className="text-2xl font-bold">24</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-bold">My Products</h3>
            <button
              onClick={() => setShowAddProduct(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              {t('addProduct')}
            </button>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {products.map((product) => (
              <div key={product.id} className="border-2 border-gray-100 rounded-xl p-4">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-4xl">{product.emoji}</span>
                  <button
                    onClick={() => setProducts(products.filter(p => p.id !== product.id))}
                    className="p-2 bg-red-100 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
                <h4 className="font-bold text-lg">{selectedLanguage === 'hi' ? product.nameHi : product.name}</h4>
                <p className="text-2xl font-bold text-green-600">₹{product.price}</p>
                <p className="text-sm text-gray-600">Stock: {product.stock}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ProductManagement isOpen={showAddProduct} onClose={() => setShowAddProduct(false)} />
      <Chat isOpen={showChat} onClose={() => setShowChat(false)} />
    </div>
  );
};

export default FarmerDashboard;
