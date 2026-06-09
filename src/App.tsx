import React, { useState, useEffect } from 'react';
import { Note, NoteType, QuizHistory } from './types';
import { curDemos } from './components/PreLoadedDemos';
import { AudioRecorder } from './components/AudioRecorder';
import { QuizSection } from './components/QuizSection';
import { CheatSheetSection } from './components/CheatSheetSection';
import { MarkdownRenderer } from './components/MarkdownRenderer';
import { CollaborationLog } from './components/CollaborationLog';
import {
  GraduationCap,
  PlusCircle,
  FileText,
  Youtube,
  Trash2,
  Sparkles,
  Search,
  BookOpen,
  Trophy,
  Activity,
  Award,
  Video,
  UploadCloud,
  FileDown,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  // LocalStorage note initial sync
  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem('study_suite_notes_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to load notes', e);
      }
    }
    return curDemos;
  });

  const [activeNoteId, setActiveNoteId] = useState<string | null>(() => {
    const saved = localStorage.getItem('study_suite_active_id');
    if (saved) return saved;
    return curDemos.length > 0 ? curDemos[0].id : null;
  });

  const [activeTab, setActiveTab] = useState<'summary' | 'cheatSheet' | 'quizzes'>('summary');
  const [showHomeworkLog, setShowHomeworkLog] = useState(false);

  // New Note Creation form States
  const [inputType, setInputType] = useState<NoteType>('recording');
  const [sourceName, setSourceName] = useState('');
  const [textContent, setTextContent] = useState('');
  const [audioData, setAudioData] = useState('');
  const [audioMime, setAudioMime] = useState('audio/mp3');
  const [imageData, setImageData] = useState('');
  const [imageMime, setImageMime] = useState('image/png');
  const [ytUrl, setYtUrl] = useState('');

  // UI state managers
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingStepIdx, setLoadingStepIdx] = useState(0);
  const [apiError, setApiError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Sync back to local storage
  useEffect(() => {
    localStorage.setItem('study_suite_notes_v1', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    if (activeNoteId) {
      localStorage.setItem('study_suite_active_id', activeNoteId);
    }
  }, [activeNoteId]);

  // Rotate loading step descriptions during long-running API actions to enhance UX Vibe
  useEffect(() => {
    let interval: any;
    if (isGenerating) {
      interval = setInterval(() => {
        setLoadingStepIdx((prev) => (prev + 1) % loadingSteps.length);
      }, 3500);
    } else {
      setLoadingStepIdx(0);
    }
    return () => clearInterval(interval);
  }, [isGenerating]);

  const loadingSteps = [
    '🔍 正在深入解析您上載的課堂多媒體內容...',
    '📡 正在調用 Google Gemini 大模型（gemini-3.5-flash）進行語意聽寫與精準校對...',
    '🧠 正在為您量身打磨考前趣味口訣與諧音聯想卡片...',
    '⚡ 正在分析課堂上下文，自動設計 5 題觀念強化互動測驗...',
    '🎓 生理圖譜與學生成效看板正在融合對接...'
  ];

  const activeNote = notes.find((n) => n.id === activeNoteId);

  // Filter notes on search query
  const filteredNotes = notes.filter((n) =>
    n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle drag and drop or manual upload of slide images
  const handleImageUploaded = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSourceName(file.name);
    setImageMime(file.type);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageData(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleYtUrlEntered = (url: string) => {
    setYtUrl(url);
    setSourceName(url);
    // Auto preset name content if standard
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      setTextContent('本堂課為 YouTube 影片教學。重點著重在此網址之影片核心學說授課。');
    }
  };

  // Callback from our custom audio recorder widget
  const handleAudioPrepared = (base64: string, mime: string, transcriptText: string) => {
    setAudioData(base64);
    setAudioMime(mime);
    setSourceName('課堂 live 現場錄音.mp3');
    if (transcriptText) {
      setTextContent(transcriptText);
    }
  };

  // API handler to server.ts
  const handleTriggerAI = async () => {
    try {
      setIsGenerating(true);
      setApiError(null);

      // Verify basic fields to guide user properly
      let bodyData: any = {
        type: inputType,
        sourceName: sourceName || (inputType === 'youtube' ? ytUrl : '新簡報'),
        textContent: textContent,
      };

      if (inputType === 'recording' && audioData) {
        bodyData.audioData = audioData;
        bodyData.audioMime = audioMime;
      } else if (inputType === 'ppt' && imageData) {
        bodyData.imageData = imageData;
        bodyData.imageMime = imageMime;
      }

      const response = await fetch('/api/generate-note', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyData),
      });

      if (!response.ok) {
        const errObj = await response.json();
        throw new Error(errObj.error || '呼叫 Gemini API 整理時發生阻礙');
      }

      const freshNoteData = await response.json();

      // Create full note schema
      const newNote: Note = {
        id: 'note-' + Date.now(),
        title: freshNoteData.title || (inputType === 'youtube' ? '📺 新 YouTube 課堂筆記' : '🎙️ 新智慧錄音筆記'),
        createdAt: new Date().toISOString(),
        type: inputType,
        sourceName: sourceName || (inputType === 'youtube' ? ytUrl : '課堂資訊'),
        content: textContent || '語音/簡報轉檔提取內容',
        summary: freshNoteData.summary,
        keyPoints: freshNoteData.keyPoints || [],
        cheatSheet: {
          structure: freshNoteData.cheatSheet?.structure || '',
          mnemonics: freshNoteData.cheatSheet?.mnemonics || [],
          formulasOrBriefs: freshNoteData.cheatSheet?.formulasOrBriefs || [],
        },
        quizzes: freshNoteData.quizzes || [],
        quizHistory: [],
      };

      setNotes((prev) => [newNote, ...prev]);
      setActiveNoteId(newNote.id);
      setActiveTab('summary');
      setShowHomeworkLog(false);

      // Reset fields
      setSourceName('');
      setTextContent('');
      setAudioData('');
      setImageData('');
      setYtUrl('');
    } catch (err: any) {
      console.error(err);
      setApiError(err?.message || 'Gemini 智慧解析失敗，請稍候重試或確認 Secret API 密鑰設定。');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDeleteNote = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = notes.filter((n) => n.id !== id);
    setNotes(updated);
    if (activeNoteId === id) {
      setActiveNoteId(updated.length > 0 ? updated[0].id : null);
    }
  };

  // Inside single note: user submissions of quiz results
  const handleQuizSubmitted = (score: number, pickedAnswers: number[]) => {
    if (!activeNoteId) return;

    const freshHistory: QuizHistory = {
      score,
      maxScore: activeNote?.quizzes.length || 5,
      answers: pickedAnswers,
      takenAt: new Date().toISOString(),
    };

    const updatedNotes = notes.map((note) => {
      if (note.id === activeNoteId) {
        return {
          ...note,
          quizHistory: [...(note.quizHistory || []), freshHistory],
        };
      }
      return note;
    });

    setNotes(updatedNotes);
  };

  // Helper: YouTube Video ID parser to render interactive card thumbnails
  const extractYtId = (url: string) => {
    if (!url) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : '';
  };

  const promoYtId = inputType === 'youtube' ? extractYtId(ytUrl) : '';

  // Statistical data values
  const totalNotesCount = notes.length;
  const completedQuizCount = notes.filter((n) => n.quizHistory && n.quizHistory.length > 0).length;
  const averageAllScores = () => {
    let totalScoreSum = 0;
    let totalAttempts = 0;
    notes.forEach((n) => {
      if (n.quizHistory && n.quizHistory.length > 0) {
        n.quizHistory.forEach((h) => {
          totalScoreSum += h.score;
          totalAttempts++;
        });
      }
    });
    return totalAttempts > 0 ? (totalScoreSum / totalAttempts).toFixed(1) : '無歷史成績';
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-[#1A1A1A] flex flex-col font-sans selection:bg-[#1A1A1A] selection:text-white">
      
      {/* Top Editorial Navigation Menu */}
      <nav className="h-16 border-b border-[#1A1A1A]/10 flex items-center justify-between px-6 md:px-8 bg-[#FDFCFB]">
        <div className="flex items-center gap-6 md:gap-8">
          <span className="text-2xl font-bold tracking-tighter italic font-serif text-[#1A1A1A]">Lumina.AI</span>
          <div className="h-4 w-px bg-[#1A1A1A]/20 hidden sm:block"></div>
          <div className="hidden sm:flex gap-6 text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A]/60">
            <span className="text-[#1A1A1A]">Workspace / 筆記本</span>
            <span className="text-[#1A1A1A]/30 font-light">|</span>
            <span>Study Insights</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              setShowHomeworkLog((prev) => !prev);
            }}
            className={`py-2 px-4 border border-[#1A1A1A]/10 text-[10px] font-bold uppercase tracking-widest rounded-sm transition-all flex items-center gap-1.5 cursor-pointer ${
              showHomeworkLog
                ? 'bg-[#1A1A1A] border-[#1A1A1A] text-white'
                : 'bg-white hover:bg-[#F7F5F2] text-[#1A1A1A]'
            }`}
          >
            📝 課堂作業成果：AI 協作紀錄
          </button>
        </div>
      </nav>

      {/* Main Container Layout */}
      <div className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-6 lg:p-8 space-y-8">
        
        {/* Global Performance Statistics dashboard styled as crisp Editorial grid */}
        <section className="grid grid-cols-2 md:grid-cols-4 border border-[#1A1A1A]/10 bg-white rounded-sm divide-y divide-[#1A1A1A]/10 md:divide-y-0 md:divide-x divide-dashed">
          <div className="p-5 flex items-center gap-4 text-left">
            <div className="p-2.5 bg-[#F7F5F2] rounded-full text-[#1A1A1A]">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[9px] text-[#1A1A1A]/50 font-bold uppercase tracking-widest block">整理筆記總數</span>
              <span className="text-lg font-serif font-black italic text-[#1A1A1A] font-mono">{totalNotesCount} 篇</span>
            </div>
          </div>

          <div className="p-5 flex items-center gap-4 text-left">
            <div className="p-2.5 bg-[#F7F5F2] rounded-full text-[#1A1A1A]">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[9px] text-[#1A1A1A]/50 font-bold uppercase tracking-widest block">自我評估完成率</span>
              <span className="text-lg font-serif font-black italic text-[#1A1A1A] font-mono">
                {totalNotesCount > 0 ? `${Math.round((completedQuizCount / totalNotesCount) * 100)}%` : '0%'}
              </span>
            </div>
          </div>

          <div className="p-5 flex items-center gap-4 text-left">
            <div className="p-2.5 bg-[#F7F5F2] rounded-full text-[#1A1A1A]">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[9px] text-[#1A1A1A]/50 font-bold uppercase tracking-widest block">全科測驗平均分</span>
              <span className="text-lg font-serif font-black italic text-[#1A1A1A] font-mono">{averageAllScores()}</span>
            </div>
          </div>

          <div className="p-5 flex items-center gap-4 text-left">
            <div className="p-2.5 bg-[#F7F5F2] rounded-full text-[#1A1A1A]">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[9px] text-[#1A1A1A]/50 font-bold uppercase tracking-widest block">連接授權狀態</span>
              <span className="text-xs font-bold text-[#1A1A1A] flex items-center gap-1.5 mt-0.5 font-mono uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block"></span>
                <span>Active</span>
              </span>
            </div>
          </div>
        </section>

        {apiError && (
          <div className="bg-rose-50 border border-rose-250 text-[#1A1A1A] rounded-sm p-4 text-xs text-left space-y-1">
            <span className="font-bold font-serif italic text-red-700 text-sm">⚠️ AI 解析模組發生障礙：</span>
            <p className="opacity-90">{apiError}</p>
          </div>
        )}

        {/* Dynamic Multi-Section views switcher (Homework Report vs Main Interactive Desk) */}
        <AnimatePresence mode="wait">
          {showHomeworkLog ? (
            <motion.div
              key="homework"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <CollaborationLog />
            </motion.div>
          ) : (
            <motion.div
              key="desk"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
            >
              
              {/* LEFT SIDE PANEL: Input & Notebook list selector (lg:col-span-5) */}
              <div className="lg:col-span-5 space-y-8">
                
                {/* 1. Dynamic Material Creator Sandbox */}
                <div className="bg-[#F7F5F2] rounded-sm border border-[#1A1A1A]/10 p-6 space-y-6 text-left">
                  <div className="border-b border-[#1A1A1A]/10 pb-4 space-y-1">
                    <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-[#1A1A1A]/40 block">01. 新增課堂來源</span>
                    <h2 className="font-serif font-black italic text-[#1A1A1A] text-lg">
                      課堂資訊抽取器
                    </h2>
                    <p className="text-[11px] text-[#1A1A1A]/60 font-sans leading-normal">
                      選擇對應的媒介，Gemini 將自動將其打造成學前/學後的系統化筆記。
                    </p>
                  </div>

                  {/* Input Selector Tabs */}
                  <div className="grid grid-cols-3 gap-1 bg-[#1A1A1A]/5 rounded-sm p-1 border border-[#1A1A1A]/5">
                    <button
                      onClick={() => setInputType('recording')}
                      disabled={isGenerating}
                      className={`py-2 text-[10px] font-bold uppercase tracking-wider rounded-xs transition-all cursor-pointer ${
                        inputType === 'recording'
                          ? 'bg-[#1A1A1A] text-white shadow-xs'
                          : 'text-[#1A1A1A]/50 hover:text-[#1A1A1A]'
                      }`}
                    >
                      🎙️ 現場錄音
                    </button>
                    <button
                      onClick={() => setInputType('ppt')}
                      disabled={isGenerating}
                      className={`py-2 text-[10px] font-bold uppercase tracking-wider rounded-xs transition-all cursor-pointer ${
                        inputType === 'ppt'
                          ? 'bg-[#1A1A1A] text-white shadow-xs'
                          : 'text-[#1A1A1A]/50 hover:text-[#1A1A1A]'
                      }`}
                    >
                      📂 講義簡報
                    </button>
                    <button
                      onClick={() => setInputType('youtube')}
                      disabled={isGenerating}
                      className={`py-2 text-[10px] font-bold uppercase tracking-wider rounded-xs transition-all cursor-pointer ${
                        inputType === 'youtube'
                          ? 'bg-[#1A1A1A] text-white shadow-xs'
                          : 'text-[#1A1A1A]/50 hover:text-[#1A1A1A]'
                      }`}
                    >
                      📺 YT 連結
                    </button>
                  </div>

                  {/* Dynamic Tab Body Renderers */}
                  <AnimatePresence mode="wait">
                    {inputType === 'recording' && (
                      <motion.div
                        key="rec-tab"
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className="space-y-4"
                      >
                        <AudioRecorder onAudioReady={handleAudioPrepared} isGenerating={isGenerating} />
                      </motion.div>
                    )}

                    {inputType === 'ppt' && (
                      <motion.div
                        key="ppt-tab"
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className="space-y-5 bg-white border border-[#1A1A1A]/10 p-5 rounded-sm"
                      >
                        {/* Drag and Drop slide upload mimic */}
                        <div className="border border-dashed border-[#1A1A1A]/20 rounded-sm p-6 hover:border-[#1A1A1A] transition-colors bg-[#F7F5F2] text-center relative">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUploaded}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                          <div className="space-y-2">
                            <div className="p-3 bg-white border border-[#1A1A1A]/5 rounded-full w-12 h-12 flex items-center justify-center mx-auto text-[#1A1A1A]">
                              <UploadCloud className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A]">上傳板書或簡報圖片</p>
                              <p className="text-[10px] text-[#1A1A1A]/55 font-mono">SUPPORT: PNG, JPG, JPEG</p>
                            </div>
                            {sourceName && (
                              <span className="inline-block px-2.5 py-0.5 bg-[#1A1A1A] text-white font-mono text-[9px] font-bold uppercase tracking-wider">
                                已選：{sourceName}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Image Preview */}
                        {imageData && (
                          <div className="relative rounded-sm overflow-hidden border border-[#1A1A1A]/10 h-36">
                            <img src={imageData} alt="ppt preview" className="w-full h-full object-cover" />
                            <button
                              onClick={() => setImageData('')}
                              className="absolute top-2 right-2 px-2 py-1 bg-black/60 rounded-xs hover:bg-black text-white text-[10px] font-bold font-mono"
                            >
                              ✕ DELETE
                            </button>
                          </div>
                        )}

                        <div className="space-y-1.5">
                          <label className="block text-[10px] uppercase tracking-wider font-extrabold text-[#1A1A1A]/60">手工補充備忘或特殊標註</label>
                          <textarea
                            value={textContent}
                            onChange={(e) => setTextContent(e.target.value)}
                            placeholder="例如：這張 slides 是在介紹分子生物 transcription initiation 區塊..."
                            className="w-full text-xs px-3 py-2 border border-[#1A1A1A]/10 bg-white rounded-sm focus:border-[#1A1A1A] focus:outline-none h-20 resize-none font-sans text-[#1A1A1A]"
                          />
                        </div>
                      </motion.div>
                    )}

                    {inputType === 'youtube' && (
                      <motion.div
                        key="yt-tab"
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className="space-y-5 bg-white border border-[#1A1A1A]/10 p-5 rounded-sm"
                      >
                        <div className="space-y-1.5">
                          <label className="block text-[10px] uppercase tracking-wider font-extrabold text-[#1A1A1A]/60">YouTube 影片網址</label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={ytUrl}
                              onChange={(e) => handleYtUrlEntered(e.target.value)}
                              placeholder="https://www.youtube.com/watch?v=..."
                              className="flex-1 text-xs px-4 py-2.5 border border-[#1A1A1A]/10 bg-white focus:outline-none focus:border-[#1A1A1A] rounded-sm font-sans"
                            />
                          </div>
                        </div>

                        {promoYtId ? (
                          <div className="border border-[#1A1A1A]/10 rounded-sm overflow-hidden flex flex-col sm:flex-row items-stretch h-28 bg-[#F7F5F2]">
                            <img
                              src={`https://img.youtube.com/vi/${promoYtId}/mqdefault.jpg`}
                              alt="YT Thumbnail"
                              className="sm:w-36 h-20 sm:h-auto object-cover border-r border-[#1A1A1A]/10"
                            />
                            <div className="p-3 flex-1 flex flex-col justify-center text-left space-y-1">
                              <span className="text-[8px] font-bold uppercase tracking-wider bg-[#1A1A1A] text-white px-2 py-0.5 rounded-sm self-start font-mono">
                                READY / 連結就緒
                              </span>
                              <p className="text-[10px] text-[#1A1A1A]/60 font-mono truncate">{ytUrl}</p>
                            </div>
                          </div>
                        ) : (
                          <div className="bg-[#F7F5F2] border border-dashed border-[#1A1A1A]/10 rounded-sm p-4 flex gap-2.5 items-center text-xs text-[#1A1A1A]/70 font-medium">
                            <Video className="w-5 h-5 text-[#1A1A1A]/30 shrink-0" />
                            <span>輸入連結後，此處將以微型海報自動渲染影片特徵。</span>
                          </div>
                        )}

                        <div className="space-y-1.5">
                          <label className="block text-[10px] uppercase tracking-wider font-extrabold text-[#1A1A1A]/60">補充說明或複習考點</label>
                          <textarea
                            value={textContent}
                            onChange={(e) => setTextContent(e.target.value)}
                            placeholder="例如：本影片核心在介紹 Dijkstra 與 0/1 背包演算法關聯..."
                            className="w-full text-xs px-3 py-2 border border-[#1A1A1A]/10 bg-white rounded-sm focus:border-[#1A1A1A] focus:outline-none h-20 resize-none font-sans"
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Submit AI trigger button */}
                  <button
                    onClick={handleTriggerAI}
                    disabled={isGenerating || (inputType === 'ppt' && !imageData) || (inputType === 'youtube' && !ytUrl) || (inputType === 'recording' && !audioData)}
                    className="w-full py-3.5 bg-[#1A1A1A] hover:bg-[#333333] disabled:opacity-40 text-white text-xs font-bold uppercase tracking-[0.25em] rounded-sm transition-colors cursor-pointer text-center flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    {isGenerating ? 'Gemini 智慧整理中...' : '開始 AI 智慧整理'}
                  </button>
                </div>

                {/* 2. My Notebook Study Catalog container */}
                <div className="bg-white rounded-sm border border-[#1A1A1A]/10 p-5 space-y-5 text-left">
                  <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-[#1A1A1A]/40 block">02. 我的 AI 複習筆記庫</span>
                  
                  <div className="flex items-baseline justify-between border-b border-[#1A1A1A]/10 pb-2">
                    <h3 className="font-serif font-black italic text-lg text-[#1A1A1A]">
                      個人學門案卷
                    </h3>
                    <span className="text-[10px] bg-[#1A1A1A] text-white px-2 py-0.5 rounded-sm font-bold font-mono">
                      {notes.length} INDEXES
                    </span>
                  </div>

                  {/* Search notebook query input */}
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#1A1A1A]/40" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="檢索特定主題標題或概念..."
                      className="w-full text-xs pl-9 pr-3 py-2.5 border border-[#1A1A1A]/10 bg-white focus:outline-none focus:border-[#1A1A1A] rounded-sm font-sans"
                    />
                  </div>

                  {/* Notebook catalog cards */}
                  <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                    {filteredNotes.length > 0 ? (
                      filteredNotes.map((note) => {
                        const scoreCount = note.quizHistory?.length || 0;
                        const isSelected = note.id === activeNoteId;
                        return (
                          <div
                            key={note.id}
                            onClick={() => {
                              setActiveNoteId(note.id);
                              setShowHomeworkLog(false);
                            }}
                            className={`p-4 rounded-sm border transition-all cursor-pointer relative group flex gap-3.5 text-left ${
                              isSelected
                                ? 'bg-[#1A1A1A] border-[#1A1A1A] text-white'
                                : 'bg-[#FDFCFB] border-[#1A1A1A]/10 hover:border-[#1A1A1A] text-[#1A1A1A]'
                            }`}
                          >
                            <div className="self-center flex-shrink-0">
                              {note.type === 'recording' && <span className="text-xl">🎙️</span>}
                              {note.type === 'ppt' && <span className="text-xl">📂</span>}
                              {note.type === 'youtube' && <span className="text-xl">📺</span>}
                            </div>
                            <div className="flex-1 space-y-1.5 overflow-hidden">
                              <h4 className="font-serif font-bold italic text-sm truncate pr-4">{note.title}</h4>
                              <div className="flex flex-wrap items-center gap-2 text-[9px] font-bold">
                                <span className={`px-1.5 py-0.5 rounded-xs uppercase tracking-wider font-mono ${
                                  isSelected ? 'bg-white/20 text-white' : 'bg-[#1A1A1A]/5 text-[#1A1A1A]/70'
                                }`}>
                                  {note.type}
                                </span>
                                <span className={isSelected ? 'text-white/60' : 'text-[#1A1A1A]/50'}>
                                  {new Date(note.createdAt).toLocaleDateString()}
                                </span>
                                {scoreCount > 0 && (
                                  <span className={`px-1.5 py-0.5 rounded-xs uppercase tracking-wider font-mono font-bold ${
                                    isSelected ? 'bg-emerald-950/80 text-emerald-300' : 'bg-emerald-50 text-emerald-800 border border-emerald-100'
                                  }`}>
                                    ✓ 已做測驗
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Delete note key button */}
                            <button
                              onClick={(e) => handleDeleteNote(note.id, e)}
                              className="absolute top-3 right-2 opacity-0 group-hover:opacity-100 p-1.5 rounded-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition"
                              title="刪除筆記"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-8 text-xs text-[#1A1A1A]/40 space-y-2 border border-dashed border-[#1A1A1A]/10 rounded-sm font-serif italic">
                        <span>暫無匹配的案卷檔案</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Preset Study topics list so professors can experience standard cycle instantaneously */}
                <div className="bg-[#1A1A1A] text-white rounded-sm p-5 text-left space-y-4">
                  <div className="flex items-center gap-2">
                    <Info className="w-4.5 h-4.5 text-white/80 shrink-0" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/95 font-sans">極速複習範本一鍵切換 (Instant Preset)</span>
                  </div>
                  <p className="text-xs text-white/70 leading-relaxed font-serif italic">
                    如果您希望立即預覽高難度科目在本軟體下的轉化深度，可以使用以下知名學術專題直接注入：
                  </p>
                  <div className="grid grid-cols-2 gap-3.5">
                    <button
                      onClick={() => {
                        // Import Molecular Biology
                        if (!notes.some(n => n.id === 'demo-1')) {
                          setNotes(prev => [curDemos[0], ...prev]);
                        }
                        setActiveNoteId('demo-1');
                        setShowHomeworkLog(false);
                      }}
                      className="py-2.5 px-2 bg-white/10 hover:bg-white/15 border border-white/20 transition font-bold text-[10px] rounded-xs text-white text-center truncate cursor-pointer uppercase tracking-wider font-mono"
                    >
                      🧬 遺傳學轉錄
                    </button>
                    <button
                      onClick={() => {
                        // Import Algorithm DP
                        if (!notes.some(n => n.id === 'demo-2')) {
                          setNotes(prev => [...prev, curDemos[1]]);
                        }
                        setActiveNoteId('demo-2');
                        setShowHomeworkLog(false);
                      }}
                      className="py-2.5 px-2 bg-white/10 hover:bg-white/15 border border-white/20 transition font-bold text-[10px] rounded-xs text-white text-center truncate cursor-pointer uppercase tracking-wider font-mono"
                    >
                      💻 背包動態規劃
                    </button>
                  </div>
                </div>

              </div>

              {/* RIGHT SIDE HUB: Active Study Notes & Interactive Sections (lg:col-span-7) */}
              <div className="lg:col-span-7 space-y-8">
                
                {/* Loader screen when compiling AI generation parameters */}
                {isGenerating ? (
                  <div className="bg-white rounded-sm border border-[#1A1A1A]/10 p-12 text-center space-y-6">
                    <div className="p-4 bg-[#F7F5F2] border border-[#1A1A1A]/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto text-[#1A1A1A] animate-pulse">
                      <GraduationCap className="w-10 h-10" />
                    </div>

                    <div className="space-y-4 max-w-sm mx-auto">
                      <h3 className="text-base md:text-lg font-serif font-bold italic text-[#1A1A1A] animate-bounce">AI 正在撰寫章節課堂摘要與互動材料...</h3>
                      
                      <div className="h-1.5 w-full bg-[#F7F5F2] border border-[#1A1A1A]/5 rounded-sm overflow-hidden">
                        <motion.div
                          className="bg-[#1A1A1A] h-full"
                          initial={{ width: '5%' }}
                          animate={{ width: '95%' }}
                          transition={{ duration: 15, ease: 'easeOut' }}
                        />
                      </div>

                      <p className="text-xs text-[#1A1A1A]/85 font-medium leading-relaxed bg-[#F7F5F2] border border-[#1A1A1A]/10 p-4 rounded-sm italic font-serif">
                        {loadingSteps[loadingStepIdx]}
                      </p>
                    </div>
                  </div>
                ) : activeNote ? (
                  <div className="space-y-6">
                    
                    {/* Active study notes details header summary */}
                    <div className="bg-white rounded-sm border border-[#1A1A1A]/10 p-6 lg:p-8 text-left space-y-6">
                      
                      {/* Note Title banner */}
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-[#1A1A1A]/10">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="px-1.5 py-0.5 bg-[#1A1A1A] text-white font-mono font-bold text-[9px] uppercase tracking-wider rounded-xs">
                              {activeNote.type}
                            </span>
                            <span className="text-[10px] text-[#1A1A1A]/40 font-bold font-mono uppercase tracking-wider">
                              Established: {new Date(activeNote.createdAt).toLocaleString()}
                            </span>
                          </div>
                          
                          <h2 className="text-2xl md:text-3xl font-serif font-black italic text-[#1A1A1A] leading-tight">
                            {activeNote.title}
                          </h2>
                          
                          <p className="text-xs text-[#1A1A1A]/60 flex items-center gap-1.5 truncate">
                            <span className="font-extrabold uppercase tracking-widest text-[9px] text-[#1A1A1A]/40">Source Identity:</span>
                            <span className="truncate font-mono">{activeNote.sourceName}</span>
                          </p>
                        </div>
                      </div>

                      {/* Content Category Tabs controller */}
                      <div className="flex border-b border-[#1A1A1A]/10 overflow-x-auto">
                        <button
                          onClick={() => setActiveTab('summary')}
                          className={`py-3 px-5 font-bold text-[10px] md:text-xs uppercase tracking-widest border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                            activeTab === 'summary'
                              ? 'border-[#1A1A1A] text-[#1A1A1A]'
                              : 'border-transparent text-[#1A1A1A]/40 hover:text-[#1A1A1A]'
                          }`}
                        >
                          📝 AI 課堂摘要研究
                        </button>
                        <button
                          onClick={() => setActiveTab('cheatSheet')}
                          className={`py-3 px-5 font-bold text-[10px] md:text-xs uppercase tracking-widest border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                            activeTab === 'cheatSheet'
                              ? 'border-[#1A1A1A] text-[#1A1A1A]'
                              : 'border-transparent text-[#1A1A1A]/40 hover:text-[#1A1A1A]'
                          }`}
                        >
                          ⚡ 考前口訣與衝刺圖
                        </button>
                        <button
                          onClick={() => setActiveTab('quizzes')}
                          className={`py-3 px-5 font-bold text-[10px] md:text-xs uppercase tracking-widest border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                            activeTab === 'quizzes'
                              ? 'border-[#1A1A1A] text-[#1A1A1A]'
                              : 'border-transparent text-[#1A1A1A]/40 hover:text-[#1A1A1A]'
                          }`}
                        >
                          🧠 學術自評強化測驗
                        </button>
                      </div>

                      {/* Content sections body container */}
                      <div className="pt-2 min-h-[350px]">
                        <AnimatePresence mode="wait">
                          {activeTab === 'summary' && (
                            <motion.div
                              key="summary-tab"
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -5 }}
                              className="space-y-8"
                            >
                              {/* Summary text parser */}
                              <div className="bg-white text-base leading-relaxed font-sans text-[#1A1A1A]/90">
                                <MarkdownRenderer content={activeNote.summary} />
                              </div>

                              {/* Key bullet takeaways */}
                              {activeNote.keyPoints && activeNote.keyPoints.length > 0 && (
                                <div className="space-y-4 pt-6 border-t border-[#1A1A1A]/10 text-left">
                                  <div className="flex items-center gap-3">
                                    <span className="text-[10px] bg-[#1A1A1A] text-white px-2 py-0.5 font-bold uppercase tracking-[0.2em]">04. 要點大綱</span>
                                    <div className="h-px flex-1 bg-[#1A1A1A]/10"></div>
                                  </div>
                                  
                                  <h4 className="font-serif font-black italic text-xl text-[#1A1A1A]">
                                    課堂黃金核心要旨 (Core Insights)
                                  </h4>
                                  
                                  <div className="grid grid-cols-1 gap-3.5">
                                    {activeNote.keyPoints.map((pt, index) => (
                                      <div
                                        key={index}
                                        className="bg-[#F7F5F2] border border-[#1A1A1A]/10 p-5 rounded-sm text-xs sm:text-sm font-sans flex gap-3.5 items-start"
                                      >
                                        <span className="font-serif italic font-bold text-base text-[#1A1A1A]/40 shrink-0 mt-0.5 font-mono">
                                          {(index + 1).toString().padStart(2, '0')}
                                        </span>
                                        <span className="leading-relaxed text-[#1A1A1A] font-medium">{pt}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </motion.div>
                          )}

                          {activeTab === 'cheatSheet' && (
                            <motion.div
                              key="cheat-tab"
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -5 }}
                            >
                              <CheatSheetSection cheatSheet={activeNote.cheatSheet} />
                            </motion.div>
                          )}

                          {activeTab === 'quizzes' && (
                            <motion.div
                              key="quiz-tab"
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -5 }}
                            >
                              <QuizSection
                                quizzes={activeNote.quizzes}
                                quizHistory={activeNote.quizHistory || []}
                                onQuizSubmit={handleQuizSubmitted}
                              />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-sm border border-[#1A1A1A]/10 p-12 text-center space-y-4">
                    <BookOpen className="w-16 h-16 text-[#1A1A1A]/20 mx-auto stroke-1" />
                    <div className="space-y-2">
                      <h3 className="text-lg font-serif font-bold italic text-[#1A1A1A]">智慧複習案卷是空的</h3>
                      <p className="text-xs text-[#1A1A1A]/55 max-w-sm mx-auto leading-relaxed">
                        請在左側選擇合適的來源（如現場直接錄音、簡報簡圖、或者 YouTube 授課連結）並點擊整理；亦或是點選上方黑框中的知名快速範本，即可立竿見影解鎖複習大案卷！
                      </p>
                    </div>
                  </div>
                )}

              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* Bottom Bar Info / Elegant design footer block */}
      <footer className="mt-auto h-12 bg-[#1A1A1A] text-white flex items-center justify-between px-6 md:px-8 text-[9px] uppercase tracking-[0.25em] font-medium font-sans">
        <div className="flex items-center gap-4">
          <span>Campus Portal Status: Operational</span>
          <span className="opacity-35 hidden sm:inline">|</span>
          <span className="hidden sm:inline">LLM: Gemini-3.5-flash Enhanced</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Live Recording Engine Is Ready</span>
        </div>
      </footer>
    </div>
  );
}
export { App };
