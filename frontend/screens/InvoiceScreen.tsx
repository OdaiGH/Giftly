
import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet, ActivityIndicator, Alert, Platform, Linking } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { useAuth } from '../App';
import { getInvoiceByOrder, InvoiceResponse } from '../api';

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'https://971c-37-106-14-206.ngrok-free.app';

interface Props {
  onBack: () => void;
  orderId: number;
}

export const InvoiceScreen: React.FC<Props> = ({ onBack, orderId }) => {
  const insets = useSafeAreaInsets();
  const { token } = useAuth();
  const [invoice, setInvoice] = useState<InvoiceResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchInvoice();
  }, [orderId, token]);

  const fetchInvoice = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const invoiceData = await getInvoiceByOrder(token, orderId);
      console.log('Invoice status received:', invoiceData.status); // Debug log
      setInvoice(invoiceData);
    } catch (err) {
      console.error('Failed to fetch invoice:', err);
      setError('فشل في تحميل الفاتورة');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
          <Pressable onPress={onBack} style={styles.backButton}>
            <Feather name="chevron-right" size={24} color="#9CA3AF" />
          </Pressable>
          <Text style={styles.headerTitle}>تفاصيل الفاتورة</Text>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#E0AAFF" />
          <Text style={styles.loadingText}>جاري تحميل الفاتورة...</Text>
        </View>
      </View>
    );
  }

  if (error || !invoice) {
    return (
      <View style={styles.container}>
        <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
          <Pressable onPress={onBack} style={styles.backButton}>
            <Feather name="chevron-right" size={24} color="#9CA3AF" />
          </Pressable>
          <Text style={styles.headerTitle}>تفاصيل الفاتورة</Text>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.errorContainer}>
          <Feather name="alert-circle" size={48} color="#EF4444" />
          <Text style={styles.errorText}>{error || 'فاتورة غير متوفرة'}</Text>
          <Pressable onPress={fetchInvoice} style={styles.retryButton}>
            <Text style={styles.retryButtonText}>إعادة المحاولة</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  // Calculate tax as 15% of order_only_price
  const tax = invoice.order_only_price * 0.15;

  // Status configuration
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'new':
        return {
          text: 'جديدة',
          color: '#F59E0B', // Amber
          bgColor: 'rgba(245, 158, 11, 0.1)',
          borderColor: 'rgba(245, 158, 11, 0.2)',
        };
      case 'paid':
        return {
          text: 'مدفوعة بالكامل',
          color: '#10B981', // Green
          bgColor: 'rgba(16, 185, 129, 0.1)',
          borderColor: 'rgba(16, 185, 129, 0.2)',
        };
      case 'cancelled':
        return {
          text: 'ملغية',
          color: '#EF4444', // Red
          bgColor: 'rgba(239, 68, 68, 0.1)',
          borderColor: 'rgba(239, 68, 68, 0.2)',
        };
      case 'refunded':
        return {
          text: 'مستردة',
          color: '#8B5CF6', // Purple
          bgColor: 'rgba(139, 92, 246, 0.1)',
          borderColor: 'rgba(139, 92, 246, 0.2)',
        };
      default:
        return {
          text: 'غير محدد',
          color: '#6B7280', // Gray
          bgColor: 'rgba(107, 114, 128, 0.1)',
          borderColor: 'rgba(107, 114, 128, 0.2)',
        };
    }
  };

  const statusConfig = getStatusConfig(invoice.status);

  const handleDownloadPDF = async () => {
    if (!token) return;

    try {
      console.log('Starting inline PDF download...');

      // Download the PDF with proper authentication
      const response = await fetch(`${API_BASE_URL}/invoices/order/${orderId}/pdf`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      // Get the blob
      const blob = await response.blob();
      console.log('Blob received, size:', blob.size);

      if (blob.size === 0) {
        throw new Error('Empty PDF file received');
      }

      // Convert blob to base64
      const base64 = await blobToBase64(blob);

      // Create file path in app's document directory
      const fileUri = FileSystem.documentDirectory + `${invoice.invoice_id}.pdf`;

      // Write file to device
      await FileSystem.writeAsStringAsync(fileUri, base64, {
        encoding: FileSystem.EncodingType.Base64,
      });

      console.log('PDF saved to:', fileUri);

      // Share the PDF file
      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'application/pdf',
          dialogTitle: 'حفظ الفاتورة',
        });
        console.log('Share dialog opened');
      } else {
        Alert.alert('نجح', 'تم تحميل الفاتورة بنجاح إلى الجهاز');
      }
    } catch (error) {
      console.error('PDF download failed:', error);
      Alert.alert('خطأ', `فشل في تحميل الفاتورة: ${error.message}`);
    }
  };

  const handlePayment = async (paymentMethod: string) => {
    // Mock payment processing
    Alert.alert(
      'معالجة الدفع',
      `جاري معالجة الدفع باستخدام ${paymentMethod === 'apple_pay' ? 'Apple Pay' : paymentMethod === 'credit_card' ? 'بطاقة الائتمان' : 'Samsung Pay'}...`,
      [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: 'تأكيد',
          onPress: () => {
            // Simulate payment success
            setTimeout(() => {
              Alert.alert(
                'تم الدفع بنجاح!',
                'تم دفع الفاتورة بنجاح. شكراً لاستخدام خدماتنا.',
                [
                  {
                    text: 'موافق',
                    onPress: () => {
                      // Refresh invoice to show paid status
                      fetchInvoice();
                    }
                  }
                ]
              );
            }, 2000);
          }
        }
      ]
    );
  };

  // Helper function to convert blob to base64
  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  return (
    <View style={styles.container}>
      {/* Header Navigation */}
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Pressable onPress={onBack} style={styles.backButton}>
          <Feather name="chevron-right" size={24} color="#9CA3AF" />
        </Pressable>
        <Text style={styles.headerTitle}>تفاصيل الفاتورة</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Scrollable Content Container */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>

        {/* Main Receipt Card */}
        <View style={styles.receiptCard}>

          {/* Status Badge */}
          <View style={[styles.statusBadge, {
            backgroundColor: statusConfig.bgColor,
            borderColor: statusConfig.borderColor,
          }]}>
            <Feather
              name={
                invoice.status === 'paid' ? 'check-circle' :
                invoice.status === 'cancelled' ? 'x-circle' :
                invoice.status === 'refunded' ? 'refresh-cw' :
                'clock'
              }
              size={14}
              color={statusConfig.color}
            />
            <Text style={[styles.statusText, { color: statusConfig.color }]}>
              {statusConfig.text}
            </Text>
          </View>

          {/* Brand Info */}
          <View style={styles.brandInfo}>
            <View style={styles.brandIcon}>
              <Feather name="star" size={28} color="#E0AAFF" />
            </View>
            <Text style={styles.brandName}>هديتي للخدمات</Text>
            <View style={styles.invoiceDetails}>
              <Text style={styles.invoiceNumber}>رقم الفاتورة: {invoice.invoice_id}</Text>
              <Text style={styles.invoiceDate}>التاريخ: {new Date(invoice.created_at).toLocaleDateString('en-US')}</Text>
            </View>
            {/* Apple Pay Button - Only show if invoice is new */}
            {invoice.status === 'new' && (
              <Pressable onPress={() => handlePayment('apple_pay')} style={styles.brandApplePayButton}>
                <Text style={styles.brandApplePayText}> Pay</Text>
              </Pressable>
            )}
          </View>

          {/* Invoice Details */}
          <View style={styles.priceList}>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>قيمة الطلب</Text>
              <Text style={styles.priceValue}>{invoice.order_only_price.toFixed(2)} ر.س</Text>
            </View>
            <View style={[styles.priceRow, styles.priceRowBorder]}>
              <Text style={styles.priceLabel}>رسوم الخدمة</Text>
              <Text style={styles.priceValue}>{invoice.service_fee.toFixed(2)} ر.س</Text>
            </View>
            <View style={[styles.priceRow, styles.priceRowBorder]}>
              <Text style={styles.priceLabel}>الضريبة (15%)</Text>
              <Text style={styles.priceValue}>{tax.toFixed(2)} ر.س</Text>
            </View>
            {invoice.description && (
              <View style={[styles.priceRow, styles.priceRowBorder]}>
                <Text style={styles.priceLabel}>الوصف</Text>
                <Text style={styles.priceValue}>{invoice.description}</Text>
              </View>
            )}
          </View>

          {/* Totals Section */}
          <View style={styles.totalsSection}>
            <View style={styles.totalAmount}>
              <View style={styles.totalAmountLeft}>
                <Text style={styles.totalAmountLabel}>المبلغ الإجمالي</Text>
                <Text style={styles.totalAmountSubLabel}>صافي المدفوع</Text>
              </View>
              <View style={styles.totalAmountRight}>
                <Text style={styles.totalAmountValue}>{invoice.full_amount.toFixed(2)}</Text>
                <Text style={styles.totalAmountCurrency}>ر.س</Text>
              </View>
            </View>
          </View>

          {/* Footer Note */}
          <View style={styles.footerNote}>
            <Feather name="file-text" size={12} color="#9CA3AF" />
            <Text style={styles.footerText}>Digital Invoice</Text>
          </View>
        </View>

        {/* Payment Section - Only show if invoice is new (unpaid) */}
        {invoice.status === 'new' && (
          <View style={styles.paymentSection}>
            <Text style={styles.paymentTitle}>الدفع</Text>
            <Text style={styles.paymentSubtitle}>اختر طريقة الدفع المناسبة لك</Text>

            <View style={styles.paymentOptions}>
              {/* Apple Pay Button */}
              <Pressable onPress={() => handlePayment('apple_pay')} style={styles.applePayButton}>
                <Text style={styles.applePayText}> Pay</Text>
              </Pressable>

              {/* Credit Card Button */}
              <Pressable onPress={() => handlePayment('credit_card')} style={styles.paymentButton}>
                <View style={styles.paymentIcon}>
                  <Feather name="credit-card" size={20} color="#E0AAFF" />
                </View>
                <View style={styles.paymentText}>
                  <Text style={styles.paymentButtonTitle}>بطاقة ائتمان</Text>
                  <Text style={styles.paymentButtonSubtitle}>فيزا، ماستركارد، إلخ</Text>
                </View>
                <Feather name="chevron-left" size={20} color="#666" />
              </Pressable>

              {/* Mada Button */}
              <Pressable onPress={() => handlePayment('mada')} style={styles.madaButton}>
                <View style={styles.madaIcon}>
                  <Text style={styles.madaText}>مدى</Text>
                </View>
                <View style={styles.paymentText}>
                  <Text style={styles.paymentButtonTitle}>مدى</Text>
                  <Text style={styles.paymentButtonSubtitle}>البطاقة الوطنية السعودية</Text>
                </View>
                <Feather name="chevron-left" size={20} color="#666" />
              </Pressable>
            </View>
          </View>
        )}

        {/* Download Button - Always show */}
        <View style={styles.singleButtonContainer}>
          <Pressable onPress={handleDownloadPDF} style={styles.saveButton}>
            <Feather name="download" size={18} color="white" />
            <Text style={styles.saveButtonText}>حفظ PDF</Text>
          </Pressable>
        </View>

      </ScrollView>
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
  backButton: {
    padding: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  receiptCard: {
    backgroundColor: 'white',
    borderRadius: 40,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#F9FAFB',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
    alignSelf: 'center',
    marginBottom: 24,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#10B981',
    textTransform: 'uppercase',
  },
  brandInfo: {
    alignItems: 'center',
    marginBottom: 24,
  },
  brandIcon: {
    width: 56,
    height: 56,
    backgroundColor: 'rgba(224, 170, 255, 0.1)',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  brandName: {
    fontSize: 20,
    fontWeight: '900',
    color: '#1F2937',
    marginBottom: 8,
  },
  invoiceDetails: {
    flexDirection: 'row',
    gap: 12,
  },
  invoiceNumber: {
    fontSize: 9,
    fontWeight: '900',
    color: '#9CA3AF',
  },
  invoiceDate: {
    fontSize: 9,
    fontWeight: '900',
    color: '#9CA3AF',
  },
  priceList: {
    backgroundColor: '#F9FAFB',
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    alignSelf: 'center',
    width: '90%',
    overflow: 'hidden',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
  },
  priceRowBorder: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  priceLabel: {
    fontSize: 12,
    fontWeight: '900',
    color: '#374151',
  },
  priceValue: {
    fontSize: 14,
    fontWeight: '900',
    color: '#1F2937',
  },
  totalsSection: {
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 2,
    borderTopColor: '#F3F4F6',
    borderStyle: 'dashed',
    gap: 8,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  totalLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: '#9CA3AF',
    textTransform: 'uppercase',
  },
  totalValue: {
    fontSize: 12,
    fontWeight: '900',
    color: '#6B7280',
  },
  totalAmount: {
    backgroundColor: '#E0AAFF',
    borderRadius: 32,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  totalAmountLeft: {
    gap: 4,
  },
  totalAmountLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: 'rgba(255, 255, 255, 0.8)',
    textTransform: 'uppercase',
  },
  totalAmountSubLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
  },
  totalAmountRight: {
    alignItems: 'flex-end',
  },
  totalAmountValue: {
    fontSize: 24,
    fontWeight: '900',
    color: 'white',
  },
  totalAmountCurrency: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
  },
  footerNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 24,
  },
  footerText: {
    fontSize: 8,
    fontWeight: '900',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  singleButtonContainer: {
    alignItems: 'center',
  },
  saveButton: {
    width: '80%',
    height: 56,
    backgroundColor: '#E0AAFF',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: '#EF4444',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 24,
    backgroundColor: '#E0AAFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 16,
  },
  retryButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  paymentSection: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  paymentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  paymentSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  paymentOptions: {
    gap: 12,
  },
  paymentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  paymentIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#E0AAFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  applePayIcon: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
  samsungPayIcon: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
  paymentText: {
    flex: 1,
  },
  paymentButtonTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  paymentButtonSubtitle: {
    fontSize: 12,
    color: '#6B7280',
  },
  applePayButton: {
    backgroundColor: '#000000',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  applePayText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  madaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  madaIcon: {
    width: 48,
    height: 32,
    backgroundColor: '#0066CC',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  madaText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  brandApplePayButton: {
    marginTop: 16,
    backgroundColor: '#000000',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  brandApplePayText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
