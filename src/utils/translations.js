export const languages = [
  { code: 'hi', name: 'Hindi', native: 'हिंदी', voiceLang: 'hi-IN' },
  { code: 'en', name: 'English', native: 'English', voiceLang: 'en-US' },
  { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ', voiceLang: 'pa-IN' },
  { code: 'bn', name: 'Bangla', native: 'বাংলা', voiceLang: 'bn-IN' }
];

export const translations = {
  hi: {
    welcome: "स्वागत है",
    chooseLanguage: "अपनी भाषा चुनें",
    continue: "जारी रखें",
    areFarmer: "क्या आप किसान हैं?",
    yesFarmer: "हाँ, मैं किसान हूँ",
    buyer: "मैं खरीदार हूँ",
    back: "वापस",
    products: "उत्पाद",
    orders: "आदेश",
    earnings: "कमाई",
    addProduct: "उत्पाद जोड़ें",
    buyNow: "अभी खरीदें",
    cart: "कार्ट",
    chat: "चैट",
    placeOrder: "ऑर्डर दें",
    total: "कुल",
    logout: "लॉगआउट",
    noMessages: "अभी तक कोई संदेश नहीं",
    typeMessage: "संदेश लिखें",
    cartEmpty: "कार्ट खाली है",
    productName: "उत्पाद का नाम",
    price: "मूल्य",
    quantity: "मात्रा",
    quality: "गुणवत्ता",
    selectQuality: "गुणवत्ता चुनें",
    premium: "प्रीमियम",
    aGrade: "ए ग्रेड",
    bGrade: "बी ग्रेड"
  },
  en: {
    welcome: "Welcome",
    chooseLanguage: "Choose Language",
    continue: "Continue",
    areFarmer: "Are you a Farmer?",
    yesFarmer: "Yes, I am Farmer",
    buyer: "I am Buyer",
    back: "Back",
    products: "Products",
    orders: "Orders",
    earnings: "Earnings",
    addProduct: "Add Product",
    buyNow: "Buy Now",
    cart: "Cart",
    chat: "Chat",
    placeOrder: "Place Order",
    total: "Total",
    logout: "Logout",
    noMessages: "No messages yet",
    typeMessage: "Type message",
    cartEmpty: "Cart is empty",
    productName: "Product Name",
    price: "Price",
    quantity: "Quantity",
    quality: "Quality",
    selectQuality: "Select Quality",
    premium: "Premium",
    aGrade: "A Grade",
    bGrade: "B Grade"
  },
  pa: {
    welcome: "ਸੁਆਗਤ ਹੈ",
    chooseLanguage: "ਭਾਸ਼ਾ ਚੁਣੋ",
    continue: "ਜਾਰੀ ਰੱਖੋ",
    yesFarmer: "ਹਾਂ, ਮੈਂ ਕਿਸਾਨ ਹਾਂ",
    buyer: "ਮੈਂ ਖਰੀਦਦਾਰ ਹਾਂ",
    logout: "ਲੌਗਆਉਟ"
  },
  bn: {
    welcome: "স্বাগতম",
    chooseLanguage: "ভাষা নির্বাচন করুন",
    continue: "চালিয়ে যান",
    yesFarmer: "হ্যাঁ, আমি কৃষক",
    buyer: "আমি ক্রেতা",
    logout: "লগআউট"
  }
};

export const getTranslation = (key, language) => {
  return translations[language]?.[key] || translations['en'][key] || key;
};