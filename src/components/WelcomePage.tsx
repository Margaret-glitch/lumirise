/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArrowRight, BookOpen, GraduationCap } from 'lucide-react';

interface WelcomePageProps {
  onGetStarted: () => void;
}

export const WelcomePage: React.FC<WelcomePageProps> = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50/70 via-white to-slate-50 text-slate-900 flex flex-col font-sans selection:bg-purple-100 selection:text-purple-900">
      {/* Top Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-50">
        <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-center">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-purple-500/20">
              <BookOpen className="w-4 h-4" />
            </div>
            <div className="text-center">
              <span className="font-display font-black text-lg tracking-tight text-slate-900 block leading-none">
                LumiRise
              </span>
              <span className="text-[10px] font-semibold text-purple-600 uppercase tracking-widest block mt-0.5">
                Learning Platform
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Welcome Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 max-w-md mx-auto w-full text-center space-y-6">
        {/* Visual Illustration Card matching reference image */}
        <div className="w-full relative rounded-3xl bg-gradient-to-b from-violet-100/60 via-purple-50/40 to-indigo-50/60 p-8 border border-purple-100 shadow-xl shadow-purple-900/5 flex flex-col items-center justify-center min-h-[300px]">
          <div className="absolute top-4 right-4 w-16 h-16 bg-purple-200/50 rounded-full blur-xl pointer-events-none" />
          <div className="absolute bottom-4 left-4 w-20 h-20 bg-indigo-200/40 rounded-full blur-xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col items-center space-y-4">
            {/* Graduation Cap & Books Stack Icon representation */}
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30 transform hover:scale-105 transition-transform">
              <GraduationCap className="w-10 h-10" />
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-100 px-3 py-1 rounded-full">
                Smart Learning
              </span>
            </div>
          </div>
        </div>

        {/* Headline & Description matching reference image exactly */}
        <div className="space-y-3 px-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight leading-tight">
            Your Journey <br />
            to Knowledge <br />
            <span className="bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Starts Here
            </span>
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed max-w-sm mx-auto">
            Learn new skills, take courses, and build a brighter future with AI-powered learning.
          </p>
        </div>

        {/* Pagination Dots */}
        <div className="flex items-center justify-center gap-2 pt-2">
          <span className="w-6 h-2 rounded-full bg-indigo-600" />
          <span className="w-2 h-2 rounded-full bg-slate-300" />
          <span className="w-2 h-2 rounded-full bg-slate-300" />
        </div>

        {/* Get Started Button matching reference image */}
        <div className="w-full pt-4">
          <button
            onClick={onGetStarted}
            className="w-full py-4 px-6 text-sm font-bold text-white bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 rounded-2xl shadow-lg shadow-purple-600/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Get Started</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </main>
    </div>
  );
};
