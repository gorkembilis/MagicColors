import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useI18n } from '../lib/i18n';

export default function PremiumScreen() {
  const { t } = useI18n();

  const features = [
    { icon: 'sparkles', title: t('premium.feat.ai') || 'Unlimited AI Creation', desc: 'Create as many custom pages as you want.' },
    { icon: 'albums', title: t('premium.feat.packs') || 'Unlock All Packs', desc: 'Princesses, Space, Superheroes & more.' },
    { icon: 'ban', title: t('premium.feat.ads') || 'No More Ads', desc: 'A completely distraction-free experience.' },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('premium.title')}</Text>
      </View>

      <View style={styles.bannerContainer}>
        <View style={styles.banner}>
          <Ionicons name="star" size={48} color="#FFD700" />
          <Text style={styles.bannerTitle}>{t('premium.banner.title')}</Text>
          <Text style={styles.bannerDesc}>{t('premium.banner.desc')}</Text>
        </View>
      </View>

      <View style={styles.featuresContainer}>
        {features.map((feature, index) => (
          <View key={index} style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Ionicons name={feature.icon as any} size={24} color="#FF69B4" />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureDesc}>{feature.desc}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.ctaContainer}>
        <TouchableOpacity style={styles.trialButton}>
          <Text style={styles.trialButtonText}>{t('premium.trial')}</Text>
        </TouchableOpacity>
        <Text style={styles.priceText}>{t('premium.price')}</Text>
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
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  bannerContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  banner: {
    backgroundColor: '#FF69B4',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
  },
  bannerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 16,
    marginBottom: 8,
  },
  bannerDesc: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
  },
  featuresContainer: {
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  featureItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF0F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
    justifyContent: 'center',
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  featureDesc: {
    fontSize: 13,
    color: '#666',
  },
  ctaContainer: {
    paddingHorizontal: 16,
    paddingBottom: 100,
    alignItems: 'center',
  },
  trialButton: {
    backgroundColor: '#FFD700',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 48,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  trialButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  priceText: {
    fontSize: 13,
    color: '#999',
  },
});
