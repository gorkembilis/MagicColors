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
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useI18n } from '../lib/i18n';

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2;

const mockGallery = [
  { id: '1', prompt: 'Flying cat', imageUrl: 'https://via.placeholder.com/200x200/FFFFFF/000000?text=Cat' },
  { id: '2', prompt: 'Race car', imageUrl: 'https://via.placeholder.com/200x200/FFFFFF/000000?text=Car' },
  { id: '3', prompt: 'Princess', imageUrl: 'https://via.placeholder.com/200x200/FFFFFF/000000?text=Princess' },
];

export default function GalleryScreen() {
  const navigation = useNavigation<any>();
  const { t } = useI18n();
  const savedArt = mockGallery;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('gallery.title')}</Text>
      </View>

      {savedArt.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIcon}>
            <Ionicons name="download-outline" size={40} color="#999" />
          </View>
          <Text style={styles.emptyTitle}>{t('gallery.empty.title')}</Text>
          <Text style={styles.emptyDesc}>{t('gallery.empty.desc')}</Text>
          <TouchableOpacity 
            style={styles.createButton}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.createButtonText}>{t('gallery.createNow')}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.grid}>
            {savedArt.map((art) => (
              <View key={art.id} style={styles.card}>
                <View style={styles.imageContainer}>
                  <Image source={{ uri: art.imageUrl }} style={styles.image} />
                </View>
                <View style={styles.cardContent}>
                  <Text style={styles.prompt} numberOfLines={1}>{art.prompt}</Text>
                  <View style={styles.cardActions}>
                    <TouchableOpacity style={styles.iconButton}>
                      <Ionicons name="print-outline" size={18} color="#666" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconButton}>
                      <Ionicons name="share-outline" size={18} color="#666" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      )}
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
    paddingBottom: 16,
  },
  title: {
    fontSize: 24,
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
  card: {
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
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#f5f5f5',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  cardContent: {
    padding: 12,
  },
  prompt: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  iconButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  emptyDesc: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginBottom: 24,
  },
  createButton: {
    backgroundColor: '#FF69B4',
    borderRadius: 24,
    paddingHorizontal: 32,
    paddingVertical: 14,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
