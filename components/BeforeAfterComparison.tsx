'use client';

import { useState } from 'react';
import { ImageIssueOverlay } from '@/components/ImageIssueOverlay';
import { RedesignPreview } from '@/components/RedesignPreview';
import type { Finding } from '@/lib/diagnosis';
import type { RedesignPreview as Preview } from '@/lib/redesign';

export function BeforeAfterComparison({ imageSrc, findings, preview }: { imageSrc: string | null; findings: Finding[]; preview: Preview | null }) {
  const [mode, setMode] = useState<'side' | 'before' | 'after'>('side');

  return (
    <section className="rounded-3xl bg-white/80 p-4 shadow-soft">
      <div className="flex flex-col gap-3 px-1 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-950">Before-and-after comparison</h2>
          <p className="mt-1 text-sm text-slate-600">Compare the uploaded screenshot with the controlled responsive preview.</p>
        </div>
        <div className="grid grid-cols-3 rounded-2xl bg-slate-100 p-1 text-sm font-bold">
          {(['side', 'before', 'after'] as const).map((item) => (
            <button key={item} onClick={() => setMode(item)} className={`rounded-xl px-3 py-2 capitalize ${mode === item ? 'bg-slate-950 text-white' : 'text-slate-600 hover:bg-white'}`}>
              {item === 'side' ? 'Side' : item}
            </button>
          ))}
        </div>
      </div>

      <div className={mode === 'side' ? 'grid gap-4 xl:grid-cols-2' : 'grid gap-4'}>
        {(mode === 'side' || mode === 'before') && (
          <div>
            <p className="mb-2 px-1 text-sm font-black uppercase tracking-[0.18em] text-slate-500">Before</p>
            <ImageIssueOverlay imageSrc={imageSrc} findings={findings} />
          </div>
        )}
        {(mode === 'side' || mode === 'after') && (
          <div>
            <p className="mb-2 px-1 text-sm font-black uppercase tracking-[0.18em] text-slate-500">After</p>
            <RedesignPreview preview={preview} />
          </div>
        )}
      </div>
    </section>
  );
}
