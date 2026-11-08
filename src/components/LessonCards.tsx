import React, { useState } from 'react';
import { Module, Lesson } from '../types/education';
import {
  Play,
  CheckCircle2,
  Circle,
  FileText,
  HelpCircle,
  Code2,
  ChevronDown,
  ChevronUp,
  Clock,
  Search,
  Filter,
} from 'lucide-react';

interface LessonCardsProps {
  modules: Module[];
  selectedLessonId: string;
  onSelectLesson: (lesson: Lesson, moduleNumber: number) => void;
  onToggleComplete: (lessonId: string) => void;
}

export const LessonCards: React.FC<LessonCardsProps> = ({
  modules,
  selectedLessonId,
  onSelectLesson,
  onToggleComplete,
}) => {
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({
    'mod-1': true,
    'mod-2': true,
    'mod-3': true,
    'mod-4': false,
  });

  const [filterType, setFilterType] = useState<'all' | 'video' | 'exercise' | 'quiz'>('all');
  const [searchFilter, setSearchFilter] = useState('');

  const toggleModule = (id: string) => {
    setExpandedModules((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const getLessonIcon = (type: Lesson['type'], completed: boolean) => {
    if (completed) {
      return <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-50" />;
    }
    switch (type) {
      case 'video':
        return <Play className="w-4 h-4 text-indigo-600" />;
      case 'exercise':
        return <Code2 className="w-4 h-4 text-amber-600" />;
      case 'quiz':
        return <HelpCircle className="w-4 h-4 text-violet-600" />;
      case 'reading':
      default:
        return <FileText className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Interactive Controls Bar: Search & Type Filter Tabs */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Search topics, auto layout, grids..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
          />
          {searchFilter && (
            <button
              onClick={() => setSearchFilter('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filter Segmented Buttons (Functional interactive controls, NOT pills) */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg shrink-0">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              filterType === 'all'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Lessons
          </button>
          <button
            onClick={() => setFilterType('video')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              filterType === 'video'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Videos
          </button>
          <button
            onClick={() => setFilterType('exercise')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              filterType === 'exercise'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Exercises
          </button>
          <button
            onClick={() => setFilterType('quiz')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              filterType === 'quiz'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Quizzes
          </button>
        </div>
      </div>

      {/* Modules List */}
      <div className="space-y-4">
        {modules.map((mod) => {
          // Filter lessons by query & type
          const filteredLessons = mod.lessons.filter((l) => {
            const matchesType = filterType === 'all' || l.type === filterType;
            const matchesQuery =
              !searchFilter ||
              l.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
              (l.description && l.description.toLowerCase().includes(searchFilter.toLowerCase()));
            return matchesType && matchesQuery;
          });

          if (filteredLessons.length === 0 && (filterType !== 'all' || searchFilter)) {
            return null;
          }

          const isExpanded = expandedModules[mod.id] ?? true;
          const completedCount = mod.lessons.filter((l) => l.completed).length;

          return (
            <div
              key={mod.id}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden transition-all"
            >
              {/* Module Accordion Header */}
              <button
                onClick={() => toggleModule(mod.id)}
                className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-slate-50/75 transition-colors border-b border-slate-100"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center text-xs font-bold font-mono">
                    0{mod.number}
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-slate-900">
                      {mod.title}
                    </h2>
                    <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                      <span>{mod.lessons.length} lessons</span>
                      <span aria-hidden="true">·</span>
                      <span>{mod.totalDuration}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-emerald-700 font-medium">
                        {completedCount}/{mod.lessons.length} done
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-slate-400">
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </div>
              </button>

              {/* Module Description & Lesson Cards */}
              {isExpanded && (
                <div className="p-4 sm:p-5 bg-slate-50/40 space-y-3">
                  <p className="text-xs text-slate-500 mb-2 px-1">
                    {mod.description}
                  </p>

                  <div className="grid grid-cols-1 gap-2.5">
                    {filteredLessons.map((lesson, idx) => {
                      const isSelected = selectedLessonId === lesson.id;

                      return (
                        <div
                          key={lesson.id}
                          className={`p-3.5 sm:p-4 rounded-lg border transition-all flex items-center justify-between gap-3 group cursor-pointer ${
                            isSelected
                              ? 'bg-indigo-50/80 border-indigo-500/60 ring-1 ring-indigo-500/30'
                              : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
                          }`}
                          onClick={() => onSelectLesson(lesson, mod.number)}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            {/* Checkbox / Completion toggle */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onToggleComplete(lesson.id);
                              }}
                              title={lesson.completed ? 'Mark uncompleted' : 'Mark completed'}
                              className="shrink-0 p-1 rounded hover:bg-slate-100 transition-colors"
                            >
                              {lesson.completed ? (
                                <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                              ) : (
                                <Circle className="w-5 h-5 text-slate-300 hover:text-slate-400" />
                              )}
                            </button>

                            {/* Lesson Title & Metadata */}
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-mono text-slate-400 shrink-0">
                                  {mod.number}.{idx + 1}
                                </span>
                                <h3
                                  className={`text-sm font-medium truncate ${
                                    isSelected
                                      ? 'text-indigo-950 font-semibold'
                                      : lesson.completed
                                      ? 'text-slate-700'
                                      : 'text-slate-900'
                                  }`}
                                >
                                  {lesson.title}
                                </h3>
                              </div>

                              <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                                <span className="capitalize">{lesson.type}</span>
                                <span aria-hidden="true">·</span>
                                <span className="tabular-nums flex items-center gap-1">
                                  <Clock className="w-3 h-3 text-slate-400" />
                                  {lesson.duration}
                                </span>
                                {lesson.resources && lesson.resources.length > 0 && (
                                  <>
                                    <span aria-hidden="true">·</span>
                                    <span>{lesson.resources.length} file</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Right Action Trigger */}
                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onSelectLesson(lesson, mod.number);
                              }}
                              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 ${
                                isSelected
                                  ? 'bg-indigo-600 text-white'
                                  : 'bg-slate-100 text-slate-700 group-hover:bg-indigo-50 group-hover:text-indigo-600'
                              }`}
                            >
                              {getLessonIcon(lesson.type, lesson.completed)}
                              <span className="hidden sm:inline">
                                {isSelected ? 'Current' : lesson.completed ? 'Review' : 'Start'}
                              </span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
