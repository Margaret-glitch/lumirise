/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  LayoutDashboard,
  BookOpen,
  BookmarkCheck,
  PenTool,
  Award,
  FileText,
  GraduationCap,
  Sparkles,
  BarChart3,
  User,
  LogOut,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';
import { UserSession } from '../types/education';

export type StudentTab =
  | 'dashboard'
  | 'library'
  | 'myCourses'
  | 'practiceTests'
  | 'quizzes'
  | 'mainTests'
  | 'exams'
  | 'certificates'
  | 'aiTutor'
  | 'progress'
  | 'profile'
  | 'help'
  | 'courseDetail';

interface SidebarProps {
  activeTab: StudentTab;
  setActiveTab: (tab: StudentTab) => void;
  currentUser: UserSession | null;
  onSignOut: () => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  onSignOut,
  isCollapsed,
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen,
}) => {
  const navItems = [
    { id: 'dashboard' as StudentTab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'library' as StudentTab, label: 'Course Library', icon: BookOpen },
    { id: 'myCourses' as StudentTab, label: 'My Courses', icon: BookmarkCheck },
    { id: 'practiceTests' as StudentTab, label: 'Practice Tests', icon: PenTool },
    { id: 'quizzes' as StudentTab, label: 'Quizzes', icon: Award },
    { id: 'mainTests' as StudentTab, label: 'Main Tests', icon: FileText },
    { id: 'exams' as StudentTab, label: 'Exams', icon: GraduationCap },
    { id: 'certificates' as StudentTab, label: 'Certificates', icon: Award },
    { id: 'aiTutor' as StudentTab, label: 'AI Tutor', icon: Sparkles },
    { id: 'progress' as StudentTab, label: 'Progress', icon: BarChart3 },
    { id: 'profile' as StudentTab, label: 'Profile & Settings', icon: User },
  ];

  const handleSelectTab = (tab: StudentTab) => {
    setActiveTab(tab);
    setIsMobileOpen(false); // Close mobile drawer on selection
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs md:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 bg-slate-950 text-slate-300 flex flex-col shrink-0 min-h-screen border-r border-slate-800 transition-all duration-300 transform ${
          isMobileOpen ? 'translate-x-0 w-72' : '-translate-x-full md:translate-x-0'
        } ${isCollapsed ? 'md:w-20' : 'md:w-64'}`}
      >
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-800/80 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/20 shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            {(!isCollapsed || isMobileOpen) && (
              <div className="truncate">
                <span className="font-display font-black text-lg tracking-tight text-white block leading-none truncate">
                  LumiRise
                </span>
                <span className="text-[10px] font-semibold text-purple-400 uppercase tracking-widest block mt-1 truncate">
                  AI Education Platform
                </span>
              </div>
            )}
          </div>

          {/* Close button for mobile */}
          <button
            onClick={() => setIsMobileOpen(false)}
            className="md:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Desktop Collapse Toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900 transition-colors"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                title={isCollapsed && !isMobileOpen ? item.label : undefined}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                } ${isCollapsed && !isMobileOpen ? 'justify-center px-0' : ''}`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                {(!isCollapsed || isMobileOpen) && <span className="truncate">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Help & Support Footer Link */}
        <div className="p-4 border-t border-slate-800/80">
          <button
            onClick={() => handleSelectTab('help')}
            title={isCollapsed && !isMobileOpen ? 'Help & Support' : undefined}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-900 transition-colors ${
              isCollapsed && !isMobileOpen ? 'justify-center px-0' : ''
            }`}
          >
            <HelpCircle className="w-4 h-4 text-purple-400 shrink-0" />
            {(!isCollapsed || isMobileOpen) && <span className="truncate">Help & Support</span>}
          </button>

          {currentUser && (!isCollapsed || isMobileOpen) && (
            <div className="mt-3 pt-3 border-t border-slate-800/60 flex items-center justify-between">
              <div className="flex items-center gap-2.5 truncate">
                <div className="w-8 h-8 rounded-full bg-violet-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                  {(currentUser.name || 'M')[0].toUpperCase()}
                </div>
                <div className="truncate">
                  <span className="text-xs font-bold text-white block truncate">
                    {currentUser.name}
                  </span>
                  <span className="text-[10px] text-slate-400 block truncate">
                    {currentUser.email}
                  </span>
                </div>
              </div>
              <button
                onClick={onSignOut}
                className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-900 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
