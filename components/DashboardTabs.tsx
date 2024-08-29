'use client'

import * as React from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { styled } from '@mui/system'
import { Tabs } from '@mui/base/Tabs'
import { TabsList as BaseTabsList } from '@mui/base/TabsList'
import { Tab as BaseTab, tabClasses } from '@mui/base/Tab'
import { Typography } from '@mui/material'

export default function DashboardTabs() {
  const router = useRouter()
  const pathname = usePathname()

  const onTabChange = (
    _event: React.SyntheticEvent | null,
    value: number | string | null
  ) => {
    if (value !== pathname && typeof value === 'string') {
      router.push(value)
    }
  }

  return (
    <Tabs value={pathname} onChange={onTabChange}>
      <TabsList sx={{ boxShadow: 3 }}>
        <Tab value="/dashboard/availability">
          <Typography fontWeight={'bold'}>AVAILABILITY</Typography>
        </Tab>
        <Tab value="/dashboard/requests">
          <Typography fontWeight={'bold'}>REQUESTS</Typography>
        </Tab>
      </TabsList>
    </Tabs>
  )
}

const Tab = styled(BaseTab)(
  ({ theme }) => `
  cursor: pointer;
  background-color: ${theme.palette.background.default};
  width: 220px;
  padding: 10px 12px;
  margin: 6px;
  border: none;
  border-radius: 7px;
  display: flex;
  justify-content: center;

  &:hover {
    background-color: ${theme.palette.secondary.main};
  }

  &.${tabClasses.selected} {
    background-color: ${theme.palette.primary.main};
    color: ${theme.palette.background.default};
  }
`
)

const TabsList = styled(BaseTabsList)`
  min-width: 400px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  align-content: space-between;
`
