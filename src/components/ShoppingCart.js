import React from 'react';
import { X, Plus, Minus, Trash2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { getTranslation } from '../utils/translations';
import { useVoiceGuidance } from './VoiceGuidance';

const ShoppingCart = ({ isOpen, onClose }) => {
  const { cart, setCart, orders, setOrders, selectedLanguage } = useAppContext();
  const { speak } = useVoiceGuidance();

  const t = (key) => getTranslation(key, selectedLanguage);

  const updateQuantity = (productId, change) => {
    setCart(cart.map(item => {
      if (item.id === productId) {
        const newQty = item.quantity + change;
        return newQty > 0 ? {...item, quantity: newQty} : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
    speak("Product removed");
  };

  const placeOrder = () => {
    const newOrder = {
      id: Date.now(),
      items: cart,
      total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      status: 'Processing',
      date: new Date().toLocaleDateString()
    };
    setOrders([...orders, newOrder]);
    setCart([]);
    onClose();
    speak("Order placed successfully");
  };

  if (!isOpen) return null;

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 rounded-t-2xl flex justify-between items-center">
          <h3 className="text-2xl font-bold">{t('cart')}</h3>
          <button onClick={onClose} className="hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-all">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {cart.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🛒</div>
              <p className="text-xl text-gray-500">{t('cartEmpty')}</p>
            </div>
          ) : (
            <>
              <div className="space-y-4 mb-6">
                {cart.map((item) => (
                  <div key={item.id} className="border-2 border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all">
                    <div className="flex items-center gap-4">
                      <span className="text-5xl">{item.emoji}</span>
                      <div className="flex-1">
                        <h4 className="font-bold text-lg">{selectedLanguage === 'hi' ? item.nameHi : item.name}</h4>
                        <p className="text-green-600 font-bold text-lg">
                          ₹{item.price} × {item.quantity} = ₹{item.price * item.quantity}
                        </p>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">{item.quality}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="p-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-all"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="font-bold text-xl w-12 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-2 bg-red-100 hover:bg-red-200 rounded-lg transition-all ml-2"
                        >
                          <Trash2 className="w-5 h-5 text-red-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t-4 border-gray-200 pt-6">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-2xl font-bold text-gray-700">{t('total')}:</span>
                  <span className="text-3xl font-black text-green-600">₹{total.toLocaleString()}</span>
                </div>
                <button
                  onClick={placeOrder}
                  className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold text-xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all"
                >
                  {t('placeOrder')}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;