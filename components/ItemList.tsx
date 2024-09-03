import { Box, Divider, Typography } from '@mui/material'
import React from 'react'

type ItemListProps = {
  title: string
  emptyMessage: string
  footer?: React.ReactNode
  children: React.ReactNode
}

const ItemList: React.FC<ItemListProps> = ({
  title,
  emptyMessage,
  footer,
  children,
}) => {
  const isEmpty = React.Children.count(children) === 0

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        borderRadius: '8px',
        margin: '8px',
        boxShadow: 3,
        backgroundColor: 'white',
      }}
    >
      <Box padding="16px 24px">
        <Typography variant={'h6'} fontWeight={'bold'} textAlign={'left'}>
          {title}
        </Typography>
      </Box>
      <Divider />
      <Box display="flex" flexDirection="column" gap={2} padding="16px 24px">
        {isEmpty ? (
          <Typography
            variant={'body2'}
            color={'textSecondary'}
            textAlign={'center'}
            my={8}
          >
            {emptyMessage}
          </Typography>
        ) : (
          children
        )}
      </Box>
      {footer && (
        <>
          <Divider />
          <Box padding="16px 24px">{footer}</Box>
        </>
      )}
    </Box>
  )
}

export default ItemList
