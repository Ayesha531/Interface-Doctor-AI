import type { Finding } from '@/lib/diagnosis';

const severityStyles: Record<Finding['severity'], string> = {
  critical: 'bg-red-100 text-red-800 ring-red-200',
  high: 'bg-orange-100 text-orange-800 ring-orange-200',
  medium: 'bg-amber-100 text-amber-800 ring-amber-200',
  low: 'bg-sky-100 text-sky-800 ring-sky-200',
};

export function FindingsList({ findings }: { findings: Finding[] }) {
  if (findings.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
        <p className="font-semibold text-slate-700">Diagnosis findings will appear here.</p>
        <p className="mt-2 text-sm">Each finding includes severity, explanation, fix, and a matching image marker.</p>
      </div>
    );
  }

  return (
    <ol className="space-y-4">
      {findings.map((finding, index) => (
        <li key={finding.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-slate-900 text-sm font-bold text-white">{index + 1}</span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base font-bold text-slate-950">{finding.title}</h3>
                <span className={`rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wide ring-1 ${severityStyles[finding.severity]}`}>
                  {finding.severity}
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600">{finding.explanation}</p>
              <div className="mt-4 rounded-2xl bg-teal-50 p-4 text-sm leading-6 text-teal-900">
                <span className="font-bold">Suggested fix: </span>
                {finding.suggestedFix}
              </div>
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}
