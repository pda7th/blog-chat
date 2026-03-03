import './globals.css';
import type { Viewport } from 'next';

export const viewport: Viewport = {
  initialScale: 1,
  width: 'device-width',
  maximumScale: 1,
  viewportFit: 'cover',
  userScalable: false,
};

const viewportMetaContent = `width=${viewport.width}, initial-scale=${viewport.initialScale}, maximum-scale=${viewport.maximumScale}, viewport-fit=${viewport.viewportFit}, user-scalable=${viewport.userScalable ? 'yes' : 'no'}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>pda</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content={viewportMetaContent} />
        <meta property="og:title" content="pda7th" />
        <meta property="og:description" content="프로디지털아카데미 수강생을 위한 커뮤니티" />
        <meta property="og:url" content="https://github.com/pda7th" />
      </head>
      <body>
        <section className="h-full w-full">{children}</section>
      </body>
    </html>
  );
}
