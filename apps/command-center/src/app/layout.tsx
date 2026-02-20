import type { Metadata, Viewport } from 'next'
import '../styles/globals.css'

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

export const metadata: Metadata = {
  title: 'Construct-OS | Command Center',
  description: 'Professional construction intelligence platform — CRM, billing, templates, and AI-powered lead automation',
  manifest: `${basePath}/manifest.json`,
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#39FF14',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href={`${basePath}/favicon.svg`} />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      </head>
      <body className="font-mono antialiased bg-dark-bg text-white">
        {children}
        <script dangerouslySetInnerHTML={{
          __html: `
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', () => {
                navigator.serviceWorker.register('${basePath}/sw.js');
              });
            }
          `
        }} />
      </body>
    </html>
  )
}
