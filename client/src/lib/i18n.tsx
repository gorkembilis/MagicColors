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
    "generator.tryAgain": "Try Again (Regenerate)",

    "pack.back": "Back",
    "pack.premiumLabel": "Premium Pack",
    "pack.premiumDesc": "Unlock all pages",
    "pack.unlock": "Unlock",

    "view.printNow": "Print Now",
    "view.downloadPdf": "Download PDF",
    "view.parentTips": "Parent Tips 💡",
    "view.tip1": "Use thicker paper (cardstock) if using markers.",
    "view.tip2": "Print two pages per sheet for smaller travel coloring.",
    "view.ad.label": "ADVERTISEMENT",
    "view.ad.remove": "Remove Ads with Premium",

    "gallery.title": "My Gallery",
    "gallery.empty.title": "No Artworks Yet",
    "gallery.empty.desc": "Create your first magic coloring page to see it here!",
    "gallery.createNow": "Create Now",
    "gallery.today": "Today",
    "gallery.yesterday": "Yesterday",

    "premium.title": "Premium Access",
    "premium.banner.title": "Unlock Everything",
    "premium.banner.desc": "Get unlimited access to all packs, AI tools, and remove all ads.",
    "premium.trial": "Start 7-Day Free Trial",
    "premium.price": "Then $4.99/month. Cancel anytime.",
    "premium.feat.ai": "Unlimited AI Creation",
    "premium.feat.ai.desc": "Create as many custom pages as you want.",
    "premium.feat.packs": "Unlock All Packs",
    "premium.feat.packs.desc": "Princesses, Space, Superheroes & more.",
    "premium.feat.ads": "No More Ads",
    "premium.feat.ads.desc": "A completely distraction-free experience.",
    "premium.restore": "Restore Purchases",

    // Pack Titles Mapping (Simple approach)
    "pack.animals": "Cute Animals",
    "pack.cars": "Cool Cars",
    "pack.fruits": "Yummy Fruits",
    "pack.dinos": "Dino World",
    "pack.princess": "Princess Castle",
    "pack.space": "Space Explorer",
    "pack.pokemon": "Poke-Style",
    "pack.superhero": "Super Heroes",
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

    "view.printNow": "Yazdır",
    "view.downloadPdf": "PDF İndir",
    "view.parentTips": "Ebeveyn İpuçları 💡",
    "view.tip1": "Keçeli kalem kullanacaksanız kalın kağıt tercih edin.",
    "view.tip2": "Seyahat boyu için tek kağıda iki sayfa yazdırın.",
    "view.ad.label": "REKLAM",
    "view.ad.remove": "Premium ile Reklamları Kaldır",

    "gallery.title": "Galerim",
    "gallery.empty.title": "Henüz Resim Yok",
    "gallery.empty.desc": "İlk sihirli boyama sayfanı oluştur!",
    "gallery.createNow": "Hemen Oluştur",
    "gallery.today": "Bugün",
    "gallery.yesterday": "Dün",

    "premium.title": "Premium Erişim",
    "premium.banner.title": "Her Şeyin Kilidini Aç",
    "premium.banner.desc": "Tüm paketlere, sınırsız AI aracına eriş ve reklamsız deneyim yaşa.",
    "premium.trial": "7 Gün Ücretsiz Dene",
    "premium.price": "Sonra ₺49.99/ay. İstediğin zaman iptal et.",
    "premium.feat.ai": "Sınırsız AI Üretimi",
    "premium.feat.ai.desc": "Dilediğin kadar özel boyama sayfası oluştur.",
    "premium.feat.packs": "Tüm Paketleri Aç",
    "premium.feat.packs.desc": "Prensesler, Uzay, Süper Kahramanlar ve fazlası.",
    "premium.feat.ads": "Reklamsız Deneyim",
    "premium.feat.ads.desc": "Tamamen dikkat dağıtıcı unsurlardan arınmış.",
    "premium.restore": "Satın Alımları Geri Yükle",

    // Pack Titles Mapping
    "pack.animals": "Sevimli Hayvanlar",
    "pack.cars": "Havalı Arabalar",
    "pack.fruits": "Leziz Meyveler",
    "pack.dinos": "Dinozor Dünyası",
    "pack.princess": "Prenses Şatosu",
    "pack.space": "Uzay Kaşifi",
    "pack.pokemon": "Poke-Tarzı",
    "pack.superhero": "Süper Kahramanlar",
  }
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  // Default to English or detect browser lang (keeping simple for now)
  const [language, setLanguage] = useState<Language>('tr'); // Default to Turkish as requested by user interaction language

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
