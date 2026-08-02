import React, { useState } from 'react';
import { CreditCard, CheckCircle2, ShieldCheck, Loader2 } from 'lucide-react';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

interface PayPalButtonProps {
  userId: string;
  passStartsAt?: string;
  passExpiresAt?: string;
  onSuccess: (paymentData: any) => void;
  onError?: (err: any) => void;
  onGoHome?: () => void;
}

export const PayPalButton: React.FC<PayPalButtonProps> = ({ userId, passStartsAt, passExpiresAt, onSuccess, onError, onGoHome }) => {
  const [loading, setLoading] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);

  const initialOptions = {
    clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID || "test",
    currency: "USD",
    intent: "capture",
  };

  const createOrder = async () => {
    try {
      const orderRes = await fetch('/api/payments/paypal/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, amount: "1", currency: "USD" })
      });
      const orderData = await orderRes.json();
      if (orderData.orderID) {
        return orderData.orderID;
      }
      throw new Error(orderData.error || "Failed to create order");
    } catch (err: any) {
      if (onError) onError(err);
      throw err;
    }
  };

  const onApprove = async (data: any, actions: any) => {
    setLoading(true);
    try {
      const captureRes = await fetch('/api/payments/paypal/capture-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderID: data.orderID,
          userId,
          passStartsAt,
          passExpiresAt
        })
      });

      const captureData = await captureRes.json();
      setLoading(false);
      if (captureData.success) {
        setPaymentDone(true);
        onSuccess(captureData);
      } else {
        alert(captureData.error || '결제 승인 중 오류가 발생했습니다.');
        if (onError) onError(new Error(captureData.error));
      }
    } catch (err: any) {
      setLoading(false);
      if (onError) onError(err);
      alert('PayPal 결제 승인 연동 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="w-full space-y-3">
      {paymentDone ? (
        <div className="bg-emerald-50 border-2 border-emerald-500 p-4 rounded-xl text-emerald-900 text-center space-y-3">
          <div>
            <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-600 animate-bounce" />
            <p className="font-extrabold text-[15px] mt-1">PayPal $1 결제 승인 완료!</p>
            <p className="text-[12px] text-emerald-700">10일간 프리미엄 라이선스가 활성화되었습니다.</p>
          </div>
          {onGoHome && (
            <button
              onClick={onGoHome}
              className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold py-2.5 rounded-lg text-[13px] shadow transition-all cursor-pointer"
            >
              홈 화면으로 돌아가기
            </button>
          )}
        </div>
      ) : (
        <PayPalScriptProvider options={initialOptions}>
          {loading && (
             <div className="w-full py-4 flex items-center justify-center gap-2">
               <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
               <span className="font-bold text-blue-700 text-sm">PayPal 결제 처리 중...</span>
             </div>
          )}
          <div className={loading ? "hidden" : "block"}>
             <PayPalButtons 
               createOrder={createOrder} 
               onApprove={onApprove}
               style={{ layout: "vertical", shape: "rect", color: "blue" }}
             />
          </div>
        </PayPalScriptProvider>
      )}

      <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-500 font-medium">
        <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
        <span>PayPal SSL 암호화 결제 • 10일 후 자동 만료 (구독 자동갱신 없음)</span>
      </div>
    </div>
  );
};
