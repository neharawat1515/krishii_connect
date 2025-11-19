import React, { useState } from 'react';
import { Store, ShoppingCart as CartIcon, MessageSquare, MapPin } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { getTranslation } from '../utils/translations';
import { useVoiceGuidance } from './VoiceGuidance';
import CartModal from './ShoppingCart';
import Chat from './Chat';

const BuyerDashboard = () => {
  const { products, cart, setCart, selectedLanguage, setCurrentPage } = useAppContext();
  const [showCart, setShowCart] = useState(false);
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

  const addToCart = (product) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item => 
        item.id === product.id ? {...item, quantity: item.quantity + 1} : item
      ));
    } else {
      setCart([...cart, {...product, quantity: 1}]);
    }
    speak(t('buyNow'));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <nav className="bg-white shadow-lg border-b-4 border-blue-500 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Store className="w-8 h-8 text-blue-600" />
            <h1 className="text-xl font-bold">{t('buyerDashboard')}</h1>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setShowChat(true)} className="p-2 bg-blue-100 rounded-lg">
              <MessageSquare className="w-5 h-5 text-blue-600" />
            </button>
            <button onClick={() => setShowCart(true)} className="p-2 bg-blue-100 rounded-lg relative">
              <CartIcon className="w-5 h-5 text-blue-600" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </button>
            <button 
              onClick={() => {
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
  <div className="flex justify-between items-center mb-6">
    <h3 className="text-3xl font-bold text-gray-800">{t('availableCrops')}</h3>
  </div>
  
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {products.map((product) => (
      <div key={product.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all transform hover:-translate-y-1">
        <div className="bg-gradient-to-r from-green-400 to-emerald-500 p-8 text-center">
          <span className="text-7xl">{product.emoji}</span>
        </div>
        <div className="p-6">
          <h4 className="font-bold text-xl mb-2 text-gray-800">{getProductName(product)}</h4>
          <p className="text-3xl font-bold text-green-600 mb-3">₹{product.price}</p>
          <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
            <MapPin className="w-4 h-4" />
            <span>{product.location}</span>
          </div>
          <button
            onClick={() => addToCart(product)}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            {t('buyNow')}
          </button>
        </div>
      </div>
    ))}
  </div>
</div>

      <CartModal isOpen={showCart} onClose={() => setShowCart(false)} />
      <Chat isOpen={showChat} onClose={() => setShowChat(false)} />
    </div>
  );
};

export default BuyerDashboard;