
import React, { useState } from 'react';
import { View, Text, Pressable, TextInput, StyleSheet, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface Props {
  onNext: (phone: string) => void;
}

export const LoginScreen: React.FC<Props> = ({ onNext }) => {
  const [phone, setPhone] = useState('');
  const [step, setStep] = useState<'PHONE' | 'OTP'>('PHONE');
  const [otp, setOtp] = useState(['', '', '', '']);

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
      {/* Branded Logo Section */}
      <View style={styles.logoSection}>
        <View style={styles.logoContainer}>
          <View style={styles.logoBox}>
            <View style={styles.glossyOverlay} />
            <View style={styles.ribbonVertical} />
            <View style={styles.ribbonHorizontal} />
            <Feather name="star" size={40} color="white" />
            <View style={styles.sparkle} />
          </View>
        </View>
        <Text style={styles.brandName}>هديتي</Text>
        <Text style={styles.brandTagline}>أرسل الفرحة لمن تحب بكل حب</Text>
      </View>

      {step === 'PHONE' ? (
        <View style={styles.formSection}>
          <View style={styles.formHeader}>
            <Text style={styles.formTitle}>مرحباً بك</Text>
            <Text style={styles.formSubtitle}>أدخل رقم جوالك للمتابعة</Text>
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.phoneInput}
              placeholder="5xxxxxxxx"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              placeholderTextColor="#9CA3AF"
            />
            <View style={styles.phoneIcon}>
              <Feather name="phone" size={22} color="#E0AAFF" />
            </View>
            <View style={styles.countryCode}>
              <Text style={styles.countryCodeText}>+966</Text>
            </View>
          </View>

            <Pressable onPress={() => {
              if (phone === '123') {
                // Special case for courier login
                onNext('123');
              } else {
                setStep('OTP');
              }
            }} style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>إرسال رمز التحقق</Text>
            </Pressable>
        </View>
      ) : (
        <View style={styles.formSection}>
          <View style={styles.formHeader}>
            <Text style={styles.formTitle}>رمز التحقق</Text>
            <Text style={styles.otpSubtitle}>تم إرسال الرمز إلى {phone}</Text>
          </View>

          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                style={styles.otpInput}
                value={digit}
                onChangeText={(value) => handleOtpChange(value, index)}
                keyboardType="numeric"
                maxLength={1}
                placeholderTextColor="#9CA3AF"
              />
            ))}
          </View>

          <Pressable onPress={() => onNext(phone)} style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>دخول</Text>
          </Pressable>

          <Pressable onPress={() => setStep('PHONE')} style={styles.changeNumberButton}>
            <Text style={styles.changeNumberText}>تغيير الرقم</Text>
            <Feather name="arrow-left" size={16} color="#E0AAFF" />
          </Pressable>
        </View>
      )}

      <View style={styles.footer}>
        <Text style={styles.footerText}>Hadiyati • Secure Marketplace</Text>
      </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFC',
  },
  logoSection: {
    marginBottom: 48,
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 24,
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
    transform: [{ rotate: '3deg' }],
    position: 'relative',
  },
  glossyOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 32,
  },
  ribbonVertical: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: '50%',
    width: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    transform: [{ translateX: -8 }],
  },
  ribbonHorizontal: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '50%',
    height: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    transform: [{ translateY: -8 }],
  },
  sparkle: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    backgroundColor: 'white',
    borderRadius: 4,
  },
  brandName: {
    fontSize: 30,
    fontWeight: '900',
    color: '#1F2937',
  },
  brandTagline: {
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: 'bold',
    marginTop: 8,
  },
  formSection: {
    width: '100%',
    gap: 24,
  },
  formHeader: {
    gap: 8,
    alignItems: 'center',
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#374151',
  },
  formSubtitle: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  inputContainer: {
    position: 'relative',
  },
  phoneInput: {
    width: '100%',
    height: 60,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#F9FAFB',
    borderRadius: 16,
    paddingHorizontal: 80,
    fontSize: 18,
    fontWeight: '900',
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
    transform: [{ translateY: -11 }],
  },
  countryCode: {
    position: 'absolute',
    left: 16,
    top: '50%',
    transform: [{ translateY: -9 }],
  },
  countryCodeText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#9CA3AF',
  },
  primaryButton: {
    width: '100%',
    height: 60,
    backgroundColor: '#E0AAFF',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#E0AAFF',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: '900',
    color: 'white',
  },
  otpSubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: 'bold',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  otpInput: {
    flex: 1,
    height: 64,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#F9FAFB',
    borderRadius: 16,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '900',
    color: '#374151',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  changeNumberButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    alignSelf: 'center',
  },
  changeNumberText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#E0AAFF',
    textTransform: 'uppercase',
  },
  footer: {
    marginTop: 64,
  },
  footerText: {
    fontSize: 10,
    color: '#D1D5DB',
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
});
