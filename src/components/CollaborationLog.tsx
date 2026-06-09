import React, { useState } from 'react';
import { ClipboardCheck, Copy, Terminal, Settings, ShieldCheck, HeartPulse } from 'lucide-react';

export const CollaborationLog: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const promptText = `你是一位專業的頂尖大學「課堂助教與學習教練 (TA & Study Coach)」。你的任務是協助學生成理高品質的課堂筆記、複習重點、高效率的考前懶人包，並生成一組極具挑戰性但富有啟發性的互動測驗。你需要根據輸入內容，產出精確、專業、組織清晰的繁體中文 JSON 格式：
{
  "title": "...",
  "summary": "...",
  "keyPoints": ["...", "..."],
  "cheatSheet": {
    "structure": "...",
    "mnemonics": [{ "term": "...", "context": "...", "trick": "..." }],
    "formulasOrBriefs": [{ "title": "...", "desc": "..." }]
  },
  "quizzes": [{ "question": "...", "options": ["...", "..."], "correctIndex": 0, "explanation": "..." }]
}`;

  const copyPrompt = () => {
    navigator.clipboard.writeText(promptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-sm border border-[#1A1A1A]/10 p-6 lg:p-8 text-left space-y-8 select-none">
      {/* Document header banner */}
      <div className="border-b border-[#1A1A1A]/10 pb-5 space-y-2">
        <span className="text-[10px] bg-[#1A1A1A] text-white px-2.5 py-0.5 rounded-sm uppercase tracking-[0.2em] font-bold inline-block">
          🏫 作業成果與技術報告
        </span>
        <h3 className="text-2xl font-serif font-black italic text-[#1A1A1A]">AI 課堂協作紀錄分析</h3>
        <p className="text-xs text-[#1A1A1A]/60 leading-relaxed font-sans max-w-2xl">
          本區專為協助學生撰寫學期作業報告而設。系統已將當前系統與 Google Gemini 大模型在架構設計、核心算法、阻礙突破等層面的協作特徵，彙編為標準學術報告片段，可一鍵載入。
        </p>
      </div>

      {/* Grid panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          {/* Tool card */}
          <div className="space-y-3">
            <h4 className="flex items-center gap-2 font-serif font-bold italic text-[#1A1A1A] text-base">
              <Settings className="w-4 h-4 text-[#1A1A1A] animate-spin" />
              1. 系統開發工具包 (Tech Stack Specs)
            </h4>
            <div className="bg-[#F7F5F2] border border-[#1A1A1A]/10 rounded-sm p-4 space-y-2 text-xs">
              <p className="flex justify-between border-b border-[#1A1A1A]/5 pb-1.5">
                <span className="font-bold text-[#1A1A1A]/50 font-sans uppercase tracking-wider text-[9px]">主力 Coding 助手：</span>
                <span className="font-bold text-[#1A1A1A] font-serif">DeepMind Gemini Coding Agent</span>
              </p>
              <p className="flex justify-between border-b border-[#1A1A1A]/5 pb-1.5">
                <span className="font-bold text-[#1A1A1A]/50 font-sans uppercase tracking-wider text-[9px]">主體 AI 運算模型：</span>
                <span className="font-bold text-[#1A1A1A] font-mono">gemini-3.5-flash (Google GenAI)</span>
              </p>
              <p className="flex justify-between border-b border-[#1A1A1A]/5 pb-1.5">
                <span className="font-bold text-[#1A1A1A]/50 font-sans uppercase tracking-wider text-[9px]">核心前端架構：</span>
                <span className="font-bold text-[#1A1A1A]">React 19 + TypeScript + Vite</span>
              </p>
              <p className="flex justify-between">
                <span className="font-bold text-[#1A1A1A]/50 font-sans uppercase tracking-wider text-[9px]">樣式工程與動態：</span>
                <span className="font-bold text-[#1A1A1A] font-mono">Tailwind CSS + Motion React</span>
              </p>
            </div>
          </div>

          {/* AI Helper Contributions */}
          <div className="space-y-3">
            <h4 className="flex items-center gap-2 font-serif font-bold italic text-[#1A1A1A] text-base">
              <ShieldCheck className="w-4 h-4 text-[#1A1A1A]" />
              2. 深度 AI 技術貢獻 (Core Milestones)
            </h4>
            <div className="bg-[#F7F5F2] border border-[#1A1A1A]/10 rounded-sm p-5 space-y-3.5 text-xs text-[#1A1A1A]/70 leading-relaxed font-sans">
              <div className="flex gap-2.5 items-start">
                <span className="text-[#1A1A1A] font-serif font-black">✓</span>
                <span>規劃高安全 Full-Stack 端代理架構，由後端 Express 熱代理調用 Gemini SDK 傳輸，確保 API Keys 絕對不暴露於客戶端。</span>
              </div>
              <div className="flex gap-2.5 items-start">
                <span className="text-[#1A1A1A] font-serif font-black">✓</span>
                <span>設計高度強健的 Regex 剖析引擎與自適應 Markdown 格式排版渲染，使摘要、速記定理、翻轉口訣如同高質感電子期刊般精緻。</span>
              </div>
              <div className="flex gap-2.5 items-start">
                <span className="text-[#1A1A1A] font-serif font-black">✓</span>
                <span>整合 HTML5 Microphone Web API 現場拾音，並搭建 3D perspective 翻轉记忆口诀卡片，提升沉浸式複習品質。</span>
              </div>
            </div>
          </div>
        </div>

        {/* Challenge logging card */}
        <div className="space-y-6">
          <div className="space-y-3">
            <h4 className="flex items-center gap-2 font-serif font-bold italic text-[#1A1A1A] text-base">
              <HeartPulse className="w-4 h-4 text-[#1A1A1A]" />
              3. 解決技術瓶頸與優化對策 (Resolution Log)
            </h4>
            <div className="bg-[#F7F5F2] border border-[#1A1A1A]/10 rounded-sm p-5 space-y-4 text-xs font-sans">
              <div className="space-y-1">
                <p className="font-bold text-[#1A1A1A]">課題 I：IFrame 沙盒高度安全限制下拒絕音訊捕捉</p>
                <p className="text-[#1A1A1A]/70 text-[11px] leading-relaxed">
                  <span className="text-[#1A1A1A] font-bold border-b border-[#1A1A1A]/30">優化解：</span>
                  封裝完備的媒體流探測器，一旦 iframe 被拒絕，會優雅展示沙盒宣告；同時，研製 **「擬真大課語音模擬器」**。預先編錄 分子生物學、演算法DP、特徵工程等精準音軌與語料，令用戶依舊能無縫體驗 Speech-to-Text 轉學術筆記套裝。
                </p>
              </div>

              <div className="space-y-1">
                <p className="font-bold text-[#1A1A1A]">課題 II：繁重多媒體及講義 Base64 大檔案上載時網頁超時崩潰</p>
                <p className="text-[#1A1A1A]/70 text-[11px] leading-relaxed">
                  <span className="text-[#1A1A1A] font-bold border-b border-[#1A1A1A]/30">優化解：</span>
                  調整 Express API 核心接收上限，配置 `express.json` 與 `urlencoded` 的 Payload 水平至 `100mb`，完全承載長錄音與高清晰度簡報截圖，在有限算力下實現敏捷的高速響應。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copy prompt block */}
      <div className="space-y-3 pt-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h4 className="flex items-center gap-2 font-serif font-bold italic text-[#1A1A1A] text-base">
            <Terminal className="w-4 h-4 text-[#1A1A1A]" />
            4. 智慧核心背後之提示詞範本 (AI System Prompts)
          </h4>
          <button
            onClick={copyPrompt}
            className="flex items-center gap-2 bg-[#1A1A1A] hover:bg-[#333333] text-white font-bold text-xs py-2 px-4 rounded-sm tracking-widest uppercase transition-all cursor-pointer"
          >
            {copied ? (
              <>
                <ClipboardCheck className="w-3.5 h-3.5 text-white animate-bounce" /> 已複製提示詞！
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" /> 複製 Prompt 範本
              </>
            )}
          </button>
        </div>

        <div className="bg-[#1A1A1A] rounded-sm p-5 text-white/90 font-mono text-[11px] overflow-x-auto max-h-48 leading-relaxed border border-[#1A1A1A]/20 selection:bg-white selection:text-black">
          <pre>{promptText}</pre>
        </div>
      </div>
    </div>
  );
};
