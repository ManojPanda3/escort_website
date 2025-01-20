import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers'

const checkAdmin = async () => {
  const adminEmail = process.env.ADMIN_EMAIL
  const supabase = createServerComponentClient({ cookies })
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error
  return user && user.email == adminEmail
}
export default checkAdmin
