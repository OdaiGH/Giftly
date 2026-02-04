
import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, TextInput, StyleSheet, Image, Modal } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Message } from '../types';

interface Props {
  onBack: () => void;
}

const INITIAL_MESSAGES: Message[] = [
  { id: '1', text: 'أهلاً بك في دعم هديتي! كيف يمكننا مساعدتك اليوم؟', sender: 'other', time: '10:00 ص' },
  { id: '2', text: 'أهلاً، أريد الاستفسار عن حالة طلبي رقم #8742', sender: 'user', time: '10:01 ص' },
  { id: '3', text: 'أبشر، جاري فحص الحالة مع المندوب الآن. انتظرني لحظة فضلاً.', sender: 'other', time: '10:02 ص' },
];

export const CustomerChatScreen: React.FC<Props> = ({ onBack }) => {
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [showCancelOptions, setShowCancelOptions] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;
    const newMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      time: 'الآن',
    };
    setMessages([...messages, newMessage]);
    setInput('');
  };

  const handleAttachImage = () => {
    // محاكاة إرسال صورة
    const newMessage: Message = {
      id: Date.now().toString(),
      text: "تم إرفاق صورة 📸",
      sender: 'user',
      time: 'الآن',
    };
    setMessages([...messages, newMessage]);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top + 16, 24) }]}>
        <View style={styles.headerContent}>
          <Pressable onPress={onBack} style={styles.backButton}>
            <Feather name="chevron-right" size={24} color="#9CA3AF" />
          </Pressable>
          <Pressable style={styles.userInfo}>
            <View style={styles.avatar}>
              <Image
                source={{ uri: "https://picsum.photos/seed/agent/100/100" }}
                style={styles.avatarImage}
              />
              <View style={styles.onlineIndicator} />
            </View>
            <View>
              <Text style={styles.userName}>دعم العملاء</Text>
              <Text style={styles.userStatus}>متصل الآن</Text>
            </View>
          </Pressable>
        </View>
        <View style={styles.headerActions}>
          <Pressable style={styles.actionButton}>
            <Feather name="phone" size={20} color="#9CA3AF" />
          </Pressable>
          <Pressable onPress={() => setShowCancelOptions(true)} style={styles.cancelButton}>
            <Text style={styles.cancelText}>إلغاء الطلب</Text>
          </Pressable>
        </View>
      </View>

      {/* Chat Area */}
      <ScrollView style={styles.chatContainer} contentContainerStyle={styles.chatContent}>
        {messages.map((msg) => (
          <View key={msg.id} style={[styles.messageContainer, msg.sender === 'user' ? styles.userMessage : styles.otherMessage]}>
            <View style={[styles.messageBubble, msg.sender === 'user' ? styles.userBubble : styles.otherBubble]}>
              <Text style={[styles.messageText, msg.sender === 'user' ? styles.userText : styles.otherText]}>
                {msg.text}
              </Text>
            </View>
            <Text style={styles.messageTime}>{msg.time}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Input Area */}
      <View style={styles.inputArea}>
        <View style={styles.inputContainer}>
          <Pressable onPress={handleAttachImage} style={styles.attachButton}>
            <Feather name="image" size={22} color="#9CA3AF" />
          </Pressable>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="اكتب رسالتك هنا..."
            placeholderTextColor="#9CA3AF"
          />
          <Pressable onPress={handleSend} style={styles.sendButton}>
            <Feather name="send" size={18} color="white" />
          </Pressable>
        </View>
      </View>

      {/* Cancel Options Modal */}
      <Modal
        visible={showCancelOptions}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowCancelOptions(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.cancelModal}>
            <View style={styles.cancelModalHeader}>
              <Text style={styles.cancelModalTitle}>إلغاء الطلب</Text>
              <Pressable onPress={() => setShowCancelOptions(false)} style={styles.closeButton}>
                <Feather name="x" size={20} color="#9CA3AF" />
              </Pressable>
            </View>

            <View style={styles.cancelOptions}>
              <Pressable style={styles.cancelOption}>
                <View style={styles.cancelOptionIcon}>
                  <Feather name="message-circle" size={20} color="#EF4444" />
                </View>
                <View style={styles.cancelOptionContent}>
                  <Text style={styles.cancelOptionTitle}>تواصل مع المندوب</Text>
                  <Text style={styles.cancelOptionSubtitle}>تحدث مع المندوب لحل المشكلة</Text>
                </View>
              </Pressable>

              <Pressable style={styles.cancelOption}>
                <View style={styles.cancelOptionIcon}>
                  <Feather name="headphones" size={20} color="#F59E0B" />
                </View>
                <View style={styles.cancelOptionContent}>
                  <Text style={styles.cancelOptionTitle}>الدعم الفني</Text>
                  <Text style={styles.cancelOptionSubtitle}>تواصل مع فريق الدعم</Text>
                </View>
              </Pressable>

              <Pressable style={styles.cancelOption}>
                <View style={styles.cancelOptionIcon}>
                  <Feather name="refresh-ccw" size={20} color="#10B981" />
                </View>
                <View style={styles.cancelOptionContent}>
                  <Text style={styles.cancelOptionTitle}>إعادة جدولة</Text>
                  <Text style={styles.cancelOptionSubtitle}>غير موعد التوصيل</Text>
                </View>
              </Pressable>

              <Pressable style={[styles.cancelOption, styles.cancelFinal]}>
                <View style={styles.cancelOptionIcon}>
                  <Feather name="x-circle" size={20} color="#DC2626" />
                </View>
                <View style={styles.cancelOptionContent}>
                  <Text style={styles.cancelOptionTitle}>إلغاء نهائي</Text>
                  <Text style={styles.cancelOptionSubtitle}>إلغاء الطلب بشكل نهائي</Text>
                </View>
              </Pressable>
            </View>

            <Pressable onPress={() => setShowCancelOptions(false)} style={styles.cancelKeepButton}>
              <Text style={styles.cancelKeepText}>الاحتفاظ بالطلب</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
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
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(224, 170, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: 'white',
  },
  userName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  userStatus: {
    fontSize: 10,
    color: '#E0AAFF',
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
  },
  cancelButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  cancelText: {
    fontSize: 10,
    color: '#EF4444',
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  chatContainer: {
    flex: 1,
  },
  chatContent: {
    padding: 24,
    gap: 24,
  },
  messageContainer: {
    maxWidth: '85%',
  },
  userMessage: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  otherMessage: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },
  messageBubble: {
    borderRadius: 28,
    paddingHorizontal: 20,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userBubble: {
    backgroundColor: '#E0AAFF',
    borderBottomRightRadius: 0,
  },
  otherBubble: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#F9FAFB',
    borderBottomLeftRadius: 0,
  },
  messageText: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  userText: {
    color: 'white',
  },
  otherText: {
    color: '#374151',
  },
  messageTime: {
    fontSize: 10,
    color: '#9CA3AF',
    fontWeight: 'bold',
    marginTop: 6,
    marginHorizontal: 8,
  },
  inputArea: {
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    gap: 16,
    paddingBottom: 32,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(249, 250, 251, 0.5)',
    borderRadius: 24,
    paddingHorizontal: 6,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  attachButton: {
    padding: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#374151',
    paddingHorizontal: 16,
    textAlign: 'right',
  },
  sendButton: {
    width: 48,
    height: 48,
    backgroundColor: '#E0AAFF',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#E0AAFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelModal: {
    backgroundColor: 'white',
    borderRadius: 32,
    padding: 24,
    width: '90%',
    maxWidth: 400,
  },
  cancelModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  cancelModalTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#1F2937',
  },
  closeButton: {
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
  },
  cancelOptions: {
    gap: 12,
    marginBottom: 24,
  },
  cancelOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  cancelFinal: {
    backgroundColor: 'rgba(220, 38, 38, 0.05)',
    borderColor: 'rgba(220, 38, 38, 0.2)',
  },
  cancelOptionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cancelOptionContent: {
    flex: 1,
  },
  cancelOptionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 2,
  },
  cancelOptionSubtitle: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  cancelKeepButton: {
    width: '100%',
    height: 48,
    backgroundColor: '#E0AAFF',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelKeepText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
});
