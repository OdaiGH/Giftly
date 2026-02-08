
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, Pressable, ScrollView, TextInput, StyleSheet, Image, Modal, Alert, Keyboard, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Message, ChatMessage } from '../types';
import { useAuth } from '../App';
import { cancelOrder, getOrder, OrderResponse, getConversationMessages, sendMessage, createOrGetConversation, Conversation } from '../api';

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

export const CustomerChatScreen: React.FC<Props> = ({ onBack, orderId, onShowInvoice, chatState, onChatStateChange }) => {
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState(chatState?.input || '');
  const [showCancelOptions, setShowCancelOptions] = useState(false);
  const [selectedReason, setSelectedReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [order, setOrder] = useState<OrderResponse | null>(chatState?.order || null);
  const [loadingOrder, setLoadingOrder] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorOverlay, setShowErrorOverlay] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [wsConnected, setWsConnected] = useState(false);
  const [reconnecting, setReconnecting] = useState(false);

  const { token, user } = useAuth();
  const onChatStateChangeRef = useRef(onChatStateChange);
  const scrollViewRef = useRef<ScrollView>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;

  // Update the ref whenever onChatStateChange changes
  useEffect(() => {
    onChatStateChangeRef.current = onChatStateChange;
  }, [onChatStateChange]);

  // Initialize state when orderId or chatState changes
  useEffect(() => {
    if (chatState) {
      setMessages(chatState.messages || []);
      setInput(chatState.input || '');
      setOrder(chatState.order || null);
    } else {
      // Reset to initial state for new orders
      setMessages([]);
      setInput('');
      setOrder(null);
      setConversation(null);
    }

    // Fetch order details if we have orderId and token
    if (orderId && token && (!chatState?.order || chatState.order.order_id !== orderId)) {
      fetchOrderDetails();
    }
  }, [orderId, chatState, token]);



  // Convert ChatMessage to Message for UI display
  const convertChatMessageToMessage = useCallback((chatMsg: ChatMessage): Message => {
    const isCurrentUser = chatMsg.sender_id === user?.id;
    const date = new Date(chatMsg.sent_at);
    const timeString = date.toLocaleTimeString('ar-SA', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    let text = chatMsg.content;
    if (chatMsg.message_type === 'invoice' && chatMsg.invoice_description) {
      text = `فاتورة: ${chatMsg.invoice_description}\nالمجموع: ${chatMsg.invoice_total} ريال`;
    }

    return {
      id: chatMsg.id.toString(),
      text,
      sender: isCurrentUser ? 'user' : 'other',
      time: timeString,
      isInvoice: chatMsg.message_type === 'invoice',
      invoiceData: chatMsg.message_type === 'invoice' ? {
        description: chatMsg.invoice_description || '',
        giftPrice: chatMsg.invoice_gift_price || 0,
        serviceFee: chatMsg.invoice_service_fee || 0,
        deliveryFee: chatMsg.invoice_delivery_fee || 0,
        total: chatMsg.invoice_total || 0,
      } : undefined,
    };
  }, []); // Remove user?.id dependency to prevent recreation

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, []);

  // WebSocket connection management
  const connectWebSocket = useCallback(() => {
    if (!conversation || !token) return;

    // Use the same base URL as API but replace http/https with ws/wss
    const apiBaseUrl = 'https://971c-37-106-14-206.ngrok-free.app'; // Should match API_BASE_URL
    // Use wss:// for secure WebSocket connection
    const wsBaseUrl = apiBaseUrl.replace(/^https:/, 'wss:').replace(/^http:/, 'ws:');
    const wsUrl = `${wsBaseUrl}/ws/chat/${conversation.id}?token=${encodeURIComponent(token)}`;

    console.log('Connecting to WebSocket:', wsUrl);
    setReconnecting(true);

    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log('WebSocket connected');
      setWsConnected(true);
      setReconnecting(false);
      reconnectAttemptsRef.current = 0;
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('Received WebSocket message:', data);

        const newMessage = convertChatMessageToMessage(data);
        setMessages(prev => {
          // Check if message already exists to avoid duplicates
          if (prev.some(msg => msg.id === newMessage.id)) {
            return prev;
          }
          return [...prev, newMessage];
        });
        scrollToBottom();
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    ws.onclose = (event) => {
      console.log('WebSocket closed:', event.code, event.reason);
      setWsConnected(false);
      wsRef.current = null;

      // Attempt reconnection if not a normal closure
      if (event.code !== 1000 && reconnectAttemptsRef.current < maxReconnectAttempts) {
        const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 30000);
        console.log(`Attempting reconnection in ${delay}ms...`);
        reconnectTimeoutRef.current = setTimeout(() => {
          reconnectAttemptsRef.current++;
          connectWebSocket();
        }, delay);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setWsConnected(false);
    };

    wsRef.current = ws;
  }, [conversation, token, convertChatMessageToMessage, scrollToBottom]);

  // Disconnect WebSocket
  const disconnectWebSocket = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close(1000, 'Component unmounting');
      wsRef.current = null;
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    setWsConnected(false);
    setReconnecting(false);
  }, []);

  // Load conversation and messages
  const loadConversation = useCallback(async () => {
    if (!order || !token || !user) return;

    try {
      // If order is assigned to courier (received by courier status), enable chat
      if (order.status === 'received by courier' && order.assigned_to_user_id) {
        const conv = await createOrGetConversation(token, order.assigned_to_user_id);
        setConversation(conv);

        // Load existing messages
        setLoadingMessages(true);
        const chatMessages = await getConversationMessages(token, conv.id);
        const uiMessages = chatMessages.map(convertChatMessageToMessage);
        setMessages(uiMessages);
        scrollToBottom();
      }
    } catch (error: any) {
      console.error('Error loading conversation:', error);
      setErrorMessage(error.message || 'فشل في تحميل المحادثة');
      setShowErrorOverlay(true);
      setTimeout(() => {
        setShowErrorOverlay(false);
        setErrorMessage('');
      }, 3000);
    } finally {
      setLoadingMessages(false);
    }
  }, [order, token, user, convertChatMessageToMessage, scrollToBottom]);

  // Effect to load conversation when order is available
  useEffect(() => {
    if (order && !conversation) {
      loadConversation();
    }
  }, [order, conversation]); // Removed loadConversation from dependencies

  // Effect to connect WebSocket when conversation is available
  useEffect(() => {
    if (conversation && !wsConnected && !reconnecting) {
      connectWebSocket();
    }

    return () => {
      disconnectWebSocket();
    };
  }, [conversation, wsConnected, reconnecting, connectWebSocket, disconnectWebSocket]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnectWebSocket();
    };
  }, [disconnectWebSocket]);

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

  const handleSend = async () => {
    console.log('🔄 handleSend: Starting send process');
    console.log('📝 Input:', input.trim());
    console.log('💬 Conversation:', !!conversation);
    console.log('🔑 Token:', !!token);
    console.log('⏳ Sending:', sendingMessage);
    console.log('📦 Order status:', order?.status);

    if (!input.trim() || !token || sendingMessage) {
      console.log('❌ handleSend: Early return - conditions not met');
      console.log('   - Has input:', !!input.trim());
      console.log('   - Has token:', !!token);
      console.log('   - Not sending:', !sendingMessage);
      return;
    }

    // Immediately disable sending to prevent multiple clicks
    console.log('🔒 Disabling send button');
    setSendingMessage(true);

    // If no conversation but order is assigned, try to create conversation first
    let currentConversation = conversation;
    if (!currentConversation && order?.status === 'received by courier' && order.assigned_to_user_id) {
      console.log('🏗️ Creating conversation for assigned order...');
      try {
        currentConversation = await createOrGetConversation(token, order.assigned_to_user_id);
        setConversation(currentConversation);
        console.log('✅ Conversation created:', currentConversation.id);
      } catch (error: any) {
        console.error('❌ Failed to create conversation:', error);
        setSendingMessage(false); // Re-enable on error
        setErrorMessage('فشل في إنشاء المحادثة');
        setShowErrorOverlay(true);
        setTimeout(() => {
          setShowErrorOverlay(false);
          setErrorMessage('');
        }, 3000);
        return;
      }
    }

    if (!currentConversation) {
      console.log('❌ No conversation available');
      setSendingMessage(false); // Re-enable on error
      setErrorMessage('لا توجد محادثة متاحة');
      setShowErrorOverlay(true);
      setTimeout(() => {
        setShowErrorOverlay(false);
        setErrorMessage('');
      }, 3000);
      return;
    }

    const messageContent = input.trim();
    console.log('📤 Sending message:', messageContent.substring(0, 50) + (messageContent.length > 50 ? '...' : ''));
    setInput(''); // Clear input immediately

    try {
      // Send message via HTTP API
      console.log('🌐 Calling sendMessage API...');
      const sentMessage = await sendMessage(token, currentConversation.id, {
        content: messageContent,
        message_type: 'text'
      });
      console.log('✅ Message sent via API:', sentMessage.id);

      // Convert to UI message format
      const uiMessage = convertChatMessageToMessage(sentMessage);
      console.log('🔄 Converted to UI message');

      // Add to messages (optimistic update - message should also come via WebSocket)
      setMessages(prev => {
        // Check if message already exists (from WebSocket)
        if (prev.some(msg => msg.id === uiMessage.id.toString())) {
          console.log('📨 Message already exists from WebSocket');
          return prev;
        }
        console.log('📨 Adding message to UI');
        return [...prev, uiMessage];
      });

      scrollToBottom();
      console.log('✅ Message send process completed');
    } catch (error: any) {
      console.error('❌ Error sending message:', error);
      // Revert input on error
      setInput(messageContent);
      setErrorMessage(error.message || 'فشل في إرسال الرسالة');
      setShowErrorOverlay(true);
      setTimeout(() => {
        setShowErrorOverlay(false);
        setErrorMessage('');
      }, 3000);
    } finally {
      console.log('🔓 Re-enabling send button');
      setSendingMessage(false);
    }
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
      <ScrollView
        ref={scrollViewRef}
        style={styles.chatContainer}
        contentContainerStyle={styles.chatContent}
      >
        {loadingMessages && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#E0AAFF" />
            <Text style={styles.loadingText}>جاري تحميل الرسائل...</Text>
          </View>
        )}
        {!loadingMessages && messages.length === 0 && conversation && (
          <View style={styles.emptyChatContainer}>
            <Text style={styles.emptyChatText}>ابدأ المحادثة الآن</Text>
          </View>
        )}
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
            placeholder={order?.status === 'received by courier' ? "اكتب رسالتك هنا..." : "في انتظار تعيين مندوب..."}
            placeholderTextColor="#9CA3AF"
            editable={order?.status === 'received by courier'}
          />
          <Pressable onPress={handleSend} style={[styles.sendButton, { backgroundColor: sendingMessage || order?.status !== 'received by courier' ? '#9CA3AF' : '#E0AAFF', shadowColor: sendingMessage || order?.status !== 'received by courier' ? '#9CA3AF' : '#E0AAFF' }]} disabled={sendingMessage || order?.status !== 'received by courier'}>
            {sendingMessage ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Feather name="send" size={18} color="white" />
            )}
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
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  emptyChatContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyChatText: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
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
