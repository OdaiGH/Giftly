
import React, { useState } from 'react';
import { View, Text, Pressable, TextInput, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Props {
  onNext: () => void;
  onBack: () => void;
}

export const CourierLoginScreen: React.FC<Props> = ({ onNext, onBack }) => {
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState<'LOGIN' | 'DOCS'>('LOGIN');

  return (
    <View style={[styles.container, { paddingTop: insets.top + 32 }]}>
      <Pressable onPress={onBack} style={styles.backButton}>
        <Feather name="chevron-right" size={24} color="#9CA3AF" />
      </Pressable>

      {step === 'LOGIN' ? (
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>تسجيل المندوب</Text>
            <Text style={styles.subtitle}>انضم لأسرة مندوبين هديتي</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>رقم الجوال</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="5xxxxxxxx"
                  keyboardType="phone-pad"
                  placeholderTextColor="#9CA3AF"
                />
                <View style={styles.phoneIcon}>
                  <Feather name="phone" size={20} color="#9CA3AF" />
                </View>
              </View>
            </View>

            <Pressable onPress={() => setStep('DOCS')} style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>المتابعة للبيانات</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>بيانات المركبة</Text>
            <Text style={styles.subtitle}>نحتاج لبعض الوثائق للتحقق</Text>
          </View>

          <View style={styles.form}>
            <Pressable style={styles.documentCard}>
              <View style={styles.documentLeft}>
                <View style={styles.documentIcon}>
                  <Feather name="shield" size={24} color="#E0AAFF" />
                </View>
                <Text style={styles.documentText}>رخصة القيادة</Text>
              </View>
              <Text style={styles.uploadText}>رفع صورة</Text>
            </Pressable>

            <Pressable style={styles.documentCard}>
              <View style={styles.documentLeft}>
                <View style={styles.documentIcon}>
                  <Feather name="truck" size={24} color="#E0AAFF" />
                </View>
                <Text style={styles.documentText}>استمارة المركبة</Text>
              </View>
              <Text style={styles.uploadText}>رفع صورة</Text>
            </Pressable>

            <Pressable onPress={onNext} style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>إرسال للتدقيق</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
    backgroundColor: '#FFFFFC',
  },
  backButton: {
    alignSelf: 'flex-start',
    padding: 8,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 32,
  },
  content: {
    flex: 1,
    gap: 32,
  },
  header: {
    gap: 8,
  },
  title: {
    fontSize: 30,
    fontWeight: '900',
    color: '#1F2937',
  },
  subtitle: {
    fontSize: 16,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  form: {
    gap: 24,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#374151',
  },
  inputContainer: {
    position: 'relative',
  },
  input: {
    width: '100%',
    height: 56,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#F9FAFB',
    borderRadius: 16,
    paddingHorizontal: 48,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'left',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  phoneIcon: {
    position: 'absolute',
    right: 16,
    top: '50%',
    transform: [{ translateY: -10 }],
  },
  primaryButton: {
    width: '100%',
    height: 64,
    backgroundColor: '#E0AAFF',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#E0AAFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: '900',
    color: 'white',
  },
  documentCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: '#F9FAFB',
    borderStyle: 'dashed',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  documentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  documentIcon: {
    width: 48,
    height: 48,
    backgroundColor: 'rgba(224, 170, 255, 0.1)',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  documentText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#374151',
  },
  uploadText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#E0AAFF',
  },
});
