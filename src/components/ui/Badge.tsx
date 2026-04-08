type BadgeVariant = 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'gray';

const styles: Record<BadgeVariant, string> = {
  primary: 'bg-blue-100 text-blue-700',
  success: 'bg-green-100 text-green-700',
  warning: 'bg-amber-100 text-amber-700',
  danger:  'bg-red-100 text-red-700',
  info:    'bg-violet-100 text-violet-700',
  gray:    'bg-slate-100 text-slate-600',
};

export function Badge({ variant = 'primary', children }: { variant?: BadgeVariant; children: React.ReactNode }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${styles[variant]}`}>
      {children}
    </span>
  );
}
