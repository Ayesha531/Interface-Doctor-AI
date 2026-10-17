'use client';

import { useMemo, useRef, useState } from 'react';
import { BeforeAfterComparison } from '@/components/BeforeAfterComparison';
import { FindingsList } from '@/components/FindingsList';
import { FlowStateMatrix } from '@/components/FlowStateMatrix';
import { ImageIssueOverlay } from '@/components/ImageIssueOverlay';
import { StatusPill } from '@/components/StatusPill';
import type { Diagnosis } from '@/lib/diagnosis';
import { validateDiagnosisPayload, validateImageFile } from '@/lib/diagnosis';
import { generateControlledRedesign } from '@/lib/redesign';
import { createSampleScreenshot } from '@/lib/sampleScreenshot';

type Screenshot = {
  dataUrl: string;
  fileName: string;
  mimeType: string;
  sizeLabel: string;
};

type DiagnoseState = 'empty' | 'ready' | 'loading' | 'success' | 'error';

function bytesToLabel(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function readAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Could not read the selected image.'));
    reader.readAsDataURL(file);
  });
}

export function DoctorApp() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [screenshot, setScreenshot] = useState<Screenshot | null>(null);
  const [diagnosis, setDiagnosis] = useState<Diagnosis | null>(null);
  const [redesign, setRedesign] = useState<ReturnType<typeof generateControlledRedesign>>(null);
  const [diagnoseState, setDiagnoseState] = useState<DiagnoseState>('empty');
  const [error, setError] = useState<string | null>(null);

  const uploadStatus = screenshot ? 'success' : 'empty';
  const uploadLabel = screenshot ? 'Screenshot ready' : 'Waiting for screenshot';

  const diagnosisStatusLabel = useMemo(() => {
    if (diagnoseState === 'loading') return 'AI diagnosis running';
    if (diagnoseState === 'success') return 'Diagnosis complete';
    if (diagnoseState === 'error') return 'Diagnosis needs attention';
    if (diagnoseState === 'ready') return 'Ready to diagnose';
    return 'No diagnosis yet';
  }, [diagnoseState]);

  async function handleFile(file: File) {
    const validation = validateImageFile(file);
    if (validation) {
      setError(validation);
      setDiagnoseState('error');
      return;
    }

    try {
      const dataUrl = await readAsDataUrl(file);
      setScreenshot({ dataUrl, fileName: file.name, mimeType: file.type, sizeLabel: bytesToLabel(file.size) });
      setDiagnosis(null);
      setRedesign(null);
      setError(null);
      setDiagnoseState('ready');
    } catch (eventError) {
      setError(eventError instanceof Error ? eventError.message : 'Upload failed.');
      setDiagnoseState('error');
    }
  }

  async function loadSample() {
    try {
      const sample = await createSampleScreenshot();
      setScreenshot({ ...sample, sizeLabel: 'sample' });
      setDiagnosis(null);
      setRedesign(null);
      setError(null);
      setDiagnoseState('ready');
    } catch (eventError) {
      setError(eventError instanceof Error ? eventError.message : 'Could not load the sample screenshot.');
      setDiagnoseState('error');
    }
  }

  async function runDiagnosis() {
    if (!screenshot) {
      setError('Upload a screenshot or load the sample before starting diagnosis.');
      setDiagnoseState('error');
      return;
    }

    setDiagnoseState('loading');
    setError(null);
    setDiagnosis(null);
    setRedesign(null);

    try {
      const response = await fetch('/api/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageData: screenshot.dataUrl, mimeType: screenshot.mimeType }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.error || 'Diagnosis failed.');
      const validated = validateDiagnosisPayload(payload);
      setDiagnosis(validated);
      setRedesign(generateControlledRedesign(validated));
      setDiagnoseState('success');
    } catch (eventError) {
      setError(eventError instanceof Error ? eventError.message : 'Diagnosis failed.');
      setDiagnoseState('error');
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#ccfbf1,transparent_32rem),#eef6f6] px-4 py-6 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-7xl">
        <header className="rounded-[2rem] bg-slate-950 p-6 text-white shadow-soft sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-teal-300">DebugMD</p>
              <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">Interface Doctor AI</h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300">
                Upload a UI screenshot, run a server-side vision diagnosis, and review prioritized design findings with matching visual overlays.
              </p>
            </div>
            <div className="grid gap-2 sm:grid-cols-2 lg:min-w-[28rem]">
              <StatusPill status={uploadStatus} label={uploadLabel} />
              <StatusPill status={diagnoseState} label={diagnosisStatusLabel} />
              <StatusPill status="pending" label="Generation pending phase 2" />
              <StatusPill status="pending" label="Verification & saving pending phase 3" />
            </div>
          </div>
        </header>

        <div className="mt-6 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <aside className="space-y-6">
            <section className="rounded-3xl bg-white p-6 shadow-soft">
              <h2 className="text-xl font-black text-slate-950">1. Screenshot input</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">PNG and JPG uploads are validated before they are sent to the secure diagnosis API. Maximum size: 6 MB.</p>

              <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5">
                <input
                  ref={inputRef}
                  className="sr-only"
                  type="file"
                  accept="image/png,image/jpeg"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) void handleFile(file);
                    event.currentTarget.value = '';
                  }}
                />
                <button className="focus-ring w-full rounded-2xl bg-slate-950 px-4 py-3 font-bold text-white hover:bg-slate-800" onClick={() => inputRef.current?.click()}>
                  Upload PNG/JPG screenshot
                </button>
                <button className="focus-ring mt-3 w-full rounded-2xl border border-teal-200 bg-teal-50 px-4 py-3 font-bold text-teal-900 hover:bg-teal-100" onClick={loadSample}>
                  Load sample screenshot
                </button>
              </div>

              {screenshot ? (
                <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                  <p className="font-bold text-slate-950">{screenshot.fileName}</p>
                  <p className="mt-1">{screenshot.mimeType} · {screenshot.sizeLabel}</p>
                </div>
              ) : (
                <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">Empty state: no screenshot has been selected.</div>
              )}
            </section>

            <section className="rounded-3xl bg-white p-6 shadow-soft">
              <h2 className="text-xl font-black text-slate-950">2. AI diagnosis</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">The API route keeps the AI key server-side, validates the image and AI response, and returns structured findings only.</p>
              <button
                className="focus-ring mt-5 w-full rounded-2xl bg-clinical px-4 py-3 font-bold text-white hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                disabled={!screenshot || diagnoseState === 'loading'}
                onClick={runDiagnosis}
              >
                {diagnoseState === 'loading' ? 'Diagnosing screenshot…' : 'Run AI diagnosis'}
              </button>
              {error && <div role="alert" className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-800">{error}</div>}
              {diagnosis?.summary && <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-900"><strong>Summary:</strong> {diagnosis.summary}</div>}
            </section>

            <FlowStateMatrix />
          </aside>

          <section className="space-y-6">
            <ImageIssueOverlay imageSrc={screenshot?.dataUrl ?? null} findings={diagnosis?.findings ?? []} />
            <section className="rounded-3xl bg-white/70 p-1">
              <div className="mb-4 flex items-center justify-between px-2 pt-2">
                <h2 className="text-xl font-black text-slate-950">Prioritized findings</h2>
                <span className="text-sm font-semibold text-slate-500">{diagnosis?.findings.length ?? 0} detected</span>
              </div>
              <FindingsList findings={diagnosis?.findings ?? []} />
            </section>
          </section>
        </div>
      </section>
    </main>
  );
}
