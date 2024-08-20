import React, { useMemo, useState } from 'react'
import Modal from './Modal'
import axios from 'axios'
import { Box, MenuItem, Select, FormControl, InputLabel } from '@mui/material'
import { EmployeeWithAvailability } from './EmployeeAvailability'
import { isSameDay } from 'date-fns'
import { Availability } from '@prisma/client'
import Form from './Form'

type AvailabilityModalProps = {
  token: string
  employee: EmployeeWithAvailability
  date: Date
  onClose: () => void
  onSuccess: (availability: Availability) => void
}

const generateTimeOptions = () => {
  const times = []
  for (let hour = 1; hour <= 12; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const displayMinute = minute.toString().padStart(2, '0')
      times.push(`${hour}:${displayMinute}`)
    }
  }
  return times
}

const convertToDate = (time: string, period: string, date: Date) => {
  const [hour, minute] = time.split(':').map(Number)
  const adjustedHour =
    period === 'PM' && hour !== 12
      ? hour + 12
      : hour === 12 && period === 'AM'
        ? 0
        : hour
  const newDate = new Date(date)
  newDate.setHours(adjustedHour, minute)
  return newDate
}

const AvailabilityModal: React.FC<AvailabilityModalProps> = ({
  token,
  employee,
  date,
  onClose,
  onSuccess,
}) => {
  const [startTime, setStartTime] = useState<string | null>(null)
  const [startPeriod, setStartPeriod] = useState<string | null>('AM')
  const [endTime, setEndTime] = useState<string | null>(null)
  const [endPeriod, setEndPeriod] = useState<string | null>('AM')
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const currentAvailabilities = useMemo(() => {
    return employee.availabilities.filter((availability) =>
      isSameDay(availability.day, date)
    )
  }, [date, employee.availabilities])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMessage('')

    const start = convertToDate(startTime!, startPeriod!, date)
    const end = convertToDate(endTime!, endPeriod!, date)

    if (start >= end) {
      setStatus('error')
      return setErrorMessage('End time must be after start time.')
    }

    for (const availability of currentAvailabilities) {
      const existingStart = new Date(availability.startTime)
      const existingEnd = new Date(availability.endTime)

      if (
        (start >= existingStart && start < existingEnd) ||
        (end > existingStart && end <= existingEnd) ||
        (start <= existingStart && end >= existingEnd)
      ) {
        setStatus('error')
        return setErrorMessage(
          'The selected time overlaps with an existing availability for this day.'
        )
      }
    }

    const availability = {
      token,
      day: date,
      startTime: start,
      endTime: end,
    }

    try {
      const response = await axios.post('/api/availabilities', availability)
      setStatus('success')
      setTimeout(() => {
        setStatus('idle')
        onClose()
      }, 500)
      onSuccess(response.data.availability)
    } catch (error) {
      setStatus('error')
      return setErrorMessage('Failed to submit availability. Please try again.')
    }
  }

  const timeOptions = generateTimeOptions()

  return (
    <Modal
      title="Add Availability"
      subtitle={`Availability for ${date.toDateString()}`}
      onClose={onClose}
      errorMessage={errorMessage}
    >
      <Form onSubmit={onSubmit} status={status}>
        <Box mb={2} display="flex" gap={2}>
          <FormControl fullWidth required>
            <InputLabel id="start-time-label">Start Time</InputLabel>
            <Select
              labelId="start-time-label"
              value={startTime || ''}
              onChange={(e) => setStartTime(e.target.value as string)}
              label="Start Time"
            >
              {timeOptions.map((time) => (
                <MenuItem key={time} value={time}>
                  {time}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 100 }} required>
            <InputLabel id="start-period-label">AM/PM</InputLabel>
            <Select
              labelId="start-period-label"
              value={startPeriod || ''}
              onChange={(e) => setStartPeriod(e.target.value as string)}
              label="AM/PM"
            >
              <MenuItem value="AM">AM</MenuItem>
              <MenuItem value="PM">PM</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box mb={2} display="flex" gap={2}>
          <FormControl fullWidth required>
            <InputLabel id="end-time-label">End Time</InputLabel>
            <Select
              labelId="end-time-label"
              value={endTime || ''}
              onChange={(e) => setEndTime(e.target.value as string)}
              label="End Time"
            >
              {timeOptions.map((time) => (
                <MenuItem key={time} value={time}>
                  {time}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 100 }} required>
            <InputLabel id="end-period-label">AM/PM</InputLabel>
            <Select
              labelId="end-period-label"
              value={endPeriod || ''}
              onChange={(e) => setEndPeriod(e.target.value as string)}
              label="AM/PM"
            >
              <MenuItem value="AM">AM</MenuItem>
              <MenuItem value="PM">PM</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Form>
    </Modal>
  )
}

export default AvailabilityModal
