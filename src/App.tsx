import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useStore, restoreSession } from './store/useStore';
import AppLayout from './layouts/AppLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Players from './pages/Players';
import PlayerDetail from './pages/PlayerDetail';
import Staff from './pages/Staff';
import Evaluation from './pages/Evaluation';
import Chat from './pages/Chat';
import Reports from './pages/Reports';
import Checklist from './pages/Checklist';
import Notices from './pages/Notices';

// ── ログイン必須ルートのガード ──
// （未ログインの場合はログイン画面へ自動的にリダイレクトする）
function RequireAuth({ children }: { children: React.ReactNode }) {
  const currentUser = useStore((s) => s.currentUser);
  if (!currentUser) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  // ブラウザを閉じて開き直しても、前回ログインしていれば自動でログイン状態を復元する
  useEffect(() => { restoreSession(); }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* ログイン画面 */}
        <Route path="/login" element={<Login />} />

        {/* ログイン後のメイン画面（AppLayoutがサイドバー＋ヘッダーを担当） */}
        <Route
          path="/"
          element={
            <RequireAuth>
              <AppLayout />
            </RequireAuth>
          }
        >
          {/* デフォルトはダッシュボードへ */}
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard"   element={<Dashboard />} />
          <Route path="players"     element={<Players />} />
          <Route path="players/:id" element={<PlayerDetail />} />
          <Route path="staff"       element={<Staff />} />
          <Route path="evaluation"  element={<Evaluation />} />
          <Route path="chat"        element={<Chat />} />
          <Route path="reports"     element={<Reports />} />
          <Route path="checklist"   element={<Checklist />} />
          <Route path="notices"     element={<Notices />} />
        </Route>

        {/* 未定義のURLはダッシュボードへ */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
