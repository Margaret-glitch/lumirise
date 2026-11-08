/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Award, Download, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
import { Course } from '../types/education';

interface CertificatesViewProps {
  courses: Course[];
  onSelectCourse: (course: Course) => void;
}

export const CertificatesView: React.FC<CertificatesViewProps> = ({ courses, onSelectCourse }) => {
  const earnedCertificates = courses.slice(0, 3); // Demo certificates earned

  return (
    <div className="space-y-6 pb-16">
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <Award className="w-6 h-6 text-amber-500" />
          <span>Certificates & Achievements ({earnedCertificates.length})</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Verified certificates awarded upon successful completion of course final examinations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {earnedCertificates.map((course, idx) => (
          <div
            key={course.id}
            className="bg-white p-6 rounded-3xl border-2 border-violet-200 shadow-xl space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>

              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-violet-600 bg-violet-50 px-2.5 py-1 rounded-md">
                Verified Certificate #{1042 + idx}
              </span>

              <h3 className="text-lg font-extrabold text-slate-900">{course.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{course.subtitle}</p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Passed with 92%</span>
              <button
                onClick={() => onSelectCourse(course)}
                className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>View Certificate</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
