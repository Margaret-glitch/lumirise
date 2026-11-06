import React from 'react';
import { Note, Course } from '../types/education';
import { FileText, Trash2, Copy, Check, Download, BookOpen } from 'lucide-react';

interface NotesViewProps {
  notes: Note[];
  course: Course;
  onDeleteNote: (id: string) => void;
  onSelectLessonById: (lessonId: string) => void;
}

export const NotesView: React.FC<NotesViewProps> = ({
  notes,
  course,
  onDeleteNote,
  onSelectLessonById,
}) => {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getLessonTitle = (lessonId: string) => {
    for (const mod of course.modules) {
      const found = mod.lessons.find((l) => l.id === lessonId);
      if (found) return { title: found.title, modNumber: mod.number };
    }
    return { title: 'Unknown Lesson', modNumber: 1 };
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            My Study Notes & Timestamp Bookmarks
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Personal takeaways captured while studying Saiful Ahmed's UI Design lessons.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const allText = notes
                .map((n) => `[${n.timestamp}] ${getLessonTitle(n.lessonId).title}:\n${n.text}\n`)
                .join('\n');
              navigator.clipboard.writeText(allText);
              setCopiedId('all');
              setTimeout(() => setCopiedId(null), 2500);
            }}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors flex items-center gap-1.5"
          >
            {copiedId === 'all' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy All Notes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {notes.length === 0 ? (
        <div className="py-12 text-center text-slate-400 space-y-2">
          <FileText className="w-8 h-8 mx-auto text-slate-300" />
          <p className="text-sm font-medium text-slate-600">No notes recorded yet</p>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Switch to any lesson in the interactive player and use the "Personal Notes" tab to capture insights and timestamps.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {notes.map((note) => {
            const lessonInfo = getLessonTitle(note.lessonId);
            return (
              <div
                key={note.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 flex flex-col justify-between hover:border-slate-300 transition-all space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                    <button
                      onClick={() => onSelectLessonById(note.lessonId)}
                      className="font-medium text-indigo-600 hover:underline flex items-center gap-1 truncate max-w-[200px]"
                    >
                      <BookOpen className="w-3 h-3 shrink-0" />
                      <span className="truncate">Mod 0{lessonInfo.modNumber}: {lessonInfo.title}</span>
                    </button>
                    <span className="font-mono text-slate-400 shrink-0">
                      @ {note.timestamp}
                    </span>
                  </div>
                  <p className="text-sm text-slate-800 leading-relaxed font-normal">
                    {note.text}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                  <button
                    onClick={() => onSelectLessonById(note.lessonId)}
                    className="text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
                  >
                    Go to Lesson →
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleCopy(note.text, note.id)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 rounded transition-colors"
                      title="Copy note"
                    >
                      {copiedId === note.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      onClick={() => onDeleteNote(note.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded transition-colors"
                      title="Delete note"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
