import React, { useState, useEffect } from 'react';
import { WritingPrompt, WritingSubmission } from '../types/education';
import {
  PenTool,
  Sparkles,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  FileText,
  Clock,
  RotateCcw,
  Save,
  Trash2,
  Award,
  ChevronRight,
  TrendingUp,
  Check,
} from 'lucide-react';

interface WritingPracticeSectionProps {
  courseTitle: string;
  prompts?: WritingPrompt[];
  onBackToLessons?: () => void;
}

export const WritingPracticeSection: React.FC<WritingPracticeSectionProps> = ({
  courseTitle,
  prompts = [],
  onBackToLessons,
}) => {
  const [selectedPrompt, setSelectedPrompt] = useState<WritingPrompt | null>(
    prompts[0] || null
  );
  const [content, setContent] = useState<string>('');
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [evaluationFeedback, setEvaluationFeedback] = useState<WritingSubmission['aiFeedback'] | null>(null);
  const [evalError, setEvalError] = useState<string | null>(null);
  const [submissions, setSubmissions] = useState<WritingSubmission[]>([]);
  const [activeSubTab, setActiveSubTab] = useState<'editor' | 'history'>('editor');
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // Fetch past submissions
  useEffect(() => {
    async function fetchSubmissions() {
      try {
        const res = await fetch('/api/writing/submissions');
        if (res.ok) {
          const data = await res.json();
          if (data.submissions) {
            setSubmissions(data.submissions);
          }
        }
      } catch (err) {
        console.error('Error fetching submissions:', err);
      }
    }
    fetchSubmissions();
  }, []);

  const wordCount = content.trim() ? content.trim().split(/\s+/).filter(Boolean).length : 0;
  const charCount = content.length;
  const paragraphCount = content.trim() ? content.split(/\n\s*\n/).filter((p) => p.trim().length > 0).length : 0;
  const targetWords = selectedPrompt?.targetWordCount || 300;
  const progressRatio = Math.min(Math.round((wordCount / targetWords) * 100), 100);

  const handleSelectPrompt = (p: WritingPrompt) => {
    setSelectedPrompt(p);
    setContent('');
    setEvaluationFeedback(null);
    setEvalError(null);
  };

  const handleLoadStarter = () => {
    if (selectedPrompt?.sampleStarter) {
      setContent(selectedPrompt.sampleStarter);
    }
  };

  const handleEvaluate = async () => {
    if (!content.trim() || wordCount < 20) {
      setEvalError('Please write at least 20 words before requesting AI evaluation.');
      return;
    }

    setEvalError(null);
    setIsEvaluating(true);

    try {
      const res = await fetch('/api/writing/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          promptTitle: selectedPrompt?.title || 'English Writing Practice',
          category: selectedPrompt?.category || 'Essay',
          content: content.trim(),
          rubrics: selectedPrompt?.rubrics || [],
        }),
      });

      const data = await res.json();
      if (res.ok && data.feedback) {
        setEvaluationFeedback(data.feedback);
        // Automatically save to submissions database
        const saveRes = await fetch('/api/writing/submissions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            promptId: selectedPrompt?.id || 'custom',
            category: selectedPrompt?.category || 'Essay',
            title: selectedPrompt?.title || 'Writing Practice',
            content: content.trim(),
            wordCount,
            aiFeedback: data.feedback,
            status: 'evaluated',
          }),
        });
        if (saveRes.ok) {
          const sData = await saveRes.json();
          if (sData.submission) {
            setSubmissions((prev) => [sData.submission, ...prev]);
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
          }
        }
      } else {
        setEvalError(data.error || 'Failed to evaluate writing with AI. Please check server logs.');
      }
    } catch (err: any) {
      console.error(err);
      setEvalError('Network error connecting to evaluation service.');
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleDeleteSubmission = async (id: string) => {
    try {
      await fetch(`/api/writing/submissions/${id}`, { method: 'DELETE' });
      setSubmissions((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      {/* Top Banner / Studio Header */}
      <div className="p-5 sm:p-6 bg-slate-900 text-white border-b border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-mono mb-1">
              <PenTool className="w-3.5 h-3.5" />
              <span>DEDICATED WRITING PRACTICE STUDIO</span>
              <span className="text-slate-600">·</span>
              <span className="text-slate-400">{courseTitle}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              Composition, Correspondence & Creative Writing
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Write essays, formal & informal letters, summaries, reports, and creative pieces.
              Receive instant, objective grading and detailed rubric critique.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => setActiveSubTab('editor')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                activeSubTab === 'editor'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              Writing Desk
            </button>
            <button
              onClick={() => setActiveSubTab('history')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                activeSubTab === 'history'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <span>Saved Submissions</span>
              {submissions.length > 0 && (
                <span className="text-[10px] bg-slate-700 text-slate-200 px-1.5 py-0.2 rounded-full font-mono">
                  {submissions.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {activeSubTab === 'history' ? (
        /* History & Previous Submissions View */
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">
              Student Writing Portfolio ({submissions.length})
            </h3>
            <span className="text-xs text-slate-500">
              Saved in database with AI scoring and examiner critique.
            </span>
          </div>

          {submissions.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs space-y-2">
              <FileText className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="font-semibold text-slate-700">No writing submissions recorded yet</p>
              <p>Write an essay, letter, or report in the Writing Desk to have it scored and saved here.</p>
              <button
                onClick={() => setActiveSubTab('editor')}
                className="mt-2 px-3 py-1.5 bg-indigo-600 text-white text-xs font-semibold rounded-lg"
              >
                Go to Writing Desk
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {submissions.map((sub) => (
                <div
                  key={sub.id}
                  className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded">
                          {sub.category}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900">{sub.title}</h4>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-2">
                        <span>{sub.wordCount} words</span>
                        <span>·</span>
                        <span>{new Date(sub.submittedAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {sub.aiFeedback && (
                        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-900 px-3 py-1 rounded-lg text-xs font-bold font-mono">
                          <Award className="w-4 h-4 text-emerald-600" />
                          <span>Score: {sub.aiFeedback.overallScore}/100</span>
                        </div>
                      )}
                      <button
                        onClick={() => handleDeleteSubmission(sub.id)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                        title="Delete submission"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Submission Text Content */}
                  <div className="text-xs text-slate-700 leading-relaxed max-h-36 overflow-y-auto whitespace-pre-line bg-white p-3 rounded-lg border border-slate-200/60 font-sans">
                    {sub.content}
                  </div>

                  {/* Feedback breakdown */}
                  {sub.aiFeedback && (
                    <div className="bg-white p-4 rounded-lg border border-slate-200 text-xs space-y-2.5">
                      <div className="grid grid-cols-3 gap-2 text-center text-[11px] font-mono border-b border-slate-100 pb-2">
                        <div className="p-1.5 bg-slate-50 rounded">
                          <span className="text-slate-500 block">Grammar</span>
                          <span className="font-bold text-slate-900">{sub.aiFeedback.grammarScore}%</span>
                        </div>
                        <div className="p-1.5 bg-slate-50 rounded">
                          <span className="text-slate-500 block">Vocabulary</span>
                          <span className="font-bold text-slate-900">{sub.aiFeedback.vocabularyScore}%</span>
                        </div>
                        <div className="p-1.5 bg-slate-50 rounded">
                          <span className="text-slate-500 block">Structure</span>
                          <span className="font-bold text-slate-900">{sub.aiFeedback.structureScore}%</span>
                        </div>
                      </div>

                      <div className="text-slate-800 leading-relaxed font-normal">
                        <span className="font-bold text-slate-900 block mb-0.5">Examiner Evaluation:</span>
                        {sub.aiFeedback.detailedAnalysis}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Writing Desk & Live Editor */
        <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
          {/* Left Column: Prompts Selector & Rubrics */}
          <div className="lg:col-span-4 p-5 sm:p-6 space-y-5 bg-slate-50/50">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
                Select Writing Assignment
              </span>
              <div className="space-y-1.5">
                {prompts.map((p) => {
                  const isSelected = selectedPrompt?.id === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => handleSelectPrompt(p)}
                      className={`w-full text-left p-3 rounded-lg border transition-all text-xs flex items-start justify-between gap-2 ${
                        isSelected
                          ? 'bg-white border-indigo-600 shadow-sm text-slate-900 font-semibold'
                          : 'bg-white/80 border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 block mb-0.5">
                          {p.category}
                        </span>
                        <span className="line-clamp-1">{p.title}</span>
                      </div>
                      <ChevronRight
                        className={`w-3.5 h-3.5 shrink-0 mt-1 ${
                          isSelected ? 'text-indigo-600' : 'text-slate-300'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Prompt Details & Instructions */}
            {selectedPrompt && (
              <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                  <span>Assignment Prompt</span>
                  <span className="text-[11px] font-mono text-indigo-600 font-semibold">
                    Target: ~{selectedPrompt.targetWordCount} words
                  </span>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed">
                  {selectedPrompt.prompt}
                </p>

                {/* Rubrics Checklist */}
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
                    Grading Rubrics
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-600">
                    {selectedPrompt.rubrics.map((r, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {selectedPrompt.sampleStarter && (
                  <button
                    onClick={handleLoadStarter}
                    className="w-full mt-2 py-1.5 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
                  >
                    <BookOpen className="w-3 h-3 text-slate-500" />
                    <span>Load Sample Opening Sentence</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Right Column: Writing Area & Evaluation */}
          <div className="lg:col-span-8 p-5 sm:p-6 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              {/* Editor Header Bar with Live Word Metrics */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {selectedPrompt?.title || 'English Writing Workspace'}
                  </h3>
                  <span className="text-xs text-slate-500">
                    Category: {selectedPrompt?.category || 'General Practice'}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs font-mono text-slate-600">
                  <span className="bg-slate-100 px-2 py-1 rounded">
                    <strong>{wordCount}</strong> words
                  </span>
                  <span className="bg-slate-100 px-2 py-1 rounded">
                    <strong>{paragraphCount}</strong> paragraphs
                  </span>
                  <span className="bg-slate-100 px-2 py-1 rounded">
                    <strong>{charCount}</strong> chars
                  </span>
                </div>
              </div>

              {/* Progress towards word count */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>Target Progress</span>
                  <span className="font-mono">{wordCount} / {targetWords} words ({progressRatio}%)</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      progressRatio >= 90 && progressRatio <= 115
                        ? 'bg-emerald-500'
                        : progressRatio > 115
                        ? 'bg-amber-500'
                        : 'bg-indigo-600'
                    }`}
                    style={{ width: `${progressRatio}%` }}
                  />
                </div>
              </div>

              {/* Distraction-Free Text Area */}
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Begin writing your essay, letter, report, or creative piece here. Use proper punctuation, paragraphs, and academic vocabulary..."
                rows={14}
                className="w-full p-4 text-sm text-slate-900 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 leading-relaxed resize-y font-sans placeholder-slate-400"
              />

              {evalError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{evalError}</span>
                </div>
              )}

              {saveSuccess && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Writing piece successfully evaluated and saved to your learning portfolio!</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setContent('');
                      setEvaluationFeedback(null);
                    }}
                    className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300 rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Clear</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleEvaluate}
                    disabled={isEvaluating || wordCount < 15}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition-all flex items-center gap-2 shadow-none"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{isEvaluating ? 'Evaluating with Gemini AI...' : 'Submit & Evaluate with Gemini AI'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* AI Feedback & Scorecard */}
            {evaluationFeedback && (
              <div className="mt-6 p-5 rounded-xl border border-indigo-200 bg-indigo-50/40 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-indigo-100 pb-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 block">
                      AI Examiner Evaluation Report
                    </span>
                    <h4 className="text-base font-bold text-slate-900">
                      Overall Writing Assessment
                    </h4>
                  </div>

                  <div className="flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-lg border border-indigo-200 text-indigo-950 font-mono font-bold text-base shadow-xs">
                    <Award className="w-5 h-5 text-indigo-600" />
                    <span>{evaluationFeedback.overallScore} / 100</span>
                  </div>
                </div>

                {/* Score Breakdown Columns */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-white p-3 rounded-lg border border-slate-200 text-center">
                    <span className="text-[11px] text-slate-500 font-medium block">Grammar & Concord</span>
                    <span className="text-base font-bold text-slate-900 font-mono">
                      {evaluationFeedback.grammarScore}%
                    </span>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-slate-200 text-center">
                    <span className="text-[11px] text-slate-500 font-medium block">Lexicon & Vocabulary</span>
                    <span className="text-base font-bold text-slate-900 font-mono">
                      {evaluationFeedback.vocabularyScore}%
                    </span>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-slate-200 text-center">
                    <span className="text-[11px] text-slate-500 font-medium block">Structure & Flow</span>
                    <span className="text-base font-bold text-slate-900 font-mono">
                      {evaluationFeedback.structureScore}%
                    </span>
                  </div>
                </div>

                {/* Strengths & Improvements */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-3.5 rounded-lg border border-slate-200 space-y-2">
                    <div className="flex items-center gap-1.5 text-emerald-800 text-xs font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Demonstrated Strengths</span>
                    </div>
                    <ul className="space-y-1.5 text-xs text-slate-700">
                      {evaluationFeedback.strengths.map((str, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-emerald-600 font-bold">•</span>
                          <span>{str}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-white p-3.5 rounded-lg border border-slate-200 space-y-2">
                    <div className="flex items-center gap-1.5 text-amber-800 text-xs font-bold">
                      <TrendingUp className="w-3.5 h-3.5 text-amber-600" />
                      <span>Areas for Improvement</span>
                    </div>
                    <ul className="space-y-1.5 text-xs text-slate-700">
                      {evaluationFeedback.improvements.map((imp, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-amber-600 font-bold">•</span>
                          <span>{imp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Detailed Analysis */}
                <div className="bg-white p-4 rounded-lg border border-slate-200 space-y-1.5">
                  <span className="text-xs font-bold text-slate-900 block">
                    Detailed Examiner Critique:
                  </span>
                  <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                    {evaluationFeedback.detailedAnalysis}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
