import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { USERS } from '../data/mockData';

const DEMO_ACCOUNTS = [
  { label: '経営陣', id: 'admin',  pw: 'admin123' },
  { label: 'コーチ', id: 'coach',  pw: 'coach123' },
  { label: '選手',   id: 'player', pw: 'player123' },
  { label: '保護者', id: 'parent', pw: 'parent123' },
];

export default function Login() {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useStore();
  const navigate = useNavigate();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const user = USERS.find((u) => u.id === userId && u.password === password);
    if (user) {
      login(user);
      navigate('/dashboard');
    } else {
      setError('IDまたはパスワードが正しくありません');
      setTimeout(() => setError(''), 3000);
    }
  }

  function fillDemo(id: string, pw: string) {
    setUserId(id);
    setPassword(pw);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-blue-700">
      <div className="bg-white rounded-2xl shadow-2xl p-12 w-full max-w-sm">
        {/* ロゴ */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-2">⚽</div>
          <h1 className="text-3xl font-extrabold text-blue-700 tracking-wider">AS ONE</h1>
          <p className="text-slate-400 text-sm mt-1">サッカークラブ管理システム</p>
        </div>

        {/* フォーム */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">ユーザーID</label>
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="IDを入力"
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">パスワード</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="パスワードを入力"
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm bg-red-50 px-3 py-2 rounded-lg">{error}</div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-blue-700 transition-colors"
          >
            ログイン
          </button>
        </form>

        {/* デモアカウント */}
        <div className="mt-6 pt-4 border-t border-slate-200">
          <p className="text-xs text-slate-400 text-center mb-2">デモアカウント</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {DEMO_ACCOUNTS.map(({ label, id, pw }) => (
              <button
                key={id}
                type="button"
                onClick={() => fillDemo(id, pw)}
                className="px-3 py-1 rounded-full border border-blue-500 text-blue-600 text-xs hover:bg-blue-600 hover:text-white transition-colors"
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
