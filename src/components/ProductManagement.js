import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { getTranslation } from '../utils/translations';
import { useVoiceGuidance } from './VoiceGuidance';

const ProductManagement = ({ isOpen, onClose }) => {
  const { products, setProducts, formData, selectedLanguage } = useAppContext();
  const { speak } = useVoiceGuidance();
  const [newProduct, setNewProduct] = useState({
    name: '', price: '', quantity: '', quality: ''
  });

  const t = (key) => getTranslation(key, selectedLanguage);

  const addProduct = () => {
    if (!newProduct.name || !newProduct.price) {
      speak("Please fill all fields");
      return;
    }

    const product = {
      id: Date.now(),
      name: newProduct.name,
      nameHi: newProduct.name,
      price: parseInt(newProduct.price),
      unit: 'quintal',
      stock: parseInt(newProduct.quantity) || 100,
      emoji: '🌾',
      quality: newProduct.quality || 'A Grade',
      farmer: formData.name || 'You',
      location: formData.location || 'Your Farm',
      rating: 4.5
    };

    setProducts([...products, product]);
    setNewProduct({ name: '', price: '', quantity: '', quality: '' });
    onClose();
    speak("Product added successfully");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800">{t('addProduct')}</h3>
          <button onClick={onClose} className="hover:bg-gray-100 p-2 rounded-lg transition-all">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">{t('productName')}</label>
            <input
              type="text"
              placeholder="e.g., Wheat, Rice"
              value={newProduct.name}
              onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">{t('price')} (per quintal)</label>
            <input
              type="number"
              placeholder="e.g., 2100"
              value={newProduct.price}
              onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">{t('quantity')} (quintal)</label>
            <input
              type="number"
              placeholder="e.g., 50"
              value={newProduct.quantity}
              onChange={(e) => setNewProduct({...newProduct, quantity: e.target.value})}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">{t('quality')}</label>
            <select
              value={newProduct.quality}
              onChange={(e) => setNewProduct({...newProduct, quality: e.target.value})}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
            >
              <option value="">{t('selectQuality')}</option>
              <option value="Premium">{t('premium')}</option>
              <option value="A Grade">{t('aGrade')}</option>
              <option value="B Grade">{t('bGrade')}</option>
            </select>
          </div>

          <button
            onClick={addProduct}
            className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all"
          >
            {t('addProduct')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductManagement;