
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Pressable, ScrollView, TextInput, StyleSheet, Image, Modal, Alert, Keyboard } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Message } from '../types';
import { useAuth } from '../App';
import { cancelOrder, getOrder, OrderResponse } from '../api';

interface Props {
  onBack: () => void;
  orderId?: string | null;
  onShowInvoice?: (invoiceId: string) => void;
  chatState?: {
    messages: Message[];
    input: string;
    order: OrderResponse | null;
  };
  onChatStateChange?: (state: {
    messages: Message[];
    input: string;
    order: OrderResponse | null;
  }) => void;
}

const INITIAL_MESSAGES: Message[] = [
  { id: '1', text: 'أهلاً بك في دعم هديتي! كيف يمكننا مساعدتك اليوم؟', sender: 'other', time: '10:00 ص' },
  { id: '2', text: 'أهلاً، أريد الاستفسار عن حالة طلبي رقم #8742', sender: 'user', time: '10:01 ص' },
  { id: '3', text: 'أبشر، جاري فحص الحالة مع المندوب الآن. انتظرني لحظة فضلاً.', sender: 'other', time: '10:02 ص' },
];

export const CustomerChatScreen: React.FC<Props> = ({ onBack, orderId, onShowInvoice, chatState, onChatStateChange }) => {
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState<Message[]>(chatState?.messages || INITIAL_MESSAGES);
  const [input, setInput] = useState(chatState?.input || '');
  const [showCancelOptions, setShowCancelOptions] = useState(false);
  const [selectedReason, setSelectedReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [order, setOrder] = useState<OrderResponse | null>(chatState?.order || null);
  const [loadingOrder, setLoadingOrder] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorOverlay, setShowErrorOverlay] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { token } = useAuth();
  const onChatStateChangeRef = useRef(onChatStateChange);

  // Update the ref whenever onChatStateChange changes
  useEffect(() => {
    onChatStateChangeRef.current = onChatStateChange;
  }, [onChatStateChange]);

  // Initialize state when orderId or chatState changes
  useEffect(() => {
    if (chatState) {
      setMessages(chatState.messages || INITIAL_MESSAGES);
      setInput(chatState.input || '');
      setOrder(chatState.order || null);
    } else {
      // Reset to initial state for new orders
      setMessages(INITIAL_MESSAGES);
      setInput('');
      setOrder(null);
    }

    // Fetch order details if we have orderId and token
    if (orderId && token && (!chatState?.order || chatState.order.order_id !== orderId)) {
      fetchOrderDetails();
    }
  }, [orderId, chatState, token]);



  const fetchOrderDetails = async () => {
    if (!orderId || !token) {
      console.log('fetchOrderDetails: Missing orderId or token', { orderId, token: !!token });
      return;
    }
    console.log('fetchOrderDetails: Fetching order with ID:', orderId);
    setLoadingOrder(true);
    try {
      const orderDetails = await getOrder(token, orderId);
      console.log('fetchOrderDetails: Successfully fetched order:', JSON.stringify(orderDetails, null, 2));
      console.log('fetchOrderDetails: Order invoice data:', orderDetails.invoice ? JSON.stringify(orderDetails.invoice, null, 2) : 'No invoice data');
      setOrder(orderDetails);
    } catch (error: any) {
      console.error('fetchOrderDetails: Failed to fetch order details:', error);
      setErrorMessage(error.message || 'فشل في تحميل تفاصيل الطلب');
      setShowErrorOverlay(true);
      setTimeout(() => {
        setShowErrorOverlay(false);
        setErrorMessage('');
      }, 3000);
    } finally {
      setLoadingOrder(false);
    }
  };

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

  const handleConfirmCancel = async () => {
    console.log('handleConfirmCancel: Called unexpectedly?');
    if (!order || !token) {
      console.log('handleConfirmCancel: Missing order or token', { order: !!order, token: !!token });
      return;
    }

    const reason = selectedReason === 'سبب آخر' ? customReason : selectedReason;
    console.log('handleConfirmCancel: Reason selected:', reason);
    if (!reason.trim()) {
      Alert.alert('خطأ', 'يرجى اختيار سبب أو إدخال سبب مخصص');
      return;
    }

    try {
      console.log('handleConfirmCancel: Calling cancelOrder API with order_id:', order.order_id);
      await cancelOrder(token, order.order_id, { reason });
      console.log('handleConfirmCancel: Cancel order successful');
      setShowCancelOptions(false);
      setShowSuccessMessage(true);

      // Update order status locally
      if (order) {
        setOrder({ ...order, status: 'cancelled' });
      }

      // Navigate back to home after 3 seconds
      setTimeout(() => {
        setShowSuccessMessage(false);
        onBack();
      }, 3000);
    } catch (error: any) {
      console.error('handleConfirmCancel: Failed to cancel order:', error);
      setShowCancelOptions(false);
      setErrorMessage(error.message || 'فشل في إلغاء الطلب');
      setShowErrorOverlay(true);
      setTimeout(() => {
        setShowErrorOverlay(false);
        setErrorMessage('');
      }, 3000);
    }
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
          {order && order.status === 'paid' && (
            <Pressable onPress={() => Alert.alert('خدمة العملاء', 'يرجى الاتصال بخدمة العملاء على الرقم: 800-123-4567')} style={styles.customerCareButton}>
              <Feather name="headphones" size={16} color="#1E40AF" />
              <Text style={styles.customerCareText}>خدمة العملاء</Text>
            </Pressable>
          )}
          {order && order.status !== 'cancelled' && order.status !== 'done' && order.status !== 'paid' && (!order.invoice || order.invoice.status !== 'paid') && (
            <Pressable onPress={() => setShowCancelOptions(true)} style={styles.cancelButton}>
              <Text style={styles.cancelText}>إلغاء الطلب</Text>
            </Pressable>
          )}
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
        {order && order.invoice && onShowInvoice && (
          <Pressable onPress={() => {
            console.log(`you have clicked on invoice number ${order.invoice.invoice_id} for order id ${order.id}`);
            onShowInvoice(order.invoice.invoice_id);
          }} style={styles.invoiceButtonBottom}>
            <Feather name="file-text" size={16} color="#E0AAFF" />
            <Text style={styles.invoiceButtonTextBottom}>عرض الفاتورة</Text>
          </Pressable>
        )}
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

            <Text style={styles.cancelModalSubtitle}>يرجى اختيار سبب الإلغاء:</Text>

            <View style={styles.reasonsList}>
              {[
                'عدم تجاوب المندوب',
                'المنتج غير متوفر',
                'السعر غير مناسب',
                'مشكلة في الدفع',
                'غيّرت رأيي',
                'سبب آخر'
              ].map((reason) => (
                <Pressable
                  key={reason}
                  onPress={() => setSelectedReason(reason)}
                  style={[
                    styles.reasonOption,
                    selectedReason === reason && styles.selectedReasonOption
                  ]}
                >
                  <Text style={[
                    styles.reasonText,
                    selectedReason === reason && styles.selectedReasonText
                  ]}>
                    {reason}
                  </Text>
                  {selectedReason === reason && (
                    <Feather name="check" size={16} color="#E0AAFF" />
                  )}
                </Pressable>
              ))}
            </View>

            {selectedReason === 'سبب آخر' && (
              <TextInput
                style={styles.customReasonInput}
                placeholder="اكتب السبب هنا..."
                value={customReason}
                onChangeText={setCustomReason}
                multiline
                numberOfLines={3}
                returnKeyType="done"
                onSubmitEditing={() => Keyboard.dismiss()}
                blurOnSubmit={true}
              />
            )}

            <View style={styles.cancelModalActions}>
              <Pressable
                onPress={() => setShowCancelOptions(false)}
                style={styles.cancelModalCancelButton}
              >
                <Text style={styles.cancelModalCancelText}>إلغاء</Text>
              </Pressable>
              <Pressable
                onPress={handleConfirmCancel}
                style={styles.cancelModalConfirmButton}
              >
                <Text style={styles.cancelModalConfirmText}>تأكيد الإلغاء</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Success Message Overlay */}
      {showSuccessMessage && (
        <View style={styles.successOverlay}>
          <View style={styles.successMessage}>
            <Feather name="check-circle" size={48} color="#10B981" />
            <Text style={styles.successTitle}>تم إلغاء الطلب بنجاح</Text>
            <Text style={styles.successSubtitle}>سيتم توجيهك إلى الصفحة الرئيسية...</Text>
          </View>
        </View>
      )}

      {/* Error Overlay */}
      {showErrorOverlay && (
        <View style={styles.errorOverlay}>
          <View style={styles.errorMessage}>
            <Feather name="x-circle" size={48} color="#EF4444" />
            <Text style={styles.errorTitle}>فشل في إلغاء الطلب</Text>
            <Text style={styles.errorSubtitle}>{errorMessage}</Text>
          </View>
        </View>
      )}
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
  customerCareButton: {
    backgroundColor: 'rgba(30, 64, 175, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(30, 64, 175, 0.2)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  customerCareText: {
    fontSize: 10,
    color: '#1E40AF',
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  invoiceButton: {
    backgroundColor: 'rgba(224, 170, 255, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(224, 170, 255, 0.2)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  invoiceButtonText: {
    fontSize: 10,
    color: '#E0AAFF',
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  invoiceButtonBottom: {
    backgroundColor: 'rgba(224, 170, 255, 0.1)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(224, 170, 255, 0.2)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    alignSelf: 'center',
  },
  invoiceButtonTextBottom: {
    fontSize: 12,
    color: '#E0AAFF',
    fontWeight: 'bold',
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
  cancelModalSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
    marginBottom: 20,
  },
  reasonsList: {
    gap: 10,
    marginBottom: 20,
  },
  reasonOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  selectedReasonOption: {
    backgroundColor: 'rgba(224, 170, 255, 0.1)',
    borderColor: '#E0AAFF',
  },
  reasonText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
  selectedReasonText: {
    color: '#E0AAFF',
    fontWeight: 'bold',
  },
  customReasonInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#374151',
    textAlignVertical: 'top',
    marginBottom: 20,
    minHeight: 80,
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
  cancelModalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelModalCancelButton: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  cancelModalCancelText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6B7280',
  },
  cancelModalConfirmButton: {
    flex: 1,
    backgroundColor: '#EF4444',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  cancelModalConfirmText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  successOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  successMessage: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  successSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  errorOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  errorMessage: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  errorSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  paidOrderBanner: {
    backgroundColor: '#DBEAFE',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 16,
    margin: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  bannerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1E40AF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerContent: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E40AF',
    marginBottom: 4,
  },
  bannerText: {
    fontSize: 14,
    color: '#1E40AF',
    lineHeight: 20,
  },
});
