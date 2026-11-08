/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BookOpen, Search, ArrowRight, Sparkles, Lock, CheckCircle2 } from 'lucide-react';
import { Course, UserSession } from '../types/education';

interface CourseLibraryViewProps {
  courses: Course[];
  currentUser: UserSession | null;
  onSelectCourse: (course: Course) => void;
}

export const CourseLibraryView: React.FC<CourseLibraryViewProps> = ({
  courses,
  currentUser,
  onSelectCourse,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Mathematics', 'Humanities & Language', 'Science', 'Technology & AI', 'Business & Marketing'];

  const filteredCourses = courses.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase());
    if (selectedCategory !== 'All') {
      return matchesSearch && c.category.toLowerCase().includes(selectedCategory.toLowerCase());
    }
    return matchesSearch;
  });

  return (
    <div className="space-y-6 pb-16">
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Course Library ({courses.length})
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Explore all 20 fully structured academic and artificial intelligence courses.
          </p>
        </div>

        <div className="relative w-full md:w-80">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search all 20 courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-600 text-slate-900 placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              selectedCategory === cat
                ? 'bg-violet-600 text-white shadow-md shadow-violet-600/25'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => {
          const isEnrolled =
            Boolean(currentUser?.role === 'admin') ||
            (currentUser?.enrolledCourseIds && currentUser.enrolledCourseIds.includes(course.id)) ||
            course.id === 'course-1-mathematics';
          const price = typeof course.price === 'number' && course.price > 0 ? course.price : (course.id === 'course-1-mathematics' ? 0 : 15000);
          const priceTag = price === 0 ? 'Free Access' : `₦${price.toLocaleString()}`;

          return (
            <div
              key={course.id}
              onClick={() => onSelectCourse(course)}
              className="bg-white p-6 rounded-3xl border border-slate-200/80 hover:border-violet-400 hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-violet-50 text-violet-700 border border-violet-200">
                    {course.category}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {isEnrolled ? (
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Enrolled</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 flex items-center gap-1">
                        <Lock className="w-3 h-3 text-slate-400" />
                        <span>{priceTag}</span>
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="text-lg font-bold text-slate-900 group-hover:text-violet-600 transition-colors">
                  {course.title}
                </h3>

                <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                  {course.subtitle}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-violet-600">
                <span>{isEnrolled ? 'Open Masterclass' : 'Enroll with Paystack'}</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
