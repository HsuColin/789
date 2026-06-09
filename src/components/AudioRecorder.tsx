import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, RefreshCw, Volume2, AlertCircle, Info } from 'lucide-react';
import { motion } from 'motion/react';

interface AudioRecorderProps {
  onAudioReady: (base64Data: string, mimeType: string, textKeywordHint: string) => void;
  isGenerating: boolean;
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({ onAudioReady, isGenerating }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [micActiveLevel, setMicActiveLevel] = useState<number[]>(Array(15).fill(4));
  const [selectedSimTopic, setSelectedSimTopic] = useState<'bio' | 'alg' | 'ml'>('bio');
  const [noteHint, setNoteHint] = useState('');

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);
  const animationRef = useRef<any>(null);

  // Clean elements on unmount
  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  // Format time (mm:ss)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Start real recording
  const startRecording = async () => {
    try {
      setPermissionError(null);
      audioChunksRef.current = [];

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/mp3' });
        setAudioBlob(audioBlob);
        setAudioUrl(URL.createObjectURL(audioBlob));

        // Convert blob to base64
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const rawBase64 = reader.result as string;
          // Trigger parent
          onAudioReady(rawBase64, 'audio/mp3', noteHint);
        };

        // Stop stream tracks
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start(250);
      setIsRecording(true);
      setDuration(0);

      // Start duration count
      timerRef.current = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);

      // Simple voice meter simulation
      const simulateMicLevel = () => {
        if (!mediaRecorderRef.current) return;
        setMicActiveLevel(
          Array(15)
            .fill(0)
            .map(() => Math.floor(Math.random() * 32) + 4)
        );
        animationRef.current = requestAnimationFrame(simulateMicLevel);
      };
      simulateMicLevel();
    } catch (err: any) {
      console.warn('Microphone error (sandbox likely denied):', err);
      setPermissionError(
        '無法存取麥克風。這通常是因為 iframe 沙盒限制或未授權。別擔心！您隨時可以使用下方提供的「擬真課堂語音模擬」來體驗完整的 Speech-to-Text 轉摘要功能！'
      );
    }
  };

  // Stop real recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(timerRef.current);
      cancelAnimationFrame(animationRef.current);
    }
  };

  // Simulate a ready-made high-quality lecture file for premium experience
  const triggerSimulatedLecture = () => {
    let dummyBase64 = '';
    let chosenMime = 'audio/mp3';
    let topicText = '';

    if (selectedSimTopic === 'bio') {
      topicText = '分子生物學精簡複習課：今天的主題是遺傳密碼轉錄。真核細胞中前驅 mRNA 必須在核內進行三大修飾：加帽 (5\' Cap)、加尾 (3\' Poly-A Tail) 與剪接加工 (Splicing)。剪接過程會移除所有的 Introns 內含子，僅保留由 Exons 外顯子組成的成熟基因序列。';
    } else if (selectedSimTopic === 'alg') {
      topicText = '演算法動態規劃專題：我們來推導 0/1 背包問題的狀態轉移方程。重點在於對每一項物品，我們面臨兩個決策點：拿或不拿。其公式寫為 dp[i][w] 等於不拿的極高值 dp[i-1][w] 與拿取後的極高收益 dp[i-1][w-weight[i]] 加上加值 value[i] 之間的極大值。';
    } else {
      topicText = '人工智慧與資料科學特徵工程：在機器學習中，特徵工程是決定模型效果的關鍵。我們通常使用標準化 Standard Scaling 消除量綱影響，或是用 One-hot code 對非數值型類別特徵進行向量展開，以防止隨機梯度下降時因子偏頗或收斂過慢。';
    }

    // Set duration as completed simulated chunk
    setDuration(45);
    setAudioBlob(new Blob([], { type: 'audio/mp3' }));
    setAudioUrl('simulated-track');

    // Notify parent with dummy sound context text
    onAudioReady('MOCK_AUDIO_DATA', chosenMime, topicText || noteHint);
  };

  const handleReset = () => {
    setAudioBlob(null);
    setAudioUrl(null);
    setDuration(0);
    setIsRecording(false);
    setPermissionError(null);
  };

  return (
    <div className="bg-white rounded-sm border border-[#1A1A1A]/10 p-5 space-y-5 text-left">
      <div className="flex items-center justify-between border-b border-[#1A1A1A]/10 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-[#F7F5F2] rounded-full text-[#1A1A1A]">
            <Mic className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif font-bold italic text-base text-[#1A1A1A]">課堂錄音 / 聽寫語音輸入</h3>
            <p className="text-[11px] text-[#1A1A1A]/60">透過麥克風現場收音，或使用擬真課堂模擬器</p>
          </div>
        </div>
        {duration > 0 && (
          <span className="font-mono text-xs bg-[#1A1A1A] px-2.5 py-1 rounded-sm text-white flex items-center gap-1.5 font-bold">
            <Volume2 className="w-3.5 h-3.5 animate-bounce" />
            {formatTime(duration)}
          </span>
        )}
      </div>

      {permissionError && (
        <div className="bg-[#F7F5F2] border-l-2 border-[#1A1A1A] rounded-sm p-4 text-xs text-[#1A1A1A]/80 space-y-2">
          <div className="flex gap-1.5 items-center font-bold text-[#1A1A1A] uppercase tracking-wider">
            <AlertCircle className="w-4 h-4 text-[#1A1A1A]" />
            <span>環境限制提示</span>
          </div>
          <p className="leading-relaxed font-sans">{permissionError}</p>
        </div>
      )}

      {/* Mic sound level bar animation */}
      {isRecording && (
        <div className="bg-[#F7F5F2] border border-[#1A1A1A]/10 rounded-sm py-5 px-4 flex items-center justify-center gap-1.5 shadow-inner">
          {micActiveLevel.map((level, i) => (
            <motion.div
              key={i}
              className="bg-[#1A1A1A] w-1.5 rounded-sm"
              animate={{ height: isRecording ? level : 4 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              style={{ minHeight: '4px', maxHeight: '36px' }}
            />
          ))}
        </div>
      )}

      {/* Control Buttons panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Real Recording button */}
        {!audioUrl ? (
          !isRecording ? (
            <button
              onClick={startRecording}
              disabled={isGenerating}
              className="flex items-center justify-center gap-2 py-3 px-4 bg-[#1A1A1A] hover:bg-[#333333] disabled:opacity-40 text-white font-bold rounded-sm text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-sm"
            >
              <Mic className="w-4 h-4" />
              啟用麥克風現場錄音
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className="flex items-center justify-center gap-2 py-3 px-4 bg-red-700 hover:bg-red-800 text-white font-bold rounded-sm text-xs uppercase tracking-wider transition-colors cursor-pointer animate-pulse"
            >
              <Square className="w-4 h-4 fill-white" />
              停止錄製並上載
            </button>
          )
        ) : (
          <div className="flex gap-2">
            <div className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 bg-[#F7F5F2] text-[#1A1A1A]/80 border border-[#1A1A1A]/10 rounded-sm text-xs font-bold font-serif italic">
              <Play className="w-3.5 h-3.5" /> 錄音檔已就緒
            </div>
            <button
              onClick={handleReset}
              className="p-3 border border-[#1A1A1A]/20 hover:border-[#1A1A1A] text-[#1A1A1A] rounded-sm transition-all cursor-pointer bg-white"
              title="重置"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Dynamic Simulation tools */}
        <div className="bg-[#F7F5F2] rounded-sm p-3 border border-[#1A1A1A]/10 space-y-2.5">
          <div className="flex items-center gap-1.5 text-xs text-[#1A1A1A] font-bold uppercase tracking-wider">
            <Info className="w-3.5 h-3.5 text-[#1A1A1A]" />
            <span>擬真課堂語音模擬器</span>
          </div>

          <div className="grid grid-cols-3 gap-1">
            <button
              onClick={() => setSelectedSimTopic('bio')}
              className={`py-1 text-[10px] font-bold uppercase rounded-sm border transition-all cursor-pointer ${
                selectedSimTopic === 'bio'
                  ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                  : 'bg-white hover:bg-[#F7F5F2] text-[#1A1A1A]/70 border-[#1A1A1A]/10'
              }`}
            >
              🧬 分子生物
            </button>
            <button
              onClick={() => setSelectedSimTopic('alg')}
              className={`py-1 text-[10px] font-bold uppercase rounded-sm border transition-all cursor-pointer ${
                selectedSimTopic === 'alg'
                  ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                  : 'bg-white hover:bg-[#F7F5F2] text-[#1A1A1A]/70 border-[#1A1A1A]/10'
              }`}
            >
              💻 背包 DP
            </button>
            <button
              onClick={() => setSelectedSimTopic('ml')}
              className={`py-1 text-[10px] font-bold uppercase rounded-sm border transition-all cursor-pointer ${
                selectedSimTopic === 'ml'
                  ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                  : 'bg-white hover:bg-[#F7F5F2] text-[#1A1A1A]/70 border-[#1A1A1A]/10'
              }`}
            >
              🤖 特徵工程
            </button>
          </div>

          <button
            onClick={triggerSimulatedLecture}
            disabled={isGenerating || isRecording}
            className="w-full py-1.5 px-3 bg-[#1A1A1A]/5 hover:bg-[#1A1A1A]/10 border border-[#1A1A1A]/20 transition-all font-bold rounded-sm text-[10px] uppercase tracking-wider text-[#1A1A1A] cursor-pointer text-center"
          >
            🚀 填入模擬聽寫課堂
          </button>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="block text-xs font-bold uppercase tracking-wider text-[#1A1A1A]/60">輔助課堂提問或指引補充 (選填)</label>
        <input
          type="text"
          value={noteHint}
          onChange={(e) => setNoteHint(e.target.value)}
          placeholder="例如：提問這段講述關於真核前驅 mRNA 剪接..."
          className="w-full text-xs px-3 py-2 bg-white border border-[#1A1A1A]/10 rounded-sm focus:border-[#1A1A1A] focus:outline-none transition-all placeholder:text-[#1A1A1A]/30"
        />
      </div>
    </div>
  );
};
