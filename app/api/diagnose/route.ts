import { NextRequest, NextResponse } from 'next/server';
import { ALLOWED_IMAGE_TYPES, MAX_UPLOAD_BYTES, validateDiagnosisPayload } from '@/lib/diagnosis';

export const runtime = 'nodejs';

type DiagnoseBody = {
  imageData?: string;
  mimeType?: string;
};

function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

function estimateBase64Bytes(dataUrl: string) {
  const base64 = dataUrl.split(',')[1] ?? '';
  return Math.floor((base64.length * 3) / 4);
}

function extractJson(text: string) {
  const cleaned = text.trim().replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/i, '').trim();
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  if (start === -1 || end === -1 || end <= start) {
    throw new Error('The AI response did not contain valid JSON.');
  }
  return JSON.parse(cleaned.slice(start, end + 1));
}

export async function POST(request: NextRequest) {
  let body: DiagnoseBody;
  try {
    body = (await request.json()) as DiagnoseBody;
  } catch {
    return jsonError('Request body must be valid JSON.');
  }

  const { imageData, mimeType } = body;
  if (!imageData || !mimeType) {
    return jsonError('A screenshot image and MIME type are required.');
  }
  if (!ALLOWED_IMAGE_TYPES.includes(mimeType as (typeof ALLOWED_IMAGE_TYPES)[number])) {
    return jsonError('Only PNG and JPG screenshots are supported.');
  }
  if (!imageData.startsWith(`data:${mimeType};base64,`)) {
    return jsonError('Screenshot data did not match the declared MIME type.');
  }
  if (estimateBase64Bytes(imageData) > MAX_UPLOAD_BYTES) {
    return jsonError('Screenshot is too large. Please keep uploads under 6 MB.');
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return jsonError('AI diagnosis is not configured. Add OPENAI_API_KEY in the workspace Secrets panel and restart the preview.', 503);
  }

  const model = process.env.OPENAI_VISION_MODEL || 'gpt-4o-mini';

  try {
    const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        temperature: 0.2,
        max_tokens: 1200,
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content:
              'You are Interface Doctor AI for team DebugMD. Diagnose UI/UX problems from screenshots. Return only JSON. Do not include markdown. Use percentage coordinates relative to the screenshot for every issue area.',
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text:
                  'Analyze this website or app screenshot. Return JSON with this shape: {"summary":"one paragraph","findings":[{"id":"short-id","title":"concise issue title","severity":"critical|high|medium|low","explanation":"why this matters","suggestedFix":"specific fix","area":{"x":0-100,"y":0-100,"width":0-100,"height":0-100}}]}. Prioritize the most important 3 to 6 findings. Include only issues visible in the screenshot.',
              },
              { type: 'image_url', image_url: { url: imageData, detail: 'high' } },
            ],
          },
        ],
      }),
    });

    if (!aiResponse.ok) {
      const detail = await aiResponse.text();
      console.error('OpenAI diagnosis failed:', detail.slice(0, 1000));
      return jsonError('The AI service could not complete the diagnosis right now. Please try again shortly.', 502);
    }

    const completion = await aiResponse.json();
    const content = completion?.choices?.[0]?.message?.content;
    if (typeof content !== 'string') {
      return jsonError('The AI service returned an unreadable response.', 502);
    }

    const diagnosis = validateDiagnosisPayload(extractJson(content));
    return NextResponse.json(diagnosis);
  } catch (error) {
    console.error(error);
    return jsonError(error instanceof Error ? error.message : 'Diagnosis failed unexpectedly.', 500);
  }
}
