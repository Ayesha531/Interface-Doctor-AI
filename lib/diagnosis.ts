export const MAX_UPLOAD_BYTES = 6 * 1024 * 1024;
export const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg'] as const;

export type Severity = 'critical' | 'high' | 'medium' | 'low';

export type Finding = {
  id: string;
  title: string;
  severity: Severity;
  explanation: string;
  suggestedFix: string;
  area: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
};

export type Diagnosis = {
  summary: string;
  findings: Finding[];
};

const severityRank: Record<Severity, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
};

export function validateImageFile(file: Pick<File, 'type' | 'size'>): string | null {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type as (typeof ALLOWED_IMAGE_TYPES)[number])) {
    return 'Please upload a PNG or JPG screenshot.';
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return 'Screenshot is too large. Please keep uploads under 6 MB.';
  }
  return null;
}

export function normalizeFindings(findings: Finding[]) {
  return [...findings].sort((a, b) => severityRank[a.severity] - severityRank[b.severity]);
}

function isSeverity(value: unknown): value is Severity {
  return value === 'critical' || value === 'high' || value === 'medium' || value === 'low';
}

function clampPercent(value: unknown, fallback: number) {
  const numberValue = typeof value === 'number' && Number.isFinite(value) ? value : fallback;
  return Math.min(100, Math.max(0, numberValue));
}

export function validateDiagnosisPayload(payload: unknown): Diagnosis {
  if (!payload || typeof payload !== 'object') {
    throw new Error('AI response was not a JSON object.');
  }

  const raw = payload as Record<string, unknown>;
  const summary = typeof raw.summary === 'string' && raw.summary.trim()
    ? raw.summary.trim().slice(0, 900)
    : 'The screenshot was reviewed for interface design issues.';

  if (!Array.isArray(raw.findings)) {
    throw new Error('AI response did not include a findings array.');
  }

  const findings = raw.findings.slice(0, 8).map((item, index) => {
    if (!item || typeof item !== 'object') {
      throw new Error('One or more AI findings were malformed.');
    }
    const f = item as Record<string, unknown>;
    const area = (f.area && typeof f.area === 'object' ? f.area : {}) as Record<string, unknown>;
    const severity = isSeverity(f.severity) ? f.severity : 'medium';

    return {
      id: typeof f.id === 'string' && f.id.trim() ? f.id.trim().slice(0, 40) : `finding-${index + 1}`,
      title: typeof f.title === 'string' && f.title.trim() ? f.title.trim().slice(0, 120) : 'Interface issue',
      severity,
      explanation: typeof f.explanation === 'string' && f.explanation.trim() ? f.explanation.trim().slice(0, 600) : 'The AI identified this as a likely usability or visual design concern.',
      suggestedFix: typeof f.suggestedFix === 'string' && f.suggestedFix.trim() ? f.suggestedFix.trim().slice(0, 600) : 'Adjust layout, visual hierarchy, spacing, or contrast in this area.',
      area: {
        x: clampPercent(area.x, 12 + index * 6),
        y: clampPercent(area.y, 12 + index * 5),
        width: Math.max(5, clampPercent(area.width, 24)),
        height: Math.max(5, clampPercent(area.height, 14)),
      },
    } satisfies Finding;
  });

  if (findings.length === 0) {
    throw new Error('AI response did not include any findings.');
  }

  return { summary, findings: normalizeFindings(findings) };
}
