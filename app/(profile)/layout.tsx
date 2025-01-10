import { NavBar } from '@/components/nav-bar'
import { Footer } from '@/components/footer'

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      <NavBar />
      {children}
      <Footer />
    </div>
  )
}

