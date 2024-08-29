import { shiftColorMap } from '@/lib/shift-color-map'
import { Box, Divider, IconButton, Typography } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import { ShiftType } from '@prisma/client'
import { format } from 'date-fns'

type ShiftTypeBlockProps = {
  shiftType: ShiftType
  onDelete: (shiftType: ShiftType) => void
}

const ShiftTypeBlock: React.FC<ShiftTypeBlockProps> = ({
  shiftType,
  onDelete,
}) => {
  const startHour = format(shiftType.startTime, 'h:mm a')
  const endHour = format(shiftType.endTime, 'h:mm a')

  return (
    <Box
      bgcolor={shiftColorMap[shiftType.color]}
      padding={2}
      borderRadius={4}
      display="flex"
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
    >
      <Box display="flex" flexDirection={'row'} gap={2}>
        <Typography fontWeight={'bold'}>{shiftType.name}</Typography>
        <Divider orientation="vertical" flexItem />
        <Typography color={'textSecondary'}>
          {startHour} - {endHour}
        </Typography>
      </Box>

      <IconButton
        size="small"
        color="error"
        onClick={async () => {
          await fetch(`/api/shift-types/${shiftType.id}`, {
            method: 'DELETE',
          })
          onDelete(shiftType)
        }}
      >
        <DeleteIcon fontSize="small" />
      </IconButton>
    </Box>
  )
}

export default ShiftTypeBlock
