import { notFound, redirect} from "next/navigation"
import LoginPage from "./login_page"
import SignupPage from "./signup_page"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
export default async function AuthPage(props: { params: Promise<{ action: 'login' | 'signup' }> }) {
  const params = await props.params;
  const action = params.action
  if(action!=="login" && action!=="signup"){
    return notFound()
  }
  const supabase = createServerComponentClient({cookies})
  const {data:{user:isLogedIn}}= await supabase.auth.getUser()
  if(isLogedIn){
    return redirect("/profile")
  }

  if(action==="login"){
  return <>{action==='login'&&<LoginPage/>}</>
  }
  else if(action==="signup"){
    return <>{action==='signup'&&<SignupPage/>}</>
  }
}

