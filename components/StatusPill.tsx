type Status = 'empty' | 'ready' | 'loading' | 'success' | 'error' | 'pending';

const styles: Record<Status, string> = {
  empty: 'bg-slate-100 text-slate-600 ring-slate-200',
  ready: 'bg-cyan-50 text-cyan-700 ring-cyan-200',
  loading: 'bg-amber-50 text-amber-700 ring-amber-200',
  success: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  error: 'bg-red-50 text-red-700 ring-red-200',
  pending: 'bg-violet-50 text-violet-700 ring-violet-200',
};

export function StatusPill({ status, label }: { status: Status; label: string }) {
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ${styles[status]}`}>
      {label}
    </span>
  );
}
