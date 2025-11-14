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
      time: new Date().toLocaleTimeString()
    };
    
    setChatMessages([...chatMessages, newMessage]);
    setCurrentMessage('');
    speak("Message sent");
    
    // Auto-response simulation
    setTimeout(() => {
      setChatMessages(prev => [...prev, {
        sender: userType === 'farmer' ? 'buyer' : 'farmer',
        message: "Thank you for your message! I'll respond shortly.",
        time: new Date().toLocaleTimeString()
      }]);
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full h-[600px] flex flex-col">
        <div className="p-4 border-b-2 flex justify-between items-center bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-t-2xl">
          <h3 className="text-xl font-bold">{t('chat')}</h3>
          <button onClick={onClose} className="hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-all">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
          {chatMessages.length === 0 ? (
            <p className="text-center text-gray-500 py-8">{t('noMessages')}</p>
          ) : (
            chatMessages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.sender === userType ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs px-4 py-2 rounded-2xl shadow-md ${
                  msg.sender === userType 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' 
                    : 'bg-white text-gray-800 border-2 border-gray-200'
                }`}>
                  <p className="break-words">{msg.message}</p>
                  <span className="text-xs opacity-70 mt-1 block">{msg.time}</span>
                </div>
              </div>
            ))
          )}
        </div>
        
        <div className="p-4 border-t-2 bg-white rounded-b-2xl">
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
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:shadow-lg transition-all"
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