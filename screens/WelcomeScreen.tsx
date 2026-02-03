
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface Props {
  onStart: () => void;
}

export const WelcomeScreen: React.FC<Props> = ({ onStart }) => {
  return (
    <View style={styles.container}>
      <View style={styles.backgroundElements}>
        <View style={styles.backgroundCircle1} />
        <View style={styles.backgroundCircle2} />
        <View style={styles.cloud1} />
        <View style={styles.cloud2} />
      </View>

      <View style={styles.content}>
        <View style={styles.balloonContainer}>
          <View style={styles.balloon}>
            <View style={styles.balloonHighlight1} />
            <View style={styles.balloonHighlight2} />
            <View style={styles.balloonRibbon1} />
            <View style={styles.balloonRibbon2} />
            <View style={styles.balloonRibbon3} />
          </View>

          <View style={styles.cords} />

          <View style={styles.basket}>
            <View style={styles.basketRibbonVertical} />
            <View style={styles.basketRibbonHorizontal} />
            <View style={styles.giftIcon}>
              <Feather name="gift" size={28} color="white" />
            </View>
            <View style={styles.bow1} />
            <View style={styles.bow2} />
          </View>
        </View>

        <View style={styles.textContent}>
          <View style={styles.tagline}>
            <Feather name="star" size={12} color="#E0AAFF" />
            <Text style={styles.taglineText}>هدايا تُحلق في سماء من تحب</Text>
          </View>
          <Text style={styles.title}>
            مرحباً بك في{'\n'}
            <Text style={styles.titleHighlight}>هديتي</Text>
          </Text>
          <Text style={styles.subtitle}>
            ارسم الابتسامة على وجوههم بلمسة واحدة فاخرة
          </Text>
        </View>
      </View>

      <View style={styles.bottomSection}>
        <Pressable onPress={onStart} style={styles.startButton}>
          <Text style={styles.startButtonText}>ابدأ الرحلة الآن</Text>
          <View style={styles.sendIcon}>
            <Feather name="send" size={18} color="white" />
          </View>
        </Pressable>
        <Text style={styles.footerText}>Hadiyati Marketplace</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 24,
    backgroundColor: '#FFFFFC',
  },
  backgroundElements: {
    ...StyleSheet.absoluteFillObject,
  },
  backgroundCircle1: {
    position: 'absolute',
    top: -60,
    right: -60,
    width: 256,
    height: 256,
    backgroundColor: 'rgba(224, 170, 255, 0.2)',
    borderRadius: 128,
  },
  backgroundCircle2: {
    position: 'absolute',
    bottom: -40,
    left: -40,
    width: 224,
    height: 224,
    backgroundColor: 'rgba(224, 170, 255, 0.1)',
    borderRadius: 112,
  },
  cloud1: {
    position: 'absolute',
    top: 80,
    left: 40,
    width: 80,
    height: 32,
    backgroundColor: 'rgba(156, 163, 175, 0.5)',
    borderRadius: 16,
  },
  cloud2: {
    position: 'absolute',
    top: 160,
    right: 32,
    width: 112,
    height: 40,
    backgroundColor: 'rgba(156, 163, 175, 0.4)',
    borderRadius: 20,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: 16,
  },
  balloonContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  balloon: {
    width: 144,
    height: 192,
    backgroundColor: '#E0AAFF',
    borderTopLeftRadius: 72,
    borderTopRightRadius: 72,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    shadowColor: '#E0AAFF',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.4,
    shadowRadius: 30,
    elevation: 15,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    position: 'relative',
  },
  balloonHighlight1: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 36,
    width: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  balloonHighlight2: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 36,
    width: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  balloonRibbon1: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    height: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    transform: [{ translateY: -6 }],
  },
  balloonRibbon2: {
    position: 'absolute',
    top: '33%',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  balloonRibbon3: {
    position: 'absolute',
    bottom: '25%',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  cords: {
    width: 112,
    height: 48,
    marginTop: -2,
  },
  basket: {
    width: 80,
    height: 80,
    backgroundColor: 'white',
    borderRadius: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.1,
    shadowRadius: 25,
    elevation: 10,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -8,
    position: 'relative',
  },
  basketRibbonVertical: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: '50%',
    width: 16,
    backgroundColor: 'rgba(224, 170, 255, 0.2)',
    transform: [{ translateX: -8 }],
  },
  basketRibbonHorizontal: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '50%',
    height: 16,
    backgroundColor: 'rgba(224, 170, 255, 0.2)',
    transform: [{ translateY: -8 }],
  },
  giftIcon: {
    width: 56,
    height: 56,
    backgroundColor: '#E0AAFF',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  bow1: {
    position: 'absolute',
    top: -10,
    left: '50%',
    width: 20,
    height: 12,
    backgroundColor: '#E0AAFF',
    borderRadius: 6,
    transform: [{ translateX: -10 }, { rotate: '-30deg' }],
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  bow2: {
    position: 'absolute',
    top: -10,
    right: '50%',
    width: 20,
    height: 12,
    backgroundColor: '#E0AAFF',
    borderRadius: 6,
    transform: [{ translateX: 10 }, { rotate: '30deg' }],
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  textContent: {
    alignItems: 'center',
    paddingHorizontal: 24,
    gap: 12,
  },
  tagline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(224, 170, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(224, 170, 255, 0.2)',
  },
  taglineText: {
    fontSize: 9,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: '#E0AAFF',
  },
  title: {
    fontSize: 30,
    fontWeight: '900',
    color: '#1F2937',
    textAlign: 'center',
    lineHeight: 36,
  },
  titleHighlight: {
    color: '#E0AAFF',
  },
  subtitle: {
    fontSize: 16,
    color: '#9CA3AF',
    fontWeight: 'bold',
    textAlign: 'center',
    maxWidth: 240,
    lineHeight: 24,
  },
  bottomSection: {
    width: '100%',
    paddingBottom: 32,
    alignItems: 'center',
  },
  startButton: {
    width: '100%',
    height: 64,
    backgroundColor: '#E0AAFF',
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 12,
    shadowColor: '#E0AAFF',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 30,
    elevation: 15,
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: '900',
    color: 'white',
  },
  sendIcon: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 8,
    borderRadius: 20,
  },
  footerText: {
    fontSize: 8,
    color: '#9CA3AF',
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 5,
    marginTop: 24,
    opacity: 0.3,
  },
});
