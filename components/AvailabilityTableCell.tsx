import { Box, Fab, TableCell } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { Availability } from '@prisma/client'
import AvailabilityBlock from './AvailabilityBlock'
import { AvailabilityWithShiftType } from '@/types/prisma-combined'

type AvailabilityTableCellProps = {
  day: Date
  availability: AvailabilityWithShiftType[]
  onDeleteAvailability?: (availability: Availability) => void
  onDayClick?: (day: Date) => void
}

const AvailabilityTableCell: React.FC<AvailabilityTableCellProps> = ({
  day,
  availability,
  onDeleteAvailability,
  onDayClick,
}) => {
  return (
    <TableCell sx={{ position: 'relative' }}>
      <Box display="flex" flexDirection="column" gap={1}>
        {availability.map((a) => (
          <AvailabilityBlock
            key={a.id}
            availability={a}
            onDeleteAvailability={onDeleteAvailability}
          />
        ))}
      </Box>
      {onDayClick && (
        <>
          <Box sx={{ height: '40px' }}></Box>
          <Fab
            color="primary"
            size="small"
            onClick={() => onDayClick(day)}
            sx={{
              position: 'absolute',
              bottom: '8px',
              right: '8px',
              zIndex: 1,
            }}
          >
            <AddIcon />
          </Fab>
        </>
      )}
    </TableCell>
  )
}

export default AvailabilityTableCell
