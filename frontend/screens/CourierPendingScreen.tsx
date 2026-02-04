
import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface Props {
  onComplete: () => void;
}

export const CourierPendingScreen: React.FC<Props> = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <View style={styles.container}>
      <View style={styles.loaderContainer}>
        <View style={styles.loaderBackground} />
        <View style={styles.loaderIcon}>
          <Feather name="loader" size={64} color="#E0AAFF" />
        </View>
        <View style={styles.clockIcon}>
          <Feather name="clock" size={24} color="#E0AAFF" />
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>في انتظار التفعيل</Text>
        <Text style={styles.subtitle}>
          شكراً لانضمامك! يقوم فريق الإدارة الآن بمراجعة مستنداتك وتفعيل حسابك. لن يستغرق الأمر طويلاً.
        </Text>
      </View>

      <View style={styles.infoBox}>
        <View style={styles.infoIcon}>
          <Feather name="shield" size={32} color="#E0AAFF" />
        </View>
        <Text style={styles.infoText}>
          نحن نولي الأمان أهمية قصوى لضمان تجربة مميزة لك ولعملائنا.
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
    marginBottom: 40,
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
  clockIcon: {
    position: 'absolute',
    bottom: -16,
    right: -16,
    width: 48,
    height: 48,
    backgroundColor: 'white',
    borderRadius: 24,
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
    gap: 16,
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
  infoBox: {
    position: 'absolute',
    bottom: 48,
    left: 48,
    right: 48,
    backgroundColor: 'rgba(224, 170, 255, 0.1)',
    borderRadius: 32,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    borderWidth: 1,
    borderColor: 'rgba(224, 170, 255, 0.2)',
  },
  infoIcon: {
    flexShrink: 1,
  },
  infoText: {
    fontSize: 12,
    color: '#E0AAFF',
    fontWeight: '900',
    flex: 1,
    lineHeight: 16,
    textAlign: 'right',
  },
});
