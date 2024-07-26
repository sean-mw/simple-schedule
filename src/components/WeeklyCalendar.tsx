import React from 'react'
import { format, startOfWeek, addDays } from 'date-fns'
import { Box, IconButton, Typography } from '@mui/material'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'

type WeeklyCalendarProps = {
  currentWeek: Date
  onNextWeek: () => void
  onPrevWeek: () => void
}

const WeeklyCalendar: React.FC<WeeklyCalendarProps> = ({
  currentWeek,
  onNextWeek,
  onPrevWeek,
}) => {
  const startOfCurrentWeek = startOfWeek(currentWeek, { weekStartsOn: 1 })

  return (
    <Box display="flex" justifyContent="center" alignItems="center" mb={2}>
      <IconButton onClick={onPrevWeek} color="primary">
        <ArrowBackIosIcon />
      </IconButton>
      <Typography variant="h6" color="textSecondary" mx={2}>
        {format(startOfCurrentWeek, 'MMMM d, yyyy')} -{' '}
        {format(addDays(startOfCurrentWeek, 6), 'MMMM d, yyyy')}
      </Typography>
      <IconButton onClick={onNextWeek} color="primary">
        <ArrowForwardIosIcon />
      </IconButton>
    </Box>
  )
}

export default WeeklyCalendar
