import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'tr';

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    "app.title": "MagicColors",
    "nav.home": "Home",
    "nav.create": "Create",
    "nav.gallery": "My Art",
    "nav.premium": "Premium",
    
    "home.hero.title": "Create Your Own",
    "home.hero.subtitle": "Coloring Pages",
    "home.hero.placeholder": "Unicorn on the moon...",
    "home.hero.button": "Create Magic ✨",
    "home.packs.title": "Explore Packs",
    "home.packs.subtitle": "Ready-to-print collections",
    "home.packs.viewAll": "View All",
    "home.packs.free": "FREE",
    "home.packs.pages": "pages",

    "generator.back": "Back",
    "generator.creating": "Creating Magic...",
    "generator.savePdf": "Save PDF",
    "generator.print": "Print",
    "generator.share": "Share",
    "generator.tryAgain": "Try Again",

    "pack.back": "Back",
    "pack.premiumLabel": "Premium Pack",
    "pack.premiumDesc": "Unlock all pages",
    "pack.unlock": "Unlock",

    "gallery.title": "My Gallery",
    "gallery.empty.title": "No Artworks Yet",
    "gallery.empty.desc": "Create your first magic coloring page!",
    "gallery.createNow": "Create Now",

    "premium.title": "Premium Access",
    "premium.banner.title": "Unlock Everything",
    "premium.banner.desc": "Get unlimited access to all packs and AI tools.",
    "premium.trial": "Start 7-Day Free Trial",
    "premium.price": "Then $4.99/month",

    "pack.animals": "Cute Animals",
    "pack.cars": "Cool Cars",
    "pack.fruits": "Yummy Fruits",
    "pack.dinos": "Dino World",
    "pack.princess": "Princess Castle",
    "pack.space": "Space Explorer",
    "pack.pokemon": "Poke-Style",
    "pack.superhero": "Super Heroes",

    "auth.loginRequired": "Login Required",
    "auth.loginToCreate": "Please sign in to create your own magical coloring pages.",
    "auth.login": "Sign In",
  },
  tr: {
    "app.title": "SihirliRenkler",
    "nav.home": "Ana Sayfa",
    "nav.create": "Oluştur",
    "nav.gallery": "Resimlerim",
    "nav.premium": "Premium",
    
    "home.hero.title": "Kendi Boyama",
    "home.hero.subtitle": "Sayfanı Oluştur",
    "home.hero.placeholder": "Ayda dondurma yiyen kedi...",
    "home.hero.button": "Sihir Yarat ✨",
    "home.packs.title": "Paketleri Keşfet",
    "home.packs.subtitle": "Yazdırmaya hazır koleksiyonlar",
    "home.packs.viewAll": "Tümü",
    "home.packs.free": "ÜCRETSİZ",
    "home.packs.pages": "sayfa",

    "generator.back": "Geri",
    "generator.creating": "Sihir Yapılıyor...",
    "generator.savePdf": "PDF İndir",
    "generator.print": "Yazdır",
    "generator.share": "Paylaş",
    "generator.tryAgain": "Tekrar Dene",

    "pack.back": "Geri",
    "pack.premiumLabel": "Premium Paket",
    "pack.premiumDesc": "Tüm sayfaların kilidini aç",
    "pack.unlock": "Kilidi Aç",

    "gallery.title": "Galerim",
    "gallery.empty.title": "Henüz Resim Yok",
    "gallery.empty.desc": "İlk sihirli boyama sayfanı oluştur!",
    "gallery.createNow": "Hemen Oluştur",

    "premium.title": "Premium Erişim",
    "premium.banner.title": "Her Şeyin Kilidini Aç",
    "premium.banner.desc": "Tüm paketlere ve sınırsız AI aracına eriş.",
    "premium.trial": "7 Gün Ücretsiz Dene",
    "premium.price": "Sonra ₺49.99/ay",

    "pack.animals": "Sevimli Hayvanlar",
    "pack.cars": "Havalı Arabalar",
    "pack.fruits": "Leziz Meyveler",
    "pack.dinos": "Dinozor Dünyası",
    "pack.princess": "Prenses Şatosu",
    "pack.space": "Uzay Kaşifi",
    "pack.pokemon": "Poke-Tarzı",
    "pack.superhero": "Süper Kahramanlar",

    "auth.loginRequired": "Giriş Gerekli",
    "auth.loginToCreate": "AI ile boyama sayfası oluşturmak için giriş yap.",
    "auth.login": "Giriş Yap",
  }
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('tr');

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within a I18nProvider');
  }
  return context;
}
