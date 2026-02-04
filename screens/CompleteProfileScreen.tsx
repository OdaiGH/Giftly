
import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, TextInput, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Props {
  onNext: () => void;
}

export const CompleteProfileScreen: React.FC<Props> = ({ onNext }) => {
  const insets = useSafeAreaInsets();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [birthDate, setBirthDate] = useState('');

  return (
    <ScrollView style={styles.container} contentContainerStyle={[styles.content, { paddingTop: insets.top + 32 }]}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Feather name="star" size={32} color="#E0AAFF" />
        </View>
        <Text style={styles.title}>أكمل بياناتك</Text>
        <Text style={styles.subtitle}>خطوة بسيطة لبدء رحلة الهدايا</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>الاسم بالكامل</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="مثال: محمد علي"
              value={name}
              onChangeText={setName}
              placeholderTextColor="#9CA3AF"
            />
            <View style={styles.iconWrapper}>
              <Feather name="user" size={18} color="#D1D5DB" />
            </View>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>البريد الإلكتروني</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="example@mail.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#9CA3AF"
            />
            <View style={styles.iconWrapper}>
              <Feather name="mail" size={18} color="#D1D5DB" />
            </View>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>تاريخ الميلاد</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="YYYY-MM-DD"
              value={birthDate}
              onChangeText={setBirthDate}
              placeholderTextColor="#9CA3AF"
            />
            <View style={styles.iconWrapper}>
              <Feather name="calendar" size={18} color="#D1D5DB" />
            </View>
          </View>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <Pressable onPress={onNext} style={styles.button}>
          <Text style={styles.buttonText}>حفظ والمتابعة</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFC',
  },
  content: {
    paddingHorizontal: 32,
    paddingBottom: 100,
  },
  header: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 32,
  },
  iconContainer: {
    width: 64,
    height: 64,
    backgroundColor: 'rgba(224, 170, 255, 0.2)',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: '#1F2937',
    textAlign: 'center',
    fontFamily: 'System',
  },
  subtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: '500',
    marginTop: 4,
    textAlign: 'center',
    fontFamily: 'System',
  },
  form: {
    flex: 1,
    gap: 16,
  },
  inputGroup: {
    gap: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: '900',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginRight: 8,
  },
  inputContainer: {
    position: 'relative',
  },
  input: {
    width: '100%',
    height: 52,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#F9FAFB',
    borderRadius: 16,
    paddingHorizontal: 48,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconWrapper: {
    position: 'absolute',
    right: 16,
    top: '50%',
    transform: [{ translateY: -9 }],
  },
  buttonContainer: {
    paddingTop: 16,
    paddingBottom: 24,
  },
  button: {
    width: '100%',
    height: 60,
    backgroundColor: '#E0AAFF',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '900',
    color: 'white',
  },
});
