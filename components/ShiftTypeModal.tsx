import React, { useState } from 'react'
import {
  Box,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  TextField,
} from '@mui/material'
import Form from './Form'
import Modal from './Modal'
import { ShiftColor, ShiftType } from '@prisma/client'
import { shiftColorMap } from '@/lib/shift-color-map'
import { convertToDate, generateDailyTimes } from '@/lib/date-util'

type ShiftTypeModalProps = {
  onClose: () => void
  onSuccess: (shiftType: ShiftType) => void
}

const renderColorBox = (color: ShiftColor) => {
  return (
    <Box
      sx={{
        marginRight: 1,
        width: 16,
        height: 16,
        backgroundColor: shiftColorMap[color],
        border: '1px solid #000',
        borderRadius: '4px',
      }}
    />
  )
}

const ShiftTypeModal: React.FC<ShiftTypeModalProps> = ({
  onClose,
  onSuccess,
}) => {
  const [name, setName] = useState('')
  const [color, setColor] = useState<ShiftColor>(ShiftColor.Green)
  const [startTime, setStartTime] = useState<string | null>(null)
  const [startPeriod, setStartPeriod] = useState<string | null>('AM')
  const [endTime, setEndTime] = useState<string | null>(null)
  const [endPeriod, setEndPeriod] = useState<string | null>('AM')
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMessage('')

    const start = convertToDate(startTime!, startPeriod!, new Date())
    const end = convertToDate(endTime!, endPeriod!, new Date())

    if (start >= end) {
      setStatus('error')
      return setErrorMessage('End time must be after start time.')
    }

    try {
      const response = await fetch('/api/shift-types', {
        method: 'POST',
        body: JSON.stringify({
          name,
          startTime: convertToDate(startTime!, startPeriod!, new Date()),
          endTime: convertToDate(endTime!, endPeriod!, new Date()),
          color,
        }),
      })
      const createdShiftType = await response.json()
      setStatus('success')
      setTimeout(() => {
        setStatus('idle')
        onClose()
      }, 500)
      onSuccess(createdShiftType)
    } catch (error) {
      setStatus('error')
      return setErrorMessage('Failed to create shift type. Please try again.')
    }
  }

  const timeOptions = generateDailyTimes(15)

  return (
    <Modal title="Add Shift Type" onClose={onClose} errorMessage={errorMessage}>
      <Form onSubmit={onSubmit} status={status}>
        <Box mb={2}>
          <TextField
            required
            fullWidth
            margin="dense"
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Box>
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
        <Box mb={2}>
          <FormControl fullWidth required>
            <InputLabel>Color</InputLabel>
            <Select
              value={color}
              label="Color"
              onChange={(e) => setColor(e.target.value as ShiftColor)}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {renderColorBox(selected as ShiftColor)}
                  {selected}
                </Box>
              )}
            >
              {Object.values(ShiftColor).map((color) => {
                return (
                  <MenuItem key={color} value={color}>
                    {renderColorBox(color)}
                    {color}
                  </MenuItem>
                )
              })}
            </Select>
          </FormControl>
        </Box>
      </Form>
    </Modal>
  )
}

export default ShiftTypeModal
