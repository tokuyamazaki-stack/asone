import type { Evaluation } from '../../types';

const BARS = [
  { label: '心', key: 'heart' as const, color: 'bg-red-400' },
  { label: '頭', key: 'head'  as const, color: 'bg-violet-400' },
  { label: '技', key: 'tech'  as const, color: 'bg-amber-400' },
  { label: '体', key: 'body'  as const, color: 'bg-green-400' },
];

export function EvalBars({ evaluation }: { evaluation: Evaluation }) {
  return (
    <div className="flex flex-col gap-2">
      {BARS.map(({ label, key, color }) => (
        <div key={key} className="flex items-center gap-2">
          <span className="w-6 text-xs font-semibold text-slate-500 shrink-0">{label}</span>
          <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${color} eval-bar-fill`}
              style={{ width: `${evaluation[key]}%` }}
            />
          </div>
          <span className="w-7 text-xs font-semibold text-slate-700 text-right shrink-0">
            {evaluation[key]}
          </span>
        </div>
      ))}
    </div>
  );
}
