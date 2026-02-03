
import React, { useState } from 'react';
import { Package, Truck, DollarSign, LogOut, Bell, User, Star, CheckCircle, Phone, MapPin, Image as ImageIcon, Plus, X, Sparkles, Upload, ChevronRight, Clock, Map, Gift } from 'lucide-react';

interface Props {
  onLogout: () => void;
  onAcceptOrder: () => void;
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

export const CourierHomeScreen: React.FC<Props> = ({ onLogout, onAcceptOrder }) => {
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
    <div className="flex-1 flex flex-col bg-[#FFFFFC] dark:bg-[#121212] overflow-hidden relative h-full">
      {/* Header - Fixed */}
      <div className="p-6 bg-white dark:bg-gray-800 border-b border-gray-50 dark:border-gray-700 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#E0AAFF] rounded-2xl flex items-center justify-center text-white shadow-lg">
            <Truck size={24} />
          </div>
          <div>
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">مندوب هديتي</p>
            <h3 className="text-lg font-black text-gray-800 dark:text-white">أحمد بن فهد</h3>
          </div>
        </div>
        <button onClick={onLogout} className="p-2.5 text-red-400 bg-red-50 dark:bg-red-900/10 rounded-xl active:scale-95 transition-all">
          <LogOut size={20} />
        </button>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-32">
        {(activeTab === 'available' || activeTab === 'active') && (
          <div className="animate-in fade-in duration-500">
            {/* Stats Summary */}
            <div className="px-6 grid grid-cols-2 gap-4 mt-6">
              <div className="bg-white dark:bg-gray-800 p-5 rounded-[2rem] shadow-sm border border-gray-50 dark:border-gray-700 text-center">
                <p className="text-[10px] text-gray-400 font-black uppercase mb-1 tracking-tighter">أرباح اليوم</p>
                <span className="text-2xl font-black text-[#E0AAFF]">145 <span className="text-xs">ر.س</span></span>
              </div>
              <div className="bg-white dark:bg-gray-800 p-5 rounded-[2rem] shadow-sm border border-gray-50 dark:border-gray-700 text-center">
                <p className="text-[10px] text-gray-400 font-black uppercase mb-1 tracking-tighter">طلبات مكتملة</p>
                <span className="text-2xl font-black text-[#E0AAFF]">8</span>
              </div>
            </div>

            {/* Tabs */}
            <div className="px-6 mt-8">
              <div className="flex gap-4 p-1.5 bg-gray-50 dark:bg-gray-900 rounded-3xl">
                <button 
                  onClick={() => setActiveTab('available')}
                  className={`flex-1 py-3 rounded-2xl font-bold text-sm transition-all ${activeTab === 'available' ? 'bg-white dark:bg-gray-800 text-[#E0AAFF] shadow-sm' : 'text-gray-400'}`}
                >
                  طلبات متاحة
                </button>
                <button 
                  onClick={() => setActiveTab('active')}
                  className={`flex-1 py-3 rounded-2xl font-bold text-sm transition-all ${activeTab === 'active' ? 'bg-white dark:bg-gray-800 text-[#E0AAFF] shadow-sm' : 'text-gray-400'}`}
                >
                  طلباتي النشطة
                </button>
              </div>
            </div>

            <div className="px-6 mt-6 space-y-4">
              {activeTab === 'available' ? (
                NEW_ORDERS.map(order => (
                  <div key={order.id} className="bg-white dark:bg-gray-800 p-5 rounded-[2.5rem] shadow-sm border border-gray-50 dark:border-gray-700 animate-in slide-in-from-bottom duration-300">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex gap-4">
                        <div className="w-12 h-12 bg-[#E0AAFF]/10 rounded-2xl flex items-center justify-center text-[#E0AAFF]"><Package size={24} /></div>
                        <div>
                          <h4 className="font-bold text-gray-800 dark:text-white">طلب #{order.id}</h4>
                          <p className="text-xs text-gray-400 dark:text-gray-300 font-medium mt-1">{order.item}</p>
                        </div>
                      </div>
                      <div className="text-left"><span className="text-sm font-black text-[#E0AAFF]">{order.price} ر.س</span></div>
                    </div>
                    <div className="flex items-center justify-end pt-4 border-t border-gray-50 dark:border-gray-700">
                      <button onClick={onAcceptOrder} className="px-8 py-2 bg-[#E0AAFF] text-white rounded-xl text-xs font-bold shadow-md active:scale-95">قبول الطلب</button>
                    </div>
                  </div>
                ))
              ) : (
                activeOrders.length > 0 ? (
                  activeOrders.map(order => (
                    <div key={order.id} className="bg-white dark:bg-gray-800 p-6 rounded-[2.5rem] shadow-soft border border-[#E0AAFF]/10 animate-in slide-in-from-bottom duration-300">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[#E0AAFF]/10 text-[#E0AAFF] rounded-xl flex items-center justify-center"><Package size={20} /></div>
                          <div>
                            <h4 className="font-black text-gray-800 dark:text-white text-sm">طلب #{order.id}</h4>
                            <p className="text-[10px] text-gray-400 font-bold uppercase">{order.customer}</p>
                          </div>
                        </div>
                        <div className="bg-green-50 dark:bg-green-900/10 text-green-500 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tight">نشط الآن</div>
                      </div>

                      <div className="space-y-6">
                         <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest text-right">تحديث مسار الطلب</p>
                         <div className="flex items-center justify-between relative px-2">
                            <div className="absolute top-5 left-8 right-8 h-0.5 bg-gray-100 dark:bg-gray-700 -z-0"></div>
                            <div className={`absolute top-5 left-8 h-0.5 bg-[#E0AAFF] transition-all duration-500 -z-0 ${order.status === 'PREPARING' ? 'w-0' : order.status === 'DELIVERING' ? 'w-[50%]' : 'w-full'}`}></div>
                            
                            <button onClick={() => updateOrderStatus(order.id, 'PREPARING')} className="flex flex-col items-center gap-2 relative z-10">
                               <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${order.status === 'PREPARING' ? 'bg-[#E0AAFF] text-white shadow-soft scale-110' : 'bg-white dark:bg-gray-800 text-gray-300 border border-gray-100 dark:border-gray-700'}`}><Gift size={18} /></div>
                               <span className={`text-[9px] font-black ${order.status === 'PREPARING' ? 'text-[#E0AAFF]' : 'text-gray-400'}`}>تجهيز الهدية</span>
                            </button>

                            <button onClick={() => updateOrderStatus(order.id, 'DELIVERING')} className="flex flex-col items-center gap-2 relative z-10">
                               <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${order.status === 'DELIVERING' ? 'bg-[#E0AAFF] text-white shadow-soft scale-110' : order.status === 'DELIVERED' ? 'bg-green-100 text-green-500' : 'bg-gray-50 dark:bg-gray-800 text-gray-300 border border-gray-100 dark:border-gray-700'}`}><Truck size={18} /></div>
                               <span className={`text-[9px] font-black ${order.status === 'DELIVERING' ? 'text-[#E0AAFF]' : 'text-gray-400'}`}>في الطريق</span>
                            </button>

                            <button onClick={() => updateOrderStatus(order.id, 'DELIVERED')} className="flex flex-col items-center gap-2 relative z-10">
                               <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${order.status === 'DELIVERED' ? 'bg-green-500 text-white shadow-soft scale-110' : 'bg-white dark:bg-gray-800 text-gray-300 border border-gray-100 dark:border-gray-700'}`}><CheckCircle size={18} /></div>
                               <span className={`text-[9px] font-black ${order.status === 'DELIVERED' ? 'text-green-500' : 'text-gray-400'}`}>تم التسليم</span>
                            </button>
                         </div>
                      </div>

                      <div className="mt-8 pt-6 border-t border-gray-50 dark:border-gray-700 flex gap-3">
                         <button onClick={onAcceptOrder} className="flex-1 py-3 bg-[#E0AAFF]/10 text-[#E0AAFF] rounded-2xl font-bold text-xs active:scale-95 transition-all flex items-center justify-center gap-2"><Map size={16} /> فتح الخريطة</button>
                         <button onClick={onAcceptOrder} className="flex-1 py-3 bg-[#E0AAFF] text-white rounded-2xl font-bold text-xs shadow-soft active:scale-95 transition-all">الدردشة مع العميل</button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 opacity-40">
                    <div className="w-20 h-20 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4"><Package size={32} /></div>
                    <p className="font-bold text-gray-500 dark:text-gray-400">لا توجد طلبات نشطة حالياً</p>
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="p-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between mb-8">
               <h2 className="text-2xl font-black text-gray-800 dark:text-white">التنبيهات</h2>
               <span className="bg-[#E0AAFF]/20 text-[#E0AAFF] px-3 py-1 rounded-full text-[10px] font-black uppercase">3 جديد</span>
            </div>
            <div className="space-y-4">
              {NOTIFICATIONS.map(note => (
                <div key={note.id} className="bg-white dark:bg-gray-800 p-5 rounded-[2rem] shadow-sm border border-gray-50 dark:border-gray-700 flex items-start gap-4 hover:border-[#E0AAFF]/30 transition-all cursor-pointer">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                    note.type === 'new_order' ? 'bg-blue-50 text-blue-500' : 
                    note.type === 'payment' ? 'bg-green-50 text-green-500' : 'bg-amber-50 text-amber-500'
                  }`}>
                    {note.type === 'new_order' ? <Package size={20} /> : note.type === 'payment' ? <DollarSign size={20} /> : <Star size={20} />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-bold text-gray-800 dark:text-white text-sm">{note.title}</h4>
                      <span className="text-[9px] text-gray-300 font-bold">{note.time}</span>
                    </div>
                    <p className="text-xs text-gray-400 dark:text-gray-300 leading-relaxed">{note.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'wallet' && (
          <div className="p-6 animate-in fade-in duration-500">
            <h2 className="text-2xl font-black text-gray-800 dark:text-white mb-6 text-right">المحفظة</h2>
            <div className="bg-[#E0AAFF] rounded-[2.5rem] p-8 text-white shadow-soft relative overflow-hidden mb-8">
              <div className="relative z-10 text-right">
                <p className="text-sm font-bold opacity-80 mb-1">الرصيد المتاح</p>
                <h3 className="text-4xl font-black">241.50 <span className="text-lg">ر.س</span></h3>
              </div>
              <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mt-16 blur-2xl"></div>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="p-6 animate-in fade-in duration-500">
            <div className="flex flex-col items-center mb-8">
               <div className="w-32 h-32 rounded-[2.5rem] bg-[#E0AAFF] p-1 shadow-soft rotate-3 overflow-hidden mb-6">
                  <img src="https://picsum.photos/seed/courier1/200/200" className="w-full h-full rounded-[2.3rem] object-cover border-4 border-white dark:border-gray-800" />
               </div>
               <h3 className="text-2xl font-black text-gray-800 dark:text-white">أحمد بن فهد</h3>
               <div className="flex items-center gap-1.5 mt-2 bg-amber-50 dark:bg-amber-900/10 px-4 py-1.5 rounded-full border border-amber-100 dark:border-amber-900/20">
                  <Star size={18} className="text-amber-400 fill-amber-400" />
                  <span className="text-sm font-black text-amber-600 dark:text-amber-400">4.8 (120 تقييم)</span>
               </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Nav - Absolute to stay inside the phone frame */}
      <nav className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-[400px] bg-white dark:bg-gray-800 h-20 rounded-[2.5rem] shadow-2xl flex items-center justify-around px-8 border border-gray-50 dark:border-gray-700 z-50">
        <button onClick={() => setActiveTab('available')} className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'available' || activeTab === 'active' ? 'text-[#E0AAFF] scale-110' : 'text-gray-400 dark:text-gray-300'}`}><Truck size={24} /><span className="text-[10px] font-bold">الرئيسية</span></button>
        <button onClick={() => setActiveTab('wallet')} className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'wallet' ? 'text-[#E0AAFF] scale-110' : 'text-gray-400 dark:text-gray-300'}`}><DollarSign size={24} /><span className="text-[10px] font-bold">المحفظة</span></button>
        <button onClick={() => setActiveTab('notifications')} className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'notifications' ? 'text-[#E0AAFF] scale-110' : 'text-gray-400 dark:text-gray-300'}`}><Bell size={24} /><span className="text-[10px] font-bold">التنبيهات</span></button>
        <button onClick={() => setActiveTab('profile')} className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'profile' ? 'text-[#E0AAFF] scale-110' : 'text-gray-400 dark:text-gray-300'}`}><User size={24} /><span className="text-[10px] font-bold">ملفي</span></button>
      </nav>
    </div>
  );
};
