# MagicColors - Expo React Native App

Çocuklar için AI destekli boyama sayfası uygulaması.

## Kurulum

1. **Projeyi indirin** ve klasöre gidin:
```bash
cd mobile-app
```

2. **Bağımlılıkları yükleyin:**
```bash
npm install
```

3. **Uygulamayı başlatın:**
```bash
npm start
```

4. **Expo Go ile test edin:**
   - iOS: App Store'dan Expo Go'yu indirin
   - Android: Play Store'dan Expo Go'yu indirin
   - Terminalde görünen QR kodu tarayın

## API Bağlantısı

`src/lib/api.ts` dosyasındaki `API_BASE_URL` değişkenini Replit backend URL'niz ile güncelleyin:

```typescript
const API_BASE_URL = 'https://your-replit-url.repl.co';
```

## Özellikler

- 🎨 AI ile özel boyama sayfası oluşturma
- 📦 8 farklı tema paketi (Hayvanlar, Arabalar, Uzay, vb.)
- 🌍 Türkçe ve İngilizce dil desteği
- ⭐ Premium üyelik sistemi
- 🖼️ Kişisel galeri

## Ekranlar

- **Ana Sayfa:** Prompt girişi ve paket listesi
- **Generator:** AI ile boyama sayfası oluşturma
- **Galeri:** Kaydedilen resimler
- **Premium:** Üyelik sayfası
- **Paket Detay:** Paket içeriği görüntüleme

## Teknolojiler

- React Native + Expo
- React Navigation (Bottom Tabs + Stack)
- TypeScript
- @expo/vector-icons
