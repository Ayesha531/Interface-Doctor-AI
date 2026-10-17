import type { RedesignPreview as Preview } from '@/lib/redesign';

const themeClasses = {
  clinical: 'from-teal-700 to-slate-950 text-white',
  contrast: 'from-slate-950 to-indigo-950 text-white',
  calm: 'from-cyan-100 to-white text-slate-950',
};

export function RedesignPreview({ preview }: { preview: Preview | null }) {
  if (!preview) {
    return (
      <div className="flex min-h-[28rem] items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-slate-400">No preview yet</p>
          <h3 className="mt-3 text-2xl font-black text-slate-900">Generate after diagnosis</h3>
          <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">The redesign is assembled from safe React components and Tailwind styles. No AI-generated JavaScript is executed.</p>
        </div>
      </div>
    );
  }

  return (
    <article className="overflow-hidden rounded-3xl bg-white shadow-soft ring-1 ring-slate-200">
      <div className={`bg-gradient-to-br ${themeClasses[preview.theme]} p-6 sm:p-8`}>
        <div className="max-w-2xl">
          <p className="text-xs font-black uppercase tracking-[0.3em] opacity-75">Responsive redesign preview</p>
          <h3 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">{preview.headline}</h3>
          <p className="mt-4 text-sm leading-6 opacity-85">{preview.subheadline}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button className="rounded-2xl bg-white px-5 py-3 text-sm font-black text-slate-950 shadow-sm">{preview.primaryAction}</button>
            <button className="rounded-2xl border border-white/40 px-5 py-3 text-sm font-black">{preview.secondaryAction}</button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 p-5 md:grid-cols-3">
        {preview.sections.map((section) => (
          <section key={section.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-[0.7rem] font-black uppercase tracking-[0.2em] text-teal-700">{section.eyebrow}</p>
            <h4 className="mt-3 text-lg font-black text-slate-950">{section.title}</h4>
            <p className="mt-2 text-sm leading-6 text-slate-600">{section.body}</p>
            <span className="mt-4 inline-flex rounded-full bg-white px-3 py-2 text-xs font-bold text-slate-700 ring-1 ring-slate-200">{section.cta}</span>
          </section>
        ))}
      </div>

      <div className="border-t border-slate-200 p-5">
        <h4 className="text-sm font-black uppercase tracking-[0.18em] text-slate-500">Controlled changes applied</h4>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {preview.improvements.map((item) => (
            <li key={item} className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-950">✓ {item}</li>
          ))}
        </ul>
      </div>
    </article>
  );
}
