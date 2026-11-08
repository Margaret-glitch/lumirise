import React, { useState } from 'react';
import { Course, Lesson } from '../types/education';
import {
  Play,
  CheckCircle2,
  Circle,
  Clock,
  BookOpen,
  HelpCircle,
  Home,
  User,
  Bookmark,
  ChevronRight,
  Flame,
  Search,
  Sparkles,
} from 'lucide-react';

interface MobileFrameViewProps {
  course: Course;
  selectedLesson: Lesson;
  onSelectLesson: (lesson: Lesson, moduleNumber: number) => void;
  onToggleComplete: (lessonId: string) => void;
  completedLessonsCount: number;
}

export const MobileFrameView: React.FC<MobileFrameViewProps> = ({
  course,
  selectedLesson,
  onSelectLesson,
  onToggleComplete,
  completedLessonsCount,
}) => {
  const [mobileTab, setMobileTab] = useState<'home' | 'lessons' | 'quiz'>('home');
  const [activeModuleIndex, setActiveModuleIndex] = useState<number>(0);

  const activeModule = course.modules[activeModuleIndex] || course.modules[0];
  const progressPercent = Math.round(
    (completedLessonsCount / course.totalLessons) * 100
  );

  return (
    <div className="flex flex-col items-center justify-center py-6 px-4">
      {/* Device Switcher / Hint Bar */}
      <div className="text-center mb-4">
        <p className="text-xs text-slate-500 font-medium">
          Simulating Saiful Ahmed's 390px Mobile App Concept (Interactive Frame)
        </p>
      </div>

      {/* Smartphone Hardware Frame (Flat Minimalist Smartphone Mockup) */}
      <div className="w-[380px] max-w-full bg-slate-900 p-3 rounded-[40px] shadow-2xl border-4 border-slate-800">
        {/* Screen Area */}
        <div className="bg-slate-50 w-full rounded-[32px] overflow-hidden flex flex-col h-[740px] relative text-slate-900 select-none">
          {/* iOS Dynamic Island / Status Bar */}
          <div className="bg-white px-6 pt-3 pb-2 flex items-center justify-between text-xs font-semibold shrink-0">
            <span className="font-mono text-[11px]">9:41</span>
            {/* Camera notch */}
            <div className="w-20 h-4 bg-slate-900 rounded-full mx-auto" />
            <div className="flex items-center gap-1.5 text-[10px]">
              <span>5G</span>
              <div className="w-5 h-2.5 border border-slate-800 rounded-xs p-0.5 flex items-center">
                <div className="w-3 h-full bg-slate-800 rounded-xs" />
              </div>
            </div>
          </div>

          {/* Top Mobile App Header */}
          <div className="bg-white px-5 py-3 border-b border-slate-100 flex items-center justify-between shrink-0">
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">
                Welcome back
              </span>
              <span className="text-sm font-bold text-slate-900">
                Margaret Omare 👋
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded text-amber-700 text-xs font-semibold border border-amber-200">
                <Flame className="w-3 h-3 fill-amber-500 text-amber-500" />
                <span>14d</span>
              </div>
              <div className="w-7 h-7 rounded-full bg-slate-800 text-white flex items-center justify-center text-[10px] font-bold">
                MO
              </div>
            </div>
          </div>

          {/* Scrollable Mobile Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {mobileTab === 'home' && (
              <>
                {/* Active Learning Card (Featured in Saiful Ahmed's concept) */}
                <div className="bg-indigo-600 rounded-2xl p-4 text-white relative overflow-hidden">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-indigo-200 mb-1">
                    Ongoing Course
                  </div>
                  <h3 className="text-base font-bold leading-tight">
                    {course.title}
                  </h3>
                  <p className="text-xs text-indigo-100 mt-1 line-clamp-2">
                    {course.subtitle}
                  </p>

                  {/* Progress inside card */}
                  <div className="mt-4 pt-3 border-t border-indigo-500/40">
                    <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
                      <span>Overall Progress</span>
                      <span className="font-bold tabular-nums">{progressPercent}%</span>
                    </div>
                    <div className="w-full bg-indigo-900/60 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-white h-full rounded-full transition-all"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs">
                    <span className="text-indigo-200 text-[11px]">
                      {completedLessonsCount}/{course.totalLessons} Lessons Done
                    </span>
                    <button
                      onClick={() => setMobileTab('lessons')}
                      className="px-3 py-1 bg-white text-indigo-600 font-semibold text-xs rounded-lg hover:bg-indigo-50 transition-colors"
                    >
                      Continue →
                    </button>
                  </div>
                </div>

                {/* Module Selector Chips */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                      Course Curriculum
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {course.modules.length} Modules
                    </span>
                  </div>

                  <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                    {course.modules.map((m, idx) => (
                      <button
                        key={m.id}
                        onClick={() => setActiveModuleIndex(idx)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors border ${
                          activeModuleIndex === idx
                            ? 'bg-slate-900 text-white border-slate-900'
                            : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        Mod 0{m.number}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Saiful Ahmed's Clean Lesson Cards List for Active Module */}
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-slate-700">
                    {activeModule.title}
                  </div>

                  {activeModule.lessons.map((lesson, idx) => {
                    const isSelected = selectedLesson.id === lesson.id;

                    return (
                      <div
                        key={lesson.id}
                        onClick={() => onSelectLesson(lesson, activeModule.number)}
                        className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-2.5 cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-50 border-indigo-500'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleComplete(lesson.id);
                            }}
                            className="shrink-0"
                          >
                            {lesson.completed ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-100" />
                            ) : (
                              <Circle className="w-4 h-4 text-slate-300" />
                            )}
                          </button>

                          <div className="min-w-0">
                            <h4
                              className={`text-xs font-semibold truncate ${
                                isSelected ? 'text-indigo-900' : 'text-slate-800'
                              }`}
                            >
                              {lesson.title}
                            </h4>
                            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-0.5">
                              <span className="capitalize">{lesson.type}</span>
                              <span>·</span>
                              <span className="tabular-nums">{lesson.duration}</span>
                            </div>
                          </div>
                        </div>

                        <div className="shrink-0">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                              isSelected
                                ? 'bg-indigo-600 text-white'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            <Play className="w-2.5 h-2.5 fill-current" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {mobileTab === 'lessons' && (
              <div className="space-y-4">
                <div className="bg-slate-900 text-white rounded-xl p-4 aspect-video flex flex-col justify-between">
                  <div className="text-[10px] font-mono text-indigo-400">
                    NOW PLAYING · 0{activeModule.number}
                  </div>
                  <div className="text-center my-auto">
                    <button
                      onClick={() => onToggleComplete(selectedLesson.id)}
                      className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center mx-auto"
                    >
                      <Play className="w-4 h-4 fill-white" />
                    </button>
                    <div className="text-xs font-semibold mt-2 text-white">
                      {selectedLesson.title}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>02:15</span>
                    <span>{selectedLesson.duration}</span>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                    Lesson Description
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {selectedLesson.description}
                  </p>

                  <button
                    onClick={() => onToggleComplete(selectedLesson.id)}
                    className="w-full py-2 bg-indigo-600 text-white text-xs font-semibold rounded-lg"
                  >
                    {selectedLesson.completed ? '✓ Completed' : 'Mark as Complete'}
                  </button>
                </div>
              </div>
            )}

            {mobileTab === 'quiz' && (
              <div className="bg-white p-4 rounded-xl border border-slate-200 text-center space-y-3">
                <HelpCircle className="w-8 h-8 text-indigo-600 mx-auto" />
                <h4 className="text-sm font-bold text-slate-900">
                  Concept Practice Quiz
                </h4>
                <p className="text-xs text-slate-500">
                  Test your understanding of {course.title}.
                </p>
                <button
                  onClick={() => setMobileTab('lessons')}
                  className="w-full py-2 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Study Lesson & Take Quiz
                </button>
              </div>
            )}
          </div>

          {/* Bottom Mobile Navigation Bar */}
          <div className="bg-white border-t border-slate-200 px-6 py-2.5 flex items-center justify-around shrink-0">
            <button
              onClick={() => setMobileTab('home')}
              className={`flex flex-col items-center gap-1 ${
                mobileTab === 'home' ? 'text-indigo-600 font-bold' : 'text-slate-400'
              }`}
            >
              <Home className="w-4 h-4" />
              <span className="text-[10px]">Home</span>
            </button>
            <button
              onClick={() => setMobileTab('lessons')}
              className={`flex flex-col items-center gap-1 ${
                mobileTab === 'lessons' ? 'text-indigo-600 font-bold' : 'text-slate-400'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span className="text-[10px]">Lessons</span>
            </button>
            <button
              onClick={() => setMobileTab('quiz')}
              className={`flex flex-col items-center gap-1 ${
                mobileTab === 'quiz' ? 'text-indigo-600 font-bold' : 'text-slate-400'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span className="text-[10px]">Quiz</span>
            </button>
          </div>

          {/* iOS Bottom Bar */}
          <div className="bg-white pb-2 flex justify-center shrink-0">
            <div className="w-32 h-1 bg-slate-900 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};
