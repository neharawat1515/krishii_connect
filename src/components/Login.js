import React, { useState } from 'react';
import { Eye, EyeOff, Phone, ArrowLeft } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { getTranslation } from '../utils/translations';
import { useVoiceGuidance } from './VoiceGuidance';

const Login = () => {
  const { selectedLanguage, setCurrentPage, userType, setFormData, formData } = useAppContext();
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const { speak } = useVoiceGuidance();

  const t = (key) => getTranslation(key, selectedLanguage);

  const handleLogin = (e) => {
    e.preventDefault();
    
    if (phone && password) {
      setFormData({ ...formData, phone, password });
      
      // Navigate to appropriate dashboard
      if (userType === 'farmer') {
        setCurrentPage('farmerDashboard');
        speak(selectedLanguage === 'hi' 
          ? 'लॉगिन सफल। किसान डैशबोर्ड खुल रहा है।' 
          : 'Login successful. Opening farmer dashboard.');
      } else {
        setCurrentPage('buyerDashboard');
        speak(selectedLanguage === 'hi' 
          ? 'लॉगिन सफल। खरीदार डैशबोर्ड खुल रहा है।' 
          : 'Login successful. Opening buyer dashboard.');
      }
    }
  };

  const handlePhoneFocus = () => {
    speak(selectedLanguage === 'hi' 
      ? 'कृपया अपना 10 अंकों का मोबाइल नंबर दर्ज करें' 
      : 'Please enter your 10 digit mobile number');
  };

  const handlePasswordFocus = () => {
    speak(selectedLanguage === 'hi' 
      ? 'कृपया अपना पासवर्ड दर्ज करें' 
      : 'Please enter your password');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8">
        <button 
          onClick={() => {
            setCurrentPage('language');
            speak(selectedLanguage === 'hi' ? 'वापस जा रहे हैं' : 'Going back');
          }}
          className="mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-800"
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

        <form onSubmit={handleLogin} className="space-y-6">
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
              onClick={handlePhoneFocus}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100"
              placeholder="9876543210"
              pattern="[0-9]{10}"
              required
            />
          </div>

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
                onClick={handlePasswordFocus}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 pr-12"
                placeholder={selectedLanguage === 'hi' ? 'पासवर्ड डालें' : 'Enter password'}
                minLength="6"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            onMouseEnter={() => speak(selectedLanguage === 'hi' ? 'लॉगिन बटन' : 'Login button')}
            className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all"
          >
            {t('login')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            {t('noAccount')}{' '}
            <button 
              onClick={() => {
                setCurrentPage('register');
                speak(selectedLanguage === 'hi' ? 'रजिस्ट्रेशन पेज खुल रहा है' : 'Opening registration page');
              }} 
              className="text-green-600 font-bold hover:text-green-700"
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