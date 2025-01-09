import { ThemeProvider } from '@/components/theme-provider'
import { MouseBubbles } from '@/components/mouse-bubbles'
import { RoyalBackground } from '@/components/royal-background'
import '@/app/globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
        >
          <RoyalBackground />
          <MouseBubbles />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'