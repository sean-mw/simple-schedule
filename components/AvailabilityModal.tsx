import React, { useMemo, useState } from 'react'
import Modal from './Modal'
import {
  Box,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Checkbox,
} from '@mui/material'
import { EmployeeWithAvailability } from './EmployeeAvailability'
import { format, isSameDay } from 'date-fns'
import { Availability, ShiftType } from '@prisma/client'
import Form from './Form'
import { convertToDate, generateDailyTimes } from '@/lib/date-util'
import { shiftColorMap } from '@/lib/shift-color-map'

type AvailabilityModalProps = {
  token: string
  employee: EmployeeWithAvailability
  shiftTypes: ShiftType[]
  date: Date
  onClose: () => void
  onSuccess: (availability: Availability[]) => void
}

const AvailabilityModal: React.FC<AvailabilityModalProps> = ({
  token,
  employee,
  shiftTypes,
  date,
  onClose,
  onSuccess,
}) => {
  const [startTime, setStartTime] = useState<string | null>(null)
  const [startPeriod, setStartPeriod] = useState<string | null>('AM')
  const [endTime, setEndTime] = useState<string | null>(null)
  const [endPeriod, setEndPeriod] = useState<string | null>('AM')
  const [selectedShiftTypes, setSelectedShiftTypes] = useState<ShiftType[]>([])
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const currentAvailabilities = useMemo(() => {
    return employee.availability.filter((availability) =>
      isSameDay(availability.day, date)
    )
  }, [date, employee.availability])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMessage('')

    try {
      let createdAvailability: Availability[] = []
      if (shiftTypes.length > 0) {
        if (selectedShiftTypes.length === 0) {
          setStatus('error')
          return setErrorMessage('Please select at least one shift type.')
        }

        const availabilityPromises = selectedShiftTypes.map(
          async (shiftType) => {
            const start = format(shiftType.startTime, 'h:mm a')
            const end = format(shiftType.endTime, 'h:mm a')
            const startTime = start.split(' ')[0]
            const startPeriod = start.split(' ')[1]
            const endTime = end.split(' ')[0]
            const endPeriod = end.split(' ')[1]
            const availabilityData = {
              token,
              day: date,
              startTime: convertToDate(startTime, startPeriod, date),
              endTime: convertToDate(endTime, endPeriod, date),
            }

            const response = await fetch(
              `/api/availability-requests/${token}/availability`,
              {
                method: 'POST',
                body: JSON.stringify(availabilityData),
              }
            )
            return response.json()
          }
        )
        createdAvailability = await Promise.all(availabilityPromises)
      } else {
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

        const availabilityData = {
          token,
          day: date,
          startTime: start,
          endTime: end,
        }

        const response = await fetch(
          `/api/availability-requests/${token}/availability`,
          {
            method: 'POST',
            body: JSON.stringify(availabilityData),
          }
        )
        createdAvailability = [await response.json()]
      }

      setStatus('success')
      setTimeout(() => {
        setStatus('idle')
        onClose()
      }, 500)
      onSuccess(createdAvailability)
    } catch (error) {
      setStatus('error')
      return setErrorMessage('Failed to submit availability. Please try again.')
    }
  }

  const timeOptions = generateDailyTimes(15)

  return (
    <Modal
      title="Add Availability"
      subtitle={`Availability for ${date.toDateString()}`}
      onClose={onClose}
      errorMessage={errorMessage}
    >
      <Form onSubmit={onSubmit} status={status}>
        {shiftTypes.length === 0 ? (
          <>
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
          </>
        ) : (
          <List>
            {shiftTypes.map((shiftType) => (
              <Box
                key={shiftType.id}
                bgcolor={shiftColorMap[shiftType.color]}
                borderRadius={4}
                margin={2}
              >
                <ListItem>
                  <ListItemText
                    primary={shiftType.name}
                    secondary={`${format(shiftType.startTime, 'hh:mm a')} - ${format(shiftType.endTime, 'hh:mm a')}`}
                  />
                  <ListItemSecondaryAction>
                    <Checkbox
                      edge="end"
                      checked={selectedShiftTypes.includes(shiftType)}
                      onChange={() =>
                        setSelectedShiftTypes(
                          selectedShiftTypes.includes(shiftType)
                            ? selectedShiftTypes.filter(
                                (st) => st.id !== shiftType.id
                              )
                            : [...selectedShiftTypes, shiftType]
                        )
                      }
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              </Box>
            ))}
          </List>
        )}
      </Form>
    </Modal>
  )
}

export default AvailabilityModal
