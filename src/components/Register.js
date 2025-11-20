import React, { useState } from 'react';
import { User, Phone, MapPin, Eye, EyeOff, Store, ArrowLeft } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { getTranslation } from '../utils/translations';
import { useVoiceGuidance } from './VoiceGuidance';
import { authAPI } from '../services/api';

const Register = () => {
  const { selectedLanguage, setCurrentPage, userType, setFormData, setLoading } = useAppContext();
  const [showPassword, setShowPassword] = useState(false);
  const [formValues, setFormValues] = useState({
    name: '', phone: '', location: '', password: '', businessType: ''
  });
  const [error, setError] = useState('');
  const { speak } = useVoiceGuidance();

  const t = (key) => getTranslation(key, selectedLanguage);

  const voicePrompts = {
    name: selectedLanguage === 'hi' 
      ? (userType === 'farmer' ? 'कृपया अपना पूरा नाम दर्ज करें' : 'कृपया अपने व्यवसाय का नाम दर्ज करें')
      : (userType === 'farmer' ? 'Please enter your full name' : 'Please enter your business name'),
    
    phone: selectedLanguage === 'hi' 
      ? 'कृपया अपना 10 अंकों का मोबाइल नंबर दर्ज करें' 
      : 'Please enter your 10 digit mobile number',
    
    location: selectedLanguage === 'hi' 
      ? (userType === 'farmer' ? 'कृपया अपने गाँव का नाम दर्ज करें' : 'कृपया अपने व्यवसाय का स्थान दर्ज करें')
      : (userType === 'farmer' ? 'Please enter your village name' : 'Please enter your business location'),
    
    businessType: selectedLanguage === 'hi' 
      ? 'कृपया अपने व्यवसाय का प्रकार चुनें' 
      : 'Please select your business type',
    
    password: selectedLanguage === 'hi' 
      ? 'कृपया एक मजबूत पासवर्ड बनाएं। कम से कम 6 अक्षर का।' 
      : 'Please create a strong password. At least 6 characters.'
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validation
    if (!formValues.name || !formValues.phone || !formValues.location || !formValues.password) {
      const msg = selectedLanguage === 'hi' ? 'कृपया सभी फ़ील्ड भरें' : 'Please fill all fields';
      speak(msg);
      setError(msg);
      return;
    }

    if (formValues.password.length < 6) {
      const msg = selectedLanguage === 'hi' 
        ? 'पासवर्ड कम से कम 6 अक्षर का होना चाहिए' 
        : 'Password must be at least 6 characters';
      speak(msg);
      setError(msg);
      return;
    }

    try {
      setLoading(true);
      
      // Prepare data for backend
      const userData = {
        name: formValues.name,
        phone: formValues.phone,
        password: formValues.password,
        userType: userType,
        location: formValues.location,
        businessType: formValues.businessType || '',
        language: selectedLanguage
      };

      // Call backend API
      const response = await authAPI.register(userData);
      
      setFormData(formValues);
      
      speak(selectedLanguage === 'hi' 
        ? 'रजिस्ट्रेशन सफल! अब आप लॉगिन कर सकते हैं।' 
        : 'Registration successful! You can now login.');
      
      alert(selectedLanguage === 'hi'
        ? '✅ रजिस्ट्रेशन सफल!\n\nअब आप लॉगिन कर सकते हैं।'
        : '✅ Registration successful!\n\nYou can now login.');
      
      setTimeout(() => setCurrentPage('login'), 1000);
    } catch (error) {
      console.error('Registration error:', error);
      
      const errorMsg = error.response?.data?.message || 
        (selectedLanguage === 'hi' 
          ? 'रजिस्ट्रेशन विफल। कृपया पुनः प्रयास करें।' 
          : 'Registration failed. Please try again.');
      
      setError(errorMsg);
      speak(errorMsg);
      
      if (error.response?.status === 400) {
        alert(selectedLanguage === 'hi'
          ? '❌ यह मोबाइल नंबर पहले से पंजीकृत है।\nकृपया लॉगिन करें।'
          : '❌ This mobile number is already registered.\nPlease login.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 py-8 px-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <button 
            onClick={() => {
              setCurrentPage('language');
              speak(selectedLanguage === 'hi' ? 'वापस जा रहे हैं' : 'Going back');
            }}
            className="mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            {t('back')}
          </button>

          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {userType === 'farmer' ? t('farmerReg') : t('buyerReg')}
            </h2>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            {/* Name Field */}
            <div>
              <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
                <User className="w-5 h-5 text-green-600" />
                {userType === 'farmer' ? t('yourName') : t('businessName')}
              </label>
              <input
                type="text"
                value={formValues.name}
                onChange={(e) => setFormValues({...formValues, name: e.target.value})}
                onFocus={() => speak(voicePrompts.name)}
                className="w-full px-4 py-3 border-2 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all"
                placeholder={selectedLanguage === 'hi' ? 'नाम दर्ज करें' : 'Enter name'}
                required
              />
            </div>

            {/* Phone Field */}
            <div>
              <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
                <Phone className="w-5 h-5 text-green-600" />
                {t('mobile')}
              </label>
              <input
                type="tel"
                value={formValues.phone}
                onChange={(e) => setFormValues({...formValues, phone: e.target.value})}
                onFocus={() => speak(voicePrompts.phone)}
                className="w-full px-4 py-3 border-2 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all"
                placeholder="9876543210"
                pattern="[0-9]{10}"
                maxLength="10"
                required
              />
            </div>

            {/* Location Field */}
            <div>
              <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
                <MapPin className="w-5 h-5 text-green-600" />
                {t('location')}
              </label>
              <input
                type="text"
                value={formValues.location}
                onChange={(e) => setFormValues({...formValues, location: e.target.value})}
                onFocus={() => speak(voicePrompts.location)}
                className="w-full px-4 py-3 border-2 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all"
                placeholder={selectedLanguage === 'hi' ? 'स्थान दर्ज करें' : 'Enter location'}
                required
              />
            </div>

            {/* Business Type (Only for Buyer) */}
            {userType === 'buyer' && (
              <div>
                <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
                  <Store className="w-5 h-5 text-green-600" />
                  {t('businessType')}
                </label>
                <select
                  value={formValues.businessType}
                  onChange={(e) => setFormValues({...formValues, businessType: e.target.value})}
                  onFocus={() => speak(voicePrompts.businessType)}
                  className="w-full px-4 py-3 border-2 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all"
                  required
                >
                  <option value="">{t('selectType')}</option>
                  <option value="retailer">{t('retailer')}</option>
                  <option value="wholesaler">{t('wholesaler')}</option>
                  <option value="restaurant">{t('restaurant')}</option>
                  <option value="exporter">{t('exporter')}</option>
                </select>
              </div>
            )}

            {/* Password Field */}
            <div>
              <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
                <Eye className="w-5 h-5 text-green-600" />
                {t('password')}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={formValues.password}
                  onChange={(e) => setFormValues({...formValues, password: e.target.value})}
                  onFocus={() => speak(voicePrompts.password)}
                  className="w-full px-4 py-3 border-2 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 pr-12 transition-all"
                  placeholder={selectedLanguage === 'hi' ? 'पासवर्ड बनाएं' : 'Create password'}
                  minLength="6"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-all"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Register Button */}
            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all"
            >
              {t('register')}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <button 
              onClick={() => {
                setCurrentPage('login');
                speak(selectedLanguage === 'hi' ? 'लॉगिन पेज खुल रहा है' : 'Opening login page');
              }} 
              className="text-green-600 font-semibold hover:text-green-700 transition-all"
            >
              {t('alreadyAccount')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;