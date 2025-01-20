import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { EscortCard } from '@/components/escort-card'
import { NavBar } from '@/components/nav-bar'
import { Footer } from '@/components/footer'
import { redirect } from 'next/navigation'


export default async function SearchPage(
  props: {
    searchParams: Promise<{ q: string, type: string }>
  }
) {
  const searchParams = await props.searchParams;
  const searchQuery = searchParams.q?.trim() || ''
  const searchType = searchParams.type?.trim().toLowerCase() || ''
  const supabase = createServerComponentClient({ cookies })
  if (searchQuery.trim() == '') {
    redirect('/')
  }

  // Fixed query logic
  let query = supabase
    .from('users')
    .select('*')
  // .ilike('username', `%${searchQuery}%`)
  // .order('username', { ascending: true })

  // // Handle search type filtering
  // if (searchType && searchType !== 'all') {
  //   query = query.eq('user_type', searchType);
  // } else {
  //   query = query.neq('user_type', 'general');
  // }

  const { data: searchResults, error } = await query
  // .limit(20)

  if (error) {
    console.error('Search error:', error);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      <NavBar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-white">Search Results for "{searchQuery}"</h1>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {searchResults && searchResults.map((escort) => (
            <EscortCard
              key={escort.id}
              name={escort.username}
              age={escort.age}
              location={escort.location}
              measurements={escort.size}
              price={escort.price}
              image={escort.pic || '/placeholder.svg?height=600&width=400'}
              availability={escort.availability}
              isVerified={escort.is_verified}
              isVip={escort.is_vip}
              isOnline={false}
            />
          ))}
        </div>
        {(!searchResults || searchResults.length === 0) && (
          <p className="text-center text-white mt-8">No results found for "{searchQuery}"</p>
        )}
      </div>
      <Footer />
    </div>
  )
}
