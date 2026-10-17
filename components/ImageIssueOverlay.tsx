import type { Finding } from '@/lib/diagnosis';

const severityClass: Record<Finding['severity'], string> = {
  critical: 'border-red-600 bg-red-500/10 text-red-700',
  high: 'border-orange-500 bg-orange-400/10 text-orange-700',
  medium: 'border-amber-400 bg-amber-300/10 text-amber-700',
  low: 'border-sky-400 bg-sky-300/10 text-sky-700',
};

export function ImageIssueOverlay({ imageSrc, findings }: { imageSrc: string | null; findings: Finding[] }) {
  if (!imageSrc) {
    return (
      <div className="flex min-h-[360px] items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white text-center text-slate-500">
        <div>
          <p className="text-lg font-semibold text-slate-700">No screenshot selected</p>
          <p className="mt-2 text-sm">Upload a PNG/JPG or load the sample to begin diagnosis.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-slate-950 shadow-soft">
      <img src={imageSrc} alt="Uploaded UI screenshot with diagnosis overlays" className="h-auto w-full select-none" />
      {findings.map((finding, index) => (
        <div
          key={finding.id}
          className={`absolute rounded-xl border-2 ${severityClass[finding.severity]} shadow-[0_0_0_9999px_rgba(15,23,42,0.03)]`}
          style={{
            left: `${finding.area.x}%`,
            top: `${finding.area.y}%`,
            width: `${finding.area.width}%`,
            height: `${finding.area.height}%`,
          }}
          aria-label={`${finding.severity} issue: ${finding.title}`}
        >
          <span className="absolute -left-3 -top-3 grid h-8 w-8 place-items-center rounded-full bg-white text-sm font-black shadow ring-2 ring-current">
            {index + 1}
          </span>
        </div>
      ))}
    </div>
  );
}
