import { useStore } from '../store/useStore';
import type { Checklists } from '../types';

const GROUPS: { key: keyof Checklists; label: string; icon: string }[] = [
  { key: 'daily',   label: '日次チェック', icon: '☀️' },
  { key: 'weekly',  label: '週次チェック', icon: '📅' },
  { key: 'monthly', label: '月次チェック', icon: '📆' },
];

export default function Checklist() {
  const { checklists, toggleCheck } = useStore();

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-slate-800">業務チェックリスト</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {GROUPS.map(({ key, label, icon }) => {
          const items = checklists[key];
          const done = items.filter((c) => c.done).length;
          const pct = items.length ? Math.round((done / items.length) * 100) : 0;
          return (
            <div key={key} className="bg-white rounded-xl shadow-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-slate-700">{icon} {label}</h3>
                <span className="text-xs bg-blue-100 text-blue-700 font-semibold px-2 py-0.5 rounded-full">
                  {done}/{items.length}
                </span>
              </div>
              <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden mb-4">
                <div
                  className="h-full bg-green-500 rounded-full transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <div className="space-y-1">
                {items.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => toggleCheck(key, c.id)}
                    className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-slate-50 text-left transition-colors"
                  >
                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors
                      ${c.done ? 'bg-blue-600 border-blue-600' : 'border-slate-300'}`}>
                      {c.done && <span className="text-white text-[10px] font-bold">✓</span>}
                    </div>
                    <span className={`text-sm ${c.done ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                      {c.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
