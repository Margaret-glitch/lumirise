import React, { useState } from 'react';
import { Lesson } from '../types/education';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  Maximize2,
  CheckCircle2,
  Download,
  Plus,
  Trash2,
  FileText,
  Clock,
  ArrowRight,
  Code2,
  Check,
  XCircle,
  HelpCircle,
  Lightbulb,
} from 'lucide-react';

interface InteractivePlayerProps {
  lesson: Lesson;
  moduleNumber: number;
  onToggleComplete: (lessonId: string) => void;
  onNextLesson?: () => void;
  onAddNote: (lessonId: string, text: string) => void;
  notes: { id: string; timestamp: string; text: string }[];
  onDeleteNote: (noteId: string) => void;
}

export const InteractivePlayer: React.FC<InteractivePlayerProps> = ({
  lesson,
  moduleNumber,
  onToggleComplete,
  onNextLesson,
  onAddNote,
  notes,
  onDeleteNote,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [currentTime, setCurrentTime] = useState<number>(145);
  const [totalTime] = useState<number>(lesson.durationMinutes * 60 || 840);
  const [newNoteText, setNewNoteText] = useState('');
  const [activeTab, setActiveTab] = useState<'content' | 'examples' | 'quiz' | 'notes' | 'resources'>('content');

  // Mini quiz state for this lesson
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [downloadedRes, setDownloadedRes] = useState<string | null>(null);

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentTime(Number(e.target.value));
  };

  const handleAddNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    onAddNote(lesson.id, newNoteText.trim());
    setNewNoteText('');
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      {/* Video / Interactive Lecture Canvas (Flat, High Contrast Minimalist Stage) */}
      <div className="relative bg-slate-950 aspect-video w-full flex flex-col justify-between p-4 sm:p-6 text-white overflow-hidden">
        {/* Subtle geometric pattern */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, #818cf8 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        {/* Top Overlay Bar */}
        <div className="relative z-10 flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <span className="font-mono text-indigo-400">Module 0{moduleNumber}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="truncate max-w-[200px] sm:max-w-md">{lesson.title}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-white/10 px-2 py-0.5 rounded text-[11px] font-mono">
              1080p HD
            </span>
          </div>
        </div>

        {/* Center Playback Indicator */}
        <div className="relative z-10 my-auto text-center py-6">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-16 h-16 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center mx-auto transition-transform hover:scale-105 active:scale-95 shadow-none"
            aria-label={isPlaying ? 'Pause video' : 'Play video'}
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 fill-white" />
            ) : (
              <Play className="w-6 h-6 fill-white translate-x-0.5" />
            )}
          </button>
          <div className="mt-3 text-xs text-slate-400 font-medium">
            {isPlaying ? 'Playing interactive lecture' : 'Click to stream lecture'}
          </div>
        </div>

        {/* Bottom Playback Control Deck */}
        <div className="relative z-10 space-y-2 pt-4 bg-gradient-to-t from-slate-950/90 to-transparent -mx-4 -mb-4 px-4 pb-4 sm:-mx-6 sm:-mb-6 sm:px-6 sm:pb-6">
          {/* Progress Timeline Slider */}
          <div className="flex items-center gap-3 text-xs font-mono text-slate-300">
            <span className="tabular-nums">{formatSeconds(currentTime)}</span>
            <input
              type="range"
              min={0}
              max={totalTime}
              value={currentTime}
              onChange={handleSeek}
              className="flex-1 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
            <span className="tabular-nums">{formatSeconds(totalTime)}</span>
          </div>

          {/* Controls Row */}
          <div className="flex items-center justify-between text-slate-300 text-xs">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="hover:text-white transition-colors"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setCurrentTime(Math.max(0, currentTime - 10))}
                className="hover:text-white transition-colors"
                title="Rewind 10 seconds"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-1.5">
                <Volume2 className="w-4 h-4" />
                <div className="w-16 h-1 bg-slate-800 rounded-full">
                  <div className="w-3/4 h-full bg-slate-400 rounded-full" />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-[11px] font-mono bg-white/10 rounded px-1.5 py-0.5">
                {[1.0, 1.25, 1.5].map((spd) => (
                  <button
                    key={spd}
                    onClick={() => setPlaybackSpeed(spd)}
                    className={`px-1 rounded ${
                      playbackSpeed === spd ? 'text-indigo-400 font-bold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>
              <button
                onClick={() => {}}
                className="hover:text-white transition-colors"
                title="Toggle fullscreen"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Lesson Details & Interactive Secondary Deck */}
      <div className="p-5 sm:p-6">
        {/* Title & Complete Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <span className="font-mono text-indigo-600 font-medium">Module 0{moduleNumber}</span>
              <span aria-hidden="true">·</span>
              <span className="capitalize">{lesson.type}</span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">{lesson.duration}</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              {lesson.title}
            </h2>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onToggleComplete(lesson.id)}
              className={`px-4 py-2 text-xs font-semibold rounded-lg border transition-colors flex items-center gap-1.5 ${
                lesson.completed
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : 'bg-indigo-600 text-white border-transparent hover:bg-indigo-700'
              }`}
            >
              <CheckCircle2 className={`w-4 h-4 ${lesson.completed ? 'text-emerald-600' : 'text-white'}`} />
              <span>{lesson.completed ? 'Completed' : 'Mark as Complete'}</span>
            </button>

            {onNextLesson && (
              <button
                onClick={onNextLesson}
                className="px-3.5 py-2 text-xs font-medium rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors flex items-center gap-1.5"
                title="Next Lesson"
              >
                <span>Next</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Tabbed Deck: Content & Prose vs. Examples vs. Quiz vs. Notes vs. Resources */}
        <div className="mt-5">
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg overflow-x-auto mb-5 scrollbar-none">
            <button
              onClick={() => setActiveTab('content')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                activeTab === 'content'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Lesson Content & Summary
            </button>

            <button
              onClick={() => setActiveTab('examples')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'examples'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Practical Examples</span>
              {lesson.examples && lesson.examples.length > 0 && (
                <span className="text-[10px] bg-amber-100 text-amber-800 font-mono px-1.5 py-0.2 rounded-full">
                  {lesson.examples.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('quiz')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'quiz'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Lesson Check</span>
              {lesson.quiz && lesson.quiz.length > 0 && (
                <span className="text-[10px] bg-violet-100 text-violet-800 font-mono px-1.5 py-0.2 rounded-full">
                  {lesson.quiz.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('notes')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'notes'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Personal Notes</span>
              {notes.length > 0 && (
                <span className="text-[10px] bg-indigo-100 text-indigo-700 font-mono px-1.5 py-0.2 rounded-full">
                  {notes.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('resources')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'resources'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Downloads</span>
              {lesson.resources && (
                <span className="text-[10px] bg-slate-200 text-slate-700 font-mono px-1.5 py-0.2 rounded-full">
                  {lesson.resources.length}
                </span>
              )}
            </button>
          </div>

          {/* TAB 1: Detailed Educational Lesson Content & Summary */}
          {activeTab === 'content' && (
            <div className="space-y-5">
              {/* Executive Summary Card if present */}
              {lesson.summary && (
                <div className="p-4 bg-indigo-50/70 border border-indigo-100 rounded-xl text-indigo-950 text-xs leading-relaxed flex items-start gap-3">
                  <Lightbulb className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block uppercase tracking-wider text-[10px] text-indigo-700 mb-0.5">
                      Executive Summary
                    </span>
                    <p className="font-medium">{lesson.summary}</p>
                  </div>
                </div>
              )}

              {/* In-Depth Lesson Content (Prose saved to DB) */}
              <div className="prose prose-slate max-w-none text-sm leading-relaxed text-slate-800 space-y-3 whitespace-pre-line font-normal">
                {lesson.detailedContent || lesson.description}
              </div>

              {/* Important Definitions & Key Concepts for this Lesson */}
              {lesson.definitions && lesson.definitions.length > 0 && (
                <div className="pt-4 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded bg-indigo-600 inline-block" />
                    <span>Important Definitions & Key Concepts</span>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {lesson.definitions.map((d, dIdx) => (
                      <div key={dIdx} className="p-3 bg-slate-50 border border-slate-200/80 rounded-lg text-xs space-y-1">
                        <span className="font-bold text-slate-900 block text-[13px]">{d.term}</span>
                        <p className="text-slate-600 leading-relaxed">{d.definition}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Revision Questions */}
              {lesson.revisionQuestions && lesson.revisionQuestions.length > 0 && (
                <div className="pt-4 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded bg-amber-500 inline-block" />
                    <span>Lesson Revision Questions</span>
                  </h4>
                  <div className="space-y-2">
                    {lesson.revisionQuestions.map((rq, rqIdx) => (
                      <div key={rqIdx} className="p-3 bg-amber-50/50 border border-amber-200/60 rounded-lg text-xs text-amber-950 flex items-start gap-2">
                        <span className="font-mono font-bold text-amber-700 shrink-0">Q{rqIdx + 1}.</span>
                        <span className="font-medium leading-relaxed">{rq}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Key Takeaways */}
              <div className="pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">
                  Core Learning Takeaways
                </h4>
                <ul className="space-y-2">
                  {lesson.keyTakeaways.map((takeaway, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-700">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-2 shrink-0" />
                      <span>{takeaway}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* TAB 2: Practical Examples */}
          {activeTab === 'examples' && (
            <div className="space-y-4">
              {lesson.examples && lesson.examples.length > 0 ? (
                <div className="space-y-4">
                  {lesson.examples.map((ex, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2.5"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-md bg-amber-100 text-amber-800 flex items-center justify-center text-xs font-mono font-bold">
                          {i + 1}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900">
                          {ex.title}
                        </h4>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        {ex.description}
                      </p>

                      {ex.codeOrCaseStudy && (
                        <div className="p-3 bg-slate-900 rounded-lg text-slate-100 font-mono text-xs overflow-x-auto whitespace-pre">
                          {ex.codeOrCaseStudy}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-lg">
                  No separate code examples for this concept lecture. Check the main lesson prose.
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Lesson Quiz */}
          {activeTab === 'quiz' && (
            <div className="space-y-4">
              {lesson.quiz && lesson.quiz.length > 0 ? (
                <div className="space-y-5">
                  <div className="flex items-center justify-between text-xs text-slate-500 pb-2 border-b border-slate-100">
                    <span className="font-semibold text-slate-800">
                      Quick Comprehension Check ({lesson.quiz.length} Questions)
                    </span>
                    <span>Test your understanding of this lesson</span>
                  </div>

                  {lesson.quiz.map((q, qIdx) => {
                    const answered = quizAnswers[qIdx] !== undefined;
                    const selected = quizAnswers[qIdx];
                    const isCorrect = selected === q.correctIndex;

                    return (
                      <div
                        key={q.id || qIdx}
                        className="p-4 rounded-xl border border-slate-200 bg-white space-y-3"
                      >
                        <div className="text-xs font-bold text-slate-900">
                          Q{qIdx + 1}. {q.question}
                        </div>

                        <div className="space-y-2">
                          {q.options.map((opt, optIdx) => {
                            const isThisSelected = selected === optIdx;
                            const isThisCorrect = optIdx === q.correctIndex;

                            let btnStyle = 'border-slate-200 hover:bg-slate-50';
                            if (answered) {
                              if (isThisCorrect) {
                                btnStyle = 'border-emerald-400 bg-emerald-50 text-emerald-950 font-medium';
                              } else if (isThisSelected) {
                                btnStyle = 'border-rose-400 bg-rose-50 text-rose-950';
                              } else {
                                btnStyle = 'border-slate-100 opacity-60';
                              }
                            }

                            return (
                              <button
                                key={optIdx}
                                disabled={answered}
                                onClick={() =>
                                  setQuizAnswers((prev) => ({ ...prev, [qIdx]: optIdx }))
                                }
                                className={`w-full p-2.5 text-left text-xs rounded-lg border transition-all flex items-center justify-between gap-2 ${btnStyle}`}
                              >
                                <span>{opt}</span>
                                {answered && isThisCorrect && (
                                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                                )}
                                {answered && isThisSelected && !isThisCorrect && (
                                  <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                                )}
                              </button>
                            );
                          })}
                        </div>

                        {answered && (
                          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 leading-relaxed">
                            <span className="font-semibold text-slate-900 block mb-0.5">
                              {isCorrect ? '✓ Correct!' : 'Incorrect.'}
                            </span>
                            {q.explanation}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-8 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-lg">
                  No mini-quiz questions configured for this lesson. Use the main Quiz Assessment tab in the header.
                </div>
              )}
            </div>
          )}

          {/* TAB 4: Personal Notes */}
          {activeTab === 'notes' && (
            <div className="space-y-4">
              <form onSubmit={handleAddNoteSubmit} className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    placeholder={`Write a note at ${formatSeconds(currentTime)}...`}
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-medium transition-colors flex items-center gap-1 shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Save Note</span>
                  </button>
                </div>
              </form>

              {notes.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-lg">
                  No notes saved yet for this lesson. Capture reminders while watching.
                </div>
              ) : (
                <div className="space-y-2">
                  {notes.map((note) => (
                    <div
                      key={note.id}
                      className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-start justify-between gap-3 text-sm"
                    >
                      <div>
                        <span className="text-xs font-mono text-indigo-600 font-semibold block mb-0.5">
                          At {note.timestamp}
                        </span>
                        <p className="text-slate-800">{note.text}</p>
                      </div>
                      <button
                        onClick={() => onDeleteNote(note.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                        title="Delete note"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: Downloads / Resources */}
          {activeTab === 'resources' && (
            <div className="space-y-3">
              {lesson.resources && lesson.resources.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {lesson.resources.map((res, i) => (
                    <div
                      key={i}
                      className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded bg-white border border-slate-200 flex items-center justify-center text-xs font-mono font-bold text-slate-700 shrink-0">
                          {res.type}
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-medium text-slate-900 truncate">
                            {res.name}
                          </div>
                          <div className="text-[11px] text-slate-400">{res.size}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setDownloadedRes(res.name);
                          setTimeout(() => setDownloadedRes(null), 3000);
                        }}
                        className={`p-1.5 rounded transition-colors flex items-center gap-1 text-xs ${
                          downloadedRes === res.name
                            ? 'text-emerald-700 bg-emerald-50'
                            : 'text-slate-600 hover:text-indigo-600 hover:bg-white'
                        }`}
                        title="Download file"
                      >
                        {downloadedRes === res.name ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-[11px] font-semibold text-emerald-700">Downloaded</span>
                          </>
                        ) : (
                          <Download className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-lg">
                  No downloadable attachments for this theoretical lesson.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
