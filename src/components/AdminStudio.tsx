import React, { useState } from 'react';
import { Course, Module, Lesson, LessonExample, LessonQuizQuestion } from '../types/education';
import {
  Sparkles,
  BookOpen,
  Plus,
  Trash2,
  Edit3,
  Check,
  CheckCircle2,
  AlertCircle,
  Clock,
  Layers,
  Save,
  Globe,
  Eye,
  RefreshCw,
  HelpCircle,
  FileText,
  Code2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface AdminStudioProps {
  courses: Course[];
  onCourseCreatedOrUpdated: (course: Course) => void;
  onCourseDeleted: (courseId: string) => void;
  onSelectCourseForStudent: (course: Course) => void;
}

export const AdminStudio: React.FC<AdminStudioProps> = ({
  courses,
  onCourseCreatedOrUpdated,
  onCourseDeleted,
  onSelectCourseForStudent,
}) => {
  const [activeView, setActiveView] = useState<'create' | 'manage'>('create');

  // AI Generator Form state
  const [topic, setTopic] = useState('');
  const [audience, setAudience] = useState('Beginner to Intermediate students');
  const [level, setLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
  const [moduleCount, setModuleCount] = useState<number>(3);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState('');
  const [generationError, setGenerationError] = useState<string | null>(null);

  // Editing state
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [expandedModuleId, setExpandedModuleId] = useState<string | null>(null);
  const [editingLesson, setEditingLesson] = useState<{
    lesson: Lesson;
    moduleId: string;
  } | null>(null);
  const [isExpandingLesson, setIsExpandingLesson] = useState(false);
  const [statusNotice, setStatusNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const notify = (text: string, type: 'success' | 'error' = 'success') => {
    setStatusNotice({ text, type });
    setTimeout(() => setStatusNotice(null), 3500);
  };

  // Quick preset topics
  const presetTopics = [
    'AI & Large Language Models for Developers',
    'Applied UI/UX Design & Ergonomics',
    'Financial Literacy & Investing for Beginners',
    'Modern TypeScript & Full-Stack Systems',
    'Product Management & Agile Leadership',
    'Web Performance & Accessibility Engineering',
  ];

  // Handle AI Course Generation
  const handleGenerateCourse = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!topic.trim()) {
      setGenerationError('Please enter a course topic or select one from the recommendations.');
      return;
    }

    setIsGenerating(true);
    setGenerationError(null);
    setGenerationStep('Connecting to Gemini 3.8 Flash via backend...');

    const timer1 = setTimeout(() => {
      setGenerationStep('Generating modular curriculum and lesson blueprints...');
    }, 1800);

    const timer2 = setTimeout(() => {
      setGenerationStep('Synthesizing detailed lesson prose, practical examples & summaries...');
    }, 4200);

    const timer3 = setTimeout(() => {
      setGenerationStep('Drafting assessment quizzes and saving directly to database...');
    }, 7000);

    try {
      const res = await fetch('/api/generate/course', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topic.trim(),
          targetAudience: audience,
          level,
          moduleCount,
          specialInstructions,
        }),
      });

      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || data.message || 'Generation failed');
      }

      // Success
      onCourseCreatedOrUpdated(data.course);
      setEditingCourse(data.course);
      setActiveView('manage');
      setTopic('');
      setSpecialInstructions('');
      notify(`Course "${data.course.title}" generated and saved to database!`);
    } catch (err: any) {
      console.error('Course generation error:', err);
      setGenerationError(err.message || 'Failed to generate course. Please verify your connection.');
    } finally {
      setIsGenerating(false);
      setGenerationStep('');
    }
  };

  // Toggle publish status
  const handleTogglePublish = async (course: Course) => {
    const nextStatus = course.status === 'published' ? 'draft' : 'published';
    try {
      const res = await fetch(`/api/courses/${course.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      const data = await res.json();
      if (res.ok) {
        onCourseCreatedOrUpdated(data.course);
        if (editingCourse?.id === course.id) {
          setEditingCourse(data.course);
        }
        notify(`Course status updated to ${nextStatus}.`);
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  // Save edited course
  const handleSaveCourseEdits = async () => {
    if (!editingCourse) return;
    setIsSaving(true);
    try {
      const res = await fetch(`/api/courses/${editingCourse.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingCourse),
      });
      const data = await res.json();
      if (res.ok) {
        onCourseCreatedOrUpdated(data.course);
        notify('Course changes saved and persisted to database!');
      } else {
        notify('Failed to save course: ' + (data.error || 'Server error'), 'error');
      }
    } catch (err) {
      console.error(err);
      notify('Error saving course changes.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Delete course
  const handleDelete = async (courseId: string) => {
    try {
      const res = await fetch(`/api/courses/${courseId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        onCourseDeleted(courseId);
        if (editingCourse?.id === courseId) {
          setEditingCourse(null);
        }
        notify('Course deleted from database.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // AI Expand a specific lesson
  const handleAiExpandLesson = async (lesson: Lesson, courseTitle: string) => {
    setIsExpandingLesson(true);
    try {
      const res = await fetch('/api/generate/lesson-expansion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseTitle,
          lessonTitle: lesson.title,
          currentDescription: lesson.description,
        }),
      });
      const data = await res.json();
      if (res.ok && data.expansion && editingCourse && editingLesson) {
        const exp = data.expansion;
        const updatedLesson: Lesson = {
          ...editingLesson.lesson,
          detailedContent: exp.detailedContent || editingLesson.lesson.detailedContent,
          summary: exp.summary || editingLesson.lesson.summary,
          examples: exp.examples || editingLesson.lesson.examples,
          keyTakeaways: exp.keyTakeaways || editingLesson.lesson.keyTakeaways,
          quiz: exp.quiz || editingLesson.lesson.quiz,
        };

        // Update in editing course
        const updatedModules = editingCourse.modules.map((m) => {
          if (m.id === editingLesson.moduleId) {
            return {
              ...m,
              lessons: m.lessons.map((l) => (l.id === updatedLesson.id ? updatedLesson : l)),
            };
          }
          return m;
        });

        const updatedCourse = { ...editingCourse, modules: updatedModules };
        setEditingCourse(updatedCourse);
        setEditingLesson({ lesson: updatedLesson, moduleId: editingLesson.moduleId });
        notify('Lesson enriched with AI examples, summaries, and quiz questions!');
      }
    } catch (err) {
      console.error(err);
      notify('Error expanding lesson content.', 'error');
    } finally {
      setIsExpandingLesson(false);
    }
  };

  return (
    <div className="space-y-6">
      {statusNotice && (
        <div
          className={`p-3.5 rounded-xl border text-xs flex items-center gap-2 font-medium ${
            statusNotice.type === 'error'
              ? 'bg-rose-50 border-rose-200 text-rose-900'
              : 'bg-emerald-50 border-emerald-200 text-emerald-900'
          }`}
        >
          {statusNotice.type === 'error' ? (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          )}
          <span>{statusNotice.text}</span>
        </div>
      )}

      {/* Top Studio Control Bar */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs uppercase tracking-wider text-indigo-600 font-semibold">
              ADMIN CONTROL PANEL
            </span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="text-xs text-slate-500">Connected to Gemini API</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-0.5">
            LumiRise Course Authoring & AI Studio
          </h2>
        </div>

        {/* View Switcher: Generate New vs Manage Existing */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg shrink-0">
          <button
            onClick={() => setActiveView('create')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
              activeView === 'create'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>AI Course Generator</span>
          </button>

          <button
            onClick={() => setActiveView('manage')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
              activeView === 'manage'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-slate-600" />
            <span>Manage Courses ({courses.length})</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: AI Course Generator */}
      {activeView === 'create' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-xl border border-slate-200 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Generate Complete Course Materials with AI
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Gemini generates original curriculum outlines, structured modules, comprehensive lesson prose, practical code/case examples, summaries, and assessment tests. All materials are automatically saved to your persistent database.
              </p>
            </div>

            <form onSubmit={handleGenerateCourse} className="space-y-5">
              {/* Topic Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-800 uppercase tracking-wide">
                  Course Topic or Title *
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Applied Machine Learning for Web Developers"
                  required
                  disabled={isGenerating}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              {/* Quick Topic Chips */}
              <div className="space-y-1.5">
                <span className="text-xs text-slate-500 font-medium block">
                  Quick Ideas:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {presetTopics.map((pt) => (
                    <button
                      type="button"
                      key={pt}
                      onClick={() => setTopic(pt)}
                      disabled={isGenerating}
                      className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 rounded-md transition-colors"
                    >
                      {pt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Parameters row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-800">
                    Difficulty Level
                  </label>
                  <select
                    value={level}
                    onChange={(e: any) => setLevel(e.target.value)}
                    disabled={isGenerating}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-800">
                    Modules Count
                  </label>
                  <select
                    value={moduleCount}
                    onChange={(e) => setModuleCount(Number(e.target.value))}
                    disabled={isGenerating}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800"
                  >
                    <option value={2}>2 Modules (~6-8 Lessons)</option>
                    <option value={3}>3 Modules (~9-12 Lessons)</option>
                    <option value={4}>4 Modules (~12-16 Lessons)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-800">
                    Target Audience
                  </label>
                  <input
                    type="text"
                    value={audience}
                    onChange={(e) => setAudience(e.target.value)}
                    placeholder="e.g. Design students"
                    disabled={isGenerating}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800"
                  />
                </div>
              </div>

              {/* Special Instructions */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-800">
                  Custom Instructions (Optional)
                </label>
                <textarea
                  rows={2}
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="e.g. Focus on interactive case studies, practical exercises, and industry best practices."
                  disabled={isGenerating}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              {/* Error message */}
              {generationError && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{generationError}</span>
                </div>
              )}

              {/* Generating loading step */}
              {isGenerating && (
                <div className="p-4 rounded-lg bg-indigo-50 border border-indigo-100 text-xs text-indigo-900 space-y-2">
                  <div className="flex items-center gap-2 font-semibold">
                    <RefreshCw className="w-4 h-4 animate-spin text-indigo-600" />
                    <span>AI Course Generation in Progress</span>
                  </div>
                  <p className="text-slate-600 pl-6">{generationStep}</p>
                </div>
              )}

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isGenerating}
                className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold text-sm rounded-lg transition-colors flex items-center justify-center gap-2 shadow-none"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isGenerating ? 'Generating Course Materials...' : 'Generate & Save Course to Database'}</span>
              </button>
            </form>
          </div>

          {/* Right Explanatory Guide */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-slate-900 text-white p-6 rounded-xl border border-slate-800 space-y-4">
              <div className="flex items-center gap-2 text-indigo-400 text-xs font-mono font-semibold">
                <Globe className="w-4 h-4" />
                <span>SERVER-SIDE AI ENGINE</span>
              </div>
              <h4 className="text-base font-bold">
                Direct Gemini 3.8 Flash Integration
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Your API key is securely held on the backend environment. The client makes authenticated REST requests to <code className="text-indigo-300 font-mono">/api/generate/course</code> which validates and saves structured courses to persistent storage.
              </p>

              <div className="pt-2 border-t border-slate-800 space-y-2 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Full modules with numbered sequence</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Real-world case studies & code examples</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Executive summaries & key takeaways</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Assessment tests with instant rationale</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: Manage, Review & Edit Saved Courses */}
      {activeView === 'manage' && (
        <div className="space-y-6">
          {/* Courses List Table / Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: All Saved Courses */}
            <div className="lg:col-span-5 space-y-3">
              <div className="flex items-center justify-between pb-2">
                <h3 className="text-sm font-bold text-slate-900">
                  Courses in Database ({courses.length})
                </h3>
                <button
                  onClick={() => setActiveView('create')}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Generate New</span>
                </button>
              </div>

              {courses.map((c) => {
                const isSelected = editingCourse?.id === c.id;
                const totalL = c.modules.reduce((s, m) => s + m.lessons.length, 0);

                return (
                  <div
                    key={c.id}
                    onClick={() => {
                      setEditingCourse(c);
                      setEditingLesson(null);
                    }}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-50/70 border-indigo-500 ring-1 ring-indigo-500/20'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 text-xs mb-1">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase font-mono ${
                              c.status === 'published'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {c.status}
                          </span>
                          <span className="text-slate-400">·</span>
                          <span className="text-slate-500">{c.level}</span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 truncate">
                          {c.title}
                        </h4>
                        <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                          {c.subtitle}
                        </p>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectCourseForStudent(c);
                          }}
                          title="Open as Student"
                          className="p-1.5 text-slate-500 hover:text-indigo-600 rounded hover:bg-slate-100 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(c.id);
                          }}
                          title="Delete course from DB"
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded hover:bg-slate-100 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                      <span>{c.modules.length} Modules · {totalL} Lessons</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTogglePublish(c);
                        }}
                        className={`text-xs font-medium hover:underline ${
                          c.status === 'published' ? 'text-amber-700' : 'text-emerald-700'
                        }`}
                      >
                        {c.status === 'published' ? 'Unpublish' : 'Publish Live'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Column: Active Course Editor & Lesson Inspector */}
            <div className="lg:col-span-7 bg-white p-6 rounded-xl border border-slate-200 space-y-6">
              {editingCourse ? (
                <>
                  {/* Course Header & Publish Controls */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                    <div>
                      <span className="text-xs font-mono text-indigo-600 font-semibold block mb-0.5">
                        COURSE EDITOR (SAVED IN DB)
                      </span>
                      <h3 className="text-lg font-bold text-slate-900">
                        {editingCourse.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleTogglePublish(editingCourse)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                          editingCourse.status === 'published'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : 'bg-amber-50 text-amber-800 border-amber-300'
                        }`}
                      >
                        {editingCourse.status === 'published' ? '✓ Published to Students' : 'Draft / In Review'}
                      </button>

                      <button
                        onClick={handleSaveCourseEdits}
                        disabled={isSaving}
                        className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Editable Course Metadata */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Course Title</label>
                      <input
                        type="text"
                        value={editingCourse.title}
                        onChange={(e) =>
                          setEditingCourse({ ...editingCourse, title: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Subtitle</label>
                      <input
                        type="text"
                        value={editingCourse.subtitle}
                        onChange={(e) =>
                          setEditingCourse({ ...editingCourse, subtitle: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900"
                      />
                    </div>

                    <div className="space-y-1 sm:col-span-2">
                      <label className="font-semibold text-slate-700">Overview Description</label>
                      <textarea
                        rows={2}
                        value={editingCourse.description || ''}
                        onChange={(e) =>
                          setEditingCourse({ ...editingCourse, description: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900"
                      />
                    </div>
                  </div>

                  {/* Modules & Lessons Inspector */}
                  <div className="pt-4 border-t border-slate-100 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        Curriculum Structure & Lessons
                      </h4>
                      <span className="text-xs text-slate-500">
                        {editingCourse.modules.length} Modules Total
                      </span>
                    </div>

                    <div className="space-y-3">
                      {editingCourse.modules.map((m) => {
                        const isExpanded = expandedModuleId === m.id;

                        return (
                          <div
                            key={m.id}
                            className="border border-slate-200 rounded-lg overflow-hidden bg-slate-50/50"
                          >
                            <button
                              onClick={() =>
                                setExpandedModuleId(isExpanded ? null : m.id)
                              }
                              className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-slate-100 transition-colors"
                            >
                              <div className="flex items-center gap-2.5">
                                <span className="font-mono text-xs font-bold text-slate-700">
                                  Module 0{m.number}:
                                </span>
                                <span className="text-xs font-semibold text-slate-900">
                                  {m.title}
                                </span>
                                <span className="text-[11px] text-slate-400">
                                  ({m.lessons.length} lessons)
                                </span>
                              </div>
                              {isExpanded ? (
                                <ChevronUp className="w-4 h-4 text-slate-400" />
                              ) : (
                                <ChevronDown className="w-4 h-4 text-slate-400" />
                              )}
                            </button>

                            {isExpanded && (
                              <div className="p-3 bg-white border-t border-slate-200 space-y-2">
                                {m.lessons.map((lesson) => {
                                  const isSelected = editingLesson?.lesson.id === lesson.id;
                                  return (
                                    <div
                                      key={lesson.id}
                                      onClick={() => setEditingLesson({ lesson, moduleId: m.id })}
                                      className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                                        isSelected
                                          ? 'border-indigo-500 bg-indigo-50/50 font-medium text-indigo-950'
                                          : 'border-slate-200 hover:bg-slate-50 text-slate-800'
                                      }`}
                                    >
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 truncate">
                                          <span className="capitalize text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                                            {lesson.type}
                                          </span>
                                          <span className="truncate">{lesson.title}</span>
                                        </div>
                                        <span className="text-slate-400 font-mono">
                                          {lesson.duration}
                                        </span>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Specific Lesson Detail Editor */}
                  {editingLesson && (
                    <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                        <div>
                          <span className="text-[11px] font-mono text-indigo-600 font-semibold uppercase">
                            Editing Lesson Material
                          </span>
                          <h4 className="text-sm font-bold text-slate-900">
                            {editingLesson.lesson.title}
                          </h4>
                        </div>

                        <button
                          onClick={() =>
                            handleAiExpandLesson(editingLesson.lesson, editingCourse.title)
                          }
                          disabled={isExpandingLesson}
                          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 shadow-none"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>{isExpandingLesson ? 'Expanding...' : 'AI Expand with Examples & Quiz'}</span>
                        </button>
                      </div>

                      {/* Detailed Content field */}
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-800">
                          Detailed Educational Content
                        </label>
                        <textarea
                          rows={5}
                          value={editingLesson.lesson.detailedContent || ''}
                          onChange={(e) => {
                            const updated = {
                              ...editingLesson.lesson,
                              detailedContent: e.target.value,
                            };
                            setEditingLesson({ ...editingLesson, lesson: updated });
                            // sync to course
                            const updatedModules = editingCourse.modules.map((m) => {
                              if (m.id === editingLesson.moduleId) {
                                return {
                                  ...m,
                                  lessons: m.lessons.map((l) => (l.id === updated.id ? updated : l)),
                                };
                              }
                              return m;
                            });
                            setEditingCourse({ ...editingCourse, modules: updatedModules });
                          }}
                          className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-xs leading-relaxed text-slate-900 font-sans"
                        />
                      </div>

                      {/* Summary */}
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-800">
                          Executive Summary
                        </label>
                        <input
                          type="text"
                          value={editingLesson.lesson.summary || ''}
                          onChange={(e) => {
                            const updated = { ...editingLesson.lesson, summary: e.target.value };
                            setEditingLesson({ ...editingLesson, lesson: updated });
                          }}
                          className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-900"
                        />
                      </div>

                      {/* Examples count */}
                      <div className="flex items-center justify-between text-xs text-slate-600 pt-2 border-t border-slate-200">
                        <span>
                          {editingLesson.lesson.examples?.length || 0} Practical Examples Attached
                        </span>
                        <span>
                          {editingLesson.lesson.quiz?.length || 0} Quiz Questions Ready
                        </span>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="py-16 text-center text-slate-400 space-y-2">
                  <BookOpen className="w-8 h-8 mx-auto text-slate-300" />
                  <p className="text-sm font-medium text-slate-600">Select a course to inspect</p>
                  <p className="text-xs text-slate-400">
                    Click any course on the left to review its lessons, edit prose, publish live, or expand with AI.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
