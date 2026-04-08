import { create } from 'zustand';
import type {
  User, Player, Staff, WeeklyReport, ChatMessage,
  Notice, EvalHistory, Checklists, Evaluation, ReportComment,
} from '../types';
import {
  PLAYERS, STAFF, WEEKLY_REPORTS, NOTIFICATIONS,
  CHAT_MESSAGES, EVAL_HISTORY, CHECKLISTS,
} from '../data/mockData';

// ===== 状態の型定義 =====
// （「storeの設計図」みたいなもの。何を持って、何ができるかを定義している）

interface AppState {
  // ── データ ──
  currentUser: User | null;
  players: Player[];
  staff: Staff[];
  reports: WeeklyReport[];
  notices: Notice[];
  chatMessages: Record<number, ChatMessage[]>;
  evalHistory: Record<number, EvalHistory[]>;
  checklists: Checklists;

  // ── 認証 ──
  login: (user: User) => void;
  logout: () => void;

  // ── 選手 ──
  addPlayer: (player: Omit<Player, 'id'>) => void;
  updatePlayer: (id: number, patch: Partial<Player>) => void;

  // ── 評価 ──
  saveEvaluation: (playerId: number, evaluation: Evaluation, comment: string, evaluatorName: string, evaluatorRole: string) => void;

  // ── 週報 ──
  addReport: (report: Omit<WeeklyReport, 'id'>) => void;
  publishReport: (id: number) => void;
  addComment: (reportId: number, comment: Omit<ReportComment, 'id'>) => void;

  // ── チャット ──
  sendMessage: (playerId: number, message: Omit<ChatMessage, 'id'>) => void;

  // ── チェックリスト ──
  toggleCheck: (group: keyof Checklists, itemId: string) => void;

  // ── お知らせ ──
  addNotice: (notice: Omit<Notice, 'id'>) => void;
}

export const useStore = create<AppState>((set) => ({
  // ── 初期データ ──
  currentUser: null,
  players: PLAYERS,
  staff: STAFF,
  reports: WEEKLY_REPORTS,
  notices: NOTIFICATIONS,
  chatMessages: CHAT_MESSAGES,
  evalHistory: EVAL_HISTORY,
  checklists: JSON.parse(JSON.stringify(CHECKLISTS)), // deep copy

  // ── 認証 ──
  login: (user) => {
    set({ currentUser: user });
    try { localStorage.setItem('asone_user', JSON.stringify(user)); } catch {}
  },
  logout: () => {
    set({ currentUser: null });
    try { localStorage.removeItem('asone_user'); } catch {}
  },

  // ── 選手 ──
  addPlayer: (player) =>
    set((s) => ({
      players: [...s.players, { ...player, id: s.players.length + 1 }],
    })),
  updatePlayer: (id, patch) =>
    set((s) => ({
      players: s.players.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    })),

  // ── 評価 ──
  saveEvaluation: (playerId, evaluation, comment, evaluatorName, evaluatorRole) => {
    const today = new Date().toISOString().slice(0, 10);
    set((s) => ({
      // 評価バーの値を更新
      players: s.players.map((p) =>
        p.id === playerId ? { ...p, evaluation } : p
      ),
      // 履歴に追加
      evalHistory: {
        ...s.evalHistory,
        [playerId]: [
          { date: today, evaluator: evaluatorRole, evaluatorName, comment, ...evaluation },
          ...(s.evalHistory[playerId] ?? []),
        ],
      },
    }));
  },

  // ── 週報 ──
  addReport: (report) =>
    set((s) => ({
      reports: [{ ...report, id: s.reports.length + 1 }, ...s.reports],
    })),
  publishReport: (id) =>
    set((s) => ({
      reports: s.reports.map((r) =>
        r.id === id ? { ...r, status: 'published' } : r
      ),
    })),
  addComment: (reportId, comment) =>
    set((s) => ({
      reports: s.reports.map((r) =>
        r.id === reportId
          ? { ...r, comments: [...r.comments, { ...comment, id: r.comments.length + 1 }] }
          : r
      ),
    })),

  // ── チャット ──
  sendMessage: (playerId, message) =>
    set((s) => ({
      chatMessages: {
        ...s.chatMessages,
        [playerId]: [
          ...(s.chatMessages[playerId] ?? []),
          { ...message, id: (s.chatMessages[playerId]?.length ?? 0) + 1 },
        ],
      },
    })),

  // ── チェックリスト ──
  toggleCheck: (group, itemId) =>
    set((s) => ({
      checklists: {
        ...s.checklists,
        [group]: s.checklists[group].map((c) =>
          c.id === itemId ? { ...c, done: !c.done } : c
        ),
      },
    })),

  // ── お知らせ ──
  addNotice: (notice) =>
    set((s) => ({
      notices: [{ ...notice, id: s.notices.length + 1 }, ...s.notices],
    })),
}));

// ── セッション復元（アプリ起動時に1回だけ呼ぶ）──
export function restoreSession() {
  try {
    const saved = localStorage.getItem('asone_user');
    if (saved) {
      useStore.getState().login(JSON.parse(saved));
      return true;
    }
  } catch {}
  return false;
}
