import React, { useState } from 'react';
import { CheatSheet } from '../types';
import { MarkdownRenderer } from './MarkdownRenderer';
import { Sparkles, BrainCircuit, Columns, ChevronRight, HelpCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface CheatSheetSectionProps {
  cheatSheet: CheatSheet;
}

export const CheatSheetSection: React.FC<CheatSheetSectionProps> = ({ cheatSheet }) => {
  const [flippedCards, setFlippedCards] = useState<{ [key: number]: boolean }>({});

  const toggleFlip = (idx: number) => {
    setFlippedCards((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const hasMnemonics = cheatSheet.mnemonics && cheatSheet.mnemonics.length > 0;
  const hasFormulas = cheatSheet.formulasOrBriefs && cheatSheet.formulasOrBriefs.length > 0;

  return (
    <div className="space-y-10 text-left selection:bg-[#1A1A1A] selection:text-white">
      {/* 1. Mnemonic Flashcards (Flip-cards layout) */}
      {hasMnemonics && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-[10px] bg-[#1A1A1A] text-white px-2 py-0.5 font-bold uppercase tracking-[0.2em]">01. 口訣卡</span>
            <div className="h-px flex-1 bg-[#1A1A1A]/10"></div>
          </div>
          
          <div className="flex items-baseline justify-between">
            <h4 className="font-serif font-black italic text-xl text-[#1A1A1A]">翻轉記憶口訣卡</h4>
            <p className="text-[11px] text-[#1A1A1A]/50 font-medium font-sans">點選卡片解鎖 AI 聯想速記口訣 / 諧音記憶</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {cheatSheet.mnemonics.map((item, idx) => {
              const isFlipped = !!flippedCards[idx];
              return (
                <div
                  key={idx}
                  onClick={() => toggleFlip(idx)}
                  className="h-48 [perspective:1000px] cursor-pointer group"
                >
                  <motion.div
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ duration: 0.45, ease: 'easeInOut' }}
                    className="relative w-full h-full [transform-style:preserve-3d] shadow-xs hover:shadow-md transition-shadow"
                  >
                    {/* Front of card */}
                    <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] bg-[#FDFCFB] border border-[#1A1A1A]/10 rounded-sm p-6 flex flex-col justify-between">
                      <div className="space-y-2">
                        <span className="text-[8px] uppercase tracking-widest font-extrabold text-[#1A1A1A]/40">
                          Term / 關鍵名詞
                        </span>
                        <h5 className="font-serif font-bold italic text-lg text-[#1A1A1A]">{item.term}</h5>
                        <p className="text-xs text-[#1A1A1A]/70 line-clamp-2 leading-relaxed font-sans">{item.context}</p>
                      </div>
                      <div className="flex justify-between items-center text-[10px] text-[#1A1A1A]/50 font-bold border-t border-[#1A1A1A]/5 pt-3">
                        <span className="flex items-center gap-1 uppercase tracking-wider text-[9px]">
                          <HelpCircle className="w-3.5 h-3.5" /> 觀看口訣
                        </span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-[#1A1A1A]" />
                      </div>
                    </div>

                    {/* Back of card (flipped) */}
                    <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] bg-[#1A1A1A] text-white rounded-sm p-6 flex flex-col justify-between [transform:rotateY(180deg)] border border-[#1A1A1A]">
                      <div className="space-y-2.5">
                        <span className="text-[8px] uppercase tracking-wider bg-white/20 text-[#FDFCFB] px-2 py-0.5 rounded-sm font-bold font-mono">
                          Mnemonic Trick / 聯想諧音
                        </span>
                        <p className="text-sm font-serif italic text-white/95 leading-relaxed pt-1.5 selection:bg-white selection:text-black">
                          {item.trick}
                        </p>
                      </div>
                      <span className="text-[9px] uppercase tracking-widest text-white/40 border-t border-white/10 pt-2.5 block text-right font-medium">
                        點擊卡片翻回正面
                      </span>
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. Key Formulas or terms */}
      {hasFormulas && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center gap-3">
            <span className="text-[10px] bg-[#1A1A1A] text-white px-2 py-0.5 font-bold uppercase tracking-[0.2em]">02. 必考要語</span>
            <div className="h-px flex-1 bg-[#1A1A1A]/10"></div>
          </div>
          
          <h4 className="font-serif font-black italic text-xl text-[#1A1A1A] pb-1">重要公式與核心術語</h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cheatSheet.formulasOrBriefs.map((fb, idx) => {
              // Alternate background styles matching yellow and blue post-its but with classic styling
              const isEven = idx % 2 === 0;
              const cardBg = isEven 
                ? 'bg-[#FEFCE8]/80 border-[#CA8A04]/20 text-[#713F12]' 
                : 'bg-[#EFF6FF]/80 border-[#2563EB]/20 text-[#1E3A8A]';
              const labelBg = isEven ? 'bg-[#FEF08A] text-[#854D0E]' : 'bg-[#DBEAFE] text-[#1E40AF]';

              return (
                <div key={idx} className={`${cardBg} border p-5 shadow-sm space-y-3 hover:shadow-md transition-shadow duration-300 rounded-sm`}>
                  <h5 className="font-serif font-bold italic text-base border-b border-black/5 pb-2 flex items-center justify-between">
                    <span>{fb.title}</span>
                    <span className={`text-[8px] uppercase font-sans tracking-widest font-black px-1.5 py-0.5 rounded-sm ${labelBg}`}>
                      ESSENTIAL
                    </span>
                  </h5>
                  <p className="text-xs leading-relaxed font-sans font-medium opacity-90">
                    {fb.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. High-Value Examination structure */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center gap-3">
          <span className="text-[10px] bg-[#1A1A1A] text-white px-2 py-0.5 font-bold uppercase tracking-[0.2em]">03. 衝刺結構</span>
          <div className="h-px flex-1 bg-[#1A1A1A]/10"></div>
        </div>
        
        <h4 className="font-serif font-black italic text-xl text-[#1A1A1A]">考前 2 分鐘考點架構圖</h4>
        
        <div className="bg-[#F7F5F2] border border-[#1A1A1A]/10 rounded-sm p-6 lg:p-8 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-24 h-24 bg-[#1A1A1A]/5 rounded-bl-full pointer-events-none" />
          <div className="prose prose-sm max-w-none text-[#1A1A1A] leading-relaxed font-sans">
            <MarkdownRenderer content={cheatSheet.structure || '暫無進階考前架構圖'} />
          </div>
        </div>
      </div>
    </div>
  );
};
