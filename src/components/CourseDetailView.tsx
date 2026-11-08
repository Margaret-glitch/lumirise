/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Play,
  Award,
  FileText,
  PenTool,
  ArrowRight,
  ArrowLeft,
  Check,
  Lightbulb,
  Sparkles,
  ShieldCheck,
  Download,
  GraduationCap,
  Lock,
  CreditCard,
} from 'lucide-react';
import { Course, Lesson, QuizQuestion, UserSession } from '../types/education';
import { sampleQuizQuestions } from '../data/educationData';

interface CourseDetailViewProps {
  course: Course;
  currentUser: UserSession | null;
  onBackToDashboard: () => void;
  onToggleCompleteLesson: (lessonId: string) => void;
  onFinishExam: (score: number, total: number) => void;
  onOpenPaystack: (course: Course) => void;
}

export const CourseDetailView: React.FC<CourseDetailViewProps> = ({
  course,
  currentUser,
  onBackToDashboard,
  onToggleCompleteLesson,
  onFinishExam,
  onOpenPaystack,
}) => {
  // Access control check
  const isEnrolled =
    Boolean(currentUser?.role === 'admin') ||
    (currentUser?.enrolledCourseIds && currentUser.enrolledCourseIds.includes(course.id)) ||
    course.id === 'course-1-mathematics';

  const coursePrice = typeof course.price === 'number' && course.price > 0 ? course.price : (course.id === 'course-1-mathematics' ? 0 : 15000);
  const formattedPrice = new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(coursePrice);

  // Stages in exact sequence: 'topics' | 'practiceTest' | 'bigQuiz' | 'mainTest' | 'exam' | 'certificate'
  const [activeStage, setActiveStage] = useState<
    'topics' | 'practiceTest' | 'bigQuiz' | 'mainTest' | 'exam' | 'certificate'
  >('topics');

  const [selectedLesson, setSelectedLesson] = useState<Lesson>(
    course.modules[0]?.lessons[0] || {
      id: 'dummy',
      title: 'Introduction',
      duration: '15 min',
      durationMinutes: 15,
      completed: false,
      type: 'reading',
      description: 'Course introduction',
      detailedContent: 'Welcome to the course.',
      keyTakeaways: ['Understand core principles.'],
    }
  );

  // Quiz / Exam state
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [examScore, setExamScore] = useState<{ score: number; total: number; passed: boolean } | null>(
    null
  );

  const allLessons = course.modules.flatMap((m) => m.lessons);
  const completedCount = allLessons.filter((l) => l.completed).length;
  const progressPercent = Math.round((completedCount / Math.max(allLessons.length, 1)) * 100);

  // Extract or generate test questions
  const finalTestQuestions: QuizQuestion[] = React.useMemo(() => {
    if (course.finalTest) {
      if (Array.isArray(course.finalTest)) return course.finalTest;
      if (course.finalTest.questions) return course.finalTest.questions;
    }
    return sampleQuizQuestions;
  }, [course]);

  const handleSelectAnswer = (optionIdx: number) => {
    if (quizSubmitted) return;
    setSelectedAnswers({ ...selectedAnswers, [currentQuizIndex]: optionIdx });
  };

  const handleNextQuizQuestion = (questionsLen: number) => {
    if (currentQuizIndex < questionsLen - 1) {
      setCurrentQuizIndex(currentQuizIndex + 1);
    } else {
      setQuizSubmitted(true);
      // Calculate score
      let score = 0;
      finalTestQuestions.forEach((q, idx) => {
        if (selectedAnswers[idx] === q.correctIndex) score++;
      });
      const total = finalTestQuestions.length;
      const passed = (score / total) * 100 >= 80;
      setExamScore({ score, total, passed });
      if (passed) {
        onFinishExam(score, total);
      }
    }
  };

  const resetQuiz = () => {
    setCurrentQuizIndex(0);
    setSelectedAnswers({});
    setQuizSubmitted(false);
    setExamScore(null);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Navigation & Back */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200">
        <button
          onClick={onBackToDashboard}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>

        <div className="flex items-center gap-3">
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-violet-50 text-violet-700 border border-violet-200">
            {course.category}
          </span>
          <span className="text-xs font-semibold text-slate-500">{course.level}</span>
        </div>
      </div>

      {/* Course Hero Header */}
      <div className="bg-gradient-to-r from-violet-900 via-indigo-900 to-slate-900 text-white p-8 rounded-3xl space-y-4 shadow-xl">
        <div className="max-w-2xl space-y-2">
          <span className="text-xs font-mono text-violet-300 font-semibold tracking-wider uppercase">
            Comprehensive Masterclass · {course.duration}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{course.title}</h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{course.subtitle}</p>
        </div>

        {/* Progress Bar */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-4 border-t border-slate-800">
          <div className="flex-1 space-y-1">
            <div className="flex justify-between text-xs font-semibold">
              <span>Course Progress</span>
              <span className="text-violet-300">{progressPercent}% Completed</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-violet-500 to-purple-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
          <div className="text-xs text-slate-300 shrink-0 font-medium">
            {completedCount} of {allLessons.length} Lessons Finished
          </div>
        </div>
      </div>

      {/* Access Gate / Paywall Notification Banner if Not Enrolled */}
      {!isEnrolled && (
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-[11px] font-bold backdrop-blur-xs">
              <Lock className="w-3.5 h-3.5" />
              <span>Premium Course · Paystack Enrollment Required</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black">
              Unlock Full Access to {course.title}
            </h2>
            <p className="text-xs sm:text-sm text-white/90 max-w-xl leading-relaxed">
              Enroll now to access all 6 modules, 30 in-depth lessons, practical test suites, examinations and your verified graduation diploma.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0 w-full md:w-auto">
            <div className="text-center md:text-right">
              <span className="text-xs text-white/80 block">One-time Tuition</span>
              <span className="text-2xl font-black">{formattedPrice}</span>
            </div>

            <button
              onClick={() => onOpenPaystack(course)}
              className="w-full sm:w-auto px-6 py-3.5 bg-white text-slate-900 hover:bg-slate-100 rounded-2xl text-xs font-black shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer transform hover:-translate-y-0.5"
            >
              <CreditCard className="w-4 h-4 text-emerald-600" />
              <span>Enroll with Paystack</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 6-Stage Sequential Learning Navigation Bar */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-1.5 overflow-x-auto">
        {[
          { id: 'topics', label: '1. Topics & Lessons', icon: BookOpen },
          { id: 'practiceTest', label: '2. Practice Test', icon: PenTool },
          { id: 'bigQuiz', label: '3. Big Quiz', icon: Award },
          { id: 'mainTest', label: '4. Main Test', icon: FileText },
          { id: 'exam', label: '5. Examination', icon: GraduationCap },
          { id: 'certificate', label: '6. Certificate', icon: ShieldCheck },
        ].map((stage, idx) => {
          const Icon = stage.icon;
          const isActive = activeStage === stage.id;
          return (
            <button
              key={stage.id}
              onClick={() => {
                if (!isEnrolled && stage.id !== 'topics') {
                  onOpenPaystack(course);
                  return;
                }
                setActiveStage(stage.id as any);
                resetQuiz();
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-violet-600 text-white shadow-md shadow-violet-600/25'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              } ${!isEnrolled && stage.id !== 'topics' ? 'opacity-70' : ''}`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{stage.label}</span>
              {!isEnrolled && stage.id !== 'topics' && <Lock className="w-3 h-3 text-slate-400 ml-1" />}
            </button>
          );
        })}
      </div>

      {/* STAGE 1: TOPICS & LESSONS */}
      {activeStage === 'topics' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Lesson Content */}
          <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-violet-600 bg-violet-50 px-2.5 py-1 rounded-md">
                  Active Lesson Spotlight
                </span>
                <h2 className="text-xl font-bold text-slate-900 mt-1">{selectedLesson.title}</h2>
              </div>
              <button
                onClick={() => onToggleCompleteLesson(selectedLesson.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer ${
                  selectedLesson.completed
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                    : 'bg-violet-600 text-white hover:bg-violet-700'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{selectedLesson.completed ? 'Completed' : 'Mark as Done'}</span>
              </button>
            </div>

            {/* Detailed Content */}
            {!isEnrolled && selectedLesson.id !== course.modules[0]?.lessons[0]?.id ? (
              <div className="py-12 px-6 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto shadow-md shadow-amber-500/20">
                  <Lock className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-900">Lesson Locked</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    To access this lesson, practice tests, quizzes and certification for <strong>{course.title}</strong>, please complete your Paystack enrollment.
                  </p>
                </div>
                <button
                  onClick={() => onOpenPaystack(course)}
                  className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/20 transition-all inline-flex items-center gap-2 cursor-pointer"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Unlock with Paystack ({formattedPrice})</span>
                </button>
              </div>
            ) : (
              <>
                <div className="prose prose-slate max-w-none text-xs sm:text-sm leading-relaxed space-y-4 text-slate-700 whitespace-pre-line">
                  {selectedLesson.detailedContent || selectedLesson.description}
                </div>

                {/* Summary */}
                {selectedLesson.summary && (
                  <div className="p-4 rounded-2xl bg-violet-50/60 border border-violet-100 space-y-1.5">
                    <div className="flex items-center gap-2 text-xs font-bold text-violet-900">
                      <Lightbulb className="w-4 h-4 text-violet-600" />
                      <span>Lesson Summary</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{selectedLesson.summary}</p>
                  </div>
                )}
              </>
            )}

            {/* Key Takeaways */}
            {selectedLesson.keyTakeaways && selectedLesson.keyTakeaways.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Key Takeaways
                </h4>
                <ul className="space-y-2 text-xs text-slate-600">
                  {selectedLesson.keyTakeaways.map((takeaway, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-violet-600 shrink-0 mt-0.5" />
                      <span>{takeaway}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Right Column: Syllabus & Modules Sidebar */}
          <div className="lg:col-span-4 space-y-4 sticky top-24">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-sm font-extrabold text-slate-900">Course Syllabus & Modules</h3>

              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
                {course.modules.map((mod) => (
                  <div key={mod.id} className="space-y-2">
                    <div className="text-xs font-bold text-violet-700 uppercase tracking-wider">
                      Module {mod.number}: {mod.title}
                    </div>
                    <div className="space-y-1.5">
                      {mod.lessons.map((l) => {
                        const isCurrent = l.id === selectedLesson.id;
                        const isLessonLocked = !isEnrolled && l.id !== course.modules[0]?.lessons[0]?.id;
                        return (
                          <button
                            key={l.id}
                            onClick={() => {
                              setSelectedLesson(l);
                              if (isLessonLocked) {
                                // show prompt
                              }
                            }}
                            className={`w-full p-3 rounded-2xl text-left text-xs transition-colors flex items-center justify-between gap-2 cursor-pointer ${
                              isCurrent
                                ? 'bg-violet-600 text-white font-bold shadow-md shadow-violet-600/20'
                                : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 truncate">
                              {isLessonLocked ? (
                                <Lock className={`w-3.5 h-3.5 shrink-0 ${isCurrent ? 'text-white' : 'text-slate-400'}`} />
                              ) : l.completed ? (
                                <CheckCircle2
                                  className={`w-4 h-4 shrink-0 ${
                                    isCurrent ? 'text-white' : 'text-emerald-600'
                                  }`}
                                />
                              ) : (
                                <div
                                  className={`w-2 h-2 rounded-full shrink-0 ${
                                    isCurrent ? 'bg-white' : 'bg-slate-300'
                                  }`}
                                />
                              )}
                              <span className="truncate">{l.title}</span>
                            </div>
                            <span
                              className={`text-[11px] font-mono tabular-nums shrink-0 ${
                                isCurrent ? 'text-violet-200' : 'text-slate-400'
                              }`}
                            >
                              {l.duration}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STAGE 2, 3, 4, 5: TESTS & EXAMINATIONS */}
      {(activeStage === 'practiceTest' ||
        activeStage === 'bigQuiz' ||
        activeStage === 'mainTest' ||
        activeStage === 'exam') && (
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs max-w-3xl mx-auto space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-violet-600 bg-violet-50 px-3 py-1 rounded-full">
                {activeStage === 'practiceTest' && 'Stage 2: Practice Assessment'}
                {activeStage === 'bigQuiz' && 'Stage 3: Comprehensive Big Quiz'}
                {activeStage === 'mainTest' && 'Stage 4: Core Main Test'}
                {activeStage === 'exam' && 'Stage 5: Final Certification Examination'}
              </span>
              <h2 className="text-xl font-bold text-slate-900 mt-2">
                {course.title} — {activeStage === 'exam' ? 'Final Examination' : 'Assessment Module'}
              </h2>
            </div>
            <span className="text-xs font-mono font-bold text-slate-500">
              Question {currentQuizIndex + 1} of {finalTestQuestions.length}
            </span>
          </div>

          {!quizSubmitted ? (
            <div className="space-y-6">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-sm font-semibold text-slate-900 leading-relaxed">
                {finalTestQuestions[currentQuizIndex]?.question}
              </div>

              <div className="space-y-3">
                {finalTestQuestions[currentQuizIndex]?.options.map((option, optIdx) => {
                  const isSelected = selectedAnswers[currentQuizIndex] === optIdx;
                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectAnswer(optIdx)}
                      className={`w-full p-4 rounded-2xl text-left text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-violet-600 text-white shadow-md shadow-violet-600/25'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            isSelected
                              ? 'bg-white text-violet-700'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span>{option}</span>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-white" />}
                    </button>
                  );
                })}
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  onClick={() => handleNextQuizQuestion(finalTestQuestions.length)}
                  disabled={selectedAnswers[currentQuizIndex] === undefined}
                  className="px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-2xl text-xs font-bold transition-all shadow-md flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  <span>
                    {currentQuizIndex < finalTestQuestions.length - 1 ? 'Next Question' : 'Submit & Review'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 space-y-6">
              <div
                className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center ${
                  examScore?.passed
                    ? 'bg-emerald-100 text-emerald-600 shadow-lg shadow-emerald-500/20'
                    : 'bg-amber-100 text-amber-600 shadow-lg shadow-amber-500/20'
                }`}
              >
                {examScore?.passed ? <Award className="w-10 h-10" /> : <Lightbulb className="w-10 h-10" />}
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-black text-slate-900">
                  {examScore?.passed ? 'Congratulations! Examination Passed 🎉' : 'Assessment Completed'}
                </h3>
                <p className="text-sm text-slate-600">
                  You scored <strong className="text-slate-900">{examScore?.score}</strong> out of{' '}
                  <strong className="text-slate-900">{examScore?.total}</strong> (
                  {Math.round(((examScore?.score || 0) / Math.max(examScore?.total || 1, 1)) * 100)}%).
                </p>
                <p className="text-xs text-slate-500">
                  {examScore?.passed
                    ? 'You have successfully unlocked your official course certificate (Stage 6).'
                    : 'Passing score is 80%. Review the course material and try again.'}
                </p>
              </div>

              <div className="pt-4 flex items-center justify-center gap-4">
                <button
                  onClick={resetQuiz}
                  className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Retake Assessment
                </button>

                {examScore?.passed && (
                  <button
                    onClick={() => setActiveStage('certificate')}
                    className="px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-2xl text-xs font-bold transition-all shadow-lg flex items-center gap-2 cursor-pointer"
                  >
                    <span>View Official Certificate</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* STAGE 6: CERTIFICATE */}
      {activeStage === 'certificate' && (
        <div className="bg-white p-8 sm:p-12 rounded-3xl border-2 border-violet-500 shadow-2xl max-w-3xl mx-auto text-center space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-violet-100/50 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-violet-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-violet-600/30">
              <Award className="w-8 h-8" />
            </div>
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-violet-600 block">
              Official LumiRise Certification
            </span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Certificate of Completion
            </h2>
          </div>

          <div className="space-y-4 py-4 border-y border-slate-200">
            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
              This is proudly presented to
            </p>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-violet-900 font-display">
              Margaret Omare
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-lg mx-auto">
              For successfully completing all modules, quizzes, practice tests, and passing the final comprehensive examination for the masterclass:
            </p>
            <h4 className="text-xl font-bold text-slate-900">{course.title}</h4>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 px-8">
            <div>
              <span className="block font-bold text-slate-900">Dr. Leonard Euler Vance</span>
              <span>Lead Academic Instructor</span>
            </div>
            <div>
              <span className="block font-bold text-slate-900">
                {new Date().toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
              <span>Issue Date</span>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-center gap-4">
            <button
              onClick={() => alert('Certificate downloaded successfully as PDF.')}
              className="px-6 py-3.5 bg-violet-600 hover:bg-violet-700 text-white rounded-2xl text-xs font-bold transition-all shadow-lg flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF Certificate</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
