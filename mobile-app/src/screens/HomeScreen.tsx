import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useI18n } from '../lib/i18n';
import { packs } from '../lib/mockData';

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2;

export default function HomeScreen() {
  const [prompt, setPrompt] = useState('');
  const navigation = useNavigation<any>();
  const { t, language, setLanguage } = useI18n();

  const handleGenerate = () => {
    if (prompt.trim()) {
      navigation.navigate('Generator', { prompt });
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'tr' : 'en');
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.logo}>{t('app.title')}</Text>
        <TouchableOpacity style={styles.langButton} onPress={toggleLanguage}>
          <Ionicons name="globe-outline" size={16} color="#666" />
          <Text style={styles.langText}>{language.toUpperCase()}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.heroSection}>
        <Text style={styles.heroTitle}>{t('home.hero.title')}</Text>
        <Text style={styles.heroSubtitle}>{t('home.hero.subtitle')}</Text>

        <View style={styles.inputContainer}>
          <Ionicons name="sparkles" size={20} color="#999" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder={t('home.hero.placeholder')}
            placeholderTextColor="#999"
            value={prompt}
            onChangeText={setPrompt}
          />
        </View>

        <TouchableOpacity style={styles.generateButton} onPress={handleGenerate}>
          <Text style={styles.generateButtonText}>{t('home.hero.button')}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.packsSection}>
        <View style={styles.packsHeader}>
          <View>
            <Text style={styles.packsTitle}>{t('home.packs.title')}</Text>
            <Text style={styles.packsSubtitle}>{t('home.packs.subtitle')}</Text>
          </View>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>{t('home.packs.viewAll')}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.packsGrid}>
          {packs.map((pack) => (
            <TouchableOpacity
              key={pack.id}
              style={styles.packCard}
              onPress={() => navigation.navigate('PackDetail', { packId: pack.id })}
            >
              <View style={styles.packImageContainer}>
                <Image source={{ uri: pack.cover }} style={styles.packImage} />
                {pack.isPremium ? (
                  <View style={styles.premiumBadge}>
                    <Ionicons name="lock-closed" size={12} color="#FFD700" />
                  </View>
                ) : (
                  <View style={styles.freeBadge}>
                    <Text style={styles.freeBadgeText}>{t('home.packs.free')}</Text>
                  </View>
                )}
              </View>
              <View style={styles.packInfo}>
                <Text style={styles.packTitle}>{t(`pack.${pack.id}`)}</Text>
                <Text style={styles.packCount}>{pack.count} {t('home.packs.pages')}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5F7',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF69B4',
  },
  langButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  langText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
    color: '#666',
  },
  heroSection: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF69B4',
    textAlign: 'center',
    marginBottom: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 16,
    width: '100%',
    height: 56,
    borderWidth: 2,
    borderColor: '#eee',
    marginBottom: 12,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  generateButton: {
    backgroundColor: '#FF69B4',
    borderRadius: 16,
    paddingVertical: 16,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#FF69B4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  generateButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  packsSection: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  packsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  packsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  packsSubtitle: {
    fontSize: 12,
    color: '#999',
  },
  viewAllText: {
    fontSize: 14,
    color: '#FF69B4',
    fontWeight: '600',
  },
  packsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  packCard: {
    width: cardWidth,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  packImageContainer: {
    width: '100%',
    aspectRatio: 1,
    position: 'relative',
  },
  packImage: {
    width: '100%',
    height: '100%',
  },
  premiumBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 12,
    padding: 6,
  },
  freeBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FFD700',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  freeBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#333',
  },
  packInfo: {
    padding: 12,
  },
  packTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  packCount: {
    fontSize: 11,
    color: '#999',
  },
});
