
import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet, Image, Dimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Props {
  onLogout: () => void;
  onAcceptOrder: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  theme: {
    backgroundColor: string;
    textColor: string;
    secondaryTextColor: string;
    cardBackground: string;
    borderColor: string;
  };
}

type OrderStatus = 'PREPARING' | 'DELIVERING' | 'DELIVERED';

interface ActiveOrder {
  id: string;
  item: string;
  customer: string;
  status: OrderStatus;
  location: string;
}

const NEW_ORDERS = [
  { id: '101', item: 'باقة ورد عملاقة', price: 25 },
  { id: '102', item: 'تغليف هدايا عيد ميلاد', price: 15 },
  { id: '103', item: 'تنسيق شوكولاتة باتشي', price: 35 },
];

const NOTIFICATIONS = [
  { id: '1', title: 'طلب جديد متاح!', body: 'هناك طلب توصيل باقة ورد بالقرب منك.', time: 'منذ دقيقتين', type: 'new_order' },
  { id: '2', title: 'تم تأكيد الدفع', body: 'قام العميل محمد بتأكيد دفع الفاتورة #8742.', time: 'منذ ساعة', type: 'payment' },
  { id: '3', title: 'تقييم جديد ⭐', body: 'حصلت على تقييم 5 نجوم من العميل سارة.', time: 'أمس', type: 'rating' },
];

const PORTFOLIO_IMAGES = [
  'https://picsum.photos/seed/gift1/400/400',
  'https://picsum.photos/seed/gift2/400/400',
  'https://picsum.photos/seed/gift3/400/400',
  'https://picsum.photos/seed/gift4/400/400',
];

export const CourierHomeScreen: React.FC<Props> = ({ onLogout, onAcceptOrder, isDarkMode, toggleDarkMode, theme }) => {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<'available' | 'active' | 'wallet' | 'profile' | 'notifications'>('available');
  const [portfolio, setPortfolio] = useState(PORTFOLIO_IMAGES);

  // Simulated active orders for tracking
  const [activeOrders, setActiveOrders] = useState<ActiveOrder[]>([
    { id: '8742', item: 'باقة جوري + شوكولاتة', customer: 'محمد العتيبي', status: 'PREPARING', location: 'حي الياسمين، الرياض' }
  ]);

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setActiveOrders(prev => prev.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      {/* Header - Fixed */}
      <View style={[styles.header, {
        paddingTop: Math.max(insets.top + 16, Dimensions.get('window').height * 0.05),
        backgroundColor: theme.cardBackground,
        borderBottomColor: theme.borderColor
      }]}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <View style={styles.truckIcon}>
              <Feather name="truck" size={24} color="white" />
            </View>
            <View>
              <Text style={[styles.headerSubtitle, { color: theme.secondaryTextColor }]}>مندوب هديتي</Text>
              <Text style={[styles.headerTitle, { color: theme.textColor }]}>أحمد بن فهد</Text>
            </View>
          </View>
        </View>
        <Pressable onPress={onLogout} style={styles.logoutButton}>
          <Feather name="log-out" size={20} color="#EF4444" />
        </Pressable>
      </View>

      {/* Scrollable Content Area */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {(activeTab === 'available' || activeTab === 'active') && (
          <View>
            {/* Stats Summary */}
            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>أرباح اليوم</Text>
                <Text style={styles.statValue}>145 <Text style={styles.currency}>ر.س</Text></Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>طلبات مكتملة</Text>
                <Text style={styles.statValue}>8</Text>
              </View>
            </View>

            {/* Tabs */}
            <View style={styles.tabsContainer}>
              <View style={styles.tabsBackground}>
                <Pressable
                  onPress={() => setActiveTab('available')}
                  style={[styles.tab, activeTab === 'available' && styles.activeTab]}
                >
                  <Text style={[styles.tabText, activeTab === 'available' && styles.activeTabText]}>طلبات متاحة</Text>
                </Pressable>
                <Pressable
                  onPress={() => setActiveTab('active')}
                  style={[styles.tab, activeTab === 'active' && styles.activeTab]}
                >
                  <Text style={[styles.tabText, activeTab === 'active' && styles.activeTabText]}>طلباتي النشطة</Text>
                </Pressable>
              </View>
            </View>

            <View style={styles.ordersContainer}>
              {activeTab === 'available' ? (
                NEW_ORDERS.map(order => (
                  <View key={order.id} style={styles.orderCard}>
                    <View style={styles.orderHeader}>
                      <View style={styles.orderLeft}>
                        <View style={styles.packageIcon}>
                          <Feather name="package" size={24} color="#E0AAFF" />
                        </View>
                        <View>
                          <Text style={styles.orderTitle}>طلب #{order.id}</Text>
                          <Text style={styles.orderSubtitle}>{order.item}</Text>
                        </View>
                      </View>
                      <Text style={styles.orderPrice}>{order.price} ر.س</Text>
                    </View>
                    <View style={styles.orderFooter}>
                      <Pressable onPress={onAcceptOrder} style={styles.acceptButton}>
                        <Text style={styles.acceptButtonText}>قبول الطلب</Text>
                      </Pressable>
                    </View>
                  </View>
                ))
              ) : (
                activeOrders.length > 0 ? (
                  activeOrders.map(order => (
                    <View key={order.id} style={styles.activeOrderCard}>
                      <View style={styles.activeOrderHeader}>
                        <View style={styles.activeOrderLeft}>
                          <View style={styles.activePackageIcon}>
                            <Feather name="package" size={20} color="#E0AAFF" />
                          </View>
                          <View>
                            <Text style={styles.activeOrderTitle}>طلب #{order.id}</Text>
                            <Text style={styles.activeOrderSubtitle}>{order.customer}</Text>
                          </View>
                        </View>
                        <View style={styles.activeBadge}>
                          <Text style={styles.activeBadgeText}>نشط الآن</Text>
                        </View>
                      </View>

                      <View style={styles.progressSection}>
                        <Text style={styles.progressTitle}>تحديث مسار الطلب</Text>
                        <View style={styles.progressContainer}>
                          <View style={styles.progressBar}>
                            <View style={[styles.progressFill, {
                              width: order.status === 'PREPARING' ? '0%' :
                                     order.status === 'DELIVERING' ? '50%' : '100%'
                            }]} />
                          </View>

                          <Pressable onPress={() => updateOrderStatus(order.id, 'PREPARING')} style={[styles.progressStep, order.status === 'PREPARING' && styles.activeStep]}>
                            <View style={[styles.stepIcon, order.status === 'PREPARING' && styles.activeStepIcon]}>
                              <Feather name="gift" size={18} color={order.status === 'PREPARING' ? 'white' : '#9CA3AF'} />
                            </View>
                            <Text style={[styles.stepText, order.status === 'PREPARING' && styles.activeStepText]}>تجهيز الهدية</Text>
                          </Pressable>

                          <Pressable onPress={() => updateOrderStatus(order.id, 'DELIVERING')} style={[styles.progressStep, order.status === 'DELIVERING' && styles.activeStep]}>
                            <View style={[styles.stepIcon, order.status === 'DELIVERING' && styles.activeStepIcon]}>
                              <Feather name="truck" size={18} color={order.status === 'DELIVERING' ? 'white' : '#9CA3AF'} />
                            </View>
                            <Text style={[styles.stepText, order.status === 'DELIVERING' && styles.activeStepText]}>في الطريق</Text>
                          </Pressable>

                          <Pressable onPress={() => updateOrderStatus(order.id, 'DELIVERED')} style={[styles.progressStep, order.status === 'DELIVERED' && styles.activeStep]}>
                            <View style={[styles.stepIcon, order.status === 'DELIVERED' && styles.activeStepIcon]}>
                              <Feather name="check-circle" size={18} color={order.status === 'DELIVERED' ? 'white' : '#9CA3AF'} />
                            </View>
                            <Text style={[styles.stepText, order.status === 'DELIVERED' && styles.activeStepText]}>تم التسليم</Text>
                          </Pressable>
                        </View>
                      </View>

                      <View style={styles.activeOrderFooter}>
                        <Pressable onPress={onAcceptOrder} style={styles.mapButton}>
                          <Feather name="map" size={16} color="#E0AAFF" />
                          <Text style={styles.mapButtonText}>فتح الخريطة</Text>
                        </Pressable>
                        <Pressable onPress={onAcceptOrder} style={styles.chatButton}>
                          <Text style={styles.chatButtonText}>الدردشة مع العميل</Text>
                        </Pressable>
                      </View>
                    </View>
                  ))
                ) : (
                  <View style={styles.emptyState}>
                    <View style={styles.emptyIcon}>
                      <Feather name="package" size={32} color="#9CA3AF" />
                    </View>
                    <Text style={styles.emptyText}>لا توجد طلبات نشطة حالياً</Text>
                  </View>
                )
              )}
            </View>
            </View>
        )}

        {activeTab === 'notifications' && (
          <View style={styles.notificationsContainer}>
            <View style={styles.notificationsHeader}>
              <Text style={styles.notificationsTitle}>التنبيهات</Text>
              <View style={styles.newBadge}>
                <Text style={styles.newBadgeText}>3 جديد</Text>
              </View>
            </View>
            <View style={styles.notificationsList}>
              {NOTIFICATIONS.map(note => (
                <Pressable key={note.id} style={styles.notificationItem}>
                  <View style={[styles.notificationIcon, {
                    backgroundColor: note.type === 'new_order' ? 'rgba(59, 130, 246, 0.1)' :
                                   note.type === 'payment' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)'
                  }]}>
                    <Feather
                      name={note.type === 'new_order' ? 'package' : note.type === 'payment' ? 'dollar-sign' : 'star'}
                      size={20}
                      color={note.type === 'new_order' ? '#3B82F6' : note.type === 'payment' ? '#10B981' : '#F59E0B'}
                    />
                  </View>
                  <View style={styles.notificationContent}>
                    <View style={styles.notificationHeader}>
                      <Text style={styles.notificationTitle}>{note.title}</Text>
                      <Text style={styles.notificationTime}>{note.time}</Text>
                    </View>
                    <Text style={styles.notificationBody}>{note.body}</Text>
                  </View>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {activeTab === 'wallet' && (
          <View style={styles.walletContainer}>
            <Text style={styles.walletTitle}>المحفظة</Text>
            <View style={styles.walletCard}>
              <View style={styles.walletContent}>
                <Text style={styles.walletLabel}>الرصيد المتاح</Text>
                <Text style={styles.walletAmount}>241.50 <Text style={styles.walletCurrency}>ر.س</Text></Text>
              </View>
            </View>
          </View>
        )}

        {activeTab === 'profile' && (
          <View style={styles.profileContainer}>
            <View style={styles.profileAvatarContainer}>
              <Image
                source={{ uri: 'https://picsum.photos/seed/courier1/200/200' }}
                style={styles.profileAvatar}
              />
            </View>
            <Text style={[styles.profileName, { color: theme.textColor }]}>أحمد بن فهد</Text>
            <View style={styles.ratingContainer}>
              <Feather name="star" size={18} color="#F59E0B" />
              <Text style={[styles.ratingText, { color: theme.textColor }]}>4.8 (120 تقييم)</Text>
            </View>

            <View style={styles.settingsSection}>
              <Text style={[styles.sectionTitle, { color: theme.secondaryTextColor }]}>إعدادات الحساب</Text>

              <View style={styles.menuItems}>
                <Pressable onPress={toggleDarkMode} style={[styles.menuItem, { backgroundColor: theme.cardBackground, borderColor: theme.borderColor }]}>
                  <View style={styles.menuItemContent}>
                    <View style={[styles.menuIcon, { backgroundColor: isDarkMode ? '#374151' : '#F9FAFB' }]}>
                      <Feather name={isDarkMode ? "sun" : "moon"} size={20} color="#9CA3AF" />
                    </View>
                    <Text style={[styles.menuLabel, { color: theme.textColor }]}>الوضع الداكن (Dark Mode)</Text>
                  </View>
                  <View style={[styles.toggle, isDarkMode && styles.toggleActive]}>
                    <View style={[styles.toggleKnob, isDarkMode && styles.toggleKnobActive]} />
                  </View>
                </Pressable>

                <Pressable style={[styles.menuItem, { backgroundColor: theme.cardBackground, borderColor: theme.borderColor }]}>
                  <View style={styles.menuItemContent}>
                    <View style={[styles.menuIcon, { backgroundColor: isDarkMode ? '#374151' : '#F9FAFB' }]}>
                      <Feather name="help-circle" size={20} color="#9CA3AF" />
                    </View>
                    <Text style={[styles.menuLabel, { color: theme.textColor }]}>مركز المساعدة والدعم</Text>
                  </View>
                  <Feather name="chevron-left" size={18} color={theme.secondaryTextColor} />
                </Pressable>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
      {/* Bottom Nav */}
      <View style={styles.bottomNav}>
        <Pressable onPress={() => setActiveTab('available')} style={styles.navItem}>
          <View style={styles.navIcon}>
            <Feather name="truck" size={18} color={activeTab === 'available' || activeTab === 'active' ? '#E0AAFF' : '#9CA3AF'} />
          </View>
          <Text style={[styles.navText, (activeTab === 'available' || activeTab === 'active') && styles.activeNavText]}>الرئيسية</Text>
        </Pressable>
        <Pressable onPress={() => setActiveTab('wallet')} style={styles.navItem}>
          <View style={styles.navIcon}>
            <Feather name="dollar-sign" size={18} color={activeTab === 'wallet' ? '#E0AAFF' : '#9CA3AF'} />
          </View>
          <Text style={[styles.navText, activeTab === 'wallet' && styles.activeNavText]}>المحفظة</Text>
        </Pressable>
        <Pressable onPress={() => setActiveTab('notifications')} style={styles.navItem}>
          <View style={styles.navIcon}>
            <Feather name="bell" size={18} color={activeTab === 'notifications' ? '#E0AAFF' : '#9CA3AF'} />
          </View>
          <Text style={[styles.navText, activeTab === 'notifications' && styles.activeNavText]}>التنبيهات</Text>
        </Pressable>
        <Pressable onPress={() => setActiveTab('profile')} style={styles.navItem}>
          <View style={styles.navIcon}>
            <Feather name="user" size={18} color={activeTab === 'profile' ? '#E0AAFF' : '#9CA3AF'} />
          </View>
          <Text style={[styles.navText, activeTab === 'profile' && styles.activeNavText]}>ملفي</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFC',
  },
  header: {
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
    minHeight: 80, // Ensure minimum header height
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  truckIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#E0AAFF',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  headerSubtitle: {
    fontSize: 10,
    color: '#9CA3AF',
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  logoutButton: {
    padding: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 12,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120, // Adjusted for new bottom nav layout
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 16,
    marginTop: Math.max(24, Dimensions.get('window').height * 0.03), // Dynamic top margin
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F9FAFB',
  },
  statLabel: {
    fontSize: 10,
    color: '#9CA3AF',
    fontWeight: '900',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '900',
    color: '#E0AAFF',
  },
  currency: {
    fontSize: 12,
  },
  tabsContainer: {
    paddingHorizontal: 24,
    marginTop: Math.max(24, Dimensions.get('window').height * 0.04), // Dynamic top margin
  },
  tabsBackground: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 28,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 24,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tabText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#9CA3AF',
  },
  activeTabText: {
    color: '#E0AAFF',
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
    gap: 4,
  },
  navIcon: {
    padding: Dimensions.get('window').width * 0.015,
    borderRadius: Dimensions.get('window').width * 0.03,
  },
  navText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#9CA3AF',
  },
  activeNavText: {
    color: '#E0AAFF',
  },
  ordersContainer: {
    paddingHorizontal: 24,
    marginTop: Math.max(16, Dimensions.get('window').height * 0.02), // Dynamic top margin for orders
    gap: 16,
  },
  orderCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 40,
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
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  orderLeft: {
    flexDirection: 'row',
    gap: 16,
  },
  packageIcon: {
    width: 48,
    height: 48,
    backgroundColor: 'rgba(224, 170, 255, 0.1)',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orderTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  orderSubtitle: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
    marginTop: 4,
  },
  orderPrice: {
    fontSize: 14,
    fontWeight: '900',
    color: '#E0AAFF',
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F9FAFB',
  },
  acceptButton: {
    paddingHorizontal: 32,
    paddingVertical: 8,
    backgroundColor: '#E0AAFF',
    borderRadius: 16,
  },
  acceptButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
  },
  activeOrderCard: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(224, 170, 255, 0.1)',
  },
  activeOrderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  activeOrderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  activePackageIcon: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(224, 170, 255, 0.1)',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeOrderTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#1F2937',
  },
  activeOrderSubtitle: {
    fontSize: 10,
    color: '#9CA3AF',
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  activeBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  activeBadgeText: {
    fontSize: 9,
    color: '#10B981',
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  progressSection: {
    gap: 24,
  },
  progressTitle: {
    fontSize: 10,
    color: '#9CA3AF',
    fontWeight: '900',
    textTransform: 'uppercase',
    textAlign: 'right',
  },
  progressContainer: {
    paddingHorizontal: 16,
    position: 'relative',
  },
  progressBar: {
    position: 'absolute',
    top: 20,
    left: 32,
    right: 32,
    height: 2,
    backgroundColor: '#F3F4F6',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#E0AAFF',
  },
  progressStep: {
    alignItems: 'center',
    gap: 8,
    position: 'relative',
    zIndex: 10,
  },
  stepIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeStepIcon: {
    backgroundColor: '#E0AAFF',
  },
  stepText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#9CA3AF',
    textAlign: 'center',
  },
  activeStepText: {
    color: '#E0AAFF',
  },
  activeOrderFooter: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#F9FAFB',
  },
  mapButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: 'rgba(224, 170, 255, 0.1)',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  mapButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#E0AAFF',
  },
  chatButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#E0AAFF',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
    opacity: 0.4,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    backgroundColor: '#F3F4F6',
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#9CA3AF',
  },
  notificationsContainer: {
    padding: 24,
  },
  notificationsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  notificationsTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#1F2937',
  },
  newBadge: {
    backgroundColor: 'rgba(224, 170, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  newBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#E0AAFF',
    textTransform: 'uppercase',
  },
  notificationsList: {
    gap: 16,
  },
  notificationItem: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F9FAFB',
    flexDirection: 'row',
    gap: 16,
  },
  notificationIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  notificationTime: {
    fontSize: 9,
    color: '#9CA3AF',
    fontWeight: 'bold',
  },
  notificationBody: {
    fontSize: 12,
    color: '#9CA3AF',
    lineHeight: 16,
  },
  walletContainer: {
    padding: 24,
  },
  walletTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#1F2937',
    textAlign: 'right',
    marginBottom: 24,
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
    alignItems: 'flex-end',
  },
  walletLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  walletAmount: {
    fontSize: 36,
    fontWeight: '900',
    color: 'white',
  },
  walletCurrency: {
    fontSize: 18,
  },
  profileContainer: {
    padding: 24,
    alignItems: 'center',
  },
  profileAvatarContainer: {
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: '#E0AAFF',
    padding: 4,
    shadowColor: '#E0AAFF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
    marginBottom: 24,
    transform: [{ rotate: '3deg' }],
  },
  profileAvatar: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
    borderWidth: 4,
    borderColor: 'white',
  },
  profileName: {
    fontSize: 24,
    fontWeight: '900',
    color: '#1F2937',
    marginBottom: 16,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.2)',
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#F59E0B',
  },
  settingsSection: {
    width: '100%',
    marginTop: 32,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: '900',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 16,
    textAlign: 'right',
  },
  menuItems: {
    gap: 12,
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
});
