
import React from 'react';
import { ChevronLeft, Download, Share2, Sparkles, Receipt, FileText, CheckCircle2 } from 'lucide-react';

interface Props {
  onBack: () => void;
}

export const InvoiceScreen: React.FC<Props> = ({ onBack }) => {
  // المبالغ المحددة
  const giftPrice = 250;
  const serviceFee = 80;
  const deliveryFee = 50;
  const subTotal = giftPrice + serviceFee + deliveryFee; // 380
  const tax = subTotal * 0.15; // 57
  const total = subTotal + tax; // 437

  return (
    <div className="flex-1 flex flex-col bg-[#FFFFFC] dark:bg-[#121212] h-full overflow-hidden">
      {/* Header Navigation */}
      <header className="px-6 py-4 flex items-center justify-between bg-white/80 dark:bg-[#1e1e1e]/80 backdrop-blur-md z-20 border-b border-gray-50 dark:border-gray-800">
        <button onClick={onBack} className="p-2 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-400 active:scale-95 transition-all">
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-lg font-black text-gray-800 dark:text-white">تفاصيل الفاتورة</h2>
        <div className="w-10"></div>
      </header>

      {/* Scrollable Content Container */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-6">
        
        {/* Main Receipt Card */}
        <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-6 shadow-soft border border-gray-100 dark:border-gray-700 relative overflow-hidden animate-in slide-in-from-bottom duration-500">
          
          {/* Status Badge */}
          <div className="flex justify-center mb-6">
            <div className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 px-4 py-1.5 rounded-full text-[10px] font-black flex items-center gap-1.5 border border-green-100 dark:border-green-900/30">
              <CheckCircle2 size={14} /> مدفوعة بالكامل
            </div>
          </div>

          {/* Brand Info */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Sparkles className="text-primary" size={28} />
            </div>
            <h3 className="text-xl font-black text-gray-800 dark:text-white">هديتي للخدمات</h3>
            <div className="flex items-center justify-center gap-3 mt-2">
              <span className="text-[9px] text-gray-400 font-black">رقم الفاتورة: #INV-8742</span>
              <span className="text-[9px] text-gray-400 font-black">التاريخ: 2024/02/24</span>
            </div>
          </div>

          {/* Detailed Price List - Compact Style */}
          <div className="bg-gray-50 dark:bg-gray-900/40 rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-700 max-w-[90%] mx-auto">
            {/* Table Row: Gift */}
            <div className="flex justify-between items-center p-3.5 border-b border-gray-100 dark:border-gray-800">
              <span className="text-xs font-black text-gray-700 dark:text-gray-300">قيمة الهدية</span>
              <span className="text-sm font-black text-gray-800 dark:text-white">{giftPrice.toFixed(2)} ر.س</span>
            </div>

            {/* Table Row: Service */}
            <div className="flex justify-between items-center p-3.5 border-b border-gray-100 dark:border-gray-800">
              <span className="text-xs font-black text-gray-700 dark:text-gray-300">رسوم الخدمة</span>
              <span className="text-sm font-black text-gray-800 dark:text-white">{serviceFee.toFixed(2)} ر.س</span>
            </div>

            {/* Table Row: Delivery */}
            <div className="flex justify-between items-center p-3.5">
              <span className="text-xs font-black text-gray-700 dark:text-gray-300">رسوم التوصيل</span>
              <span className="text-sm font-black text-gray-800 dark:text-white">{deliveryFee.toFixed(2)} ر.س</span>
            </div>
          </div>

          {/* Totals Section */}
          <div className="mt-8 pt-6 border-t-2 border-dashed border-gray-100 dark:border-gray-700 space-y-3 px-2">
            <div className="flex justify-between items-center px-2">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">المجموع الفرعي</span>
              <span className="text-xs font-black text-gray-600 dark:text-gray-400">{subTotal.toFixed(2)} ر.س</span>
            </div>
            <div className="flex justify-between items-center px-2">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">الضريبة (15%)</span>
              <span className="text-xs font-black text-gray-600 dark:text-gray-400">{tax.toFixed(2)} ر.س</span>
            </div>

            <div className="bg-primary rounded-[2rem] p-5 mt-5 flex justify-between items-center shadow-soft text-white">
              <div>
                <p className="text-[10px] font-black uppercase opacity-80">المبلغ الإجمالي</p>
                <p className="text-[10px] font-bold leading-tight">صافي المدفوع</p>
              </div>
              <div className="text-left">
                <span className="text-2xl font-black">{total.toFixed(2)}</span>
                <span className="text-[10px] font-bold mr-1">ر.س</span>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="mt-6 text-center">
             <div className="inline-flex items-center gap-2 text-gray-300 dark:text-gray-600">
                <Receipt size={12} />
                <p className="text-[8px] font-black uppercase tracking-[0.2em]">Digital Invoice</p>
             </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <button className="h-14 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-sm flex items-center justify-center gap-2 text-gray-600 dark:text-gray-300 font-black text-xs active:scale-95 transition-all">
            <Download size={18} className="text-primary" /> تحميل PDF
          </button>
          <button className="h-14 bg-primary text-white rounded-2xl shadow-soft flex items-center justify-center gap-2 font-black text-xs active:scale-95 transition-all">
            <Share2 size={18} /> مشاركة
          </button>
        </div>

      </div>
    </div>
  );
};
