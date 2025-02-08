import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { protectedRoutes } from '../constants'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: any[]) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // ✅ Redirect authenticated users away from `/signin` to the `next` param (if provided)
  // if (user && request.nextUrl.pathname.startsWith('/signin')) {
  //   const nextPath = request.nextUrl.searchParams.get('next') || '/'
  //   console.log('Redirecting to:', nextPath)
  //   return NextResponse.redirect(new URL(nextPath, request.nextUrl.origin))
  // }

  // // ✅ Redirect unauthenticated users away from protected routes
  // if (!user && protectedRoutes.includes(request.nextUrl.pathname)) {
  //   const url = request.nextUrl.clone()
  //   url.pathname = '/signin'
  //   url.searchParams.set('next', request.nextUrl.pathname)
  //   return NextResponse.redirect(url)
  // }

  return supabaseResponse
}
