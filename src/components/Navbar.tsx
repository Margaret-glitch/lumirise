import React, { useState } from 'react';
import { BookOpen, Smartphone, Monitor, Flame, Sparkles, PenTool, Award, LogOut, User as UserIcon } from 'lucide-react';
import { UserSession } from '../types/education';

interface NavbarProps {
  activeTab: 'curriculum' | 'player' | 'quiz' | 'explore' | 'notes' | 'admin' | 'writing' | 'finalTest';
  setActiveTab: (tab: 'curriculum' | 'player' | 'quiz' | 'explore' | 'notes' | 'admin' | 'writing' | 'finalTest') => void;
  viewMode: 'desktop' | 'mobile';
  setViewMode: (mode: 'desktop' | 'mobile') => void;
  streakCount: number;
  courseTitle?: string;
  isEnglishCourse?: boolean;
  currentUser?: UserSession | null;
  onSignOut?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  viewMode,
  setViewMode,
  streakCount,
  isEnglishCourse,
  currentUser,
  onSignOut,
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-8">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('curriculum')}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold shadow-none">
                <BookOpen className="w-4 h-4" />
              </div>
              <div className="leading-tight">
                <span className="font-display font-bold text-lg tracking-tight text-slate-900 block">
                  LumiRise
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Concise single-line nav links */}
          <nav className="hidden md:flex items-center gap-5 text-sm font-medium">
            <button
              onClick={() => setActiveTab('curriculum')}
              className={`whitespace-nowrap pb-0.5 border-b-2 transition-colors ${
                activeTab === 'curriculum'
                  ? 'border-indigo-600 text-indigo-600 font-semibold'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              Curriculum
            </button>
            <button
              onClick={() => setActiveTab('player')}
              className={`whitespace-nowrap pb-0.5 border-b-2 transition-colors ${
                activeTab === 'player'
                  ? 'border-indigo-600 text-indigo-600 font-semibold'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              Interactive Player
            </button>

            {/* Dedicated Writing Practice Section inside English Language Course */}
            {isEnglishCourse && (
              <button
                onClick={() => setActiveTab('writing')}
                className={`whitespace-nowrap pb-0.5 border-b-2 transition-colors flex items-center gap-1.5 ${
                  activeTab === 'writing'
                    ? 'border-indigo-600 text-indigo-600 font-semibold'
                    : 'border-transparent text-indigo-600 hover:text-indigo-800 font-semibold'
                }`}
              >
                <PenTool className="w-3.5 h-3.5" />
                <span>Writing Practice</span>
              </button>
            )}

            <button
              onClick={() => setActiveTab('quiz')}
              className={`whitespace-nowrap pb-0.5 border-b-2 transition-colors ${
                activeTab === 'quiz'
                  ? 'border-indigo-600 text-indigo-600 font-semibold'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              Lesson Check
            </button>

            <button
              onClick={() => setActiveTab('finalTest')}
              className={`whitespace-nowrap pb-0.5 border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === 'finalTest'
                  ? 'border-indigo-600 text-indigo-600 font-semibold'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-slate-400" />
              <span>Final Test</span>
            </button>

            <button
              onClick={() => setActiveTab('explore')}
              className={`whitespace-nowrap pb-0.5 border-b-2 transition-colors ${
                activeTab === 'explore'
                  ? 'border-indigo-600 text-indigo-600 font-semibold'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              Course Library (20)
            </button>
            <button
              onClick={() => setActiveTab('notes')}
              className={`whitespace-nowrap pb-0.5 border-b-2 transition-colors ${
                activeTab === 'notes'
                  ? 'border-indigo-600 text-indigo-600 font-semibold'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              My Notes
            </button>
          </nav>

          {/* Zone 3: 1 primary action & controls */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Admin Studio Button */}
            <button
              onClick={() => setActiveTab('admin')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                activeTab === 'admin'
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                  : 'bg-white text-indigo-600 border-indigo-200 hover:bg-indigo-50'
              }`}
              title="AI Course Generation & Admin Management"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Admin Studio</span>
            </button>

            {/* View Mode Toggle: Desktop Workspace vs Mobile App Frame */}
            <div className="hidden sm:flex items-center p-0.5 bg-slate-100 rounded-lg border border-slate-200">
              <button
                onClick={() => setViewMode('desktop')}
                title="Desktop Web Layout"
                className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                  viewMode === 'desktop'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>Web</span>
              </button>
              <button
                onClick={() => setViewMode('mobile')}
                title="Mobile App UI Frame"
                className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                  viewMode === 'mobile'
                    ? 'bg-white text-indigo-600 shadow-sm font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Mobile</span>
              </button>
            </div>

            {/* Streak Indicator */}
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium"
              title="Daily Learning Streak"
            >
              <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span className="tabular-nums font-semibold">{streakCount}d</span>
            </div>

            {/* User Profile & Sign Out */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-100 transition-colors"
                  title={`${currentUser.name || 'Student'} (${currentUser.role})`}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-700 to-indigo-600 text-white flex items-center justify-center text-xs font-bold tracking-wider shadow-xs">
                    {(currentUser.name || 'LR')
                      .split(' ')
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join('')
                      .toUpperCase()}
                  </div>
                </button>

                {/* Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-fadeIn">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {currentUser.name}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                      <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 uppercase tracking-wider">
                        {currentUser.role}
                      </span>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          if (onSignOut) onSignOut();
                        }}
                        className="w-full px-4 py-2 text-left text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-semibold transition-colors cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs font-semibold tracking-wider">
                LR
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
