import React, { useState } from 'react';
import { QuizQuestion } from '../types/education';
import { CheckCircle2, XCircle, RotateCcw, ArrowRight, HelpCircle } from 'lucide-react';

interface QuizModalProps {
  questions: QuizQuestion[];
  quizTitle?: string;
  onFinishQuiz: (score: number, total: number) => void;
}

export const QuizModal: React.FC<QuizModalProps> = ({ questions, quizTitle, onFinishQuiz }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);

  if (!questions || questions.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500 text-xs">
        No quiz questions available for this module yet.
      </div>
    );
  }

  const currentQ = questions[currentIdx] || questions[0];
  const hasAnswered = selectedAnswers[currentIdx] !== undefined;

  const handleSelectOption = (optIndex: number) => {
    if (hasAnswered) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentIdx]: optIndex,
    }));
    setShowExplanation(true);
  };

  const handleNext = () => {
    setShowExplanation(false);
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setQuizComplete(true);
      // Calculate score
      let correct = 0;
      questions.forEach((q, idx) => {
        if (selectedAnswers[idx] === q.correctIndex) {
          correct += 1;
        }
      });
      onFinishQuiz(correct, questions.length);
    }
  };

  const handleRestart = () => {
    setSelectedAnswers({});
    setCurrentIdx(0);
    setShowExplanation(false);
    setQuizComplete(false);
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) {
        score += 1;
      }
    });
    return score;
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 max-w-3xl mx-auto">
      {/* Quiz Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
        <div>
          <div className="text-xs font-mono text-indigo-600 font-semibold mb-1">
            QUESTION {currentIdx + 1} OF {questions.length}
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            {quizTitle || 'Course Knowledge Assessment'}
          </h2>
        </div>
        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
          <HelpCircle className="w-5 h-5" />
        </div>
      </div>

      {!quizComplete ? (
        <div className="space-y-6">
          {/* Question text */}
          <div className="text-base font-semibold text-slate-900 leading-snug">
            {currentQ.question}
          </div>

          {/* Options */}
          <div className="space-y-3">
            {currentQ.options.map((option, idx) => {
              const isSelected = selectedAnswers[currentIdx] === idx;
              const isCorrect = idx === currentQ.correctIndex;

              let cardStyle = 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50';

              if (hasAnswered) {
                if (isCorrect) {
                  cardStyle = 'border-emerald-400 bg-emerald-50 text-emerald-950 font-medium';
                } else if (isSelected) {
                  cardStyle = 'border-rose-400 bg-rose-50 text-rose-950';
                } else {
                  cardStyle = 'border-slate-100 opacity-60';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={hasAnswered}
                  className={`w-full p-4 text-left rounded-lg border text-sm transition-all flex items-center justify-between gap-3 ${cardStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-md bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-mono font-bold shrink-0">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{option}</span>
                  </div>

                  {hasAnswered && isCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  )}
                  {hasAnswered && isSelected && !isCorrect && (
                    <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Box */}
          {hasAnswered && (
            <div className="p-4 rounded-lg bg-indigo-50/70 border border-indigo-100 text-xs text-indigo-950 leading-relaxed">
              <span className="font-semibold block mb-1">Concept Rationale:</span>
              {currentQ.explanation}
            </div>
          )}

          {/* Next Button */}
          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              onClick={handleNext}
              disabled={!hasAnswered}
              className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 ${
                hasAnswered
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-none'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              <span>{currentIdx === questions.length - 1 ? 'Finish Assessment' : 'Next Question'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Results View */
        <div className="text-center py-8 space-y-5">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto text-2xl font-bold font-mono">
            {calculateScore()}/{questions.length}
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">
              Assessment Completed!
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              You scored {Math.round((calculateScore() / questions.length) * 100)}% on UI/UX fundamentals and flat design principles.
            </p>
          </div>

          <div className="pt-4 flex justify-center gap-3">
            <button
              onClick={handleRestart}
              className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retake Quiz</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
