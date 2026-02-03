
import React, { useState } from 'react';
import { Phone, ArrowLeft, ShieldCheck, Car } from 'lucide-react';

interface Props {
  onNext: () => void;
  onBack: () => void;
}

export const CourierLoginScreen: React.FC<Props> = ({ onNext, onBack }) => {
  const [step, setStep] = useState<'LOGIN' | 'DOCS'>('LOGIN');

  return (
    <div className="flex-1 flex flex-col p-8 bg-[#FFFFFC]">
      <button onClick={onBack} className="self-start p-2 bg-white rounded-xl shadow-sm text-gray-400 mb-8">
        <ArrowLeft size={24} className="rotate-180" />
      </button>

      {step === 'LOGIN' ? (
        <div className="space-y-8 animate-in slide-in-from-bottom duration-500">
          <div>
            <h1 className="text-3xl font-black text-gray-800">تسجيل المندوب</h1>
            <p className="text-gray-400 mt-2 font-medium">انضم لأسرة مندوبين هديتي</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">رقم الجوال</label>
              <div className="relative">
                <input
                  type="tel"
                  placeholder="5xxxxxxxx"
                  className="w-full h-14 bg-white border-2 border-gray-50 rounded-2xl px-12 text-left focus:border-[#E0AAFF] outline-none transition-all"
                  dir="ltr"
                />
                <Phone className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
              </div>
            </div>

            <button
              onClick={() => setStep('DOCS')}
              className="w-full h-16 bg-[#E0AAFF] text-white rounded-2xl font-black text-lg shadow-lg active:scale-95 transition-all"
            >
              المتابعة للبيانات
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-8 animate-in slide-in-from-left duration-500">
          <div>
            <h1 className="text-3xl font-black text-gray-800">بيانات المركبة</h1>
            <p className="text-gray-400 mt-2 font-medium">نحتاج لبعض الوثائق للتحقق</p>
          </div>

          <div className="space-y-4">
            <div className="bg-white p-5 rounded-3xl border-2 border-dashed border-gray-100 flex items-center justify-between group hover:border-[#E0AAFF] transition-all cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#E0AAFF]/10 text-[#E0AAFF] rounded-xl flex items-center justify-center">
                  <ShieldCheck size={24} />
                </div>
                <span className="font-bold text-gray-700">رخصة القيادة</span>
              </div>
              <span className="text-[#E0AAFF] text-sm font-bold">رفع صورة</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border-2 border-dashed border-gray-100 flex items-center justify-between group hover:border-[#E0AAFF] transition-all cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#E0AAFF]/10 text-[#E0AAFF] rounded-xl flex items-center justify-center">
                  <Car size={24} />
                </div>
                <span className="font-bold text-gray-700">استمارة المركبة</span>
              </div>
              <span className="text-[#E0AAFF] text-sm font-bold">رفع صورة</span>
            </div>

            <button
              onClick={onNext}
              className="w-full h-16 bg-[#E0AAFF] text-white rounded-2xl font-black text-lg shadow-lg active:scale-95 transition-all mt-6"
            >
              إرسال للتدقيق
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
