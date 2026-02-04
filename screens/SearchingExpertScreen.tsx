
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface Props {
  onComplete: () => void;
}

export const SearchingExpertScreen: React.FC<Props> = ({ onComplete }) => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const dotsInterval = setInterval(() => {
      setDots(prev => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);

    const timer = setTimeout(() => {
      onComplete();
    }, 5000);

    return () => {
      clearInterval(dotsInterval);
      clearTimeout(timer);
    };
  }, [onComplete]);

  return (
    <View style={styles.container}>
      <View style={styles.loaderContainer}>
        <View style={styles.loaderBackground} />
        <View style={styles.loaderIcon}>
          <Feather name="loader" size={64} color="#E0AAFF" />
        </View>
        <View style={styles.giftIcon}>
          <Feather name="gift" size={20} color="#E0AAFF" />
        </View>
        <View style={styles.shieldIcon}>
          <Feather name="shield" size={20} color="#E0AAFF" />
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>جاري البحث عن خبير هدايا{dots}</Text>
        <Text style={styles.subtitle}>
          نقوم الآن باختيار أفضل خبير متاح لتنسيق هديتك بكل حب وإتقان
        </Text>

        <View style={styles.expertsContainer}>
          <View style={styles.expertsList}>
            {[1, 2, 3, 4].map(i => (
              <View key={i} style={styles.expertAvatar}>
                <Image
                  source={{ uri: `https://picsum.photos/seed/expert${i}/100/100` }}
                  style={styles.expertImage}
                />
              </View>
            ))}
          </View>
          <Text style={styles.expertsCount}>+50 خبير متصل</Text>
        </View>
      </View>

      <View style={styles.infoBox}>
        <View style={styles.infoIcon}>
          <Feather name="star" size={16} color="#10B981" />
        </View>
        <Text style={styles.infoText}>
          سيقوم الخبير بالتواصل معك فوراً عبر الدردشة لمناقشة تفاصيل الهدية وتنسيقها.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    backgroundColor: '#FFFFFC',
  },
  loaderContainer: {
    marginBottom: 48,
    position: 'relative',
  },
  loaderBackground: {
    width: 128,
    height: 128,
    backgroundColor: 'rgba(224, 170, 255, 0.1)',
    borderRadius: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loaderIcon: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -32 }, { translateY: -32 }],
  },
  giftIcon: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 40,
    height: 40,
    backgroundColor: 'white',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  shieldIcon: {
    position: 'absolute',
    bottom: -8,
    left: -8,
    width: 40,
    height: 40,
    backgroundColor: 'white',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    alignItems: 'center',
    gap: 24,
    marginBottom: 48,
  },
  title: {
    fontSize: 30,
    fontWeight: '900',
    color: '#1F2937',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#9CA3AF',
    fontWeight: '500',
    textAlign: 'center',
    maxWidth: 280,
    lineHeight: 24,
  },
  expertsContainer: {
    alignItems: 'center',
    gap: 12,
  },
  expertsList: {
    flexDirection: 'row',
    gap: -12,
  },
  expertAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'white',
    backgroundColor: '#F3F4F6',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  expertImage: {
    width: '100%',
    height: '100%',
  },
  expertsCount: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: 'bold',
  },
  infoBox: {
    position: 'absolute',
    bottom: 48,
    left: 48,
    right: 48,
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F9FAFB',
  },
  infoIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoText: {
    fontSize: 10,
    color: '#374151',
    fontWeight: 'bold',
    flex: 1,
    lineHeight: 14,
  },
});
