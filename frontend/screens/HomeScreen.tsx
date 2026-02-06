
import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet, Dimensions, Modal, TextInput, Alert, Keyboard } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../App';
import { getUserOrders, cancelOrder, OrderResponse } from '../api';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface Props {
  onNavigateProfile: () => void;
  onNavigateCourier: () => void;
  onStartOrder: () => void;
  onShowInvoice: (orderId: number) => void;
  onNavigateToOrderChat: (orderId: string) => void;
  initialTab?: 'home' | 'orders';
}

export const HomeScreen: React.FC<Props> = ({ onNavigateProfile, onNavigateCourier, onStartOrder, onShowInvoice, onNavigateToOrderChat, initialTab }) => {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<'home' | 'orders'>('home');
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderResponse | null>(null);
  const [selectedReason, setSelectedReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const { userData, token } = useAuth();

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  useEffect(() => {
    if (activeTab === 'orders' && token) {
      fetchOrders();
    }
  }, [activeTab, token]);

  const fetchOrders = async () => {
    if (!token) return;
    setLoadingOrders(true);
    try {
      const userOrders = await getUserOrders(token);

      // Sort orders: Cancelled orders last, all others by creation date (newest first)
      const sortedOrders = userOrders.sort((a, b) => {
        // First priority: Non-cancelled orders come before cancelled orders
        if (a.status === 'cancelled' && b.status !== 'cancelled') return 1;
        if (a.status !== 'cancelled' && b.status === 'cancelled') return -1;

        // Second priority: Sort by creation date (newest first)
        const dateA = new Date(a.creation_date).getTime();
        const dateB = new Date(b.creation_date).getTime();
        return dateB - dateA;
      });

      setOrders(sortedOrders);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoadingOrders(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusStyle = (status: string) => {
    const statusConfig: { [key: string]: { text: string; color: string; backgroundColor: string } } = {
      'new': { text: 'جديد', color: '#3B82F6', backgroundColor: 'rgba(59, 130, 246, 0.1)' },
      'received by courier': { text: 'تم استلام من المندوب', color: '#F59E0B', backgroundColor: 'rgba(245, 158, 11, 0.1)' },
      'paid': { text: 'مدفوع', color: '#D97706', backgroundColor: 'rgba(217, 119, 6, 0.1)' },
      'in progress to do': { text: 'قيد التنفيذ', color: '#F97316', backgroundColor: 'rgba(249, 115, 22, 0.1)' },
      'cancelled': { text: 'ملغي', color: '#EF4444', backgroundColor: 'rgba(239, 68, 68, 0.1)' },
      'done': { text: 'مكتمل', color: '#10B981', backgroundColor: 'rgba(16, 185, 129, 0.1)' },
      'in progress to deliver': { text: 'قيد التوصيل', color: '#06B6D4', backgroundColor: 'rgba(6, 182, 212, 0.1)' }
    };
    return statusConfig[status] || { text: status, color: '#6B7280', backgroundColor: 'rgba(107, 114, 128, 0.1)' };
  };

  const handleCancelOrder = (order: OrderResponse) => {
    setSelectedOrder(order);
    setSelectedReason('');
    setCustomReason('');
    setShowCancelModal(true);
  };

  const handleConfirmCancel = async () => {
    if (!selectedOrder || !token) return;

    const reason = selectedReason === 'سبب آخر' ? customReason : selectedReason;
    if (!reason.trim()) {
      Alert.alert('خطأ', 'يرجى اختيار سبب أو إدخال سبب مخصص');
      return;
    }

    try {
      await cancelOrder(token, selectedOrder.order_id, { reason });
      setShowCancelModal(false);
      // Refresh orders
      fetchOrders();
      Alert.alert('تم', 'تم إلغاء الطلب بنجاح');
    } catch (error) {
      console.error('Failed to cancel order:', error);
      Alert.alert('خطأ', 'فشل في إلغاء الطلب');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top + 16, screenHeight * 0.05) }]}>
        <View style={styles.headerContent}>
          <View style={styles.userInfo}>
            <View style={styles.avatar}>
              <Feather name="user" size={18} color="#E0AAFF" />
            </View>
            <View>
              <Text style={styles.greeting}>أهلاً بك 👋</Text>
              <Text style={styles.userName}>{userData?.name || 'مستخدم'}</Text>
            </View>
          </View>
          <Pressable style={styles.notificationButton}>
            <Feather name="bell" size={16} color="#6B7280" />
            <View style={styles.notificationDot} />
          </Pressable>
        </View>
      </View>

      {/* Content */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {activeTab === 'home' ? (
          <View style={styles.homeContent}>
            {/* Hero Card */}
            <View style={styles.heroCard}>
              <Text style={styles.heroSubtitle}>ابدأ رحلة الإهداء</Text>
              <Text style={styles.heroTitle}>اطلب هديتك بلمسة واحدة</Text>
              <Pressable onPress={onStartOrder} style={styles.orderButton}>
                <Text style={styles.orderButtonText}>اطلب الآن</Text>
                <Feather name="zap" size={14} color="#E0AAFF" />
              </Pressable>
            </View>

            {/* Advantages */}
            <View style={styles.advantages}>
              <Text style={styles.sectionTitle}>ما يميزنا</Text>
              <View style={styles.advantageList}>
                <View style={styles.advantageItem}>
                  <View style={styles.advantageIcon}>
                    <Feather name="gift" size={20} color="#E0AAFF" />
                  </View>
                  <View style={styles.advantageText}>
                    <Text style={styles.advantageTitle}>اطلب أي هدية تتخيلها</Text>
                    <Text style={styles.advantageDesc}>نبحث عنها وننسقها لك</Text>
                  </View>
                </View>
                <View style={styles.advantageItem}>
                  <View style={styles.advantageIcon}>
                    <Feather name="star" size={20} color="#E0AAFF" />
                  </View>
                  <View style={styles.advantageText}>
                    <Text style={styles.advantageTitle}>تخصيص كامل للهدية</Text>
                    <Text style={styles.advantageDesc}>تنفيذ حسب ذوقك وتفاصيلك</Text>
                  </View>
                </View>
                <View style={styles.advantageItem}>
                  <View style={styles.advantageIcon}>
                    <Feather name="star" size={20} color="#E0AAFF" />
                  </View>
                  <View style={styles.advantageText}>
                    <Text style={styles.advantageTitle}>تنفيذ في نفس اليوم</Text>
                    <Text style={styles.advantageDesc}>مندوب يشتري، ينسق، ويسلّم</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.ordersContent}>
            <Text style={styles.sectionTitle}>طلباتك</Text>
            {loadingOrders ? (
              <Text style={styles.loadingText}>جاري تحميل الطلبات...</Text>
            ) : orders.length === 0 ? (
              <Text style={styles.noOrdersText}>لا توجد طلبات بعد</Text>
            ) : (
              orders.map((order) => (
                <Pressable key={order.id} style={styles.orderItem} onPress={() => onNavigateToOrderChat(order.order_id)}>
                  <View style={styles.orderHeader}>
                    <View style={styles.orderIcon}>
                      <Feather name="package" size={18} color="#E0AAFF" />
                    </View>
                    <View style={styles.orderInfo}>
                      <Text style={styles.orderId}>طلب #{order.order_id}</Text>
                      <Text style={styles.orderItemName}>
                        {order.description || 'وصف غير محدد'}
                      </Text>
                      <Text style={styles.orderDate}>
                        تاريخ التوصيل: {order.delivery_date ? formatDate(order.delivery_date) : 'غير محدد'}
                      </Text>
                    </View>
                  <View style={styles.orderPrice}>
                    <Text style={[styles.statusText, { color: getStatusStyle(order.status).color, backgroundColor: getStatusStyle(order.status).backgroundColor }]}>
                      {getStatusStyle(order.status).text}
                    </Text>
                  </View>
                </View>
                {order.invoice && (
                  <Pressable onPress={() => onShowInvoice(order.id)} style={styles.invoiceButton}>
                    <Text style={styles.invoiceButtonText}>عرض الفاتورة</Text>
                  </Pressable>
                )}
                </Pressable>
              ))
            )}
          </View>
        )}
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <Pressable
          onPress={() => setActiveTab('home')}
          style={[styles.navItem, activeTab === 'home' && styles.activeNavItem]}
        >
          <View style={[styles.navIcon, activeTab === 'home' && styles.activeNavIcon]}>
            <Feather name="star" size={18} color={activeTab === 'home' ? '#E0AAFF' : '#9CA3AF'} />
          </View>
          <Text style={[styles.navText, activeTab === 'home' && styles.activeNavText]}>الرئيسية</Text>
        </Pressable>

        <Pressable
          onPress={() => setActiveTab('orders')}
          style={[styles.navItem, activeTab === 'orders' && styles.activeNavItem]}
        >
          <View style={[styles.navIcon, activeTab === 'orders' && styles.activeNavIcon]}>
            <Feather name="package" size={18} color={activeTab === 'orders' ? '#E0AAFF' : '#9CA3AF'} />
          </View>
          <Text style={[styles.navText, activeTab === 'orders' && styles.activeNavText]}>طلباتك</Text>
        </Pressable>

        <Pressable onPress={onNavigateCourier} style={styles.navItem}>
          <View style={styles.navIcon}>
            <Feather name="truck" size={18} color="#9CA3AF" />
          </View>
          <Text style={styles.navText}>المندوب</Text>
        </Pressable>

        <Pressable onPress={onNavigateProfile} style={styles.navItem}>
          <View style={styles.navIcon}>
            <Feather name="user" size={18} color="#9CA3AF" />
          </View>
          <Text style={styles.navText}>ملفي</Text>
        </Pressable>
      </View>

      {/* Cancel Order Modal */}
      <Modal
        visible={showCancelModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowCancelModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.cancelModal}>
            <View style={styles.cancelModalHeader}>
              <Text style={styles.cancelModalTitle}>إلغاء الطلب</Text>
              <Pressable onPress={() => setShowCancelModal(false)} style={styles.closeButton}>
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
                onPress={() => setShowCancelModal(false)}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFC',
  },
  header: {
    paddingHorizontal: screenWidth * 0.05,
    paddingBottom: screenHeight * 0.015,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: screenWidth * 0.03,
  },
  avatar: {
    width: screenWidth * 0.1,
    height: screenWidth * 0.1,
    borderRadius: screenWidth * 0.03,
    backgroundColor: '#E0AAFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  greeting: {
    fontSize: screenWidth * 0.025,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  userName: {
    fontSize: screenWidth * 0.035,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  notificationButton: {
    padding: screenWidth * 0.025,
    backgroundColor: 'white',
    borderRadius: screenWidth * 0.03,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: screenWidth * 0.02,
    right: screenWidth * 0.02,
    width: screenWidth * 0.02,
    height: screenWidth * 0.02,
    backgroundColor: '#EF4444',
    borderRadius: screenWidth * 0.01,
    borderWidth: 2,
    borderColor: 'white',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: screenHeight * 0.15,
  },
  homeContent: {
    paddingHorizontal: screenWidth * 0.05,
  },
  heroCard: {
    backgroundColor: '#E0AAFF',
    borderRadius: screenWidth * 0.08,
    padding: screenWidth * 0.06,
    marginBottom: screenHeight * 0.03,
    shadowColor: '#E0AAFF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  heroSubtitle: {
    fontSize: screenWidth * 0.03,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
  heroTitle: {
    fontSize: screenWidth * 0.06,
    fontWeight: '900',
    color: 'white',
    lineHeight: screenWidth * 0.07,
    marginTop: screenHeight * 0.005,
  },
  orderButton: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    gap: screenWidth * 0.02,
    paddingHorizontal: screenWidth * 0.06,
    paddingVertical: screenHeight * 0.012,
    borderRadius: screenWidth * 0.03,
    marginTop: screenHeight * 0.02,
    alignSelf: 'flex-start',
  },
  orderButtonText: {
    fontSize: screenWidth * 0.035,
    fontWeight: '900',
    color: '#E0AAFF',
  },
  advantages: {
    marginBottom: screenHeight * 0.03,
  },
  sectionTitle: {
    fontSize: screenWidth * 0.045,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: screenHeight * 0.02,
  },
  advantageList: {
    gap: screenWidth * 0.03,
  },
  advantageItem: {
    backgroundColor: 'white',
    padding: screenWidth * 0.04,
    borderRadius: screenWidth * 0.06,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F9FAFB',
    flexDirection: 'row',
    alignItems: 'center',
    gap: screenWidth * 0.04,
  },
  advantageIcon: {
    width: screenWidth * 0.12,
    height: screenWidth * 0.12,
    borderRadius: screenWidth * 0.03,
    backgroundColor: 'rgba(224, 170, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  advantageText: {
    flex: 1,
  },
  advantageTitle: {
    fontSize: screenWidth * 0.035,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  advantageDesc: {
    fontSize: screenWidth * 0.025,
    color: '#9CA3AF',
    fontWeight: '500',
    marginTop: screenHeight * 0.003,
  },
  ordersContent: {
    paddingHorizontal: screenWidth * 0.05,
  },
  orderItem: {
    backgroundColor: 'white',
    padding: screenWidth * 0.04,
    borderRadius: screenWidth * 0.07,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F9FAFB',
  },
  orderHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: screenHeight * 0.015,
  },
  orderIcon: {
    width: screenWidth * 0.12,
    height: screenWidth * 0.12,
    borderRadius: screenWidth * 0.03,
    backgroundColor: 'rgba(224, 170, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  orderInfo: {
    flex: 1,
    marginLeft: screenWidth * 0.03,
  },
  orderId: {
    fontSize: screenWidth * 0.03,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  orderItemName: {
    fontSize: screenWidth * 0.025,
    color: '#9CA3AF',
    fontWeight: '500',
    marginTop: screenHeight * 0.003,
  },
  orderDate: {
    fontSize: screenWidth * 0.02,
    color: '#D1D5DB',
    fontWeight: 'bold',
    marginTop: screenHeight * 0.003,
  },
  orderPrice: {
    alignItems: 'flex-end',
  },
  priceText: {
    fontSize: screenWidth * 0.035,
    fontWeight: '900',
    color: '#E0AAFF',
  },
  statusText: {
    fontSize: screenWidth * 0.02,
    fontWeight: '900',
    color: '#3B82F6',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    paddingHorizontal: screenWidth * 0.02,
    paddingVertical: screenHeight * 0.003,
    borderRadius: screenWidth * 0.02,
    marginTop: screenHeight * 0.008,
  },
  orderActions: {
    flexDirection: 'row',
    gap: screenWidth * 0.02,
    paddingTop: screenHeight * 0.015,
    borderTopWidth: 1,
    borderTopColor: '#F9FAFB',
  },
  actionButton: {
    flex: 1,
    backgroundColor: 'rgba(224, 170, 255, 0.1)',
    paddingVertical: screenHeight * 0.015,
    borderRadius: screenWidth * 0.03,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: screenWidth * 0.025,
    fontWeight: '900',
    color: '#E0AAFF',
  },
  secondaryActionButton: {
    flex: 1,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    paddingVertical: screenHeight * 0.015,
    borderRadius: screenWidth * 0.03,
    alignItems: 'center',
  },
  secondaryActionText: {
    fontSize: screenWidth * 0.025,
    fontWeight: 'bold',
    color: '#9CA3AF',
  },
  cancelActionButton: {
    flex: 1,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    paddingVertical: screenHeight * 0.015,
    borderRadius: screenWidth * 0.03,
    alignItems: 'center',
  },
  cancelActionText: {
    fontSize: screenWidth * 0.025,
    fontWeight: '900',
    color: '#EF4444',
  },
  bottomNav: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#F9FAFB',
  },
  navItem: {
    alignItems: 'center',
    gap: screenHeight * 0.005,
  },
  activeNavItem: {
    transform: [{ scale: 1.05 }],
  },
  navIcon: {
    padding: screenWidth * 0.015,
    borderRadius: screenWidth * 0.03,
  },
  activeNavIcon: {
    backgroundColor: 'rgba(224, 170, 255, 0.1)',
  },
  navText: {
    fontSize: screenWidth * 0.022,
    fontWeight: 'bold',
    color: '#9CA3AF',
  },
  activeNavText: {
    color: '#E0AAFF',
  },
  loadingText: {
    fontSize: screenWidth * 0.035,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: screenHeight * 0.05,
  },
  noOrdersText: {
    fontSize: screenWidth * 0.035,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: screenHeight * 0.05,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelModal: {
    backgroundColor: 'white',
    borderRadius: screenWidth * 0.08,
    padding: screenWidth * 0.06,
    width: '90%',
    maxWidth: 400,
  },
  cancelModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: screenHeight * 0.02,
  },
  cancelModalTitle: {
    fontSize: screenWidth * 0.05,
    fontWeight: '900',
    color: '#1F2937',
  },
  closeButton: {
    padding: screenWidth * 0.025,
    backgroundColor: '#F9FAFB',
    borderRadius: screenWidth * 0.03,
  },
  cancelModalSubtitle: {
    fontSize: screenWidth * 0.035,
    color: '#6B7280',
    fontWeight: '500',
    marginBottom: screenHeight * 0.02,
  },
  reasonsList: {
    gap: screenHeight * 0.01,
    marginBottom: screenHeight * 0.02,
  },
  reasonOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: screenWidth * 0.04,
    backgroundColor: '#F9FAFB',
    borderRadius: screenWidth * 0.04,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  selectedReasonOption: {
    backgroundColor: 'rgba(224, 170, 255, 0.1)',
    borderColor: '#E0AAFF',
  },
  reasonText: {
    fontSize: screenWidth * 0.035,
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
    borderRadius: screenWidth * 0.03,
    padding: screenWidth * 0.04,
    fontSize: screenWidth * 0.035,
    color: '#374151',
    textAlignVertical: 'top',
    marginBottom: screenHeight * 0.02,
    minHeight: screenHeight * 0.1,
  },
  cancelModalActions: {
    flexDirection: 'row',
    gap: screenWidth * 0.03,
  },
  cancelModalCancelButton: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    paddingVertical: screenHeight * 0.015,
    borderRadius: screenWidth * 0.03,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  cancelModalCancelText: {
    fontSize: screenWidth * 0.035,
    fontWeight: 'bold',
    color: '#6B7280',
  },
  cancelModalConfirmButton: {
    flex: 1,
    backgroundColor: '#EF4444',
    paddingVertical: screenHeight * 0.015,
    borderRadius: screenWidth * 0.03,
    alignItems: 'center',
  },
  cancelModalConfirmText: {
    fontSize: screenWidth * 0.035,
    fontWeight: 'bold',
    color: 'white',
  },
  invoiceButton: {
    backgroundColor: 'rgba(224, 170, 255, 0.1)',
    paddingVertical: screenHeight * 0.015,
    borderRadius: screenWidth * 0.03,
    alignItems: 'center',
    marginTop: screenHeight * 0.01,
  },
  invoiceButtonText: {
    fontSize: screenWidth * 0.025,
    fontWeight: '900',
    color: '#E0AAFF',
  },
});
