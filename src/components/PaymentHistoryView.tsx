/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import {
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Receipt,
  BookOpen,
} from 'lucide-react';
import { PaymentRecord, UserSession, Course } from '../types/education';

interface PaymentHistoryViewProps {
  currentUser: UserSession | null;
  courses: Course[];
  onSelectCourse: (course: Course) => void;
}

export const PaymentHistoryView: React.FC<PaymentHistoryViewProps> = ({
  currentUser,
  courses,
  onSelectCourse,
}) => {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPayments = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const email = currentUser?.email || '';
      const userId = currentUser?.id || '';
      const query = new URLSearchParams({ email, userId }).toString();
      const res = await fetch(`/api/paystack/history?${query}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch payment history');
      }
      setPayments(data.payments || []);
    } catch (err: any) {
      setError(err.message || 'Could not load payment records');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [currentUser]);

  return (
    <div className="space-y-6 pb-16 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <CreditCard className="w-6 h-6 text-emerald-600" />
            <span>Paystack Billing & Receipts</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Official transaction references, invoices, and verified course enrollments.
          </p>
        </div>

        <button
          onClick={fetchPayments}
          disabled={isLoading}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Summary stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-400 block">Total Transactions</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">{payments.length}</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-400 block">Successful Payments</span>
          <span className="text-2xl font-black text-emerald-600 mt-1 block">
            {payments.filter((p) => p.status === 'success').length}
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-400 block">Total Invested (NGN)</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">
            {new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(
              payments.filter((p) => p.status === 'success').reduce((sum, p) => sum + (p.amount || 0), 0)
            )}
          </span>
        </div>
      </div>

      {/* Table / List */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Receipt className="w-4 h-4 text-violet-600" />
            <span>Transaction Log</span>
          </h3>
          <span className="text-[11px] font-semibold text-slate-400">
            {payments.length} recorded {payments.length === 1 ? 'event' : 'events'}
          </span>
        </div>

        {isLoading ? (
          <div className="py-12 flex flex-col items-center justify-center text-slate-400 space-y-2">
            <RefreshCw className="w-6 h-6 animate-spin text-emerald-600" />
            <span className="text-xs">Loading payment logs...</span>
          </div>
        ) : payments.length === 0 ? (
          <div className="py-12 text-center text-slate-400 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <Receipt className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-700">No payment records yet</p>
              <p className="text-xs text-slate-400 max-w-xs mx-auto mt-0.5">
                When you enroll in premium courses with Paystack, all verified transaction receipts appear here.
              </p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {payments.map((p) => {
              const matchedCourse = courses.find((c) => c.id === p.courseId);
              return (
                <div key={p.id || p.reference} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{p.courseTitle || 'LumiRise Course'}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 ${
                          p.status === 'success'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : p.status === 'pending'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {p.status === 'success' && <CheckCircle2 className="w-3 h-3" />}
                        {p.status === 'pending' && <Clock className="w-3 h-3" />}
                        <span>{p.status}</span>
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-slate-400">
                      <span>Ref: {p.reference}</span>
                      <span>·</span>
                      <span>{new Date(p.createdAt).toLocaleDateString()} {new Date(p.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                    <span className="text-sm font-black text-slate-900">
                      {new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(p.amount || 0)}
                    </span>

                    {matchedCourse && p.status === 'success' && (
                      <button
                        onClick={() => onSelectCourse(matchedCourse)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                      >
                        <span>Open Course</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-100 flex items-center gap-3 text-xs text-emerald-900">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
        <span>
          All payment transactions are encrypted and audited through Paystack with server-side HMAC-SHA512 verification.
        </span>
      </div>
    </div>
  );
};
