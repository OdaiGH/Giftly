
import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, Modal, TextInput, StyleSheet, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface Props {
  onBack: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export const ProfileScreen: React.FC<Props> = ({ onBack, isDarkMode, toggleDarkMode }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [name, setName] = useState('محمد العتيبي');
  const [email, setEmail] = useState('m.otaibi@example.com');

  const menuItems = [
    { icon: 'user', label: 'تعديل البيانات الشخصية', action: () => setShowEditModal(true) },
    { icon: 'credit-card', label: 'المحفظة وطرق الدفع' },
    { icon: 'shield', label: 'الخصوصية والأمان' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Pressable onPress={onBack} style={styles.backButton}>
          <Feather name="chevron-left" size={24} color="#9CA3AF" />
        </Pressable>
        <Text style={styles.title}>ملفي</Text>
        <View style={styles.spacer} />
      </View>

      <View style={styles.profileSection}>
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: 'https://picsum.photos/seed/user1/200/200' }}
            style={styles.avatar}
          />
          <Pressable onPress={() => setShowEditModal(true)} style={styles.editButton}>
            <Feather name="edit-3" size={18} color="white" />
          </Pressable>
        </View>
        <Text style={styles.userName}>{name}</Text>
        <Text style={styles.userEmail}>{email}</Text>
      </View>

      <View style={styles.walletSection}>
        <View style={styles.walletCard}>
          <View style={styles.walletContent}>
            <View style={styles.walletInfo}>
              <Text style={styles.walletLabel}>رصيد المحفظة</Text>
              <Text style={styles.walletAmount}>450.00 <Text style={styles.currency}>ر.س</Text></Text>
            </View>
            <View style={styles.walletIcon}>
              <Feather name="wallet" size={28} color="rgba(255, 255, 255, 0.8)" />
            </View>
          </View>
          <Pressable style={styles.chargeButton}>
            <Text style={styles.chargeButtonText}>شحن الرصيد</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.settingsSection}>
        <Text style={styles.sectionTitle}>إعدادات الحساب</Text>

        <View style={styles.menuItems}>
          {menuItems.map((item, idx) => (
            <Pressable key={idx} onPress={item.action} style={styles.menuItem}>
              <View style={styles.menuItemContent}>
                <View style={styles.menuIcon}>
                  <Feather name={item.icon as any} size={20} color="#9CA3AF" />
                </View>
                <Text style={styles.menuLabel}>{item.label}</Text>
              </View>
              <Feather name="chevron-left" size={18} color="#D1D5DB" />
            </Pressable>
          ))}

          <Pressable onPress={toggleDarkMode} style={styles.menuItem}>
            <View style={styles.menuItemContent}>
              <View style={styles.menuIcon}>
                <Feather name={isDarkMode ? "sun" : "moon"} size={20} color="#9CA3AF" />
              </View>
              <Text style={styles.menuLabel}>الوضع الداكن (Dark Mode)</Text>
            </View>
            <View style={[styles.toggle, isDarkMode && styles.toggleActive]}>
              <View style={[styles.toggleKnob, isDarkMode && styles.toggleKnobActive]} />
            </View>
          </Pressable>

          <Pressable style={styles.menuItem}>
            <View style={styles.menuItemContent}>
              <View style={styles.menuIcon}>
                <Feather name="help-circle" size={20} color="#9CA3AF" />
              </View>
              <Text style={styles.menuLabel}>مركز المساعدة والدعم</Text>
            </View>
            <Feather name="chevron-left" size={18} color="#D1D5DB" />
          </Pressable>
        </View>

        <Pressable style={styles.logoutButton}>
          <View style={styles.menuItemContent}>
            <View style={styles.logoutIcon}>
              <Feather name="log-out" size={20} color="#EF4444" />
            </View>
            <Text style={styles.logoutText}>تسجيل الخروج</Text>
          </View>
        </Pressable>
      </View>

      <Modal
        visible={showEditModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>تعديل البيانات الشخصية</Text>
              <Pressable onPress={() => setShowEditModal(false)} style={styles.closeButton}>
                <Feather name="x" size={20} color="#9CA3AF" />
              </Pressable>
            </View>

            <View style={styles.modalBody}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>الاسم بالكامل</Text>
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>البريد الإلكتروني</Text>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholderTextColor="#9CA3AF"
                  textAlign="left"
                />
              </View>

              <Pressable onPress={() => setShowEditModal(false)} style={styles.saveButton}>
                <Feather name="save" size={20} color="white" />
                <Text style={styles.saveButtonText}>حفظ التعديلات</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFC',
  },
  content: {
    paddingBottom: 120,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 24,
    paddingBottom: 16,
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  spacer: {
    width: 40,
  },
  profileSection: {
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 112,
    height: 112,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: 'white',
  },
  editButton: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 40,
    height: 40,
    backgroundColor: '#E0AAFF',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#FFFFFC',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userName: {
    fontSize: 24,
    fontWeight: '900',
    color: '#1F2937',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: 'bold',
  },
  walletSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  walletCard: {
    backgroundColor: '#E0AAFF',
    borderRadius: 40,
    padding: 32,
    shadowColor: '#E0AAFF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  walletContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  walletInfo: {
    flex: 1,
  },
  walletLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: 'rgba(255, 255, 255, 0.8)',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 4,
  },
  walletAmount: {
    fontSize: 30,
    fontWeight: '900',
    color: 'white',
  },
  currency: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  walletIcon: {
    width: 56,
    height: 56,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chargeButton: {
    backgroundColor: 'white',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  chargeButtonText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#E0AAFF',
  },
  settingsSection: {
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: '900',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 16,
  },
  menuItems: {
    gap: 12,
    marginBottom: 24,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F9FAFB',
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  menuIcon: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#374151',
  },
  toggle: {
    width: 48,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleActive: {
    backgroundColor: '#E0AAFF',
  },
  toggleKnob: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'white',
    transform: [{ translateX: 0 }],
  },
  toggleKnobActive: {
    transform: [{ translateX: 20 }],
  },
  logoutButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  logoutIcon: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#EF4444',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 48,
    borderTopRightRadius: 48,
    padding: 32,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#1F2937',
  },
  closeButton: {
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
  },
  modalBody: {
    gap: 24,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '900',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  input: {
    width: '100%',
    height: 56,
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    paddingHorizontal: 24,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  saveButton: {
    width: '100%',
    height: 64,
    backgroundColor: '#E0AAFF',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    shadowColor: '#E0AAFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: '900',
    color: 'white',
  },
});
