import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useI18n } from '../lib/i18n';
import { packs } from '../lib/mockData';

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2;

export default function PackDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const { t } = useI18n();
  const packId = route.params?.packId;

  const pack = packs.find(p => p.id === packId);

  if (!pack) {
    return (
      <View style={styles.container}>
        <Text>Pack not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#666" />
          <Text style={styles.backText}>{t('pack.back')}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.packHeader}>
        <Text style={styles.packTitle}>{t(`pack.${pack.id}`)}</Text>
        <Text style={styles.packCount}>{pack.count} {t('home.packs.pages')}</Text>
      </View>

      {pack.isPremium && (
        <View style={styles.premiumBanner}>
          <View style={styles.premiumContent}>
            <View style={styles.premiumIcon}>
              <Ionicons name="lock-closed" size={20} color="#FFD700" />
            </View>
            <View>
              <Text style={styles.premiumTitle}>{t('pack.premiumLabel')}</Text>
              <Text style={styles.premiumDesc}>{t('pack.premiumDesc')}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.unlockButton}>
            <Text style={styles.unlockButtonText}>{t('pack.unlock')}</Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.grid}>
          {pack.images.map((image, index) => (
            <TouchableOpacity
              key={image.id}
              style={[styles.imageCard, pack.isPremium && index > 1 && styles.lockedCard]}
            >
              <Image source={{ uri: image.url }} style={styles.image} />
              {pack.isPremium && index > 1 && (
                <View style={styles.lockOverlay}>
                  <Ionicons name="lock-closed" size={24} color="#fff" />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5F7',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 16,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 8,
  },
  packHeader: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  packTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  packCount: {
    fontSize: 14,
    color: '#999',
  },
  premiumBanner: {
    marginHorizontal: 16,
    backgroundColor: '#333',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  premiumContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  premiumIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,215,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  premiumTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  premiumDesc: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
  },
  unlockButton: {
    backgroundColor: '#FFD700',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  unlockButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  scrollView: {
    flex: 1,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    paddingBottom: 100,
  },
  imageCard: {
    width: cardWidth,
    aspectRatio: 1,
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
  lockedCard: {
    opacity: 0.7,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  lockOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
