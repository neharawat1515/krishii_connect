import React from 'react';
import { Sprout, Volume2, VolumeX } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { languages, getTranslation } from '../utils/translations';
import { useVoiceGuidance } from './VoiceGuidance';

const LanguageSelector = () => {
  const { 
    voiceEnabled, 
    setVoiceEnabled, 
    selectedLanguage, 
    setSelectedLanguage, 
    setCurrentPage,
    setUserType 
  } = useAppContext();
  
  const { speak } = useVoiceGuidance();
  const t = (key) => getTranslation(key, selectedLanguage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-600 via-green-500 to-lime-500 flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-gradient-to-br from-green-600 to-emerald-600 p-4 rounded-2xl shadow-lg">
              <Sprout className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl font-black bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">
              KissanAI
            </h1>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">{t('welcome')}</h2>
        </div>

        <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">{t('chooseLanguage')}</h3>
        
        <div className="grid grid-cols-2 gap-3 mb-6">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setSelectedLanguage(lang.code);
                speak('Language selected');
              }}
              className={`p-4 rounded-xl border-2 transition-all transform hover:scale-105 ${
                selectedLanguage === lang.code
                  ? 'bg-green-500 text-white border-green-600 shadow-lg'
                  : 'bg-white border-gray-200 text-gray-800'
              }`}
            >
              <div className="font-bold text-lg">{lang.native}</div>
            </button>
          ))}
        </div>

        {selectedLanguage && (
          <div className="space-y-3">
            <button
              onClick={() => {
                setUserType('farmer');
                setCurrentPage('farmerDashboard');
                speak('Farmer dashboard');
              }}
              className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all"
            >
              {t('yesFarmer')}
            </button>
            
            <button
              onClick={() => {
                setUserType('buyer');
                setCurrentPage('buyerDashboard');
                speak('Buyer dashboard');
              }}
              className="w-full py-4 bg-white border-2 border-green-600 text-green-700 rounded-xl font-bold text-lg hover:bg-green-50 transition-all"
            >
              {t('buyer')}
            </button>
          </div>
        )}

        <button
          onClick={() => setVoiceEnabled(!voiceEnabled)}
          className="absolute top-4 right-4 p-3 bg-green-100 rounded-full hover:bg-green-200 transition-all"
        >
          {voiceEnabled ? <Volume2 className="w-6 h-6 text-green-600" /> : <VolumeX className="w-6 h-6 text-gray-600" />}
        </button>
      </div>
    </div>
  );
};

export default LanguageSelector;