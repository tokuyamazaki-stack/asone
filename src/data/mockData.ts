import type { User, Player, Staff, WeeklyReport, ChatMessage, Notice, EvalHistory, Checklists } from '../types';

export const USERS: User[] = [
  { id: 'admin',  password: 'admin123',  name: '山田 太郎', role: 'admin',  roleLabel: '経営陣' },
  { id: 'coach',  password: 'coach123',  name: '鈴木 一郎', role: 'coach',  roleLabel: 'コーチ' },
  { id: 'player', password: 'player123', name: '田中 健太', role: 'player', roleLabel: '選手' },
  { id: 'parent', password: 'parent123', name: '田中 和子', role: 'parent', roleLabel: '保護者' },
];

export const PLAYERS: Player[] = [
  { id: 1, name: '田中 健太', number: 10, position: 'FW', grade: 'U-15', age: 14, height: 168, weight: 58, contact: '090-0001-0001', parentName: '田中 和子', joinDate: '2023-04-01', notes: '左利き。スピードに優れる。', evaluation: { heart: 80, head: 75, tech: 85, body: 78 } },
  { id: 2, name: '佐藤 拓也', number: 7,  position: 'MF', grade: 'U-15', age: 15, height: 172, weight: 62, contact: '090-0001-0002', parentName: '佐藤 誠',   joinDate: '2023-04-01', notes: 'ゲームメイクが得意。', evaluation: { heart: 85, head: 90, tech: 80, body: 72 } },
  { id: 3, name: '小林 大輝', number: 1,  position: 'GK', grade: 'U-15', age: 15, height: 180, weight: 70, contact: '090-0001-0003', parentName: '小林 美佐', joinDate: '2022-04-01', notes: '反射神経が抜群。', evaluation: { heart: 88, head: 82, tech: 78, body: 90 } },
  { id: 4, name: '伊藤 勇輝', number: 5,  position: 'DF', grade: 'U-13', age: 13, height: 160, weight: 52, contact: '090-0001-0004', parentName: '伊藤 良子', joinDate: '2024-04-01', notes: '空中戦が強い。', evaluation: { heart: 75, head: 70, tech: 68, body: 82 } },
  { id: 5, name: '渡辺 蓮',   number: 11, position: 'FW', grade: 'U-13', age: 13, height: 158, weight: 50, contact: '090-0001-0005', parentName: '渡辺 浩',   joinDate: '2024-04-01', notes: 'ドリブルが得意。', evaluation: { heart: 78, head: 65, tech: 80, body: 75 } },
  { id: 6, name: '松本 海斗', number: 3,  position: 'DF', grade: 'U-15', age: 14, height: 170, weight: 60, contact: '090-0001-0006', parentName: '松本 聡',   joinDate: '2023-04-01', notes: '積極的なオーバーラップ。', evaluation: { heart: 82, head: 74, tech: 76, body: 85 } },
];

export const STAFF: Staff[] = [
  { id: 1, name: '鈴木 一郎', role: 'coach',   roleLabel: 'ヘッドコーチ', license: 'JFA B級',    experience: '10年', contact: '080-0002-0001', joinDate: '2020-04-01' },
  { id: 2, name: '高橋 修',   role: 'coach',   roleLabel: 'コーチ',       license: 'JFA C級',    experience: '5年',  contact: '080-0002-0002', joinDate: '2021-04-01' },
  { id: 3, name: '中村 正樹', role: 'coach',   roleLabel: 'GKコーチ',     license: 'JFA GK C級', experience: '8年',  contact: '080-0002-0003', joinDate: '2022-04-01' },
  { id: 4, name: '山田 太郎', role: 'admin',   roleLabel: '代表',         license: '-',           experience: '15年', contact: '080-0002-0004', joinDate: '2018-04-01' },
  { id: 5, name: '岡田 由美', role: 'manager', roleLabel: 'マネージャー', license: '-',           experience: '3年',  contact: '080-0002-0005', joinDate: '2023-04-01' },
];

export const WEEKLY_REPORTS: WeeklyReport[] = [
  {
    id: 1, weekLabel: '2026年第13週', startDate: '2026-03-23', endDate: '2026-03-29',
    author: '鈴木 一郎', authorRole: 'coach', trainingDays: 4,
    practiceContent: 'ポジショニング強化・セットプレー練習',
    match: 'トレーニングマッチ vs FC北星（○3-1）',
    goodPoints: '前線からのプレス連動が向上。セットプレーから2得点。',
    improvements: '中盤でのボールロストが課題。ビルドアップの精度向上が必要。',
    nextWeekPlan: '個人技術練習とゲーム形式のトレーニングを重視する。',
    status: 'published', tags: ['試合あり', 'セットプレー'],
    comments: [{ id: 1, author: '山田 太郎', role: '経営陣', content: 'セットプレーの成果が出ていますね！', timestamp: '2026-03-30 10:00' }],
  },
  {
    id: 2, weekLabel: '2026年第12週', startDate: '2026-03-16', endDate: '2026-03-22',
    author: '鈴木 一郎', authorRole: 'coach', trainingDays: 3,
    practiceContent: 'フィジカルトレーニング・1対1の守備',
    match: 'なし（雨天中止）',
    goodPoints: '選手の意識が高く集中した練習ができた。',
    improvements: '出席率が低め。コミュニケーション強化が必要。',
    nextWeekPlan: 'トレーニングマッチを通じて実戦感覚を取り戻す。',
    status: 'published', tags: ['雨天中止', '要フォロー'], comments: [],
  },
  {
    id: 3, weekLabel: '2026年第14週', startDate: '2026-03-30', endDate: '2026-04-05',
    author: '鈴木 一郎', authorRole: 'coach', trainingDays: 4,
    practiceContent: '戦術練習・シュート練習',
    match: '公式戦 vs FC東洋（準備中）',
    goodPoints: '攻撃の形が整ってきた。',
    improvements: '守備ラインのコンパクトさに課題あり。',
    nextWeekPlan: '公式戦に向けてメンタル強化と戦術確認。',
    status: 'draft', tags: ['公式戦前', '要確認'], comments: [],
  },
];

export const NOTIFICATIONS: Notice[] = [
  { id: 1, type: 'match',    title: '公式戦のお知らせ',   content: '4/12（日）10:00〜 vs FC東洋　会場：中央グラウンド', date: '2026-04-03', important: true },
  { id: 2, type: 'practice', title: '練習変更のお知らせ', content: '4/8（水）の練習は17:30〜に変更します。',             date: '2026-04-03', important: false },
  { id: 3, type: 'general',  title: '年会費納入のお願い', content: '2026年度の年会費をまだ納入されていない方は4/15までにお願いします。', date: '2026-04-01', important: true },
];

export const EVAL_HISTORY: Record<number, EvalHistory[]> = {
  1: [
    { date: '2026-04-01', evaluator: 'coach',  evaluatorName: '鈴木 一郎', heart: 80, head: 75, tech: 85, body: 78, comment: '試合での積極性が増してきた。左足の改善も見られる。' },
    { date: '2026-03-01', evaluator: 'coach',  evaluatorName: '鈴木 一郎', heart: 75, head: 71, tech: 81, body: 74, comment: '基礎技術は安定している。' },
    { date: '2026-04-01', evaluator: 'self',   evaluatorName: '田中 健太', heart: 72, head: 70, tech: 80, body: 75, comment: 'シュート精度をもっと上げたい。' },
    { date: '2026-04-01', evaluator: 'parent', evaluatorName: '田中 和子', heart: 83, head: 74, tech: 82, body: 77, comment: '毎日自主練を頑張っています！' },
  ],
  2: [
    { date: '2026-04-01', evaluator: 'coach', evaluatorName: '鈴木 一郎', heart: 85, head: 90, tech: 80, body: 72, comment: 'ゲームメイクの質が確実に上がった。' },
    { date: '2026-04-01', evaluator: 'self',  evaluatorName: '佐藤 拓也', heart: 80, head: 85, tech: 77, body: 68, comment: 'フィジカルをもっと強化したい。' },
  ],
  3: [{ date: '2026-04-01', evaluator: 'coach', evaluatorName: '中村 正樹', heart: 88, head: 82, tech: 78, body: 90, comment: '反射神経とセービング範囲が特出している。' }],
  4: [{ date: '2026-04-01', evaluator: 'coach', evaluatorName: '鈴木 一郎', heart: 75, head: 70, tech: 68, body: 82, comment: '空中戦の強さを活かしたい。技術面の底上げが課題。' }],
  5: [{ date: '2026-04-01', evaluator: 'coach', evaluatorName: '鈴木 一郎', heart: 78, head: 65, tech: 80, body: 75, comment: 'ドリブルのスピードが光る。判断力を磨けば化ける。' }],
  6: [{ date: '2026-04-01', evaluator: 'coach', evaluatorName: '鈴木 一郎', heart: 82, head: 74, tech: 76, body: 85, comment: 'オーバーラップの積極性が良い。戻りの速さも向上。' }],
};

export const CHAT_MESSAGES: Record<number, ChatMessage[]> = {
  1: [
    { id: 1, sender: 'ai',     senderName: 'AIコーチ',  content: 'こんにちは、田中さん！今週の練習はどうでしたか？', timestamp: '2026-04-05 09:00', read: true },
    { id: 2, sender: 'player', senderName: '田中 健太', content: '今週はシュート練習が多くて楽しかったです！でも左足がまだ弱くて…', timestamp: '2026-04-05 09:15', read: true },
    { id: 3, sender: 'ai',     senderName: 'AIコーチ',  content: '左足の課題、よく気づきましたね！毎日5分だけ左足でのドリブルとキックを続けると、3ヶ月で大きく変わります。', timestamp: '2026-04-05 09:16', read: true },
    { id: 4, sender: 'player', senderName: '田中 健太', content: 'インサイドキックの精度が安定しないです', timestamp: '2026-04-05 09:20', read: true },
    { id: 5, sender: 'ai',     senderName: 'AIコーチ',  content: 'インサイドキックには「軸足の置き場所」が鍵です！蹴る瞬間に軸足がボールの真横に来るよう意識してみてください。', timestamp: '2026-04-05 09:21', read: true },
  ],
  2: [
    { id: 6, sender: 'ai',     senderName: 'AIコーチ',  content: 'こんにちは、佐藤さん！先週の試合でのゲームメイクが素晴らしかったです。', timestamp: '2026-04-04 18:00', read: true },
    { id: 7, sender: 'player', senderName: '佐藤 拓也', content: 'ありがとうございます。でも体力がもたなくて後半バテてしまいました…', timestamp: '2026-04-04 18:30', read: true },
    { id: 8, sender: 'ai',     senderName: 'AIコーチ',  content: '後半の体力維持は大切な課題ですね。「無駄な動きを減らす」ことが効果的です。', timestamp: '2026-04-04 18:31', read: false },
  ],
};

export const CHECKLISTS: Checklists = {
  daily: [
    { id: 'd1', label: '練習場の事前確認・準備', done: true },
    { id: 'd2', label: '選手出欠確認', done: true },
    { id: 'd3', label: '備品チェック（ビブス・ボール・コーン）', done: false },
    { id: 'd4', label: '救急セットの確認', done: false },
    { id: 'd5', label: '天気・グラウンド状況確認', done: true },
    { id: 'd6', label: '練習後の振り返り記録', done: false },
  ],
  weekly: [
    { id: 'w1', label: '週報の作成・提出', done: false },
    { id: 'w2', label: '選手評価の更新', done: false },
    { id: 'w3', label: '保護者への連絡（LINE/メール）', done: true },
    { id: 'w4', label: '練習計画の立案', done: true },
    { id: 'w5', label: '試合映像の確認・分析', done: false },
  ],
  monthly: [
    { id: 'm1', label: '月次ミーティングの開催', done: false },
    { id: 'm2', label: '会計・経費報告の提出', done: true },
    { id: 'm3', label: '保護者説明会の準備', done: false },
    { id: 'm4', label: 'ライセンス更新確認', done: true },
    { id: 'm5', label: '施設利用申請（翌月分）', done: false },
  ],
};
