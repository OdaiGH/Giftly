
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface Props {
  onBackToHome: () => void;
}

export const OrderSuccessScreen: React.FC<Props> = ({ onBackToHome }) => {
  return (
    <View style={styles.container}>
      <View style={styles.backgroundCircle} />

      <View style={styles.checkContainer}>
        <View style={styles.checkIcon}>
          <Feather name="check" size={64} color="white" />
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>تم طلبك بنجاح!</Text>
        <Text style={styles.subtitle}>
          تم استلام طلبك وهو الآن قيد المراجعة. سيتم إرسال هدية مميزة لمن تحب قريباً.
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <Pressable onPress={onBackToHome} style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>العودة للرئيسية</Text>
          <Feather name="arrow-right" size={20} color="white" />
        </Pressable>
        <Pressable style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>متابعة الطلب بالتفصيل</Text>
        </Pressable>
      </View>

      <View style={styles.decorativeIcons}>
        <Text style={[styles.icon, styles.icon1]}>🎈</Text>
        <Text style={[styles.icon, styles.icon2]}>✨</Text>
        <Text style={[styles.icon, styles.icon3]}>🌸</Text>
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
  backgroundCircle: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 256,
    height: 256,
    backgroundColor: 'rgba(224, 170, 255, 0.2)',
    borderRadius: 128,
    transform: [{ translateX: -128 }, { translateY: -128 }],
  },
  checkContainer: {
    marginBottom: 32,
  },
  checkIcon: {
    width: 128,
    height: 128,
    backgroundColor: '#E0AAFF',
    borderRadius: 64,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#E0AAFF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
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
    color: '#6B7280',
    fontWeight: '500',
    textAlign: 'center',
    maxWidth: 250,
    lineHeight: 24,
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
  },
  primaryButton: {
    width: '100%',
    height: 56,
    backgroundColor: '#E0AAFF',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 12,
    shadowColor: '#E0AAFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  secondaryButton: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#E0AAFF',
  },
  decorativeIcons: {
    ...StyleSheet.absoluteFillObject,
    pointerEvents: 'none',
  },
  icon: {
    position: 'absolute',
    fontSize: 30,
  },
  icon1: {
    top: 80,
    left: 40,
  },
  icon2: {
    bottom: 160,
    right: 40,
  },
  icon3: {
    top: '50%',
    left: 16,
    opacity: 0.3,
  },
});
