import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { EvalBars } from '../components/ui/EvalBars';
import type { Evaluation, Player } from '../types';

export default function Evaluation() {
  const { currentUser, players, saveEvaluation } = useStore();
  const navigate = useNavigate();
  const canEdit = ['admin', 'coach'].includes(currentUser?.role ?? '');
  const isPlayer = currentUser?.role === 'player';

  const displayPlayers = isPlayer
    ? players.filter((p) => p.name === currentUser?.name)
    : players;

  const [editTarget, setEditTarget] = useState<Player | null>(null);
  const [evalForm, setEvalForm] = useState<Evaluation>({ heart: 70, head: 70, tech: 70, body: 70 });
  const [evalComment, setEvalComment] = useState('');

  function openModal(p: Player) {
    setEditTarget(p);
    setEvalForm({ ...p.evaluation });
    setEvalComment('');
  }

  function save() {
    if (!editTarget || !currentUser) return;
    saveEvaluation(editTarget.id, evalForm, evalComment, currentUser.name, currentUser.role);
    setEditTarget(null);
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-slate-800">選手評価（心・頭・技・体）</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {displayPlayers.map((p) => (
          <div key={p.id} className="bg-white rounded-xl shadow-sm p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-base shrink-0">
                {p.name.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="font-semibold text-slate-800 text-sm">{p.name}</div>
                <div className="text-xs text-slate-400">{p.position} / {p.grade}</div>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => navigate(`/players/${p.id}`)}
                  className="text-xs border border-slate-300 rounded px-2 py-1 hover:bg-slate-50"
                >詳細</button>
                {canEdit && (
                  <button
                    onClick={() => openModal(p)}
                    className="text-xs border border-slate-300 rounded px-2 py-1 hover:bg-slate-50"
                  >編集</button>
                )}
              </div>
            </div>
            <EvalBars evaluation={p.evaluation} />
          </div>
        ))}
      </div>

      {/* 評価編集モーダル */}
      {editTarget && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h3 className="font-bold">{editTarget.name} の評価編集</h3>
              <button onClick={() => setEditTarget(null)} className="text-slate-400 text-xl">✕</button>
            </div>
            <div className="px-6 py-4 space-y-4">
              {([['心 (メンタル・態度)', 'heart'], ['頭 (戦術理解・判断)', 'head'], ['技 (テクニック)', 'tech'], ['体 (フィジカル)', 'body']] as const).map(([label, key]) => (
                <div key={key}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-slate-700">{label}</span>
                    <span className="text-sm font-bold text-blue-600">{evalForm[key]}</span>
                  </div>
                  <input
                    type="range" min={0} max={100} value={evalForm[key]}
                    onChange={(e) => setEvalForm({ ...evalForm, [key]: Number(e.target.value) })}
                    className="w-full accent-blue-600"
                  />
                </div>
              ))}
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">コメント（任意）</label>
                <textarea
                  value={evalComment}
                  onChange={(e) => setEvalComment(e.target.value)}
                  rows={3}
                  placeholder="評価の根拠や気づきを記入..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-200">
              <button onClick={() => setEditTarget(null)} className="px-4 py-2 border border-slate-300 rounded-lg text-sm">キャンセル</button>
              <button onClick={save} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">保存</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
