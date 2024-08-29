import { Box, Divider, Typography } from '@mui/material'
import { AvailabilityRequest, Employee } from '@prisma/client'

type AvailabilityRequestBlockProps = {
  availabilityRequest: AvailabilityRequest
  employee: Employee
}

const AvailabilityRequestBlock: React.FC<AvailabilityRequestBlockProps> = ({
  employee,
}) => {
  return (
    <Box bgcolor={'LightGrey'} padding={2} borderRadius={4}>
      <Box display="flex" flexDirection={'row'} gap={2}>
        <Typography fontWeight={'bold'}>
          {employee.firstName} {employee.lastName}{' '}
        </Typography>
        <Divider orientation="vertical" flexItem />
        <Typography color="textSecondary">{employee.email}</Typography>
      </Box>
    </Box>
  )
}

export default AvailabilityRequestBlock
