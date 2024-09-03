import { Box, IconButton, Typography } from '@mui/material'
import { format } from 'date-fns'
import DeleteIcon from '@mui/icons-material/Delete'
import { useSearchParams } from 'next/navigation'
import { AvailabilityWithShiftType } from '@/types/prisma-combined'
import { Availability } from '@prisma/client'
import { shiftColorMap } from '@/lib/shift-color-map'

type AvailabilityBlockProps = {
  availability: AvailabilityWithShiftType
  onDeleteAvailability?: (availability: Availability) => void
}

const AvailabilityBlock: React.FC<AvailabilityBlockProps> = ({
  availability,
  onDeleteAvailability,
}) => {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const startHour = format(availability.shiftType.startTime, 'h:mm a')
  const endHour = format(availability.shiftType.endTime, 'h:mm a')

  return (
    <Box
      key={availability.id}
      sx={{
        backgroundColor: shiftColorMap[availability.shiftType.color],
        borderRadius: '4px',
        padding: '4px 6px',
        fontSize: '12px',
        marginBottom: '5px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Box display="flex" flexDirection="column">
        <Typography fontWeight="bold">{availability.shiftType.name}</Typography>
        <span>
          {startHour} - {endHour}
        </span>
      </Box>
      {onDeleteAvailability && (
        <IconButton
          size="small"
          color="error"
          onClick={async () => {
            await fetch(
              `/api/availability-requests/${token}/availability/${availability.id}`,
              {
                method: 'DELETE',
              }
            )
            onDeleteAvailability(availability)
          }}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      )}
    </Box>
  )
}

export default AvailabilityBlock
