import { Box, IconButton, useTheme } from '@mui/material'
import { Availability } from '@prisma/client'
import axios from 'axios'
import { format } from 'date-fns'
import DeleteIcon from '@mui/icons-material/Delete'

type AvailabilityBlockProps = {
  availability: Availability
  onDeleteAvailability?: (availability: Availability) => void
}

const AvailabilityBlock: React.FC<AvailabilityBlockProps> = ({
  availability,
  onDeleteAvailability,
}) => {
  const theme = useTheme()

  const startHour = format(availability.startTime, 'h:mm a')
  const endHour = format(availability.endTime, 'h:mm a')

  return (
    <Box
      key={availability.id}
      sx={{
        backgroundColor: theme.palette.success.light,
        borderRadius: '4px',
        padding: '4px 6px',
        fontSize: '12px',
        marginBottom: '5px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <span>
        {startHour} - {endHour}
      </span>
      {onDeleteAvailability && (
        <IconButton
          size="small"
          color="error"
          onClick={async () => {
            await axios.delete(`/api/availabilities`, {
              data: availability,
            })
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
