import { useState } from 'react';
import { useStore } from '../store/useStore';
import { Badge } from '../components/ui/Badge';
import type { WeeklyReport } from '../types';

const EMPTY_FORM = {
  weekLabel: '', startDate: '', endDate: '', trainingDays: '',
  practiceContent: '', match: '', goodPoints: '', improvements: '', nextWeekPlan: '',
};

export default function Reports() {
  const { currentUser, reports, addReport, publishReport, addComment } = useStore();
  const canEdit = ['admin', 'coach'].includes(currentUser?.role ?? '');

  const [detail, setDetail] = useState<WeeklyReport | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [commentText, setCommentText] = useState('');

  function save(status: 'draft' | 'published') {
    if (!form.weekLabel.trim()) { alert('週ラベルを入力してください'); return; }
    addReport({
      weekLabel: form.weekLabel,
      startDate: form.startDate, endDate: form.endDate,
      author: currentUser!.name, authorRole: currentUser!.role,
      trainingDays: parseInt(form.trainingDays) || 0,
      practiceContent: form.practiceContent, match: form.match,
      goodPoints: form.goodPoints, improvements: form.improvements,
      nextWeekPlan: form.nextWeekPlan,
      status, tags: [], comments: [],
    });
    setShowCreate(false);
    setForm(EMPTY_FORM);
  }

  function sendComment() {
    if (!commentText.trim() || !detail) return;
    const now = new Date();
    const ts = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
    addComment(detail.id, { author: currentUser!.name, role: currentUser!.roleLabel, content: commentText, timestamp: ts });
    setCommentText('');
    // storeが更新されるので、detailも最新を参照するよう更新
    const updated = reports.find((r) => r.id === detail.id);
    if (updated) setDetail({ ...updated, comments: [...updated.comments, { id: updated.comments.length + 1, author: currentUser!.name, role: currentUser!.roleLabel, content: commentText, timestamp: ts }] });
  }

  return (
    <div className="space-y-4">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-800">週報管理</h2>
        {canEdit && (
          <button onClick={() => setShowCreate(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
            ＋ 週報作成
          </button>
        )}
      </div>

      {/* 週報リスト */}
      <div className="space-y-3">
        {reports.map((r) => (
          <button
            key={r.id}
            onClick={() => setDetail(r)}
            className="w-full bg-white rounded-xl shadow-sm p-4 text-left hover:shadow-md transition-shadow border border-transparent hover:border-blue-100"
          >
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <Badge variant={r.status === 'published' ? 'success' : 'warning'}>
                {r.status === 'published' ? '公開' : '下書き'}
              </Badge>
              {r.tags.map((t) => (
                <span key={t} className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold">{t}</span>
              ))}
              <span className="font-semibold text-slate-800 text-sm">{r.weekLabel}</span>
              <span className="text-xs text-slate-400 ml-auto">{r.startDate} 〜 {r.endDate}</span>
            </div>
            <p className="text-xs text-slate-500 line-clamp-1">
              <strong>練習：</strong>{r.practiceContent}　<strong>試合：</strong>{r.match}
            </p>
          </button>
        ))}
      </div>

      {/* 詳細モーダル */}
      {detail && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 sticky top-0 bg-white">
              <h3 className="font-bold text-slate-800">{detail.weekLabel}</h3>
              <button onClick={() => setDetail(null)} className="text-slate-400 hover:text-slate-700 text-xl">✕</button>
            </div>
            <div className="px-6 py-4 space-y-4">
              {/* タグ */}
              {detail.tags.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {detail.tags.map((t) => (
                    <span key={t} className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold">{t}</span>
                  ))}
                </div>
              )}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-xs font-semibold text-slate-400 mb-1">期間</div>
                  <p>{detail.startDate} 〜 {detail.endDate}</p>
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-400 mb-1">練習日数</div>
                  <p>{detail.trainingDays}日</p>
                </div>
              </div>
              {[
                ['練習内容', detail.practiceContent],
                ['試合', detail.match],
                ['良かった点', detail.goodPoints],
                ['課題・改善点', detail.improvements],
                ['来週の計画', detail.nextWeekPlan],
              ].map(([label, val]) => (
                <div key={label}>
                  <div className="text-xs font-semibold text-slate-400 mb-1">{label}</div>
                  <p className="text-sm text-slate-700">{val}</p>
                </div>
              ))}

              {/* コメント */}
              <div className="border-t border-slate-200 pt-4">
                <div className="text-sm font-semibold text-slate-700 mb-3">
                  コメント（{detail.comments.length}件）
                </div>
                {detail.comments.length === 0 && (
                  <p className="text-sm text-slate-400 mb-3">まだコメントはありません</p>
                )}
                {detail.comments.map((c) => (
                  <div key={c.id} className="flex gap-2 mb-3">
                    <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                      {c.author.charAt(0)}
                    </div>
                    <div className="flex-1 bg-slate-50 rounded-lg px-3 py-2">
                      <div className="text-xs font-semibold text-slate-700">{c.author} <span className="font-normal text-slate-400">{c.role}</span></div>
                      <div className="text-sm text-slate-700 mt-0.5">{c.content}</div>
                      <div className="text-xs text-slate-400 mt-1">{c.timestamp}</div>
                    </div>
                  </div>
                ))}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') sendComment(); }}
                    placeholder="コメントを入力..."
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-full text-sm focus:outline-none focus:border-blue-500"
                  />
                  <button onClick={sendComment} className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-700">送信</button>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-200">
              <button onClick={() => setDetail(null)} className="px-4 py-2 border border-slate-300 rounded-lg text-sm">閉じる</button>
              {canEdit && detail.status === 'draft' && (
                <button
                  onClick={() => { publishReport(detail.id); setDetail(null); }}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
                >公開する</button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 作成モーダル */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 sticky top-0 bg-white">
              <h3 className="font-bold text-slate-800">週報作成</h3>
              <button onClick={() => setShowCreate(false)} className="text-slate-400 text-xl">✕</button>
            </div>
            <div className="px-6 py-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <label className="block col-span-2">
                  <span className="text-xs font-medium text-slate-600">週ラベル</span>
                  <input value={form.weekLabel} onChange={(e) => setForm({ ...form, weekLabel: e.target.value })} className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500" placeholder="2026年第15週" />
                </label>
                <label className="block">
                  <span className="text-xs font-medium text-slate-600">開始日</span>
                  <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500" />
                </label>
                <label className="block">
                  <span className="text-xs font-medium text-slate-600">終了日</span>
                  <input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500" />
                </label>
              </div>
              {[
                ['練習内容', 'practiceContent', 'ポジショニング練習・シュート練習'],
                ['試合', 'match', 'vs FC〇〇（○3-1）'],
                ['良かった点', 'goodPoints', ''],
                ['課題・改善点', 'improvements', ''],
                ['来週の計画', 'nextWeekPlan', ''],
              ].map(([label, key, ph]) => (
                <label key={key} className="block">
                  <span className="text-xs font-medium text-slate-600">{label}</span>
                  <textarea
                    value={(form as Record<string, string>)[key]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    rows={2}
                    placeholder={ph}
                    className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 resize-none"
                  />
                </label>
              ))}
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-200">
              <button onClick={() => setShowCreate(false)} className="px-4 py-2 border border-slate-300 rounded-lg text-sm">キャンセル</button>
              <button onClick={() => save('draft')} className="px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-medium hover:bg-amber-600">下書き保存</button>
              <button onClick={() => save('published')} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">公開する</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
