import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const secret = process.env.NEXTAUTH_SECRET

  const token = await getToken({ req: request, secret })

  if (token && token.sub) {
    request.headers.set('x-user-id', token.sub)
  } else {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return NextResponse.next({
    headers: request.headers,
  })
}

export const config = {
  matcher: ['/api/employees/:path*', '/api/availability-requests'],
}
