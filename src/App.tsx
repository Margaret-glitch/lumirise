/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { initial20Courses } from './data/allCourses';
import { Course, Lesson, UserSession } from './types/education';
import { WelcomePage } from './components/WelcomePage';
import { AuthPage } from './components/AuthPage';
import { Sidebar, StudentTab } from './components/Sidebar';
import { DashboardHome } from './components/DashboardHome';
import { CourseLibraryView } from './components/CourseLibraryView';
import { CourseDetailView } from './components/CourseDetailView';
import { AiTutorView } from './components/AiTutorView';
import { CertificatesView } from './components/CertificatesView';
import {
  MyCoursesView,
  PracticeTestsView,
  QuizzesView,
  MainTestsView,
  ExamsView,
  ProgressView,
  ProfileView,
  HelpView,
} from './components/StudentViews';
import { CheckCircle2, Menu } from 'lucide-react';

export default function App() {
  const [courses, setCourses] = useState<Course[]>(initial20Courses);
  const [activeCourse, setActiveCourse] = useState<Course>(initial20Courses[0]);
  const [activeTab, setActiveTab] = useState<StudentTab>('dashboard');
  const [streakCount, setStreakCount] = useState<number>(14);

  // Sidebar state
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);

  // Authentication & Session state
  const [currentUser, setCurrentUser] = useState<UserSession | null>(() => {
    try {
      const saved = localStorage.getItem('lumirise_user');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed reading cached user:', e);
    }
    return null;
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Flow control when unauthenticated: 'welcome' | 'auth'
  const [guestAuthView, setGuestAuthView] = useState<'welcome' | 'auth'>('welcome');
  const [authInitialTab, setAuthInitialTab] = useState<'signin' | 'signup'>('signin');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleAuthSuccess = (user: UserSession, token: string) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('lumirise_user', JSON.stringify(user));
      localStorage.setItem('lumirise_auth_token', token);
    } catch (e) {
      console.error('LocalStorage write error:', e);
    }
    setGuestAuthView('welcome');
    setActiveTab('dashboard');
    showToast(`Welcome back to LumiRise, ${user.name || 'Student'}!`);
  };

  const handleSignOut = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('lumirise_user');
      localStorage.removeItem('lumirise_auth_token');
    } catch (e) {
      console.error('LocalStorage remove error:', e);
    }
    setGuestAuthView('welcome');
    showToast('You have successfully signed out.');
  };

  // Fetch courses from server database
  useEffect(() => {
    async function fetchCourses() {
      try {
        const res = await fetch('/api/courses?includeDrafts=true');
        if (res.ok) {
          const data = await res.json();
          if (data.courses && data.courses.length > 0) {
            setCourses(data.courses);
            setActiveCourse(data.courses[0]);
          }
        }
      } catch (err) {
        console.warn('Using default initial20Courses:', err);
      }
    }
    fetchCourses();
  }, []);

  const handleSelectCourse = (course: Course) => {
    setActiveCourse(course);
    setActiveTab('courseDetail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleCompleteLesson = async (lessonId: string) => {
    const updatedModules = activeCourse.modules.map((mod) => ({
      ...mod,
      lessons: mod.lessons.map((l) =>
        l.id === lessonId ? { ...l, completed: !l.completed } : l
      ),
    }));

    const updatedCourse = { ...activeCourse, modules: updatedModules };
    setActiveCourse(updatedCourse);
    setCourses((prev) => prev.map((c) => (c.id === updatedCourse.id ? updatedCourse : c)));

    try {
      await fetch(`/api/courses/${activeCourse.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedCourse),
      });
      showToast('Progress saved.');
    } catch (err) {
      console.error(err);
    }
  };

  const handleFinishExam = (score: number, total: number) => {
    const percent = Math.round((score / total) * 100);
    if (percent >= 80) {
      setStreakCount((prev) => prev + 1);
      showToast(`Examination Passed! Score: ${score}/${total} (${percent}%). Certificate Unlocked!`);
    } else {
      showToast(`Score: ${score}/${total} (${percent}%). Review lessons to achieve 80%.`);
    }
  };

  // Unauthenticated Visitor Protection Flow
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl border border-slate-700 shadow-xl text-xs flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {guestAuthView === 'auth' ? (
          <AuthPage
            initialTab={authInitialTab}
            onAuthSuccess={handleAuthSuccess}
            onBackToWelcome={() => setGuestAuthView('welcome')}
          />
        ) : (
          <WelcomePage
            onGetStarted={() => {
              setAuthInitialTab('signin');
              setGuestAuthView('auth');
            }}
          />
        )}
      </div>
    );
  }

  // Authenticated Student Dashboard Layout with Collapsible Purple Sidebar
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl border border-slate-700 shadow-xl text-xs flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Left Collapsible Purple Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onSignOut={handleSignOut}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Top Bar with Hamburger Menu */}
        <header className="md:hidden sticky top-0 z-30 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileOpen(true)}
              className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
              title="Open Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="font-display font-black text-base text-slate-900">LumiRise</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-violet-600 text-white flex items-center justify-center text-xs font-bold">
            {(currentUser.name || 'M')[0]}
          </div>
        </header>

        <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'dashboard' && (
              <DashboardHome
                currentUser={currentUser}
                courses={courses}
                activeCourse={activeCourse}
                onSelectCourse={handleSelectCourse}
                onNavigateTab={(tab) => setActiveTab(tab)}
              />
            )}

            {activeTab === 'library' && (
              <CourseLibraryView courses={courses} onSelectCourse={handleSelectCourse} />
            )}

            {activeTab === 'myCourses' && (
              <MyCoursesView courses={courses} onSelectCourse={handleSelectCourse} />
            )}

            {activeTab === 'practiceTests' && (
              <PracticeTestsView courses={courses} onSelectCourse={handleSelectCourse} />
            )}

            {activeTab === 'quizzes' && (
              <QuizzesView courses={courses} onSelectCourse={handleSelectCourse} />
            )}

            {activeTab === 'mainTests' && (
              <MainTestsView courses={courses} onSelectCourse={handleSelectCourse} />
            )}

            {activeTab === 'exams' && (
              <ExamsView courses={courses} onSelectCourse={handleSelectCourse} />
            )}

            {activeTab === 'certificates' && (
              <CertificatesView courses={courses} onSelectCourse={handleSelectCourse} />
            )}

            {activeTab === 'aiTutor' && <AiTutorView courses={courses} />}

            {activeTab === 'progress' && <ProgressView courses={courses} />}

            {activeTab === 'profile' && <ProfileView currentUser={currentUser} />}

            {activeTab === 'help' && <HelpView />}

            {activeTab === 'courseDetail' && (
              <CourseDetailView
                course={activeCourse}
                onBackToDashboard={() => setActiveTab('dashboard')}
                onToggleCompleteLesson={handleToggleCompleteLesson}
                onFinishExam={handleFinishExam}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};
