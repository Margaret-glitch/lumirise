import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div>
          <span>© 2026 LumiRise. All rights reserved.</span>
        </div>
        <div className="flex items-center gap-6">
          <a href="#curriculum" className="hover:text-slate-900 transition-colors">Curriculum</a>
          <a href="#resources" className="hover:text-slate-900 transition-colors">Resources</a>
          <a href="#quizzes" className="hover:text-slate-900 transition-colors">Assessments</a>
          <a href="#privacy" className="hover:text-slate-900 transition-colors">Privacy</a>
        </div>
      </div>
    </footer>
  );
};
