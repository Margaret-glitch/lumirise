import React from 'react';
import { Course } from '../types/education';
import { Play, Award, Clock, Users, Star, CheckCircle2, Bookmark } from 'lucide-react';

interface CourseHeaderProps {
  course: Course;
  completedLessonsCount: number;
  totalLessonsCount: number;
  onContinue: () => void;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
}

export const CourseHeader: React.FC<CourseHeaderProps> = ({
  course,
  completedLessonsCount,
  totalLessonsCount,
  onContinue,
  isBookmarked,
  onToggleBookmark,
}) => {
  const progressPercent = Math.round((completedLessonsCount / totalLessonsCount) * 100);

  return (
    <div className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Attribution & Hierarchy Kickers (Clean text, no pill badges) */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 mb-3">
          <div className="flex items-center gap-2">
            <span className="font-medium text-indigo-600 uppercase tracking-wider text-[11px]">
              Design Education Concept
            </span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>Original UI by Saiful Ahmed (@saifuix099)</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>{course.level} Level</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onToggleBookmark}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border transition-colors ${
                isBookmarked
                  ? 'bg-amber-50 text-amber-900 border-amber-200'
                  : 'bg-white text-slate-600 border-slate-200 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-500 text-amber-500' : ''}`} />
              <span>{isBookmarked ? 'Bookmarked' : 'Save Course'}</span>
            </button>
          </div>
        </div>

        {/* Title & Two-Column Hero Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 text-balance leading-tight">
              {course.title}
            </h1>
            <p className="mt-3 text-slate-600 text-base leading-relaxed max-w-3xl">
              {course.subtitle}
            </p>

            {/* Unboxed Metadata Metrics with clean separators */}
            <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-600">
              <div className="flex items-center gap-1.5 font-medium text-slate-900">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="tabular-nums">{course.rating}</span>
                <span className="text-xs text-slate-500 font-normal">({course.reviewCount.toLocaleString()} reviews)</span>
              </div>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>{course.duration}</span>
              </div>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <div className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-slate-400" />
                <span>{course.totalLessons} structured lessons</span>
              </div>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-slate-400" />
                <span>{course.enrolledStudents} learners</span>
              </div>
            </div>

            {/* Instructor snippet */}
            <div className="mt-6 pt-5 border-t border-slate-100 flex items-center gap-3.5">
              <img
                src={course.instructor.avatar}
                alt={course.instructor.name}
                className="w-10 h-10 rounded-full object-cover border border-slate-200"
              />
              <div>
                <div className="text-sm font-semibold text-slate-900">
                  {course.instructor.name}
                </div>
                <div className="text-xs text-slate-500">
                  {course.instructor.role} · Instructor Rating: {course.instructor.rating} ★
                </div>
              </div>
            </div>
          </div>

          {/* Student Progress & Fast Action Panel (Flat Clean Card) */}
          <div className="lg:col-span-4 bg-slate-50 p-6 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              <span>Your Course Progress</span>
              <span className="tabular-nums text-indigo-600 font-bold">{progressPercent}%</span>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-indigo-600 h-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
              <span className="tabular-nums">
                {completedLessonsCount} of {totalLessonsCount} lessons completed
              </span>
              <span>
                {totalLessonsCount - completedLessonsCount > 0
                  ? `${totalLessonsCount - completedLessonsCount} remaining`
                  : 'All finished!'}
              </span>
            </div>

            <div className="mt-6">
              <button
                onClick={onContinue}
                className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-lg transition-colors flex items-center justify-center gap-2 shadow-none"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Continue Learning</span>
              </button>
            </div>

            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Full lifetime access · Certificate upon completion</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
