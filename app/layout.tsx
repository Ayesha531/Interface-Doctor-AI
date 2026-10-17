import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Interface Doctor AI',
  description: 'Upload UI screenshots and receive AI design diagnosis with visual issue overlays.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
