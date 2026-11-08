/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  Lock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  X,
  Building2,
  Smartphone,
  Zap,
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

type PaymentChannel = 'card' | 'bank_transfer' | 'ussd' | 'mobile_money';

export const PaystackModal: React.FC<PaystackModalProps> = ({
  course,
  currentUser,
  isOpen,
  onClose,
  onPaymentSuccess,
}) => {
  const [email, setEmail] = useState(currentUser?.email || '');
  const [fullName, setFullName] = useState(currentUser?.name || '');
  const [selectedChannel, setSelectedChannel] = useState<PaymentChannel>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<PaymentRecord | null>(null);
  const [serverPublicKey, setServerPublicKey] = useState<string>('');

  // Fetch server config and load Paystack script on mount
  useEffect(() => {
    if (isOpen) {
      fetch('/api/paystack/config')
        .then((res) => res.json())
        .then((data) => {
          if (data && data.publicKey) {
            setServerPublicKey(data.publicKey);
          }
        })
        .catch((err) => console.warn('Failed to fetch Paystack config:', err));

      if (!window.PaystackPop) {
        const script = document.createElement('script');
        script.src = 'https://js.paystack.co/v1/inline.js';
        script.async = true;
        document.body.appendChild(script);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

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
          channel: selectedChannel,
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

      const reference = initData.reference;
      const publicKey = initData.publicKey || serverPublicKey;
      const authorizationUrl = initData.authorizationUrl;

      if (!publicKey) {
        throw new Error('Paystack public key is not configured. Please check your credentials.');
      }

      // Ensure PaystackPop is loaded
      if (!window.PaystackPop) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://js.paystack.co/v1/inline.js';
          script.async = true;
          script.onload = resolve;
          script.onerror = () => reject(new Error('Failed to load Paystack checkout script. Please check your internet connection.'));
          document.body.appendChild(script);
        });
      }

      // Step 2: Open Paystack Checkout Popup
      // Important: Paystack's legacy inline validator checks Object.prototype.toString.call(fn) === "[object Function]"
      // Therefore callback and onClose must be standard non-async functions, not async arrow functions.
      if (window.PaystackPop) {
        const channelList = selectedChannel === 'card'
          ? ['card']
          : selectedChannel === 'bank_transfer'
            ? ['bank', 'card']
            : selectedChannel === 'ussd'
              ? ['ussd', 'card']
              : ['mobile_money', 'card'];

        const handler = window.PaystackPop.setup({
          key: publicKey,
          email: email.trim().toLowerCase(),
          amount: Math.round(initData.amountInKobo),
          currency: 'NGN',
          channels: channelList,
          ref: reference,
          metadata: {
            courseId: course.id,
            courseTitle: course.title,
            userId: currentUser?.id,
            studentName: fullName,
            channel: selectedChannel,
          },
          callback: function (response: { reference: string; status: string }) {
            setIsProcessing(true);
            fetch('/api/paystack/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                reference: response.reference || reference,
                userId: currentUser?.id,
              }),
            })
              .then((res) => res.json())
              .then((verifyData) => {
                if (!verifyData.success) {
                  throw new Error(verifyData.error || 'Payment verification failed with Paystack.');
                }

                setSuccessInfo(verifyData.payment);
                setTimeout(() => {
                  onPaymentSuccess(course.id, verifyData.payment);
                }, 1200);
              })
              .catch((vErr: any) => {
                setErrorMessage(vErr.message || 'Verification failed. Please contact support.');
              })
              .finally(() => {
                setIsProcessing(false);
              });
          },
          onClose: function () {
            setIsProcessing(false);
            setErrorMessage('Transaction was cancelled or closed before completion.');
          },
        });

        handler.openIframe();
      } else if (authorizationUrl) {
        window.location.href = authorizationUrl;
      } else {
        throw new Error('Paystack checkout script is still initializing. Please wait a second and try again.');
      }
    } catch (err: any) {
      console.error('Payment initialization error:', err);
      setErrorMessage(err.message || 'Payment processing error occurred. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative overflow-hidden max-h-[90vh] overflow-y-auto">
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
              Your payment for <strong>{course.title}</strong> has been successfully confirmed by Paystack. All 6 modules, 30 lessons, and assessments are now fully unlocked.
            </p>
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-left text-[11px] font-mono space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500">Reference:</span>
                <span className="font-bold text-slate-800">{successInfo.reference}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Amount Paid:</span>
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
                  Secure Paystack Multi-Channel Checkout
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
                <span className="text-[10px] text-slate-400">One-time payment · Instant lifetime access</span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20">
                <CreditCard className="w-6 h-6" />
              </div>
            </div>

            {/* Payment Methods / Channels Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">Select Payment Method</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedChannel('card')}
                  className={`p-3 rounded-2xl border text-left transition-all flex flex-col gap-1 cursor-pointer ${
                    selectedChannel === 'card'
                      ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-600/20'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <CreditCard className={`w-4 h-4 ${selectedChannel === 'card' ? 'text-emerald-600' : 'text-slate-500'}`} />
                    <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">Instant</span>
                  </div>
                  <span className="text-xs font-bold text-slate-900">Debit / Credit Card</span>
                  <span className="text-[10px] text-slate-400">Visa, Mastercard, Verve</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedChannel('bank_transfer')}
                  className={`p-3 rounded-2xl border text-left transition-all flex flex-col gap-1 cursor-pointer ${
                    selectedChannel === 'bank_transfer'
                      ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-600/20'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Building2 className={`w-4 h-4 ${selectedChannel === 'bank_transfer' ? 'text-emerald-600' : 'text-slate-500'}`} />
                    <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded">Bank</span>
                  </div>
                  <span className="text-xs font-bold text-slate-900">Direct Bank Transfer</span>
                  <span className="text-[10px] text-slate-400">Virtual Account via Paystack</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedChannel('ussd')}
                  className={`p-3 rounded-2xl border text-left transition-all flex flex-col gap-1 cursor-pointer ${
                    selectedChannel === 'ussd'
                      ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-600/20'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Smartphone className={`w-4 h-4 ${selectedChannel === 'ussd' ? 'text-emerald-600' : 'text-slate-500'}`} />
                    <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-purple-700 bg-purple-100 px-1.5 py-0.5 rounded">Quick</span>
                  </div>
                  <span className="text-xs font-bold text-slate-900">USSD Code</span>
                  <span className="text-[10px] text-slate-400">GTB, Zenith, UBA, etc.</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedChannel('mobile_money')}
                  className={`p-3 rounded-2xl border text-left transition-all flex flex-col gap-1 cursor-pointer ${
                    selectedChannel === 'mobile_money'
                      ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-600/20'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Zap className={`w-4 h-4 ${selectedChannel === 'mobile_money' ? 'text-emerald-600' : 'text-slate-500'}`} />
                    <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">Momo</span>
                  </div>
                  <span className="text-xs font-bold text-slate-900">Mobile Money</span>
                  <span className="text-[10px] text-slate-400">Supported mobile wallets</span>
                </button>
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
                    <span>Pay {formattedPrice} via {selectedChannel === 'card' ? 'Debit/Credit Card' : selectedChannel === 'bank_transfer' ? 'Bank Transfer' : selectedChannel === 'ussd' ? 'USSD Code' : 'Mobile Money'}</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>256-bit encrypted multi-channel checkout powered by Paystack</span>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
