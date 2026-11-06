import React, { useState } from 'react';
import { Course } from '../types/education';
import { Clock, Star, BookOpen, ArrowRight, Sparkles, PenTool, CheckCircle2, Award } from 'lucide-react';

interface ExploreCoursesProps {
  courses: Course[];
  activeCourseId: string;
  onSelectCourse: (course: Course) => void;
  onOpenAdminStudio: () => void;
}

export const ExploreCourses: React.FC<ExploreCoursesProps> = ({
  courses,
  activeCourseId,
  onSelectCourse,
  onOpenAdminStudio,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Keep courses in their canonical 1-20 order
  const sortedCourses = [...courses].sort((a, b) => {
    const orderA = a.orderNumber ?? 999;
    const orderB = b.orderNumber ?? 999;
    return orderA - orderB;
  });

  const filteredCourses = sortedCourses.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.title.toLowerCase().includes(q) ||
      c.subtitle.toLowerCase().includes(q) ||
      (c.description && c.description.toLowerCase().includes(q)) ||
      (c.tags && c.tags.some((t) => t.toLowerCase().includes(q)))
    );
  });

  return (
    <div className="space-y-6">
      {/* Catalog Header & Search (No category filter tabs or academic/AI segmentation) */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-xl border border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 text-xs font-mono font-semibold mb-1">
            <BookOpen className="w-3.5 h-3.5" />
            <span>UNIFIED COURSE LIBRARY</span>
            <span className="text-slate-300">·</span>
            <span>{courses.length} COMPLETE MASTER COURSES</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            LumiRise Course Library
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            All 20 comprehensive courses presented together in one unified library. Explore detailed lessons, worked examples, key definitions, revision questions, assessments, and the English writing practice studio.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Quick Search */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search library..."
              className="w-52 sm:w-64 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          {/* AI Generator Shortcut */}
          <button
            onClick={onOpenAdminStudio}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-none"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Admin Course Studio</span>
          </button>
        </div>
      </div>

      {/* Unified 20-Course Grid — All together with individual cards */}
      {filteredCourses.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-3">
          <BookOpen className="w-8 h-8 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">No courses match &ldquo;{searchQuery}&rdquo;</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Clear your search to view all 20 courses in the LumiRise library.
          </p>
          <button
            onClick={() => setSearchQuery('')}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors"
          >
            View All 20 Courses
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((c, index) => {
            const isCurrentlyActive = c.id === activeCourseId;
            const courseNumber = c.orderNumber || index + 1;
            const totalLessons = c.totalLessons || c.modules.reduce((s, m) => s + m.lessons.length, 0);
            const isEnglishCourse = c.title.toLowerCase().includes('english');

            return (
              <div
                key={c.id}
                onClick={() => onSelectCourse(c)}
                className={`bg-white rounded-xl border overflow-hidden flex flex-col justify-between transition-all cursor-pointer group text-left ${
                  isCurrentlyActive
                    ? 'border-indigo-600 ring-2 ring-indigo-500/20 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 hover:shadow-xs'
                }`}
              >
                <div>
                  {/* Clean Card Banner with Course Number */}
                  <div className="h-28 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-4 flex flex-col justify-between text-white relative">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="bg-indigo-600 text-white font-bold px-2 py-0.5 rounded text-[11px] tracking-wide">
                        COURSE {courseNumber < 10 ? `0${courseNumber}` : courseNumber}
                      </span>
                      <span className="bg-white/10 px-2 py-0.5 rounded text-white/90">
                        {c.level}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-300">
                      <div className="flex items-center gap-2">
                        <span>{c.modules.length} Modules</span>
                        <span>·</span>
                        <span>{totalLessons} Lessons</span>
                      </div>
                      <div className="flex items-center gap-1 font-mono text-[11px] text-amber-300">
                        <Star className="w-3 h-3 fill-amber-300" />
                        <span>{c.rating}</span>
                      </div>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-3">
                    <div className="space-y-1">
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug line-clamp-2">
                        {c.title}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {c.subtitle}
                      </p>
                    </div>

                    {/* English Language Special Highlight */}
                    {isEnglishCourse && (
                      <div className="p-2.5 bg-indigo-50 rounded-lg border border-indigo-100 text-[11px] text-indigo-900 flex items-center gap-2 font-medium">
                        <PenTool className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                        <span className="truncate">Includes Writing Practice Studio (Essays, Letters, Reports)</span>
                      </div>
                    )}

                    {/* Instructor snippet */}
                    <div className="flex items-center gap-2 text-xs text-slate-600 pt-1">
                      <img
                        src={c.instructor.avatar}
                        alt={c.instructor.name}
                        className="w-5 h-5 rounded-full object-cover border border-slate-200 shrink-0"
                      />
                      <span className="font-medium truncate">{c.instructor.name}</span>
                    </div>

                    {/* Objectives snippet */}
                    {c.learningObjectives && c.learningObjectives.length > 0 && (
                      <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 line-clamp-1">
                        <span className="font-semibold text-slate-700">Covers: </span>
                        <span>{c.learningObjectives[0]}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Action Strip */}
                <div className="p-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-mono">{c.duration}</span>
                  </div>

                  <div className="flex items-center gap-1 text-indigo-600 font-semibold group-hover:translate-x-0.5 transition-transform">
                    <span>{isCurrentlyActive ? 'Currently Open' : 'Open Course'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
