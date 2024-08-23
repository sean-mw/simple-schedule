/* eslint-disable @typescript-eslint/no-unused-vars */
import NextAuth from 'next-auth'
import { NextRequest } from 'next/server'

declare module 'next-auth' {
  interface Session {
    user?: {
      id: string
      name?: string
      email?: string
      image?: string
    }
  }
}

declare module 'next/server' {
  interface NextRequest {
    userId?: string
  }
}
