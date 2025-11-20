import React, { useState } from 'react';
import { Eye, EyeOff, Phone, ArrowLeft } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { getTranslation } from '../utils/translations';
import { useVoiceGuidance } from './VoiceGuidance';
import { authAPI } from '../services/api';

const Login = () => {
  const { 
    selectedLanguage, 
    setCurrentPage, 
    userType, 
    setFormData,
    setCurrentUser,
    setIsAuthenticated,
    setLoading
  } = useAppContext();
  
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { speak } = useVoiceGuidance();

  const t = (key) => getTranslation(key, selectedLanguage);

  const handlePhoneFocus = () => {
    speak(selectedLanguage === 'hi' 
      ? 'मोबाइल नंबर दर्ज करें' 
      : 'Enter mobile number');
  };

  const handlePasswordFocus = () => {
    speak(selectedLanguage === 'hi' 
      ? 'पासवर्ड दर्ज करें' 
      : 'Enter password');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!phone || !password) {
      const msg = selectedLanguage === 'hi' ? 'कृपया सभी फ़ील्ड भरें' : 'Please fill all fields';
      speak(msg);
      setError(msg);
      return;
    }

    try {
      setLoading(true);

      // Call backend API
      const response = await authAPI.login({ phone, password, userType });
      
      // Save token and user data
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('currentUser', JSON.stringify(response.data));
      
      setCurrentUser(response.data);
      setIsAuthenticated(true);
      setFormData(response.data);
      
      speak(selectedLanguage === 'hi' 
        ? `स्वागत है ${response.data.name}! लॉगिन सफल।` 
        : `Welcome ${response.data.name}! Login successful.`);
      
      // Navigate to dashboard
      if (userType === 'farmer') {
        setCurrentPage('farmerDashboard');
      } else {
        setCurrentPage('buyerDashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      
      let errorMsg = '';
      
      if (error.response?.status === 401) {
        errorMsg = selectedLanguage === 'hi' 
          ? 'गलत मोबाइल नंबर या पासवर्ड' 
          : 'Wrong mobile number or password';
      } else if (error.response?.status === 403) {
        errorMsg = selectedLanguage === 'hi'
          ? `यह खाता ${error.response.data.message.includes('farmer') ? 'किसान' : 'खरीदार'} के रूप में पंजीकृत है`
          : error.response.data.message;
      } else {
        errorMsg = selectedLanguage === 'hi' 
          ? 'लॉगिन विफल। कृपया पुनः प्रयास करें।' 
          : 'Login failed. Please try again.';
      }
      
      setError(errorMsg);
      speak(errorMsg);
      
      alert(selectedLanguage === 'hi'
        ? `❌ लॉगिन विफल!\n\n${errorMsg}`
        : `❌ Login failed!\n\n${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8">
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

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">{t('login')}</h2>
          <p className="text-gray-600">
            {userType === 'farmer' ? t('farmerDashboard') : t('buyerDashboard')}
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Mobile Number Field */}
          <div>
            <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
              <Phone className="w-5 h-5 text-green-600" />
              {t('mobile')}
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              onFocus={handlePhoneFocus}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all"
              placeholder="9876543210"
              pattern="[0-9]{10}"
              maxLength="10"
              required
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
              <Eye className="w-5 h-5 text-green-600" />
              {t('password')}
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={handlePasswordFocus}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 pr-12 transition-all"
                placeholder={selectedLanguage === 'hi' ? 'पासवर्ड डालें' : 'Enter password'}
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

          {/* Login Button */}
          <button
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all"
          >
            {t('login')}
          </button>
        </form>

        {/* Register Link */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            {t('noAccount')}{' '}
            <button 
              onClick={() => {
                setCurrentPage('register');
                speak(selectedLanguage === 'hi' ? 'रजिस्ट्रेशन पेज खुल रहा है' : 'Opening registration page');
              }} 
              className="text-green-600 font-bold hover:text-green-700 transition-all"
            >
              {t('register')}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
