'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function AdminPage() {
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const checkAdminStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user || user.user_metadata.role !== 'admin') {
        router.push('/admin/login')
      }
    }

    checkAdminStatus()
  }, [router, supabase])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      {/* Add admin dashboard content here */}
    </div>
  )
}


