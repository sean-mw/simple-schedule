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
import { format, isSameDay } from 'date-fns'
import { Availability, ShiftType } from '@prisma/client'
import Form from './Form'
import { generateDailyTimes } from '@/lib/date-util'
import { shiftColorMap } from '@/lib/shift-color-map'
import {
  AvailabilityWithShiftType,
  EmployeeWithAvailability,
} from '@/types/prisma-combined'

type AvailabilityModalProps = {
  token: string
  employee: EmployeeWithAvailability
  shiftTypes: ShiftType[]
  date: Date
  onClose: () => void
  onSuccess: (availability: AvailabilityWithShiftType[]) => void
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
      let createdAvailabilityWithShiftType: AvailabilityWithShiftType[] = []
      if (shiftTypes.length > 0) {
        if (selectedShiftTypes.length === 0) {
          setStatus('error')
          return setErrorMessage('Please select at least one shift type.')
        }
        // Check if shift type is already selected
        const alreadySelected = currentAvailabilities.some((availability) => {
          return selectedShiftTypes.some(
            (st) => st.id === availability.shiftTypeId
          )
        })
        if (alreadySelected) {
          setStatus('error')
          return setErrorMessage(
            'One or more shift types already selected for this day.'
          )
        }

        const availabilityPromises = selectedShiftTypes.map(
          async (shiftType) => {
            const availabilityData = {
              token,
              day: date,
              shiftTypeId: shiftType.id,
            }

            const response = await fetch(
              `/api/availability-requests/${token}/availability`,
              {
                method: 'POST',
                body: JSON.stringify(availabilityData),
              }
            )
            const availability: Availability = await response.json()

            return {
              ...availability,
              shiftType,
            }
          }
        )
        createdAvailabilityWithShiftType =
          await Promise.all(availabilityPromises)
      } else {
        // TODO: Handle manual time selections
        // const start = convertToDate(startTime!, startPeriod!, date)
        // const end = convertToDate(endTime!, endPeriod!, date)
        // if (start >= end) {
        //   setStatus('error')
        //   return setErrorMessage('End time must be after start time.')
        // }
        // for (const availability of currentAvailabilities) {
        //   const existingStart = new Date(availability.startTime)
        //   const existingEnd = new Date(availability.endTime)
        //   if (
        //     (start >= existingStart && start < existingEnd) ||
        //     (end > existingStart && end <= existingEnd) ||
        //     (start <= existingStart && end >= existingEnd)
        //   ) {
        //     setStatus('error')
        //     return setErrorMessage(
        //       'The selected time overlaps with an existing availability for this day.'
        //     )
        //   }
        // }
        // const availabilityData = {
        //   token,
        //   day: date,
        //   startTime: start,
        //   endTime: end,
        // }
        // const response = await fetch(
        //   `/api/availability-requests/${token}/availability`,
        //   {
        //     method: 'POST',
        //     body: JSON.stringify(availabilityData),
        //   }
        // )
        // createdAvailabilityWithShiftType = [await response.json()]
      }

      setStatus('success')
      setTimeout(() => {
        setStatus('idle')
        onClose()
      }, 500)
      onSuccess(createdAvailabilityWithShiftType)
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
