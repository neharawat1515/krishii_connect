import React, { useState } from 'react';
import { Store, ShoppingCart as CartIcon, MessageSquare, MapPin, Heart, Star } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { getTranslation } from '../utils/translations';
import CartModal from './ShoppingCart'; // Renamed to CartModal
import Chat from './Chat';

const BuyerDashboard = () => {
  const { products, cart, setCart, selectedLanguage, setCurrentPage } = useAppContext();
  const [showCart, setShowCart] = useState(false);
  const [showChat, setShowChat] = useState(false);

  const t = (key) => getTranslation(key, selectedLanguage);

  const addToCart = (product) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item => 
        item.id === product.id ? {...item, quantity: item.quantity + 1} : item
      ));
    } else {
      setCart([...cart, {...product, quantity: 1}]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <nav className="bg-white shadow-lg border-b-4 border-blue-500 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Store className="w-8 h-8 text-blue-600" />
            <h1 className="text-xl font-bold">Buyer Dashboard</h1>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setShowChat(true)} className="p-2 bg-blue-100 rounded-lg">
              <MessageSquare className="w-5 h-5 text-blue-600" />
            </button>
            <button onClick={() => setShowCart(true)} className="p-2 bg-blue-100 rounded-lg relative">
              {/* Line 24: ShoppingCart (CartIcon) का उपयोग किया गया है */}
              <CartIcon className="w-5 h-5 text-blue-600" /> 
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </button>
            <button onClick={() => setCurrentPage('language')} className="px-4 py-2 bg-red-500 text-white rounded-lg">
              {t('logout')}
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <h3 className="text-2xl font-bold mb-4">Available Crops</h3>
        <div className="grid md:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-green-400 to-emerald-500 p-6 text-center">
                <span className="text-6xl">{product.emoji}</span>
              </div>
              <div className="p-5">
                <h4 className="font-bold text-lg mb-2">{selectedLanguage === 'hi' ? product.nameHi : product.name}</h4>
                <p className="text-2xl font-bold text-green-600 mb-2">₹{product.price}</p>
                <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{product.location}</span>
                </div>
                <button
                  onClick={() => addToCart(product)}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold"
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