import React, { useState } from 'react';
import { X, Send } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { getTranslation } from '../utils/translations';
import { useVoiceGuidance } from './VoiceGuidance';

const Chat = ({ isOpen, onClose }) => {
  const { chatMessages, setChatMessages, userType, selectedLanguage } = useAppContext();
  const [currentMessage, setCurrentMessage] = useState('');
  const { speak } = useVoiceGuidance();

  const t = (key) => getTranslation(key, selectedLanguage);

  const sendMessage = () => {
    if (!currentMessage.trim()) return;
    
    const newMessage = {
      sender: userType,
      message: currentMessage,
      time: new Date().toLocaleTimeString(),
      language: selectedLanguage
    };
    
    setChatMessages([...chatMessages, newMessage]);
    const userMsg = currentMessage;
    setCurrentMessage('');
    speak(t('messageSent'));
    
    // AI Response
    setTimeout(() => {
      let aiResponse = '';
      
      if (userMsg.toLowerCase().includes('price') || userMsg.toLowerCase().includes('कीमत') || userMsg.toLowerCase().includes('दाम')) {
        aiResponse = selectedLanguage === 'hi' 
          ? `वर्तमान बाजार मूल्य ₹${Math.floor(Math.random() * 3000 + 1000)} प्रति क्विंटल है।`
          : `Current market price is ₹${Math.floor(Math.random() * 3000 + 1000)} per quintal.`;
      } 
      else if (userMsg.toLowerCase().includes('buy') || userMsg.toLowerCase().includes('खरीद')) {
        aiResponse = selectedLanguage === 'hi'
          ? 'बढ़िया! मैं आपका ऑर्डर तैयार करता हूं।'
          : 'Great! I will prepare your order.';
      }
      else if (userMsg.toLowerCase().includes('hello') || userMsg.toLowerCase().includes('नमस्ते')) {
        aiResponse = selectedLanguage === 'hi'
          ? 'नमस्ते! मैं आपकी कैसे मदद कर सकता हूं?'
          : 'Hello! How can I help you?';
      }
      else {
        aiResponse = t('autoResponse');
      }
      
      setChatMessages(prev => [...prev, {
        sender: userType === 'farmer' ? 'buyer' : 'farmer',
        message: aiResponse,
        time: new Date().toLocaleTimeString(),
        language: selectedLanguage
      }]);
      
      speak(aiResponse.substring(0, 50));
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-md w-full h-[600px] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-t-3xl flex justify-between items-center">
          <h3 className="text-2xl font-bold">{t('chat')}</h3>
          <button onClick={onClose} className="hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-all">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3 bg-gray-50">
          {chatMessages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="text-6xl mb-3">💬</div>
                <p className="text-gray-500 text-lg">{t('noMessages')}</p>
              </div>
            </div>
          ) : (
            chatMessages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.sender === userType ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] px-4 py-3 rounded-2xl shadow-md ${
                  msg.sender === userType 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-br-none' 
                    : 'bg-white text-gray-800 border-2 border-gray-200 rounded-bl-none'
                }`}>
                  <p className="break-words text-sm">{msg.message}</p>
                  <span className="text-xs opacity-70 mt-1 block">{msg.time}</span>
                </div>
              </div>
            ))
          )}
        </div>
        
        {/* Input Area */}
        <div className="p-4 bg-white border-t-2 border-gray-200 rounded-b-3xl">
          <div className="flex gap-2">
            <input
              type="text"
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder={t('typeMessage')}
              className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
            />
            <button
              onClick={sendMessage}
              className="px-5 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:shadow-lg transition-all flex items-center justify-center"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;