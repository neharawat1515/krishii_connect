import { useAppContext } from '../context/AppContext';
import { languages } from '../utils/translations';

export const useVoiceGuidance = () => {
  const { voiceEnabled, selectedLanguage } = useAppContext();

  const speak = (text) => {
    if (!voiceEnabled || !('speechSynthesis' in window)) return;
    
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const langObj = languages.find(l => l.code === selectedLanguage);
    utterance.lang = langObj?.voiceLang || 'en-US';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  return { speak };
};