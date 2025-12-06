# MagicColors - Mobil Uygulama Build Kılavuzu

Bu kılavuz, MagicColors web uygulamasını iOS ve Android mağazalarına yüklemek için gereken adımları açıklar.

## Otomatik Build (GitHub Actions)

Projeyi GitHub'a push ettiğinizde otomatik olarak APK oluşturulur:

1. **Projeyi GitHub'a Push Edin**
2. **Actions sekmesine gidin**
3. **"Android APK Build" workflow'unu çalıştırın**
4. **Artifacts bölümünden APK'yı indirin**

### Workflow Dosyaları:
- `.github/workflows/android-build.yml` - Android APK build
- `.github/workflows/ios-build.yml` - iOS build (simulator)

---

## Gereksinimler

### Tüm Platformlar için:
- Node.js 18+ 
- npm veya yarn
- Git

### iOS için:
- macOS bilgisayar (zorunlu)
- Xcode 15+
- Apple Developer hesabı ($99/yıl)
- CocoaPods (`sudo gem install cocoapods`)

### Android için:
- Android Studio
- JDK 17+
- Google Play Developer hesabı ($25 tek seferlik)

## Kurulum Adımları

### 1. Projeyi Klonlayın

```bash
git clone <your-replit-repo-url>
cd MagicColors
npm install
```

### 2. Environment Değişkenlerini Ayarlayın

Yerel makinenizde `.env` dosyası oluşturun:

```env
DATABASE_URL=your_production_database_url
SESSION_SECRET=your_session_secret
AI_INTEGRATIONS_GEMINI_API_KEY=your_gemini_api_key
AI_INTEGRATIONS_GEMINI_BASE_URL=your_gemini_base_url
```

### 3. Web Uygulamasını Build Edin

```bash
npx vite build --outDir www
```

### 4. Capacitor Sync

```bash
npx cap sync
```

---

## iOS Build (App Store)

### 1. Xcode Projesini Açın

```bash
npx cap open ios
```

### 2. Xcode Ayarları

1. **Signing & Capabilities** sekmesine gidin
2. Team olarak Apple Developer hesabınızı seçin
3. Bundle Identifier'ı `com.magiccolors.app` olarak bırakın veya değiştirin

### 3. App Icons ve Launch Screen

- `ios/App/App/Assets.xcassets/AppIcon.appiconset/` klasörüne uygulama ikonlarını ekleyin
- 1024x1024 ana ikon gerekli

### 4. Archive ve App Store'a Yükleme

1. Xcode'da Product > Archive seçin
2. Organizer'da "Distribute App" seçin
3. App Store Connect'e yükleyin

### 5. App Store Connect

1. [App Store Connect](https://appstoreconnect.apple.com) adresine gidin
2. Yeni uygulama oluşturun
3. Açıklama, ekran görüntüleri ve metadata ekleyin
4. Review için gönderin

---

## Android Build (Google Play)

### 1. Android Studio Projesini Açın

```bash
npx cap open android
```

### 2. Signing Key Oluşturun

```bash
keytool -genkey -v -keystore magiccolors-release.keystore -alias magiccolors -keyalg RSA -keysize 2048 -validity 10000
```

### 3. Build Gradle Ayarları

`android/app/build.gradle` dosyasına signing config ekleyin:

```gradle
android {
    signingConfigs {
        release {
            storeFile file('magiccolors-release.keystore')
            storePassword 'your_password'
            keyAlias 'magiccolors'
            keyPassword 'your_password'
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}
```

### 4. Release APK/AAB Build

Android Studio'da:
1. Build > Generate Signed Bundle / APK
2. Android App Bundle (AAB) seçin
3. Release build type seçin
4. AAB dosyası `android/app/release/` klasöründe oluşur

### 5. Google Play Console

1. [Google Play Console](https://play.google.com/console) adresine gidin
2. Yeni uygulama oluşturun
3. AAB dosyasını yükleyin
4. Store listing bilgilerini doldurun
5. Review için gönderin

---

## API Server Ayarları

Mobil uygulama yayınlandığında, API sunucunuzun public erişime açık olması gerekir:

### Replit'te Deploy

1. Replit'te "Publish" butonuna tıklayın
2. Reserved VM veya Autoscale seçin
3. Production URL'inizi alın (örn: `https://magiccolors.replit.app`)

### Capacitor Config Güncelleme

`capacitor.config.ts` dosyasında production URL ekleyin:

```typescript
const config: CapacitorConfig = {
  // ... diğer ayarlar
  server: {
    url: 'https://your-production-url.replit.app',
    cleartext: true
  }
};
```

---

## Önemli Notlar

1. **Test Edin**: Release build'i telefonda test edin
2. **Güvenlik**: Production'da HTTPS kullanın
3. **API Anahtarları**: Hassas bilgileri environment variable olarak saklayın
4. **Ekran Görüntüleri**: Her platform için doğru boyutlarda ekran görüntüleri hazırlayın

## Yardımcı Komutlar

```bash
# Geliştirme modu
npm run dev

# Web build
npx vite build --outDir www

# Capacitor sync
npx cap sync

# iOS aç
npx cap open ios

# Android aç
npx cap open android

# Canlı yenileme (geliştirme)
npx cap run ios --livereload --external
npx cap run android --livereload --external
```

## Sorun Giderme

### iOS Simulator Hatası
```bash
npx cap doctor
```

### Android Build Hatası
- Android Studio'da File > Invalidate Caches / Restart

### CocoaPods Hatası
```bash
cd ios/App && pod install
```

---

## İletişim

Sorularınız için: gorkembilis@gmail.com
