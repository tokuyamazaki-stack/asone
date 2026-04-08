import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import type { Role } from '../types';

// ── ナビメニュー定義 ──
const NAV_MENUS: Record<Role, { section?: string; id?: string; label?: string }[]> = {
  admin: [
    { section: 'メイン' },
    { id: '/dashboard', label: 'ダッシュボード' },
    { section: 'クラブ管理' },
    { id: '/players',    label: '選手情報管理' },
    { id: '/staff',      label: 'スタッフ管理' },
    { id: '/evaluation', label: '選手評価' },
    { id: '/chat',       label: 'AIチャット' },
    { section: '業務' },
    { id: '/reports',    label: '週報管理' },
    { id: '/checklist',  label: '業務チェックリスト' },
    { section: 'その他' },
    { id: '/notices',    label: 'お知らせ' },
  ],
  coach: [
    { section: 'メイン' },
    { id: '/dashboard', label: 'ダッシュボード' },
    { section: 'クラブ管理' },
    { id: '/players',    label: '選手情報管理' },
    { id: '/evaluation', label: '選手評価' },
    { id: '/chat',       label: 'AIチャット' },
    { section: '業務' },
    { id: '/reports',    label: '週報管理' },
    { id: '/checklist',  label: '業務チェックリスト' },
    { section: 'その他' },
    { id: '/notices',    label: 'お知らせ' },
  ],
  player: [
    { section: 'メイン' },
    { id: '/dashboard', label: 'マイページ' },
    { id: '/evaluation', label: '自分の評価' },
    { id: '/chat',       label: 'AIコーチ' },
    { id: '/notices',    label: 'お知らせ' },
  ],
  parent: [
    { section: 'メイン' },
    { id: '/dashboard', label: 'ホーム' },
    { id: '/chat',       label: 'AIコーチ' },
    { id: '/notices',    label: 'お知らせ' },
    { id: '/reports',    label: '週報' },
  ],
};

const ICONS: Record<string, string> = {
  '/dashboard': '📊', '/players': '👤', '/staff': '👥',
  '/evaluation': '⭐', '/chat': '💬', '/reports': '📝',
  '/checklist': '✅', '/notices': '📢',
};

const ROLE_COLOR: Record<Role, string> = {
  admin: 'bg-blue-600', coach: 'bg-green-600', player: 'bg-orange-500', parent: 'bg-violet-600',
};

export default function AppLayout() {
  const { currentUser, logout } = useStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  if (!currentUser) return null;
  const menus = NAV_MENUS[currentUser.role];

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* ── オーバーレイ（スマホ用） ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── サイドバー ── */}
      <aside
        className={`fixed left-0 top-0 h-full w-[250px] bg-slate-900 text-white flex flex-col z-50
          transition-transform duration-200
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0`}
      >
        {/* ロゴ */}
        <div className="flex items-center justify-between h-[60px] px-4 border-b border-white/10">
          <span className="text-lg font-bold tracking-wider">⚽ AS ONE</span>
          <button
            className="md:hidden text-slate-400 text-xl"
            onClick={() => setSidebarOpen(false)}
          >✕</button>
        </div>

        {/* ナビ */}
        <nav className="flex-1 py-3 overflow-y-auto">
          {menus.map((item, i) => {
            if (item.section) {
              return (
                <div key={i} className="px-4 pt-4 pb-1 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  {item.section}
                </div>
              );
            }
            return (
              <NavLink
                key={item.id}
                to={item.id!}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-4 py-2.5 text-[13px] border-l-[3px] transition-colors duration-150
                  ${isActive
                    ? 'text-white bg-blue-600/30 border-blue-500'
                    : 'text-slate-400 border-transparent hover:text-white hover:bg-white/7'}`
                }
              >
                <span className="text-lg w-5 text-center">{ICONS[item.id!]}</span>
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* ユーザー情報 */}
        <div className="p-4 border-t border-white/10">
          <div className="text-[11px] text-slate-400">{currentUser.roleLabel}</div>
          <div className="text-sm font-semibold mb-2">{currentUser.name}</div>
          <button
            onClick={handleLogout}
            className="w-full text-xs text-slate-400 border border-slate-600 rounded px-3 py-1.5 hover:bg-slate-700 transition-colors"
          >
            ログアウト
          </button>
        </div>
      </aside>

      {/* ── メインエリア ── */}
      <div className="flex-1 flex flex-col md:ml-[250px] min-h-screen">
        {/* ヘッダー */}
        <header className="h-[60px] bg-white border-b border-slate-200 flex items-center px-6 gap-4 sticky top-0 z-30">
          <button
            className="md:hidden text-slate-600 text-xl"
            onClick={() => setSidebarOpen(true)}
          >☰</button>
          <div className="flex-1" /> {/* スペーサー */}
          <div className={`w-8 h-8 rounded-full ${ROLE_COLOR[currentUser.role]} text-white flex items-center justify-center font-bold text-sm`}>
            {currentUser.name.charAt(0)}
          </div>
        </header>

        {/* コンテンツ */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
