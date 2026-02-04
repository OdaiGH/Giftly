
import React from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Props {
  onBack: () => void;
}

export const InvoiceScreen: React.FC<Props> = ({ onBack }) => {
  const insets = useSafeAreaInsets();
  // المبالغ المحددة
  const giftPrice = 250;
  const serviceFee = 80;
  const deliveryFee = 50;
  const subTotal = giftPrice + serviceFee + deliveryFee; // 380
  const tax = subTotal * 0.15; // 57
  const total = subTotal + tax; // 437

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
          <View style={styles.statusBadge}>
            <Feather name="check-circle" size={14} color="#10B981" />
            <Text style={styles.statusText}>مدفوعة بالكامل</Text>
          </View>

          {/* Brand Info */}
          <View style={styles.brandInfo}>
            <View style={styles.brandIcon}>
              <Feather name="star" size={28} color="#E0AAFF" />
            </View>
            <Text style={styles.brandName}>هديتي للخدمات</Text>
            <View style={styles.invoiceDetails}>
              <Text style={styles.invoiceNumber}>رقم الفاتورة: #INV-8742</Text>
              <Text style={styles.invoiceDate}>التاريخ: 2024/02/24</Text>
            </View>
          </View>

          {/* Detailed Price List - Compact Style */}
          <View style={styles.priceList}>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>قيمة الهدية</Text>
              <Text style={styles.priceValue}>{giftPrice.toFixed(2)} ر.س</Text>
            </View>
            <View style={[styles.priceRow, styles.priceRowBorder]}>
              <Text style={styles.priceLabel}>رسوم الخدمة</Text>
              <Text style={styles.priceValue}>{serviceFee.toFixed(2)} ر.س</Text>
            </View>
            <View style={[styles.priceRow, styles.priceRowBorder]}>
              <Text style={styles.priceLabel}>رسوم التوصيل</Text>
              <Text style={styles.priceValue}>{deliveryFee.toFixed(2)} ر.س</Text>
            </View>
          </View>

          {/* Totals Section */}
          <View style={styles.totalsSection}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>المجموع الفرعي</Text>
              <Text style={styles.totalValue}>{subTotal.toFixed(2)} ر.س</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>الضريبة (15%)</Text>
              <Text style={styles.totalValue}>{tax.toFixed(2)} ر.س</Text>
            </View>

            <View style={styles.totalAmount}>
              <View style={styles.totalAmountLeft}>
                <Text style={styles.totalAmountLabel}>المبلغ الإجمالي</Text>
                <Text style={styles.totalAmountSubLabel}>صافي المدفوع</Text>
              </View>
              <View style={styles.totalAmountRight}>
                <Text style={styles.totalAmountValue}>{total.toFixed(2)}</Text>
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

        {/* Buttons */}
        <View style={styles.buttonsContainer}>
          <Pressable style={styles.downloadButton}>
            <Feather name="download" size={18} color="#E0AAFF" />
            <Text style={styles.downloadButtonText}>تحميل PDF</Text>
          </Pressable>
          <Pressable style={styles.shareButton}>
            <Feather name="share-2" size={18} color="white" />
            <Text style={styles.shareButtonText}>مشاركة</Text>
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
    padding: 24,
    gap: 24,
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
    marginBottom: 32,
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
    marginTop: 32,
    paddingTop: 24,
    borderTopWidth: 2,
    borderTopColor: '#F3F4F6',
    borderStyle: 'dashed',
    gap: 12,
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
    marginTop: 20,
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
  buttonsContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  downloadButton: {
    flex: 1,
    height: 56,
    backgroundColor: 'white',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  downloadButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#6B7280',
  },
  shareButton: {
    flex: 1,
    height: 56,
    backgroundColor: '#E0AAFF',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  shareButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
  },
});
