import React, { useState, useEffect } from 'react'; // Added useEffect
import { Sprout, Package, ShoppingCart, DollarSign, Users, MessageSquare, Trash2, Plus } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { getTranslation } from '../utils/translations';
import { useVoiceGuidance } from './VoiceGuidance';
import ProductManagement from './ProductManagement';
import Chat from './Chat';
import { productAPI } from '../services/api'; // Added productAPI import

const FarmerDashboard = () => {
  const { 
    products, 
    setProducts, 
    orders, 
    selectedLanguage, 
    setCurrentPage, 
    currentUser, // Destructured
    logout, // Destructured (Though not used in this snippet, it's good practice for completeness)
    loading, // Destructured
    setLoading // Destructured
  } = useAppContext();
  
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const { speak } = useVoiceGuidance();

  const t = (key) => getTranslation(key, selectedLanguage);

  // ADDED HELPER FUNCTION
  const getProductName = (product) => {
    if (selectedLanguage === 'hi') return product.nameHi;
    if (selectedLanguage === 'pa') return product.namePa;
    if (selectedLanguage === 'bn') return product.nameBn;
    return product.name;
  };
  // END HELPER FUNCTION

  // Fetch farmer's products from backend - ADDED useEffect
  useEffect(() => {
    const fetchMyProducts = async () => {
      try {
        setLoading(true);
        const response = await productAPI.getMyProducts();
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchMyProducts();
    }
  }, [currentUser, setProducts, setLoading]); // Added dependencies

  // Add delete handler - ADDED handleDeleteProduct
  const handleDeleteProduct = async (productId) => {
    if (!window.confirm(selectedLanguage === 'hi' 
      ? 'क्या आप इस उत्पाद को हटाना चाहते हैं?' 
      : 'Are you sure you want to delete this product?')) {
      return;
    }

    try {
      await productAPI.delete(productId);
      setProducts(products.filter(p => p._id !== productId));
      speak(selectedLanguage === 'hi' ? 'उत्पाद हटाया गया' : 'Product deleted');
    } catch (error) {
      console.error('Error deleting product:', error);
      alert(selectedLanguage === 'hi' 
        ? 'उत्पाद हटाने में त्रुटि' 
        : 'Error deleting product');
    }
  };
  // END handleDeleteProduct

  // Display a loading indicator if needed (optional addition)
  if (loading && products.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <nav className="bg-white shadow-lg border-b-4 border-green-500 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sprout className="w-8 h-8 text-green-600" />
            <h1 className="text-xl font-bold">{t('farmerDashboard')}</h1>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setShowChat(true)} className="p-2 bg-green-100 rounded-lg">
              <MessageSquare className="w-5 h-5 text-green-600" />
            </button>
            <button 
              onClick={() => {
                // Assuming logout function is available and redirects to language page
                logout(); 
                setCurrentPage('language');
                speak(t('logout'));
              }} 
              className="px-4 py-2 bg-red-500 text-white rounded-lg"
            >
              {t('logout')}
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats Grid - 4 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
            <div className="flex items-center gap-4">
              <div className="bg-green-100 p-3 rounded-xl">
                <Package className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <p className="text-gray-600 text-sm mb-1">{t('products')}</p>
                <p className="text-3xl font-bold text-gray-800">{products.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-xl">
                <ShoppingCart className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <p className="text-gray-600 text-sm mb-1">{t('orders')}</p>
                <p className="text-3xl font-bold text-gray-800">{orders.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
            <div className="flex items-center gap-4">
              <div className="bg-purple-100 p-3 rounded-xl">
                <DollarSign className="w-8 h-8 text-purple-600" />
              </div>
              <div>
                <p className="text-gray-600 text-sm mb-1">{t('earnings')}</p>
                <p className="text-3xl font-bold text-gray-800">₹{orders.reduce((sum, o) => sum + o.total, 0)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
            <div className="flex items-center gap-4">
              <div className="bg-orange-100 p-3 rounded-xl">
                <Users className="w-8 h-8 text-orange-600" />
              </div>
              <div>
                <p className="text-gray-600 text-sm mb-1">{t('buyers')}</p>
                <p className="text-3xl font-bold text-gray-800">24</p>
              </div>
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-800">{t('myProducts')}</h3>
            <button
              onClick={() => {
                setShowAddProduct(true);
                speak(t('addProduct'));
              }}
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold flex items-center gap-2 hover:shadow-lg transition-all"
            >
              <Plus className="w-5 h-5" />
              {t('addProduct')}
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              // NOTE: Changed key from product.id to product._id as per typical MongoDB/backend convention
              <div key={product._id} className="border-2 border-gray-100 rounded-xl p-5 hover:shadow-lg transition-all">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-5xl">{product.emoji}</span>
                  <button
                    // UPDATED onClick handler
                    onClick={() => handleDeleteProduct(product._id)}
                    className="p-2 bg-red-100 hover:bg-red-200 rounded-lg transition-all"
                  >
                    <Trash2 className="w-5 h-5 text-red-600" />
                  </button>
                </div>
                <h4 className="font-bold text-xl mb-2 text-gray-800">{getProductName(product)}</h4>
                <p className="text-2xl font-bold text-green-600 mb-2">₹{product.price}</p>
                <p className="text-sm text-gray-600">{t('stock')}: {product.stock}</p>
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