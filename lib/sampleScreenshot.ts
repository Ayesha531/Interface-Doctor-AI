export async function createSampleScreenshot(): Promise<{ dataUrl: string; fileName: string; mimeType: string }> {
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 820;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not create sample screenshot.');

  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, canvas.width, 88);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 28px Arial';
  ctx.fillText('Acme Analytics', 54, 54);
  ctx.font = '18px Arial';
  ctx.fillText('Home', 785, 54);
  ctx.fillText('Pricing', 875, 54);
  ctx.fillText('Docs', 980, 54);
  ctx.fillStyle = '#14b8a6';
  ctx.fillRect(1060, 24, 95, 40);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 15px Arial';
  ctx.fillText('Sign up', 1081, 50);

  ctx.fillStyle = '#e2e8f0';
  ctx.fillRect(54, 132, 1092, 270);
  ctx.fillStyle = '#334155';
  ctx.font = 'bold 54px Arial';
  ctx.fillText('Make every metric', 95, 220);
  ctx.fillText('work harder.', 95, 284);
  ctx.fillStyle = '#64748b';
  ctx.font = '22px Arial';
  ctx.fillText('All-in-one dashboards for fast growing teams.', 98, 335);
  ctx.fillStyle = '#94a3b8';
  ctx.fillRect(790, 157, 280, 190);
  ctx.fillStyle = '#cbd5e1';
  ctx.fillRect(825, 190, 205, 18);
  ctx.fillRect(825, 232, 165, 18);
  ctx.fillRect(825, 274, 230, 18);

  ctx.fillStyle = '#ffffff';
  const cardY = 455;
  for (let i = 0; i < 3; i += 1) {
    const x = 54 + i * 380;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x, cardY, 332, 215);
    ctx.fillStyle = i === 1 ? '#fee2e2' : '#f1f5f9';
    ctx.fillRect(x + 24, cardY + 25, 86, 86);
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 24px Arial';
    ctx.fillText(['Revenue', 'Churn risk', 'Activation'][i], x + 24, cardY + 145);
    ctx.fillStyle = i === 1 ? '#ef4444' : '#94a3b8';
    ctx.font = '16px Arial';
    ctx.fillText('This description is too faint and cramped', x + 24, cardY + 177);
  }

  ctx.fillStyle = '#f1f5f9';
  ctx.fillRect(54, 712, 1092, 48);
  ctx.fillStyle = '#94a3b8';
  ctx.font = '14px Arial';
  ctx.fillText('Tiny footer links with low contrast: Privacy · Terms · Contact · Support', 75, 742);

  return { dataUrl: canvas.toDataURL('image/png'), fileName: 'sample-dashboard.png', mimeType: 'image/png' };
}
