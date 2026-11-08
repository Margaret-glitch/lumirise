/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  CreditCard,
  Lock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  X,
  ExternalLink,
  Sparkles,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import { Course, UserSession, PaymentRecord } from '../types/education';

declare global {
  interface Window {
    PaystackPop?: {
      setup: (options: any) => {
        openIframe: () => void;
      };
    };
  }
}

interface PaystackModalProps {
  course: Course;
  currentUser: UserSession | null;
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: (courseId: string, record: PaymentRecord) => void;
}

export const PaystackModal: React.FC<PaystackModalProps> = ({
  course,
  currentUser,
  isOpen,
  onClose,
  onPaymentSuccess,
}) => {
  const [email, setEmail] = useState(currentUser?.email || '');
  const [fullName, setFullName] = useState(currentUser?.name || '');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<PaymentRecord | null>(null);

  if (!isOpen) return null;

  // Format price in NGN
  const coursePrice = typeof course.price === 'number' && course.price > 0 ? course.price : (course.id === 'course-1-mathematics' ? 0 : 15000);
  const formattedPrice = new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(coursePrice);

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsProcessing(true);

    if (!email || !email.includes('@')) {
      setErrorMessage('Please provide a valid email address for your payment receipt.');
      setIsProcessing(false);
      return;
    }

    try {
      // Step 1: Initialize transaction with backend
      const initRes = await fetch('/api/paystack/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId: course.id,
          studentEmail: email.trim().toLowerCase(),
          studentName: fullName.trim() || 'Student',
          userId: currentUser?.id || 'anonymous',
          callbackUrl: window.location.href,
        }),
      });

      const initData = await initRes.json();
      if (!initRes.ok || !initData.success) {
        throw new Error(initData.error || 'Failed to initialize Paystack transaction.');
      }

      // If free course was unlocked directly
      if (initData.isFree) {
        const freeRecord: PaymentRecord = {
          id: `free-${Date.now()}`,
          userId: currentUser?.id || 'anonymous',
          studentEmail: email,
          studentName: fullName,
          courseId: course.id,
          courseTitle: course.title,
          reference: `FREE_${course.id}`,
          amount: 0,
          currency: 'NGN',
          status: 'success',
          paidAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        };
        setSuccessInfo(freeRecord);
        setTimeout(() => {
          onPaymentSuccess(course.id, freeRecord);
        }, 1200);
        return;
      }

      const { reference, publicKey, authorizationUrl } = initData;

      // Step 2: Open Paystack Checkout Popup
      if (window.PaystackPop && publicKey) {
        const handler = window.PaystackPop.setup({
          key: publicKey,
          email: email.trim().toLowerCase(),
          amount: initData.amountInKobo,
          currency: 'NGN',
          ref: reference,
          metadata: {
            courseId: course.id,
            courseTitle: course.title,
            userId: currentUser?.id,
            studentName: fullName,
          },
          callback: async (response: { reference: string; status: string }) => {
            setIsProcessing(true);
            try {
              // Step 3: Verify transaction strictly on the backend
              const verifyRes = await fetch('/api/paystack/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  reference: response.reference || reference,
                  userId: currentUser?.id,
                }),
              });

              const verifyData = await verifyRes.json();
              if (!verifyRes.ok || !verifyData.success) {
                throw new Error(verifyData.error || 'Payment verification failed with Paystack.');
              }

              setSuccessInfo(verifyData.payment);
              setTimeout(() => {
                onPaymentSuccess(course.id, verifyData.payment);
              }, 1200);
            } catch (vErr: any) {
              setErrorMessage(vErr.message || 'Verification failed. Please contact support.');
            } finally {
              setIsProcessing(false);
            }
          },
          onClose: () => {
            setIsProcessing(false);
            setErrorMessage('Transaction was cancelled or closed before completion.');
          },
        });

        handler.openIframe();
      } else if (authorizationUrl) {
        // Fallback: Redirect to Paystack standard checkout page
        window.location.href = authorizationUrl;
      } else {
        throw new Error(
          'Paystack checkout script is still initializing or PAYSTACKPUBLICKEY is not configured yet. Please check your Paystack API keys.'
        );
      }
    } catch (err: any) {
      console.error('Payment initialization error:', err);
      setErrorMessage(err.message || 'Payment processing error occurred. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isProcessing}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-40"
        >
          <X className="w-5 h-5" />
        </button>

        {successInfo ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md shadow-emerald-500/20">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-slate-900">Payment Verified! 🎉</h3>
            <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
              Your payment for <strong>{course.title}</strong> has been confirmed by Paystack. All 6 modules, 30 lessons, and assessments are now unlocked.
            </p>
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-left text-[11px] font-mono space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500">Ref:</span>
                <span className="font-bold text-slate-800">{successInfo.reference}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Amount:</span>
                <span className="font-bold text-emerald-600">
                  {new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(successInfo.amount)}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Header */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                  Secure Paystack Checkout
                </span>
              </div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                Unlock {course.title}
              </h2>
              <p className="text-xs text-slate-500">
                Lifetime access to all 6 modules, 30 interactive lessons, practice tests, exams and certified diploma.
              </p>
            </div>

            {/* Course Summary Card */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-semibold text-slate-500">Course Tuition</span>
                <div className="text-2xl font-black text-slate-900">{formattedPrice}</div>
                <span className="text-[10px] text-slate-400">One-time payment · No subscriptions</span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20">
                <CreditCard className="w-6 h-6" />
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{errorMessage}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handlePay} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Margaret Omare"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={isProcessing}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Address (Receipt & Paystack Notification)
                </label>
                <input
                  type="email"
                  required
                  placeholder="student@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isProcessing}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              {/* Pay Button */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs rounded-2xl shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Connecting with Paystack...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Pay {formattedPrice} with Paystack</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>256-bit encrypted bank checkout powered by Paystack</span>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
