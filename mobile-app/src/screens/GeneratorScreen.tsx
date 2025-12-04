import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
  Share,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useI18n } from '../lib/i18n';

export default function GeneratorScreen() {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const { t } = useI18n();
  const prompt = route.params?.prompt || 'A magical surprise';

  const [isGenerating, setIsGenerating] = useState(true);
  const [resultImage, setResultImage] = useState<string | null>(null);

  useEffect(() => {
    generateImage();
  }, []);

  const generateImage = async () => {
    setIsGenerating(true);
    setResultImage(null);
    
    setTimeout(() => {
      setResultImage('https://via.placeholder.com/400x500/FFFFFF/000000?text=Coloring+Page');
      setIsGenerating(false);
    }, 3000);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this coloring page I created: ${prompt}`,
        url: resultImage || '',
      });
    } catch (error) {
      Alert.alert('Error', 'Could not share the image');
    }
  };

  const handleSave = () => {
    Alert.alert('Saved!', 'Image saved to your gallery');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#666" />
        <Text style={styles.backText}>{t('generator.back')}</Text>
      </TouchableOpacity>

      <View style={styles.imageContainer}>
        {isGenerating ? (
          <View style={styles.loadingContainer}>
            <View style={styles.sparkleContainer}>
              <Ionicons name="sparkles" size={48} color="#FF69B4" />
            </View>
            <Text style={styles.loadingText}>{t('generator.creating')}</Text>
            <ActivityIndicator size="large" color="#FF69B4" style={styles.loader} />
          </View>
        ) : resultImage ? (
          <Image source={{ uri: resultImage }} style={styles.resultImage} resizeMode="contain" />
        ) : null}
      </View>

      {!isGenerating && resultImage && (
        <View style={styles.actionsContainer}>
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.actionButton} onPress={handleSave}>
              <Ionicons name="download-outline" size={20} color="#FF69B4" />
              <Text style={styles.actionButtonText}>{t('generator.savePdf')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, styles.printButton]}>
              <Ionicons name="print-outline" size={20} color="#333" />
              <Text style={[styles.actionButtonText, styles.printButtonText]}>{t('generator.print')}</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
            <Ionicons name="share-outline" size={20} color="#666" />
            <Text style={styles.shareButtonText}>{t('generator.share')}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.retryButton} onPress={generateImage}>
            <Text style={styles.retryButtonText}>{t('generator.tryAgain')}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5F7',
    paddingTop: 60,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  backText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 8,
  },
  imageContainer: {
    flex: 1,
    marginHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  sparkleContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#FF69B4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  loadingText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF69B4',
    marginBottom: 16,
  },
  loader: {
    marginTop: 8,
  },
  resultImage: {
    width: '100%',
    height: '100%',
  },
  actionsContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 14,
    marginRight: 8,
    borderWidth: 2,
    borderColor: '#FF69B4',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF69B4',
    marginLeft: 8,
  },
  printButton: {
    marginRight: 0,
    marginLeft: 8,
    backgroundColor: '#FFD700',
    borderColor: '#FFD700',
  },
  printButtonText: {
    color: '#333',
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    marginBottom: 12,
  },
  shareButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    marginLeft: 8,
  },
  retryButton: {
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  retryButtonText: {
    fontSize: 14,
    color: '#666',
  },
});
