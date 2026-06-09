import { Note } from '../types';

export const curDemos: Note[] = [
  {
    id: 'demo-1',
    title: '🧬 分子生物學：DNA 複製與轉錄機制',
    createdAt: new Date().toISOString(),
    type: 'ppt',
    sourceName: 'Lec03_Molecular_Biology.ppt',
    content: 'DNA 雙螺旋結構、半保留複製機制 (Semi-conservative replication)、DNA 聚合酶 (DNA Polymerase) 的作用方向 5\' -> 3\'，以及轉錄作用 (Transcription) 中 RNA 聚合酶 (RNA Polymerase) 結合啟動子 (Promoter) 的完整生化反應過程。',
    summary: `### 核心概述
分子生物學的最核心法則即為「**中心法則 (Central Dogma)**」，描述遺傳訊息如何自 DNA 轉移至 RNA，再轉譯成蛋白質。本講義著重於雙螺旋結構的解螺旋（DNA Replication）與基因轉錄（Transcription）的完整分子機制過程。

### 一、DNA 半保留複製 (Semi-conservative Replication)
DNA 複製是在細胞分裂間期進行的極其精密的化學反應：
1. **解旋與穩定**：由 **解旋酶 (DNA Helicase)** 將雙股氫鍵切斷，並由 **單股結合蛋白 (SSB)** 保持股線展開。
2. **引導合成**：**引導酶 (Primase)** 先行合成一段短 RNA 引子 (Primer)。
3. **主導加長外接**：**DNA 聚合酶 (DNA Polymerase III)** 沿著 \`5' 往 3'\` 方向連續合成**領先股 (Leading strand)**；而**延遲股 (Lagging strand)** 則形成非連續的**岡崎片段 (Okazaki fragments)**，最後由 **DNA 連接酶 (DNA Ligase)** 加密連結。

### 二、RNA 轉錄作用 (Transcription)
轉錄是將 DNA 密碼轉抄為單股 mRNA 的過程。
- **起始期 (Initiation)**：RNA 聚合酶辨識啟動子 (Promoter) 特異序列（如真核生物的 **TATA Box**）並結合，使 DNA 雙鏈局部解開。
- **延伸期 (Elongation)**：聚合酶使用核糖核苷三磷酸 (NTP) 作為原料，沿 \`5' -> 3'\` 方向合成單股 RNA 序列。
- **終止期 (Termination)**：辨識特定終止密碼子或髮夾彎結構 (Hairpin loop) 後，RNA 單股釋出。`,
    keyPoints: [
      '中心法則 (Central Dogma) 規定了遺傳訊息是「DNA -> RNA -> 蛋白質」的單向精密流動。',
      'DNA 聚合酶 (DNA Polymerase III) 的生長催化方向具有極性限制，嚴格只能由 5\' 端向 3\' 端延伸。',
      '延遲股由於方向相反，必須採取不連續合成，其產生的片段稱為「岡崎片段 (Okazaki fragments)」，並依賴連接酶 (Ligase) 修補。',
      '轉錄起始完全依賴 RNA 聚合酶與啟動子(例如真核生物的 TATA 盒)的特異性分子辨識結合。'
    ],
    cheatSheet: {
      structure: `### 🎯 考前衝刺 2 分鐘精簡架構
1. **DNA 複製 3 步驟**：解螺旋 (Helicase) ➡️ 放引子 (Primase) ➡️ 聚合連線 (Polymerase III) ➡️ 片段接合 (Ligase)。
2. **複製向極性**：雙方向合成，領先股一路順風合成，延遲股分段辛苦拼貼。
3. **轉錄核心**：不需解旋酶 (RNA Polymerase 本身自帶局部解旋功能)，亦不需要引子支持，直接結合啟動子 (Promoter) 開始。
4. **DNA vs RNA**：去氧核糖 (T) 🧬 vs 核糖 (U) 🧪。`,
      mnemonics: [
        {
          term: '解旋、導引、聚合、連接（DNA複製酵素群）',
          context: '記住 DNA 複製相關酵素的順序：Helicase -> Primase -> Polymerase -> Ligase',
          trick: '「**解**開衣服、**導**演**聚**焦、**連**一線」：**解**旋(Helicase) ➡️ 引**導** (Primase) ➡️ **聚**合 (Polymerase) ➡️ **連**接 (Ligase)。'
        },
        {
          term: '領先股 5\' -> 3\' 方向',
          context: '記住複製領先股的合成方向',
          trick: '**「領取五三折」**：**領**先股由 **5** 到 **3**。'
        }
      ],
      formulasOrBriefs: [
        {
          title: 'Chargaff\'s Rule (查加夫法則)',
          desc: '在任何雙股 DNA 結構中，嘌呤的總數等於嘧啶的總數：[A] + [G] = [T] + [C]。亦即 A 恆與 T 配對（2個氫鍵），C 恆與 G 配對（3個氫鍵，因此 GC 佔比高的 DNA 熱穩定性更高）。'
        },
        {
          title: 'Okazaki Fragments (岡崎片段)',
          desc: '因為 DNA 嚴格只能 5\'->3\' 合成，反向股不得不像毛毛蟲爬行一樣，等 DNA 解開一段才反向合成一段長約 100-200bp 的片段，之後必須靠 Ligase 水解消耗 ATP 將骨架缺口相連。'
        }
      ]
    },
    quizzes: [
      {
        question: '下列關於 DNA 複製機制的敘述，哪一項是正確的？',
        options: [
          '領先股與延遲股均是由 3\' 端向 5\' 端連續合成',
          'DNA 聚合酶不需要引子 (Primer) 即可直接起始新鏈的生成',
          '延遲股不連續合成所產生的片段稱為岡崎片段，最後由 DNA 連接酶 (Ligase) 連接',
          '解螺旋酶 (Helicase) 的功能是穩定單股 DNA 避免重新纏繞'
        ],
        correctIndex: 2,
        explanation: '正確答案是【C】。延遲股以不連續方式合成，形成岡崎片段，並經由 DNA 連接酶連接。領先股合成方向為 5\'->3\'，DNA 聚合酶需要 RNA 引子提供游離的 3\'-OH 基才能開始催化，解旋酶是切斷氫鍵，而穩定單股的是單股結合蛋白 (SSB)。'
      },
      {
        question: '在轉錄作用 (Transcription) 中，RNA 聚合酶首先會辨識 DNA 上的哪個特異序列並與其結合？',
        options: [
          '外顯子 (Exon)',
          '啟動子 (Promoter)',
          '內含子 (Intron)',
          '密碼子 (Codon)'
        ],
        correctIndex: 1,
        explanation: '正確答案是【B】。轉錄起始時，RNA 聚合酶會辨識並穩固結合於 DNA 的啟動子 (Promoter) 區，這能決定轉錄的起點與轉錄方向。'
      },
      {
        question: '關於 DNA 和 RNA 的化學組成差異，下列何者正確？',
        options: [
          'DNA 包含核糖，RNA 包含去氧核糖',
          'DNA 含有鹼基 U，RNA 則含有鹼基 T',
          'DNA 雙股主要是靠核糖與磷酸之間的氫鍵結合',
          'DNA 含有胸腺嘧啶 (T)，RNA 則含有尿嘧啶 (U) 代替 T'
        ],
        correctIndex: 3,
        explanation: '正確答案是【D】。DNA 專屬鹼基為胸腺嘧啶 (T)，RNA 為尿嘧啶 (U)。DNA 的去氧核糖在 2\' 碳少了一個氧原子。'
      },
      {
        question: '在 PCR（聚合酶連鎖反應）升溫解旋的過程中，起到了體外實驗對應體內哪一種酵素的作用？',
        options: [
          'DNA 連接酶 (DNA Ligase)',
          '解旋酶 (DNA Helicase)',
          '引導酶 (DNA Primase)',
          'DNA 聚合酶'
        ],
        correctIndex: 1,
        explanation: '正確答案是【B】。PCR 利用 high level 95°C 高溫將 DNA 雙鏈的氫鍵斷開，這在體內則需要「解旋酶 (DNA Helicase)」水解 ATP 來達成。'
      },
      {
        question: '真核生物的 DNA 轉錄產物（前驅 mRNA）需要在核內進行何種加工，才能出核進行轉譯？',
        options: [
          '加上 5\' 端的化學端帽 (Cap)、3\' 端的多聚腺苷酸尾 (Poly-A Tail) 以及剪接 (Splicing) 移除內含子',
          '直接進行轉譯，不需任何額外的加工修飾',
          '使用 DNA 聚合酶修補兩端端粒長度',
          '全部內含子 (Intron) 保留，剪切掉所有外顯子 (Exon)'
        ],
        correctIndex: 0,
        explanation: '正確答案是【A】。真核前驅 mRNA 必須加上 5\' Cap、3\' Poly-A Tail，並藉由剪接體切除內含子 (Introns)、保留外顯子 (Exons)，才能運出細胞核轉譯。'
      }
    ],
    quizHistory: [
      { score: 4, maxScore: 5, answers: [2, 1, 3, 1, 1], takenAt: '2026-06-08T10:30:00Z' }
    ]
  },
  {
    id: 'demo-2',
    title: '💻 演算法基礎：動態規劃 (Dynamic Programming)',
    createdAt: new Date().toISOString(),
    type: 'youtube',
    sourceName: 'https://www.youtube.com/watch?v=DynamicProgramming_Intro',
    content: '動態規劃演算法的核心概念：子問題重疊性 (Overlapping Subproblems) 與最佳子結構 (Optimal Substructure)。透過費氏數列 (Fibonacci)、背包問題 (Knapsack Problem) 以及最長共同子序列 (LCS) 的實作對比遞迴與記憶化。',
    summary: `### 核心研討
**動態規劃 (Dynamic Programming, 簡稱 DP)** 是一種強大的演算法設計技術，主要用於解決最優化問題。其核心思想為：將一個複雜的巨大問題改寫成多個重疊的子問題，並藉由儲存子問題的解答（避免重複計算）來以空間換取時間。

### 一、動態規劃的兩大先決條件
1. **最佳子結構 (Optimal Substructure)**：大問題的最優解，恰好可以從其子問題的最優解中建構、推導而來。
2. **重疊子問題 (Overlapping Subproblems)**：在遞迴推導的樹狀結構中，同一個子問題會被反覆調用、計算上百次。

### 二、優化對抗：遞迴 vs 記憶化 vs 表格化
- **樸素遞迴 (Top-Down Naive Recursion)**：時間複雜度常高達極限的 $O(2^n)$ 級數（如 Fib 數列），因為產生了嚴格的重複計算。
- **備忘錄法 (Top-Down Memoization)**：依然使用遞迴，但引入一個 Hash Map 或陣列記錄已求解的子結果。時間複雜度瞬間優化至 $O(n)$。
- **表格自底向上法 (Bottom-Up Tabulation)**：剔除遞迴的 Stack 負載，直接以 For 迴圈由最小維度一步步填滿 DP 矩陣。`,
    keyPoints: [
      '動態規劃的核心信念是「絕對不要計算相同的東西兩次」，利用記憶體空間大幅抹殺時間複雜度。',
      '動態規劃與分治法 (Divide and Conquer) 的核心差別在於子問題是否有「重疊性」。',
      '費氏數列使用 Bottom-Up Tabulation 時，只需要空間複雜度 O(1) 的變數滾動更新即可達成極限優化。',
      '背包問題（0/1 Knapsack）是典型的二維 DP，狀態轉移方程需考慮「選與不選」當前物品的價值取捨。'
    ],
    cheatSheet: {
      structure: `### 🔥 動態規劃 4 大核心開發步驟
1. **定義 DP 陣列的狀態含義**：例如 \`dp[i]\` 代表長度為 $i$ 的最優解答。
2. **推導狀態轉移方程 (Transition Equation)**：大推小關係式，如 \`dp[i] = dp[i-1] + dp[i-2]\`。
3. **初始化邊界極值 (Base Cases)**：將起始條件設定好，如 \`dp[0] = 0, dp[1] = 1\`。
4. **確立填表順序**：判斷是自低向上還是自右向左，保證計算當前格時其需要的先前子結果均已算完。`,
      mnemonics: [
        {
          term: '動態規劃必備三大特徵',
          context: '定義、轉移、基底狀態初始化',
          trick: '「**定義**好**轉移**去**基地**」：先**定義** dp 狀態 ➡️ 再寫**轉移**方程式 ➡️ 最後補上**基地** (Base cases)。'
        },
        {
          term: '0/1 背包狀態轉移',
          context: '決策公式：放物品 vs 不放物品的價值取大 max',
          trick: '「**不背**也**背**」：不放物品 (\`dp[i-1][w]\`) 與包含物品 (\`dp[i-1][w-w[i]] + v[i]\`) 取最好。'
        }
      ],
      formulasOrBriefs: [
        {
          title: '0/1 Knapsack Transition Equation',
          desc: '`dp[i][w] = max(dp[i-1][w], dp[i-1][w - weight[i]] + value[i])`。這行公式代表當我們面對第 `i` 個物品：我們決定不拿（保持舊背包容量 `w` 的價值）或是我們決定拿（背包需騰出 `weight[i]` 的空間，並得到它的 `value[i]` 收益）。'
        },
        {
          title: '滾動陣列優化 (Space Compression)',
          desc: '在很多一維或二維環扣 DP 中，當前行的計算只與上一行有關。我們可以用二維矩陣簡化至一維（由右向左倒著更新，防止同一行的覆寫），將 O(W) 空間降低，提高 CPU 快取命中率。'
        }
      ]
    },
    quizzes: [
      {
        question: '動態規劃 (Dynamic Programming) 與分治法 (Divide & Conquer) 最關鍵的分水嶺特徵是什麼？',
        options: [
          '分治法會使用遞迴，而動態規劃絕不可能使用遞迴',
          '動態規劃的子問題常常重疊 (Overlapping Subproblems)，而分治法的子問題彼此獨立且不重疊',
          '分治法的時間複雜度必定優於動態規劃',
          '只有分治法適用於最優化問題求解'
        ],
        correctIndex: 1,
        explanation: '正確答案是【B】。動態規劃與分治法均是將問題切為子問題，但分治各子問題完全獨立（如合併排序），而動態規劃的子問題重複性很高（如計算過許多組重複的值），這時就需要記錄子解答。'
      },
      {
        question: '若使用遞迴實現 Fibonacci 數列（無任何記憶化修飾），求極高項 $N$ 時最容易產生什麼嚴重的錯誤或缺點？',
        options: [
          '由於大量的重複調用，時間複雜度呈指數暴增並可能導致堆疊溢位 (Stack Overflow)',
          '輸出結果不具備確定性，每次執行答案不同',
          '佔用過多的硬碟儲存空間導致系統硬碟爆滿',
          '陣列索引越界錯誤，因為不支援計算大於 5 的項'
        ],
        correctIndex: 0,
        explanation: '正確答案是【A】。樸素遞迴費氏數列具有大量的重複子樹，時間複雜度高達 O(2^N)，呼叫棧層級深容易造成 Heap/Stack Overflow 或程式當掉跑不出結果。'
      },
      {
        question: '在優化 0/1 背包問題的空間複雜度時，若將二維 DP 表壓縮至一維，內層迴圈背包重量 $W$ 的遍歷方向應該為何？',
        options: [
          '必須從「最大容量」逆向一路由大到小遍歷',
          '必須從「0」正向遍歷到最大容量',
          '可以任意正向或逆向遍歷，兩者完全等價',
          '不需要任何迴圈遍歷，使用 O(1) 公式即可'
        ],
        correctIndex: 0,
        explanation: '正確答案是【A】。若使用一維陣列優化，由大容量往小容量倒序遍歷。如果從小容量正序遍歷，新寫入的當前物品狀態會覆寫上一輪的舊狀態，導致一個物品在同一輪內重複「拿取多次」，退化為無限背包問題。'
      }
    ],
    quizHistory: []
  }
];
