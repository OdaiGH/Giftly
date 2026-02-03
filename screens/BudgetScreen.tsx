
import React, { useState } from 'react';
import { View, Text, Pressable, TextInput, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface Props {
  onNext: () => void;
  onBack: () => void;
}

export const BudgetScreen: React.FC<Props> = ({ onNext, onBack }) => {
  const [description, setDescription] = useState('');

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Pressable onPress={onBack} style={styles.backButton}>
          <Feather name="chevron-left" size={20} color="#9CA3AF" />
        </Pressable>
        <Text style={styles.title}>وصف الهدية</Text>
        <View style={styles.spacer} />
      </View>

      <View style={styles.mainContent}>
        <View style={styles.instruction}>
          <Feather name="star" size={18} color="#E0AAFF" />
          <Text style={styles.instructionText}>اكتب وصف الهدية المخصصة المناسبة لك</Text>
        </View>

        <View style={styles.textAreaContainer}>
          <TextInput
            style={styles.textArea}
            value={description}
            onChangeText={setDescription}
            placeholder="مثال: أريد باقة ورد حمراء مع شوكولاتة باتشي مغلفة بشريطة ذهبية وكرت مكتوب عليه..."
            placeholderTextColor="#9CA3AF"
            multiline
            textAlignVertical="top"
          />
          <View style={styles.penIcon}>
            <Feather name="edit-2" size={20} color="#D1D5DB" />
          </View>
        </View>

        <View style={styles.infoBox}>
          <View style={styles.infoIcon}>
            <Feather name="message-circle" size={14} color="#3B82F6" />
          </View>
          <Text style={styles.infoText}>
            إذا ماتعرف وش الهدية، لا تقلق! اترك الوصف فارغاً وسيقوم مندوبنا بترتيبها وتنسيقها معك خطوة بخطوة.
          </Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <Pressable onPress={onNext} style={styles.button}>
          <Text style={styles.buttonText}>
            {description.trim() ? 'المتابعة لاختيار المدينة' : 'تخطي والترتيب مع المندوب'}
          </Text>
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
    paddingHorizontal: screenWidth * 0.06, // 6% of screen width
    paddingTop: screenHeight * 0.03,
    paddingBottom: screenHeight * 0.15,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: screenHeight * 0.04,
  },
  backButton: {
    padding: 8,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: screenWidth * 0.05, // Responsive font size
    fontWeight: 'bold',
    color: '#1F2937',
  },
  spacer: {
    width: screenWidth * 0.1,
  },
  mainContent: {
    flex: 1,
  },
  instruction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: screenHeight * 0.03,
  },
  instructionText: {
    fontSize: screenWidth * 0.045,
    fontWeight: 'bold',
    color: '#4B5563',
    flex: 1,
    lineHeight: screenWidth * 0.06,
  },
  textAreaContainer: {
    position: 'relative',
    marginBottom: screenHeight * 0.03,
  },
  textArea: {
    width: '100%',
    height: screenHeight * 0.25, // 25% of screen height
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#F9FAFB',
    borderRadius: 32,
    padding: screenWidth * 0.08,
    fontSize: screenWidth * 0.035,
    fontWeight: '500',
    color: '#1F2937',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    textAlign: 'right',
  },
  penIcon: {
    position: 'absolute',
    top: screenHeight * 0.02,
    left: screenWidth * 0.06,
  },
  infoBox: {
    backgroundColor: 'rgba(219, 234, 254, 0.5)',
    borderRadius: 16,
    padding: screenWidth * 0.04,
    flexDirection: 'row',
    alignItems: 'center',
    gap: screenWidth * 0.03,
    borderWidth: 1,
    borderColor: 'rgba(219, 234, 254, 1)',
  },
  infoIcon: {
    width: screenWidth * 0.08,
    height: screenWidth * 0.08,
    borderRadius: screenWidth * 0.04,
    backgroundColor: 'rgba(219, 234, 254, 1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoText: {
    fontSize: screenWidth * 0.025,
    color: '#2563EB',
    fontWeight: '900',
    flex: 1,
    lineHeight: screenWidth * 0.035,
  },
  buttonContainer: {
    paddingTop: screenHeight * 0.03,
  },
  button: {
    width: '100%',
    height: screenHeight * 0.08,
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
    fontSize: screenWidth * 0.045,
    fontWeight: '900',
    color: 'white',
    textAlign: 'center',
  },
});
