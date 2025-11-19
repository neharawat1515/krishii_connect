import { useAppContext } from '../context/AppContext';
import { languages } from '../utils/translations';

let isSpeaking = false; // Global flag to prevent multiple calls

export const useVoiceGuidance = () => {
  const { voiceEnabled, selectedLanguage } = useAppContext();

  const speak = (text) => {
    if (!voiceEnabled || !('speechSynthesis' in window)) return;
    if (isSpeaking) return; // Prevent if already speaking
    
    isSpeaking = true;
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    const langObj = languages.find(l => l.code === selectedLanguage);
    utterance.lang = langObj?.voiceLang || 'en-US';
    
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    utterance.volume = 1.0;
    
    const voices = window.speechSynthesis.getVoices();
    let bestVoice = voices.find(v => 
      v.lang === langObj?.voiceLang && v.localService === false
    );
    
    if (!bestVoice) {
      bestVoice = voices.find(v => v.lang.startsWith(langObj?.voiceLang.split('-')[0]));
    }
    
    if (bestVoice) {
      utterance.voice = bestVoice;
    }
    
    // Reset flag when speech ends
    utterance.onend = () => {
      isSpeaking = false;
    };
    
    utterance.onerror = () => {
      isSpeaking = false;
    };
    
    window.speechSynthesis.speak(utterance);
  };

  return { speak };
};