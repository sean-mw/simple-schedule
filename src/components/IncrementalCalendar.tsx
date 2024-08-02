import React from 'react'
import { format, isSameDay } from 'date-fns'
import { Box, IconButton, Typography } from '@mui/material'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'

type IncrementalCalendarProps = {
  startOfIncrement: Date
  endOfIncrement: Date
  onNextIncrement: () => void
  onPrevIncrement: () => void
}

const IncrementalCalendar: React.FC<IncrementalCalendarProps> = ({
  startOfIncrement,
  endOfIncrement,
  onNextIncrement,
  onPrevIncrement,
}) => {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" mb={2}>
      <IconButton onClick={onPrevIncrement} color="primary">
        <ArrowBackIosIcon />
      </IconButton>
      <Typography variant="h6" color="textSecondary" mx={2}>
        {format(startOfIncrement, 'MMMM d, yyyy')}
        {!isSameDay(startOfIncrement, endOfIncrement) && (
          <>- {format(endOfIncrement, 'MMMM d, yyyy')}</>
        )}
      </Typography>
      <IconButton onClick={onNextIncrement} color="primary">
        <ArrowForwardIosIcon />
      </IconButton>
    </Box>
  )
}

export default IncrementalCalendar
