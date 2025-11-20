import React from 'react';
import { X, Plus, Minus, Trash2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { getTranslation } from '../utils/translations';
import { useVoiceGuidance } from './VoiceGuidance';
import { orderAPI } from '../services/api'; // ADDED orderAPI import

const ShoppingCart = ({ isOpen, onClose }) => {
  const { cart, setCart, orders, setOrders, selectedLanguage, setLoading } = useAppContext(); // Destructured setLoading
  const { speak } = useVoiceGuidance();

  const t = (key) => getTranslation(key, selectedLanguage);

  const getProductName = (product) => {
    if (selectedLanguage === 'hi') return product.nameHi;
    if (selectedLanguage === 'pa') return product.namePa;
    if (selectedLanguage === 'bn') return product.nameBn;
    return product.name;
  };

  const updateQuantity = (productId, change) => {
    // NOTE: If using backend data, the ID should be `item._id`
    setCart(cart.map(item => {
      if (item._id === productId) { // Changed item.id to item._id (assuming cart items now have _id)
        const newQty = item.quantity + change;
        return newQty > 0 ? {...item, quantity: newQty} : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const removeFromCart = (productId) => {
    // NOTE: If using backend data, the ID should be `item._id`
    setCart(cart.filter(item => item._id !== productId)); // Changed item.id to item._id
    speak(selectedLanguage === 'hi' ? 'उत्पाद हटाया गया' : 'Product removed');
  };

  const placeOrder = async () => { // Made function asynchronous
    if (cart.length === 0) {
      speak(selectedLanguage === 'hi' ? 'कार्ट खाली है' : 'Cart is empty');
      return;
    }

    try {
      setLoading(true); // Set loading state

      const orderData = {
        // Map cart items to the format expected by the backend
        items: cart.map(item => ({
          product: item._id, // Use backend ID for product reference
          name: getProductName(item),
          price: item.price,
          quantity: item.quantity,
          emoji: item.emoji,
          farmerId: item.farmerId, // Include farmer ID if available in cart item
        })),
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      };

      // Call backend API
      const response = await orderAPI.create(orderData);
      
      // Update local orders state with the response from the backend
      setOrders([...orders, response.data]); 
      setCart([]);
      onClose();
      
      speak(selectedLanguage === 'hi' ? 'ऑर्डर सफल' : 'Order placed successfully');
      
      alert(selectedLanguage === 'hi'
        ? '✅ ऑर्डर सफलतापूर्वक दिया गया!'
        : '✅ Order placed successfully!');
    } catch (error) {
      console.error('Error placing order:', error);
      alert(selectedLanguage === 'hi' 
        ? 'ऑर्डर देने में त्रुटि। कृपया पुनः प्रयास करें।' 
        : 'Error placing order. Please try again.');
    } finally {
      setLoading(false); // Clear loading state
    }
  };

  if (!isOpen) return null;

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 rounded-t-3xl flex justify-between items-center">
          <h3 className="text-2xl font-bold">{t('cart')}</h3>
          <button onClick={onClose} className="hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-all">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {cart.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-8xl mb-4">🛒</div>
              <p className="text-xl text-gray-500 font-semibold">{t('cartEmpty')}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                // Changed key from item.id to item._id
                <div key={item._id} className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-4 hover:shadow-md transition-all">
                  <div className="flex items-center gap-4">
                    {/* Product Icon */}
                    <div className="bg-white p-3 rounded-xl">
                      <span className="text-4xl">{item.emoji}</span>
                    </div>
                    
                    {/* Product Info */}
                    <div className="flex-1">
                      <h4 className="font-bold text-lg text-gray-800">{getProductName(item)}</h4>
                      <p className="text-green-600 font-bold text-lg">
                        ₹{item.price} × {item.quantity} = ₹{item.price * item.quantity}
                      </p>
                      <span className="inline-block text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full mt-1">
                        {item.quality}
                      </span>
                    </div>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item._id, -1)} // Changed item.id to item._id
                        className="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-lg transition-all flex items-center justify-center"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="font-bold text-xl w-12 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item._id, 1)} // Changed item.id to item._id
                        className="w-10 h-10 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all flex items-center justify-center"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removeFromCart(item._id)} // Changed item.id to item._id
                        className="w-10 h-10 bg-red-100 hover:bg-red-200 rounded-lg transition-all flex items-center justify-center ml-2"
                      >
                        <Trash2 className="w-5 h-5 text-red-600" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer - Total & Order Button */}
        {cart.length > 0 && (
          <div className="border-t-4 border-gray-200 p-6 bg-gray-50 rounded-b-3xl">
            <div className="flex justify-between items-center mb-4">
              <span className="text-2xl font-bold text-gray-700">{t('total')}:</span>
              <span className="text-4xl font-black text-green-600">₹{total.toLocaleString()}</span>
            </div>
            <button
              onClick={placeOrder}
              className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold text-xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all"
            >
              {t('placeOrder')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShoppingCart;