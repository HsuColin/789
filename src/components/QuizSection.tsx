import React, { useState } from 'react';
import { QuizQuestion, QuizHistory } from '../types';
import { CheckCircle, XCircle, Brain, RefreshCw, Trophy, BookOpen, Clock, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface QuizSectionProps {
  quizzes: QuizQuestion[];
  quizHistory: QuizHistory[];
  onQuizSubmit: (score: number, pickedAnswers: number[]) => void;
}

export const QuizSection: React.FC<QuizSectionProps> = ({ quizzes, quizHistory, onQuizSubmit }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [pickedOption, setPickedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [quizFinished, setQuizFinished] = useState(false);

  if (!quizzes || quizzes.length === 0) {
    return (
      <div className="bg-[#F7F5F2] rounded-sm border border-[#1A1A1A]/10 p-8 text-center space-y-3">
        <Brain className="w-12 h-12 text-[#1A1A1A]/40 mx-auto stroke-1" />
        <p className="text-[#1A1A1A]/60 font-medium font-serif italic">本單元尚未生成課堂自評測驗。</p>
      </div>
    );
  }

  const currentQuestion = quizzes[currentIdx];

  const handleOptionSelect = (optionIdx: number) => {
    if (isAnswered) return;
    setPickedOption(optionIdx);
    setIsAnswered(true);

    const isCorrect = optionIdx === currentQuestion.correctIndex;
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    setAnswers((prev) => [...prev, optionIdx]);
  };

  const handleNext = () => {
    if (currentIdx + 1 < quizzes.length) {
      setCurrentIdx((prev) => prev + 1);
      setPickedOption(null);
      setIsAnswered(false);
    } else {
      // Finished
      const finalScore = score + (pickedOption === currentQuestion.correctIndex ? 1 : 0);
      setQuizFinished(true);
      onQuizSubmit(finalScore, [...answers]);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setPickedOption(null);
    setIsAnswered(false);
    setScore(0);
    setAnswers([]);
    setQuizFinished(false);
  };

  // Safe average calculation
  const totalAttempts = quizHistory.length;
  const averageScore = totalAttempts > 0 
    ? (quizHistory.reduce((sum, h) => sum + h.score, 0) / totalAttempts).toFixed(1)
    : '無記錄';

  return (
    <div className="space-y-8 select-none">
      {/* Historical statistics dashboard (flat editorial boards) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#F7F5F2] border border-[#1A1A1A]/10 rounded-sm p-4 text-[#1A1A1A] flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A]/45 block">歷史最高得分</span>
            <span className="text-xl font-bold font-serif italic mt-1 block">
              {quizHistory.length > 0 ? `${Math.max(...quizHistory.map(h => h.score))} / ${quizzes.length}` : '—'}
            </span>
          </div>
          <Trophy className="w-8 h-8 text-[#1A1A1A]/20" />
        </div>

        <div className="bg-[#1A1A1A] text-white rounded-sm p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/50 block">主題複習次數</span>
            <span className="text-xl font-bold font-mono mt-1 block">{totalAttempts} 次</span>
          </div>
          <Activity className="w-8 h-8 text-white/20 animate-pulse" />
        </div>

        <div className="bg-[#FDFCFB] border border-[#1A1A1A]/10 rounded-sm p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A]/45 block">複習平均分</span>
            <span className="text-xl font-bold font-serif italic text-[#1A1A1A] mt-1 block">
              {averageScore} {totalAttempts > 0 ? `/${quizzes.length}` : ''}
            </span>
          </div>
          <Clock className="w-8 h-8 text-[#1A1A1A]/20" />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!quizFinished ? (
          <motion.div
            key="quiz-card"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white rounded-sm border border-[#1A1A1A]/10 p-6 lg:p-8 space-y-6 text-left"
          >
            {/* Question Progress bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-[11px] text-[#1A1A1A]/50 font-bold uppercase tracking-widest">
                <span>單元自評挑戰</span>
                <span>問題 {currentIdx + 1} / {quizzes.length}</span>
              </div>
              <div className="w-full bg-[#F7F5F2] h-1.5 rounded-sm overflow-hidden">
                <div
                  className="bg-[#1A1A1A] h-full transition-all duration-300"
                  style={{ width: `${((currentIdx + 1) / quizzes.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Question title */}
            <div className="space-y-2.5">
              <span className="inline-block px-2 py-0.5 border border-[#1A1A1A] text-[#1A1A1A] text-[9px] uppercase font-black tracking-widest rounded-sm">
                觀念強化題型
              </span>
              <h4 className="text-lg md:text-xl font-serif font-bold italic text-[#1A1A1A] leading-snug">
                {currentQuestion.question}
              </h4>
            </div>

            {/* Options grid */}
            <div className="space-y-3">
              {currentQuestion.options.map((option, idx) => {
                let optionStyle = 'border-[#1A1A1A]/10 bg-white text-[#1A1A1A] hover:bg-[#F7F5F2]';

                if (isAnswered) {
                  if (idx === currentQuestion.correctIndex) {
                    optionStyle = 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold';
                  } else if (idx === pickedOption) {
                    optionStyle = 'border-rose-400 bg-rose-50 text-rose-950';
                  } else {
                    optionStyle = 'border-[#1A1A1A]/5 bg-transparent text-[#1A1A1A]/40 opacity-40';
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={isAnswered}
                    onClick={() => handleOptionSelect(idx)}
                    className={`w-full text-left p-4 rounded-sm border text-xs sm:text-sm font-sans transition-all flex items-center justify-between cursor-pointer ${optionStyle}`}
                  >
                    <span className="leading-relaxed">{option}</span>
                    {isAnswered && idx === currentQuestion.correctIndex && (
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />
                    )}
                    {isAnswered && idx === pickedOption && idx !== currentQuestion.correctIndex && (
                      <XCircle className="w-4 h-4 text-rose-600 shrink-0 ml-2" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation box */}
            {isAnswered && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-[#F7F5F2] border border-[#1A1A1A]/10 rounded-sm p-5 space-y-2.5 mt-4 text-left"
              >
                <div className="flex gap-1.5 items-center font-serif font-black italic text-[#1A1A1A] text-sm">
                  <Brain className="w-4 h-4 text-[#1A1A1A]" />
                  <span>AI 💡 觀念解析小幫手</span>
                </div>
                <p className="text-xs text-[#1A1A1A]/80 leading-relaxed font-sans">
                  {currentQuestion.explanation}
                </p>

                <div className="flex justify-end pt-3">
                  <button
                    onClick={handleNext}
                    className="py-1.5 px-4 bg-[#1A1A1A] hover:bg-[#333333] text-white text-[10px] font-bold uppercase tracking-wider rounded-sm transition-all cursor-pointer"
                  >
                    {currentIdx + 1 < quizzes.length ? '下一題 ➡️' : '完成自我評估'}
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="quiz-finish"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-sm border border-[#1A1A1A]/10 p-8 text-center space-y-6"
          >
            <div className="p-4 bg-[#F7F5F2] border border-[#1A1A1A]/15 rounded-full w-20 h-20 flex items-center justify-center mx-auto text-[#1A1A1A]">
              <Trophy className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-serif font-bold italic text-[#1A1A1A]">恭喜完成本單元自評測驗！</h3>
              <p className="text-xs text-[#1A1A1A]/60 font-sans">測驗結果已完整彙整至學生成效指標中。</p>
            </div>

            <div className="py-4 px-8 bg-[#F7F5F2] border border-[#1A1A1A]/10 rounded-sm inline-block">
              <span className="text-[10px] text-[#1A1A1A]/50 block mb-1 font-bold uppercase tracking-widest font-sans">獲得成績</span>
              <span className="text-3xl font-black font-serif italic text-[#1A1A1A]">
                {score} <span className="text-[#1A1A1A]/30 text-lg font-sans">/ {quizzes.length}</span>
              </span>
            </div>

            <p className="text-xs text-[#1A1A1A]/80 max-w-sm mx-auto italic font-serif leading-relaxed">
              {score === quizzes.length
                ? '🏆 卓越學識！你獲得了滿分！所有細微概念皆精準掌握！'
                : score >= quizzes.length * 0.7
                ? '📝 做得好！大部分的觀念你都很清楚，可以針對錯題稍加複習。'
                : '💡 再接再厲！建議多花三分鐘詳讀「考前口訣與精簡懶人包」，學習進度會更好！'}
            </p>

            <div className="flex gap-3 justify-center pt-2">
              <button
                onClick={handleRestart}
                className="flex items-center gap-1.5 py-2 px-5 bg-[#1A1A1A] hover:bg-[#333333] text-white font-bold rounded-sm text-xs uppercase tracking-widest transition-all cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                重新挑戰
              </button>
            </div>

            {/* Quiz timeline histories */}
            {quizHistory.length > 0 && (
              <div className="border-t border-[#1A1A1A]/10 pt-5 space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A]/60 block text-left flex items-center gap-1.5 pl-1 font-sans">
                  <BookOpen className="w-3.5 h-3.5 text-[#1A1A1A]" />
                  複習歷程追蹤 (最近 {quizHistory.length} 次)
                </span>
                <div className="grid grid-cols-1 gap-2 max-h-36 overflow-y-auto pr-1">
                  {quizHistory.slice().reverse().map((hist, i) => (
                    <div key={i} className="flex justify-between items-center text-xs bg-[#F7F5F2]/50 border border-[#1A1A1A]/5 p-2.5 rounded-sm">
                      <span className="text-[#1A1A1A]/50 font-mono">
                        {new Date(hist.takenAt).toLocaleString('zh-TW', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                      <span className="font-sans font-bold text-[#1A1A1A]/80">
                        答對數: <span className="text-[#1A1A1A] font-serif font-black italic text-sm">{hist.score}</span> / {hist.maxScore || quizzes.length}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
