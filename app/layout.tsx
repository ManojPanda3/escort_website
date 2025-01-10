import { ThemeProvider } from '@/components/theme-provider'
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
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'
