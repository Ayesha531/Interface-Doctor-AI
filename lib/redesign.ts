import type { Diagnosis, Severity } from '@/lib/diagnosis';

export type RedesignSection = {
  eyebrow: string;
  title: string;
  body: string;
  cta: string;
};

export type RedesignPreview = {
  id: string;
  theme: 'clinical' | 'contrast' | 'calm';
  headline: string;
  subheadline: string;
  primaryAction: string;
  secondaryAction: string;
  improvements: string[];
  sections: RedesignSection[];
};

const severityWeight: Record<Severity, number> = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
};

function textFromFinding(value: string, fallback: string) {
  return value.replace(/[.。]+$/g, '').slice(0, 92) || fallback;
}

export function generateControlledRedesign(diagnosis: Diagnosis | null): RedesignPreview | null {
  if (!diagnosis) return null;

  const topFindings = [...diagnosis.findings]
    .sort((a, b) => severityWeight[b.severity] - severityWeight[a.severity])
    .slice(0, 4);

  const hasCritical = topFindings.some((finding) => finding.severity === 'critical' || finding.severity === 'high');
  const theme: RedesignPreview['theme'] = hasCritical ? 'contrast' : topFindings.length > 2 ? 'clinical' : 'calm';

  const improvements = topFindings.map((finding) => textFromFinding(finding.suggestedFix, finding.title));

  return {
    id: `redesign-${Date.now()}`,
    theme,
    headline: hasCritical ? 'A clearer interface focused on the next action' : 'A cleaner, more responsive interface preview',
    subheadline: diagnosis.summary,
    primaryAction: 'Start primary task',
    secondaryAction: 'Review details',
    improvements,
    sections: topFindings.slice(0, 3).map((finding, index) => ({
      eyebrow: `${finding.severity} priority`,
      title: textFromFinding(finding.title, `Improvement ${index + 1}`),
      body: textFromFinding(finding.explanation, 'This area was reorganized for clearer hierarchy, spacing, and readability.'),
      cta: index === 0 ? 'Make this prominent' : 'Apply pattern',
    })),
  };
}
