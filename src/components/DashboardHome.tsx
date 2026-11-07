/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Bell,
  ArrowRight,
  Sparkles,
  Award,
  FileText,
  GraduationCap,
  CheckCircle2,
  Play,
  Flame,
  BookmarkCheck,
  PenTool,
  BarChart3,
} from 'lucide-react';
import { Course, UserSession } from '../types/education';

interface DashboardHomeProps {
  currentUser: UserSession | null;
  courses: Course[];
  activeCourse: Course;
  onSelectCourse: (course: Course) => void;
  onNavigateTab: (tab: any) => void;
}

export const DashboardHome: React.FC<DashboardHomeProps> = ({
  currentUser,
  courses,
  activeCourse,
  onSelectCourse,
  onNavigateTab,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<'All Courses' | 'In Progress' | 'Completed'>('All Courses');

  const filteredCourses = courses.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase());
    if (filterCategory === 'In Progress') {
      return matchesSearch && c.id === activeCourse.id;
    }
    if (filterCategory === 'Completed') {
      return matchesSearch && false; // Simulated for demo
    }
    return matchesSearch;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Top Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Hello, {currentUser?.name || 'Margaret'}</span>
            <span className="inline-block animate-wave">👋</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Continue your learning journey with LumiRise.
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Search Bar */}
          <div className="relative w-full md:w-72">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Search courses, topics or lessons..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-slate-900 placeholder:text-slate-400 transition-all"
            />
          </div>

          {/* Notifications */}
          <button className="relative p-2.5 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-200 text-slate-600 transition-colors">
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          </button>

          {/* User Profile Avatar */}
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600 to-purple-600 text-white flex items-center justify-center text-xs font-bold shadow-md shadow-purple-500/20">
            {(currentUser?.name || 'M')[0].toUpperCase()}
          </div>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left / Main Column */}
        <div className="lg:col-span-8 space-y-8">
          {/* Hero Banner matching the mockup image */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-700 via-indigo-600 to-purple-700 p-8 text-white shadow-xl shadow-purple-900/15">
            <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            <div className="relative z-10 max-w-lg space-y-4">
              <span className="text-[10px] font-extrabold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full backdrop-blur-xs">
                Advanced Curriculum
              </span>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
                Learn New Skills <br />
                Build Your Future
              </h2>
              <p className="text-xs sm:text-sm text-purple-100 leading-relaxed">
                Access 20 fully structured courses with lessons, practice tests, big quizzes, main tests, exams and verified certificates.
              </p>
              <div>
                <button
                  onClick={() => onNavigateTab('library')}
                  className="px-6 py-3 bg-white text-violet-700 hover:bg-purple-50 rounded-2xl text-xs font-bold shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center gap-2 cursor-pointer"
                >
                  <span>Explore Courses</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Action Category Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <button
              onClick={() => onNavigateTab('library')}
              className="p-4 bg-white hover:bg-violet-50/50 border border-slate-200/80 rounded-2xl text-left transition-all group shadow-xs cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <BookOpen className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-slate-900">Course Library</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">20 Courses</p>
            </button>

            <button
              onClick={() => onNavigateTab('myCourses')}
              className="p-4 bg-white hover:bg-emerald-50/50 border border-slate-200/80 rounded-2xl text-left transition-all group shadow-xs cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <BookmarkCheck className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-slate-900">My Courses</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">In Progress</p>
            </button>

            <button
              onClick={() => onNavigateTab('practiceTests')}
              className="p-4 bg-white hover:bg-amber-50/50 border border-slate-200/80 rounded-2xl text-left transition-all group shadow-xs cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <PenTool className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-slate-900">Practice Tests</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">Learn & Practice</p>
            </button>

            <button
              onClick={() => onNavigateTab('quizzes')}
              className="p-4 bg-white hover:bg-blue-50/50 border border-slate-200/80 rounded-2xl text-left transition-all group shadow-xs cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Award className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-slate-900">Quizzes</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">Test Knowledge</p>
            </button>
          </div>

          {/* Continue Learning Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-slate-900">Continue Learning</h3>
              <button
                onClick={() => onNavigateTab('library')}
                className="text-xs font-bold text-violet-600 hover:text-violet-800 transition-colors"
              >
                See All
              </button>
            </div>

            <div className="p-4 rounded-2xl border border-violet-100 bg-violet-50/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-violet-600 text-white flex items-center justify-center font-bold shrink-0">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{activeCourse.title}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{activeCourse.subtitle}</p>
                  <div className="mt-3 flex items-center gap-3">
                    <div className="w-36 h-2 rounded-full bg-slate-200 overflow-hidden">
                      <div className="w-3/5 h-full bg-violet-600 rounded-full" />
                    </div>
                    <span className="text-[11px] font-bold text-violet-700">60% Complete</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onSelectCourse(activeCourse)}
                className="px-5 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-2xl text-xs font-bold transition-colors flex items-center gap-2 shadow-sm shrink-0 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Continue</span>
              </button>
            </div>
          </div>

          {/* All Courses (20) Section */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  All Courses ({courses.length})
                </h3>
                <p className="text-xs text-slate-500">
                  Comprehensive masterclasses structured for professional mastery.
                </p>
              </div>

              {/* Filter Pills */}
              <div className="flex items-center p-1 bg-slate-100 rounded-2xl border border-slate-200">
                {(['All Courses', 'In Progress', 'Completed'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setFilterCategory(tab)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                      filterCategory === tab
                        ? 'bg-white text-violet-700 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Course Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredCourses.slice(0, 6).map((course) => (
                <div
                  key={course.id}
                  onClick={() => onSelectCourse(course)}
                  className="bg-white p-5 rounded-3xl border border-slate-200/80 hover:border-violet-400 hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-violet-50 text-violet-700 border border-violet-200">
                        {course.category}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-400">
                        {course.level}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-slate-900 group-hover:text-violet-600 transition-colors">
                      {course.title}
                    </h4>

                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {course.subtitle}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-violet-600">
                    <span>Start Learning</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>

            {courses.length > 6 && (
              <div className="text-center pt-2">
                <button
                  onClick={() => onNavigateTab('library')}
                  className="px-6 py-3 bg-slate-900 hover:bg-violet-700 text-white rounded-2xl text-xs font-bold transition-colors inline-flex items-center gap-2 cursor-pointer"
                >
                  <span>View All {courses.length} Courses in Library</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar Column */}
        <div className="lg:col-span-4 space-y-6">
          {/* Learning Progress Widget matching mockup */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 space-y-4 shadow-xs text-center">
            <h3 className="text-sm font-extrabold text-slate-900 text-left">Your Learning Progress</h3>
            
            <div className="relative w-36 h-36 mx-auto flex items-center justify-center">
              {/* Circular Progress SVG representation */}
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-100"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-violet-600"
                  strokeDasharray="65, 100"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-slate-900">65%</span>
                <span className="text-[10px] font-bold text-slate-400">Overall</span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-sm font-bold text-slate-900">13 of 20</div>
              <div className="text-xs text-slate-500">Courses in Progress & Completed</div>
            </div>

            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div className="bg-violet-600 h-full rounded-full" style={{ width: '65%' }} />
            </div>
          </div>

          {/* Quick Stats Widget */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 space-y-4 shadow-xs">
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-violet-600" />
              <span>Quick Stats</span>
            </h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5 text-slate-600">
                  <BookOpen className="w-4 h-4 text-violet-600" />
                  <span>Total Courses</span>
                </div>
                <span className="font-bold text-slate-900">20</span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5 text-slate-600">
                  <Play className="w-4 h-4 text-indigo-600" />
                  <span>Courses In Progress</span>
                </div>
                <span className="font-bold text-slate-900">5</span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5 text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Completed Courses</span>
                </div>
                <span className="font-bold text-slate-900">3</span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5 text-slate-600">
                  <Award className="w-4 h-4 text-amber-600" />
                  <span>Certificates Earned</span>
                </div>
                <span className="font-bold text-slate-900">3</span>
              </div>
            </div>
          </div>

          {/* Exam & Certification Flow Guide Widget */}
          <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
            <div className="flex items-center gap-2 text-violet-400 text-xs font-mono font-semibold">
              <GraduationCap className="w-4 h-4" />
              <span>LEARNING SEQUENCE</span>
            </div>
            <h3 className="text-sm font-bold">Exam & Certification Flow</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Progress sequentially through each stage to master your course and earn your certificate:
            </p>

            <div className="space-y-2 pt-1 text-xs">
              <div className="flex items-center gap-2 text-slate-200">
                <span className="w-5 h-5 rounded-full bg-violet-600/50 text-violet-300 flex items-center justify-center text-[10px] font-bold">1</span>
                <span>Topics & Lessons</span>
              </div>
              <div className="flex items-center gap-2 text-slate-200">
                <span className="w-5 h-5 rounded-full bg-violet-600/50 text-violet-300 flex items-center justify-center text-[10px] font-bold">2</span>
                <span>Practice Test</span>
              </div>
              <div className="flex items-center gap-2 text-slate-200">
                <span className="w-5 h-5 rounded-full bg-violet-600/50 text-violet-300 flex items-center justify-center text-[10px] font-bold">3</span>
                <span>Big Quiz</span>
              </div>
              <div className="flex items-center gap-2 text-slate-200">
                <span className="w-5 h-5 rounded-full bg-violet-600/50 text-violet-300 flex items-center justify-center text-[10px] font-bold">4</span>
                <span>Main Test</span>
              </div>
              <div className="flex items-center gap-2 text-slate-200">
                <span className="w-5 h-5 rounded-full bg-violet-600/50 text-violet-300 flex items-center justify-center text-[10px] font-bold">5</span>
                <span>Final Examination</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                <span className="w-5 h-5 rounded-full bg-emerald-600/50 text-emerald-300 flex items-center justify-center text-[10px] font-bold">6</span>
                <span>Official Certificate</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
