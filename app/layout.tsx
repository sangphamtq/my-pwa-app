import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Premier League 2025/26',
  description: 'Lịch thi đấu và bảng xếp hạng Premier League 2025/26',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'EPL',
  },
  icons: {
    apple: '/icon-192.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#37003C',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const buildId = process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 8) ?? Date.now().toString()
  const isProd = process.env.NODE_ENV === 'production'

  return (
    <html lang="vi">
      <head>
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="min-h-screen">
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator && ${isProd}) {
                window.addEventListener('load', async () => {
                  // Unregister SW cũ nếu BUILD_ID khác
                  const regs = await navigator.serviceWorker.getRegistrations();
                  for (const reg of regs) await reg.unregister();

                  // Đăng ký SW mới với version trong query string
                  // Query string thay đổi → browser download lại sw.js
                  const reg = await navigator.serviceWorker.register(
                    '/sw.js?v=${buildId}'
                  );

                  document.addEventListener('visibilitychange', () => {
                    if (document.visibilityState === 'visible') reg.update();
                  });

                  navigator.serviceWorker.addEventListener('controllerchange', () => {
                    window.location.reload();
                  });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  )
}
