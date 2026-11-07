/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  BarChart3,
  User,
  HelpCircle,
  BookmarkCheck,
  PenTool,
  Award,
  FileText,
  GraduationCap,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { Course, UserSession } from '../types/education';

interface MyCoursesViewProps {
  courses: Course[];
  onSelectCourse: (course: Course) => void;
}

export const MyCoursesView: React.FC<MyCoursesViewProps> = ({ courses, onSelectCourse }) => {
  const enroled = courses.slice(0, 5);
  return (
    <div className="space-y-6 pb-16">
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <BookmarkCheck className="w-6 h-6 text-emerald-600" />
          <span>My Enrolled Courses ({enroled.length})</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Courses currently in progress across your active learning schedule.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {enroled.map((c) => (
          <div
            key={c.id}
            onClick={() => onSelectCourse(c)}
            className="bg-white p-6 rounded-3xl border border-slate-200/80 hover:border-violet-400 hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-violet-50 text-violet-700">
                {c.category}
              </span>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-violet-600">
                {c.title}
              </h3>
              <p className="text-xs text-slate-500 line-clamp-2">{c.subtitle}</p>
              <div className="space-y-1 pt-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span>Progress</span>
                  <span className="text-violet-600">60%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className="bg-violet-600 h-full rounded-full w-3/5" />
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-violet-600">
              <span>Continue Learning</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const PracticeTestsView: React.FC<{ courses: Course[]; onSelectCourse: (c: Course) => void }> = ({
  courses,
  onSelectCourse,
}) => (
  <div className="space-y-6 pb-16">
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
      <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
        <PenTool className="w-6 h-6 text-amber-500" />
        <span>Practice Tests</span>
      </h1>
      <p className="text-xs text-slate-500 mt-1">
        Interactive practice assessments for each course to test your daily comprehension.
      </p>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {courses.map((c) => (
        <div
          key={c.id}
          onClick={() => onSelectCourse(c)}
          className="bg-white p-5 rounded-3xl border border-slate-200 hover:border-amber-400 hover:shadow-lg transition-all cursor-pointer flex items-center justify-between"
        >
          <div>
            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded">
              Practice Stage 2
            </span>
            <h3 className="text-base font-bold text-slate-900 mt-1">{c.title} Practice Test</h3>
            <p className="text-xs text-slate-500 mt-0.5">15 Questions · Instant feedback</p>
          </div>
          <button className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl transition-colors">
            Start Test
          </button>
        </div>
      ))}
    </div>
  </div>
);

export const QuizzesView: React.FC<{ courses: Course[]; onSelectCourse: (c: Course) => void }> = ({
  courses,
  onSelectCourse,
}) => (
  <div className="space-y-6 pb-16">
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
      <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
        <Award className="w-6 h-6 text-blue-600" />
        <span>Big Quizzes</span>
      </h1>
      <p className="text-xs text-slate-500 mt-1">
        Comprehensive big quizzes covering core modules and principles.
      </p>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {courses.map((c) => (
        <div
          key={c.id}
          onClick={() => onSelectCourse(c)}
          className="bg-white p-5 rounded-3xl border border-slate-200 hover:border-blue-400 hover:shadow-lg transition-all cursor-pointer flex items-center justify-between"
        >
          <div>
            <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded">
              Big Quiz Stage 3
            </span>
            <h3 className="text-base font-bold text-slate-900 mt-1">{c.title} Big Quiz</h3>
            <p className="text-xs text-slate-500 mt-0.5">20 Questions · Mastery assessment</p>
          </div>
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors">
            Take Quiz
          </button>
        </div>
      ))}
    </div>
  </div>
);

export const MainTestsView: React.FC<{ courses: Course[]; onSelectCourse: (c: Course) => void }> = ({
  courses,
  onSelectCourse,
}) => (
  <div className="space-y-6 pb-16">
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
      <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
        <FileText className="w-6 h-6 text-purple-600" />
        <span>Main Tests</span>
      </h1>
      <p className="text-xs text-slate-500 mt-1">
        Core main tests evaluating advanced analytical problem solving.
      </p>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {courses.map((c) => (
        <div
          key={c.id}
          onClick={() => onSelectCourse(c)}
          className="bg-white p-5 rounded-3xl border border-slate-200 hover:border-purple-400 hover:shadow-lg transition-all cursor-pointer flex items-center justify-between"
        >
          <div>
            <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded">
              Main Test Stage 4
            </span>
            <h3 className="text-base font-bold text-slate-900 mt-1">{c.title} Main Test</h3>
            <p className="text-xs text-slate-500 mt-0.5">30 Minutes · Rigorous evaluation</p>
          </div>
          <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl transition-colors">
            Start Test
          </button>
        </div>
      ))}
    </div>
  </div>
);

export const ExamsView: React.FC<{ courses: Course[]; onSelectCourse: (c: Course) => void }> = ({
  courses,
  onSelectCourse,
}) => (
  <div className="space-y-6 pb-16">
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
      <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
        <GraduationCap className="w-6 h-6 text-emerald-600" />
        <span>Final Examinations & Certification</span>
      </h1>
      <p className="text-xs text-slate-500 mt-1">
        Official final examinations required to unlock your verified LumiRise certificate.
      </p>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {courses.map((c) => (
        <div
          key={c.id}
          onClick={() => onSelectCourse(c)}
          className="bg-white p-5 rounded-3xl border border-slate-200 hover:border-emerald-400 hover:shadow-lg transition-all cursor-pointer flex items-center justify-between"
        >
          <div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded">
              Exam Stage 5
            </span>
            <h3 className="text-base font-bold text-slate-900 mt-1">{c.title} Final Exam</h3>
            <p className="text-xs text-slate-500 mt-0.5">Passing Score: 80% · Certificate Unlocked</p>
          </div>
          <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors">
            Take Exam
          </button>
        </div>
      ))}
    </div>
  </div>
);

export const ProgressView: React.FC<{ courses: Course[] }> = ({ courses }) => (
  <div className="space-y-6 pb-16 max-w-3xl mx-auto">
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
      <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
        <BarChart3 className="w-6 h-6 text-violet-600" />
        <span>Learning Progress & Analytics</span>
      </h1>
      <p className="text-xs text-slate-500 mt-1">Detailed statistics on your mastery across all 20 courses.</p>
    </div>

    <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="p-4 bg-violet-50 rounded-2xl">
          <span className="text-2xl font-black text-violet-700 block">20</span>
          <span className="text-xs text-slate-600 font-medium">Total Courses</span>
        </div>
        <div className="p-4 bg-emerald-50 rounded-2xl">
          <span className="text-2xl font-black text-emerald-700 block">3</span>
          <span className="text-xs text-slate-600 font-medium">Completed</span>
        </div>
        <div className="p-4 bg-amber-50 rounded-2xl">
          <span className="text-2xl font-black text-amber-700 block">3</span>
          <span className="text-xs text-slate-600 font-medium">Certificates</span>
        </div>
      </div>
    </div>
  </div>
);

export const ProfileView: React.FC<{ currentUser: UserSession | null }> = ({ currentUser }) => (
  <div className="space-y-6 pb-16 max-w-3xl mx-auto">
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
      <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
        <User className="w-6 h-6 text-violet-600" />
        <span>Profile & Settings</span>
      </h1>
      <p className="text-xs text-slate-500 mt-1">Manage your LumiRise student account credentials.</p>
    </div>

    <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
      <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
        <div className="w-16 h-16 rounded-2xl bg-violet-600 text-white flex items-center justify-center text-xl font-bold">
          {(currentUser?.name || 'M')[0]}
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900">{currentUser?.name || 'Margaret Omare'}</h3>
          <p className="text-xs text-slate-500">{currentUser?.email || 'margaret@lumirise.edu'}</p>
          <span className="inline-block mt-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-violet-50 text-violet-700 uppercase">
            Student Scholar
          </span>
        </div>
      </div>

      <div className="space-y-3 text-xs">
        <div className="flex justify-between py-2 border-b border-slate-100">
          <span className="text-slate-500">Account Role</span>
          <span className="font-bold text-slate-900 capitalize">{currentUser?.role || 'student'}</span>
        </div>
        <div className="flex justify-between py-2 border-b border-slate-100">
          <span className="text-slate-500">Learning Streak</span>
          <span className="font-bold text-amber-600">14 Days 🔥</span>
        </div>
      </div>
    </div>
  </div>
);

export const HelpView: React.FC = () => (
  <div className="space-y-6 pb-16 max-w-3xl mx-auto">
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
      <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
        <HelpCircle className="w-6 h-6 text-purple-600" />
        <span>Help & Support Center</span>
      </h1>
      <p className="text-xs text-slate-500 mt-1">Frequently asked questions and support resources.</p>
    </div>

    <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4 text-xs">
      <div className="space-y-2">
        <h3 className="font-bold text-slate-900">How does the 6-stage sequential learning flow work?</h3>
        <p className="text-slate-600 leading-relaxed">
          Students progress sequentially through Topics & Lessons, Practice Tests, Big Quizzes, Main Tests, and Final Examinations before unlocking their verified official certificate.
        </p>
      </div>

      <div className="space-y-2 pt-2">
        <h3 className="font-bold text-slate-900">Are all 20 courses generated using Gemini AI?</h3>
        <p className="text-slate-600 leading-relaxed">
          Yes! All 20 courses are managed and expanded automatically by the system using secure backend Gemini API integration.
        </p>
      </div>
    </div>
  </div>
);
