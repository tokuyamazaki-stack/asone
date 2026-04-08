import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Badge } from '../components/ui/Badge';
import { EvalBars } from '../components/ui/EvalBars';
import type { Evaluation } from '../types';

type EvalFilter = 'all' | 'coach' | 'self' | 'parent';

const FILTER_LABELS: { key: EvalFilter; label: string }[] = [
  { key: 'all', label: 'すべて' },
  { key: 'coach', label: 'コーチ' },
  { key: 'self', label: '本人' },
  { key: 'parent', label: '保護者' },
];

const ROLE_CHIP: Record<string, string> = {
  coach: 'bg-green-100 text-green-700',
  self:  'bg-orange-100 text-orange-700',
  parent: 'bg-violet-100 text-violet-700',
};

export default function PlayerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, players, evalHistory, chatMessages, saveEvaluation } = useStore();

  const player = players.find((p) => p.id === Number(id));
  const canEdit = ['admin', 'coach'].includes(currentUser?.role ?? '');

  const [filter, setFilter] = useState<EvalFilter>('all');
  const [showEvalModal, setShowEvalModal] = useState(false);
  const [evalForm, setEvalForm] = useState<Evaluation>({ heart: 70, head: 70, tech: 70, body: 70 });
  const [evalComment, setEvalComment] = useState('');

  if (!player) return <div className="p-6 text-slate-500">選手が見つかりません</div>;

  const history = evalHistory[player.id] ?? [];
  const filtered = filter === 'all' ? history : history.filter((h) => h.evaluator === filter);
  const chatPrev = (chatMessages[player.id] ?? []).slice(-3);

  function openEvalModal() {
    setEvalForm({ ...player!.evaluation });
    setEvalComment('');
    setShowEvalModal(true);
  }

  function saveEval() {
    saveEvaluation(player!.id, evalForm, evalComment, currentUser!.name, currentUser!.role);
    setShowEvalModal(false);
  }

  return (
    <div className="space-y-5">
      {/* ヘッダー */}
      <div className="flex items-center gap-3 flex-wrap">
        <button
          onClick={() => navigate('/players')}
          className="text-xs border border-slate-300 rounded px-3 py-1.5 hover:bg-slate-100"
        >← 一覧に戻る</button>
        <h2 className="text-xl font-bold text-slate-800">{player.name}</h2>
        {canEdit && (
          <button
            onClick={openEvalModal}
            className="ml-auto bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700"
          >評価を編集</button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* 左：プロフィール */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="h-16 bg-gradient-to-r from-blue-600 to-sky-400" />
            <div className="px-5 pb-5">
              <div className="-mt-7 mb-3">
                <div className="w-14 h-14 rounded-full border-3 border-white bg-white shadow flex items-center justify-center text-2xl font-bold text-blue-600">
                  {player.name.charAt(0)}
                </div>
              </div>
              <div className="text-lg font-bold text-slate-800">{player.name}</div>
              <div className="text-sm text-slate-400 mb-4">{player.position} / {player.grade}</div>
              {[
                ['背番号', `#${player.number}`],
                ['年齢', `${player.age}歳`],
                ['身長', `${player.height}cm`],
                ['体重', `${player.weight}kg`],
                ['保護者', player.parentName],
                ['入会日', player.joinDate],
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between py-1.5 border-b border-slate-100 last:border-0 text-sm">
                  <span className="text-slate-400">{label}</span>
                  <span className="font-medium text-slate-800">{val}</span>
                </div>
              ))}
              {player.notes && (
                <div className="mt-3 bg-slate-50 rounded-lg p-3 text-sm text-slate-500">{player.notes}</div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5">
            <h3 className="font-semibold text-slate-700 mb-4">現在の評価</h3>
            <EvalBars evaluation={player.evaluation} />
          </div>
        </div>

        {/* 右：評価履歴 ＋ チャット概要 */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl shadow-sm p-5">
            <h3 className="font-semibold text-slate-700 mb-3">評価履歴</h3>
            {/* フィルタータブ */}
            <div className="flex gap-2 mb-4 flex-wrap">
              {FILTER_LABELS.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors
                    ${filter === key ? 'bg-blue-600 text-white border-blue-600' : 'border-slate-300 text-slate-500 hover:bg-slate-50'}`}
                >
                  {label}
                </button>
              ))}
            </div>

            {filtered.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-6">記録がありません</p>
            ) : (
              <div className="space-y-3">
                {filtered.map((h, i) => (
                  <div key={i} className="bg-slate-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white
                        ${h.evaluator === 'coach' ? 'bg-green-500' : h.evaluator === 'self' ? 'bg-orange-500' : 'bg-violet-500'}`}>
                        {h.evaluatorName.charAt(0)}
                      </div>
                      <span className="text-sm font-semibold text-slate-700">{h.evaluatorName}</span>
                      <Badge variant={h.evaluator === 'coach' ? 'success' : h.evaluator === 'self' ? 'warning' : 'info'}>
                        {h.evaluator === 'coach' ? 'コーチ' : h.evaluator === 'self' ? '本人' : '保護者'}
                      </Badge>
                      <span className="text-xs text-slate-400 ml-auto">{h.date}</span>
                    </div>
                    <div className="flex gap-2 flex-wrap mb-2">
                      {(['heart', 'head', 'tech', 'body'] as const).map((k) => {
                        const chip = ROLE_CHIP[h.evaluator] || ROLE_CHIP.coach;
                        const labels = { heart: '心', head: '頭', tech: '技', body: '体' };
                        return (
                          <span key={k} className={`text-xs font-semibold px-2 py-0.5 rounded-full ${chip}`}>
                            {labels[k]} {h[k]}
                          </span>
                        );
                      })}
                    </div>
                    {h.comment && <p className="text-xs text-slate-500">{h.comment}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* チャット概要 */}
          {chatPrev.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-slate-700">最近のチャット</h3>
                <button
                  onClick={() => navigate('/chat')}
                  className="text-xs border border-slate-300 rounded px-2 py-1 hover:bg-slate-50"
                >チャットへ</button>
              </div>
              {chatPrev.map((m) => (
                <div key={m.id} className="flex gap-2 py-2 border-b border-slate-100 last:border-0">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0
                    ${m.sender === 'ai' ? 'bg-violet-500' : 'bg-blue-600'}`}>
                    {m.senderName.charAt(0)}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-500">{m.senderName}</div>
                    <div className="text-sm text-slate-700">{m.content}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 評価編集モーダル */}
      {showEvalModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h3 className="font-bold">{player.name} の評価編集</h3>
              <button onClick={() => setShowEvalModal(false)} className="text-slate-400 hover:text-slate-700 text-xl">✕</button>
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
              <button onClick={() => setShowEvalModal(false)} className="px-4 py-2 border border-slate-300 rounded-lg text-sm">キャンセル</button>
              <button onClick={saveEval} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">保存</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
