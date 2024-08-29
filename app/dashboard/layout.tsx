'use client'

import DashboardTabs from '@/components/DashboardTabs'
import Navbar from '@/components/Navbar'
import { Box } from '@mui/material'
import { signIn, useSession } from 'next-auth/react'
import { useEffect } from 'react'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { status } = useSession()

  useEffect(() => {
    if (status === 'unauthenticated') {
      signIn()
    }
  }, [status])

  return (
    <>
      <Navbar />
      <Box display={'flex'} justifyContent={'center'} py={2}>
        <DashboardTabs />
      </Box>
      {children}
    </>
  )
}
