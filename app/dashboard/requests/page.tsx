'use client'

import ItemList from '@/components/ItemList'
import RequestAvailabilityModal from '@/components/RequestAvailabilityModal'
import { Box, Fab } from '@mui/material'
import { AvailabilityRequest, Employee, ShiftType } from '@prisma/client'
import { useEffect, useState } from 'react'
import AddIcon from '@mui/icons-material/Add'
import ShiftTypeModal from '@/components/ShiftTypeModal'
import ShiftTypeBlock from '@/components/ShiftTypeBlock'
import AvailabilityRequestBlock from '@/components/AvailabilityRequestBlock'

export default function Availability() {
  const [showRequestModal, setShowRequestModal] = useState(false)
  const [showShiftTypeModal, setShowShiftTypeModal] = useState(false)
  const [employees, setEmployees] = useState<Employee[]>([])
  const [shiftTypes, setShiftTypes] = useState<ShiftType[]>([])
  const [availabilityRequests, setAvailabilityRequests] = useState<
    AvailabilityRequest[]
  >([])

  useEffect(() => {
    fetch('/api/employees', {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((data) => {
        setEmployees(data)
      })

    fetch('/api/shift-types', {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((data) => {
        setShiftTypes(data)
      })

    fetch('/api/availability-requests', {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((data) => {
        setAvailabilityRequests(data)
      })
  }, [])

  return (
    <>
      <Box display="flex" flexDirection="column" alignItems="center" px={4}>
        <Box display="flex" flexDirection="row" width="100%">
          <ItemList
            title={'Shift Types'}
            emptyMessage={
              'Shift types will appear here. Add a new shift type to get started.'
            }
            footer={
              <Box display="flex" justifyContent={'center'}>
                <Fab
                  color="primary"
                  size="small"
                  onClick={() => setShowShiftTypeModal(true)}
                >
                  <AddIcon />
                </Fab>
              </Box>
            }
          >
            {shiftTypes.map((shiftType) => (
              <ShiftTypeBlock
                key={shiftType.id}
                shiftType={shiftType}
                onDelete={(shiftType: ShiftType) =>
                  setShiftTypes(
                    shiftTypes.filter((st) => st.id !== shiftType.id)
                  )
                }
              />
            ))}
          </ItemList>
          <ItemList
            title={'Outgoing Requests'}
            emptyMessage={
              'Outgoing requests will appear here. Make an availability request to get started.'
            }
            footer={
              <Box display="flex" justifyContent={'center'}>
                <Fab
                  color="primary"
                  size="small"
                  onClick={() => setShowRequestModal(true)}
                >
                  <AddIcon />
                </Fab>
              </Box>
            }
          >
            {availabilityRequests.map((availabilityRequest) => {
              const employee = employees.find(
                (employee) => employee.id === availabilityRequest.employeeId
              )
              if (!employee) return null
              return (
                <AvailabilityRequestBlock
                  key={availabilityRequest.id}
                  employee={employee}
                  availabilityRequest={availabilityRequest}
                />
              )
            })}
          </ItemList>
        </Box>
      </Box>
      {showRequestModal && (
        <RequestAvailabilityModal
          employees={employees}
          onClose={() => setShowRequestModal(false)}
          onSuccess={(newAvailabilityRequests: AvailabilityRequest[]) =>
            setAvailabilityRequests([
              ...availabilityRequests,
              ...newAvailabilityRequests,
            ])
          }
        />
      )}
      {showShiftTypeModal && (
        <ShiftTypeModal
          onClose={() => setShowShiftTypeModal(false)}
          onSuccess={(shiftType: ShiftType) =>
            setShiftTypes([...shiftTypes, shiftType])
          }
        />
      )}
    </>
  )
}
