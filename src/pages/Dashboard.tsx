import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Badge } from '../components/ui/Badge';
import { EvalBars } from '../components/ui/EvalBars';

export default function Dashboard() {
  const { currentUser, players, reports, notices, checklists } = useStore();
  const navigate = useNavigate();

  if (!currentUser) return null;

  // ── 選手・保護者用ダッシュボード ──
  if (currentUser.role === 'player') {
    const player = players.find((p) => p.name === currentUser.name) ?? players[0];
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-slate-800">マイページ</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {([['心', player.evaluation.heart, 'bg-red-100', 'text-red-600'],
             ['頭', player.evaluation.head,  'bg-violet-100', 'text-violet-600'],
             ['技', player.evaluation.tech,  'bg-amber-100', 'text-amber-600'],
             ['体', player.evaluation.body,  'bg-green-100', 'text-green-600']] as const).map(([label, val, bg, text]) => (
            <div key={label} className={`${bg} rounded-xl p-4 flex flex-col items-center`}>
              <span className={`text-3xl font-bold ${text}`}>{val}</span>
              <span className="text-sm text-slate-500 mt-1">{label}</span>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h3 className="font-semibold text-slate-700 mb-4">お知らせ</h3>
          {notices.map((n) => (
            <div key={n.id} className="py-3 border-b border-slate-100 last:border-0">
              <div className="flex gap-2 items-center mb-1">
                {n.important && <Badge variant="danger">重要</Badge>}
                <span className="font-semibold text-sm">{n.title}</span>
              </div>
              <p className="text-sm text-slate-600">{n.content}</p>
              <p className="text-xs text-slate-400 mt-1">{n.date}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (currentUser.role === 'parent') {
    const child = players.find((p) => p.parentName === currentUser.name) ?? players[0];
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-slate-800">ようこそ、{currentUser.name} さん</h2>
        {child && (
          <div className="bg-white rounded-xl shadow-sm p-5">
            <h3 className="font-semibold text-slate-700 mb-3">{child.name} の現在の評価</h3>
            <EvalBars evaluation={child.evaluation} />
          </div>
        )}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h3 className="font-semibold text-slate-700 mb-4">お知らせ</h3>
          {notices.map((n) => (
            <div key={n.id} className="py-3 border-b border-slate-100 last:border-0">
              <div className="flex gap-2 items-center mb-1">
                {n.important && <Badge variant="danger">重要</Badge>}
                <span className="font-semibold text-sm">{n.title}</span>
              </div>
              <p className="text-sm text-slate-600">{n.content}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── admin / coach ダッシュボード ──
  const draftReports   = reports.filter((r) => r.status === 'draft').length;
  const importantCount = notices.filter((n) => n.important).length;
  const doneChecks     = checklists.daily.filter((c) => c.done).length;
  const totalChecks    = checklists.daily.length;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-slate-800">ダッシュボード</h2>

      {/* 統計カード */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {([
          ['登録選手数',   players.length,  'bg-blue-100',   'text-blue-600'],
          ['未公開週報',   draftReports,    'bg-amber-100',  'text-amber-600'],
          ['重要なお知らせ', importantCount, 'bg-red-100',    'text-red-600'],
          ['今日のチェック', `${doneChecks}/${totalChecks}`, 'bg-green-100', 'text-green-600'],
        ] as const).map(([label, val, bg, text]) => (
          <div key={label} className="bg-white rounded-xl shadow-sm p-5 flex items-center gap-4">
            <div className={`${bg} rounded-xl w-12 h-12 flex items-center justify-center shrink-0`}>
              <span className={`text-xl font-bold ${text}`}>{typeof val === 'number' ? val : ''}</span>
            </div>
            <div>
              <div className="text-xl font-bold text-slate-800">{val}</div>
              <div className="text-xs text-slate-500">{label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 最新週報 */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-700">最新週報</h3>
            <button
              onClick={() => navigate('/reports')}
              className="text-xs text-blue-600 border border-blue-200 rounded px-2 py-1 hover:bg-blue-50"
            >
              すべて見る
            </button>
          </div>
          {reports.slice(0, 3).map((r) => (
            <div key={r.id} className="py-3 border-b border-slate-100 last:border-0">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant={r.status === 'published' ? 'success' : 'warning'}>
                  {r.status === 'published' ? '公開' : '下書き'}
                </Badge>
                <span className="font-semibold text-sm">{r.weekLabel}</span>
                <span className="text-xs text-slate-400 ml-auto">{r.author}</span>
              </div>
              <p className="text-xs text-slate-500 line-clamp-1">{r.goodPoints}</p>
            </div>
          ))}
        </div>

        {/* 重要なお知らせ */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h3 className="font-semibold text-slate-700 mb-4">重要なお知らせ</h3>
          {notices.filter((n) => n.important).map((n) => (
            <div key={n.id} className="py-2 border-b border-slate-100 last:border-0">
              <div className="text-sm font-semibold">{n.title}</div>
              <div className="text-xs text-slate-400">{n.date}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
