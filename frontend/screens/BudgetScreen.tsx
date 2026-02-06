
import React, { useState } from 'react';
import { View, Text, Pressable,TextInput, ScrollView, StyleSheet, Dimensions,Platform, Modal } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface Props {
  onNext: (description: string, deliveryDate: Date) => void;
  onBack: () => void;
}

export const BudgetScreen: React.FC<Props> = ({ onNext, onBack }) => {
  const insets = useSafeAreaInsets();
  const [description, setDescription] = useState('');
  const [deliveryDate, setDeliveryDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateError, setDateError] = useState('');
  const [tempDate, setTempDate] = useState<Date>(new Date());

  const formatArabicDate = (date: Date) => {
    const arabicMonths = [
      'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
      'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
    ];

    const day = date.getDate();
    const month = arabicMonths[date.getMonth()];
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
  };

  const handleNext = () => {
    // Clear previous errors
    setDateError('');

    // Validate delivery date
    if (!deliveryDate) {
      setDateError('يرجى اختيار تاريخ التوصيل');
      return;
    }

    // Proceed to next screen
    onNext(description, deliveryDate);
  };
  return (
    <ScrollView style={styles.container} contentContainerStyle={[styles.content, { paddingTop: insets.top + screenHeight * 0.03 }]}>
      <View style={styles.header}>
        <Pressable onPress={onBack} style={styles.backButton}>
          <Feather name="chevron-right" size={20} color="#9CA3AF" />
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

        {/* Delivery Date Picker */}
        <View style={styles.datePickerContainer}>
          <Text style={styles.datePickerLabel}>تاريخ التوصيل</Text>
          <Pressable onPress={() => setShowDatePicker(true)} style={[styles.datePickerButton, dateError ? styles.datePickerError : null]}>
            <Text style={[styles.datePickerText, !deliveryDate && styles.datePickerPlaceholder]}>
              { deliveryDate ? formatArabicDate(deliveryDate) : 'اختر تاريخ التوصيل'}
            </Text>
            <Feather name="calendar" size={20} color={dateError ? "#EF4444" : "#E0AAFF"} />
          </Pressable>
          {dateError ? <Text style={styles.errorText}>{dateError}</Text> : null}
        </View>
<Modal
  visible={showDatePicker}
  transparent
  animationType="fade"
  onRequestClose={() => setShowDatePicker(false)}
>
  <View
    style={{
      flex: 1,
      justifyContent: 'center',
      backgroundColor: 'rgba(0,0,0,0.4)',
    }}
  >
    <View
      style={{
        backgroundColor: '#fff',
        marginHorizontal: 20,
        borderRadius: 12,
        paddingTop: 8,
      }}
    >
      <DateTimePicker
        value={tempDate}
        mode="date"
        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
        minimumDate={(() => {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return today;
        })()}
        maximumDate={(() => {
          const maxDate = new Date();
          maxDate.setFullYear(maxDate.getFullYear() + 1);
          return maxDate;
        })()}
        locale="en-US"
        accentColor="#000000"
        textColor="#000000"
        onChange={(_, date) => {
          if (date) setTempDate(date); // only update temp date
        }}
      />

      {/* Buttons */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderTopWidth: 1,
          borderColor: '#E5E7EB',
        }}
      >
        <Pressable onPress={() => setShowDatePicker(false)}>
          <Text style={{ color: '#6B7280', fontSize: 16 }}>
            إلغاء
          </Text>
        </Pressable>

        <Pressable
          onPress={() => {
            setDeliveryDate(tempDate); // just set the date
            setDateError(''); // Clear error when date is selected
            setShowDatePicker(false);
          }}
        >
          <Text style={{ color: '#000000', fontSize: 16, fontWeight: '600' }}>
            تأكيد
          </Text>
        </Pressable>
      </View>
    </View>
  </View>
</Modal>


      <View style={styles.buttonContainer}>
        <Pressable onPress={handleNext} style={styles.button}>
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
    paddingBottom: screenHeight * 0.15,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Math.max(16, screenWidth * 0.04),
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
  datePickerContainer: {
    marginBottom: screenHeight * 0.03,
  },
  datePickerLabel: {
    fontSize: screenWidth * 0.04,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: screenHeight * 0.01,
    textAlign: 'right',
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#F9FAFB',
    borderRadius: 16,
    paddingHorizontal: screenWidth * 0.04,
    paddingVertical: screenHeight * 0.015,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  datePickerText: {
    fontSize: screenWidth * 0.035,
    fontWeight: '500',
    color: '#1F2937',
    textAlign: 'right',
  },
  datePickerPlaceholder: {
    color: '#9CA3AF',
  },
  datePickerError: {
    borderColor: '#EF4444',
  },
  errorText: {
    fontSize: screenWidth * 0.03,
    color: '#EF4444',
    fontWeight: '500',
    textAlign: 'right',
    marginTop: screenHeight * 0.005,
  },
});
