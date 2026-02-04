
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface Props {
  onSelectCustomer: () => void;
  onSelectCourier: () => void;
}

export const RoleSelectionScreen: React.FC<Props> = ({ onSelectCustomer, onSelectCourier }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoBox}>
          <View style={styles.ribbonVertical} />
          <View style={styles.ribbonHorizontal} />
          <Feather name="star" size={40} color="white" />
        </View>
        <Text style={styles.brandName}>هديتي</Text>
        <Text style={styles.subtitle}>اختر كيف تريد الانضمام إلينا</Text>
      </View>

      <View style={styles.options}>
        <Pressable onPress={onSelectCustomer} style={styles.optionButton}>
          <View style={styles.customerIcon}>
            <Feather name="user" size={32} color="#E0AAFF" />
          </View>
          <View style={styles.optionText}>
            <Text style={styles.optionTitle}>أنا عميل</Text>
            <Text style={styles.optionSubtitle}>أريد إرسال هدايا فاخرة</Text>
          </View>
        </Pressable>

        <Pressable onPress={onSelectCourier} style={styles.optionButton}>
          <View style={styles.courierIcon}>
            <Feather name="truck" size={32} color="#60A5FA" />
          </View>
          <View style={styles.optionText}>
            <Text style={styles.optionTitle}>أنا مندوب</Text>
            <Text style={styles.optionSubtitle}>أريد العمل وتوصيل الطلبات</Text>
          </View>
        </Pressable>
      </View>

      <View style={styles.footer}>
        <Feather name="star" size={16} color="#E0AAFF" />
        <Text style={styles.footerText}>بكل حب، في خدمتك دائماً</Text>
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
  header: {
    marginBottom: 48,
    alignItems: 'center',
  },
  logoBox: {
    width: 96,
    height: 96,
    backgroundColor: '#E0AAFF',
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#E0AAFF',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.4,
    shadowRadius: 30,
    elevation: 15,
    marginBottom: 24,
    transform: [{ rotate: '3deg' }],
    position: 'relative',
  },
  ribbonVertical: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: '50%',
    width: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    transform: [{ translateX: -8 }],
  },
  ribbonHorizontal: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '50%',
    height: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    transform: [{ translateY: -8 }],
  },
  brandName: {
    fontSize: 36,
    fontWeight: '900',
    color: '#1F2937',
  },
  subtitle: {
    fontSize: 16,
    color: '#9CA3AF',
    fontWeight: 'bold',
    marginTop: 8,
  },
  options: {
    width: '100%',
    gap: 24,
  },
  optionButton: {
    width: '100%',
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 2,
    borderColor: '#F9FAFB',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },
  customerIcon: {
    width: 64,
    height: 64,
    backgroundColor: 'rgba(224, 170, 255, 0.1)',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  courierIcon: {
    width: 64,
    height: 64,
    backgroundColor: 'rgba(219, 234, 254, 1)',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#1F2937',
  },
  optionSubtitle: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginTop: 4,
  },
  footer: {
    marginTop: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    opacity: 0.6,
  },
  footerText: {
    fontSize: 12,
    color: '#E0AAFF',
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
});
