import { signOut, useSession } from 'next-auth/react'
import {
  AppBar,
  Toolbar,
  Button,
  Stack,
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import { useState } from 'react'
import Logo from './Logo'

type NavbarProps = {
  onAddEmployee?: () => void
  onRequestAvailability?: () => void
  hideButtons?: boolean
}

const Navbar: React.FC<NavbarProps> = ({
  onAddEmployee,
  onRequestAvailability,
  hideButtons,
}) => {
  const session = useSession()
  const theme = useTheme()
  const showHamburger = useMediaQuery(theme.breakpoints.down('md'))
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  return (
    <AppBar position="static" sx={{ bgcolor: 'white' }}>
      <Toolbar>
        <Logo style={{ marginRight: 16 }} />
        {!hideButtons && (
          <>
            {showHamburger ? (
              <>
                <Box sx={{ flexGrow: 1 }} />
                <IconButton
                  edge="end"
                  color="primary"
                  aria-label="menu"
                  onClick={handleMenuOpen}
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                  <MenuItem onClick={onAddEmployee}>Add Employee</MenuItem>
                  <MenuItem onClick={onRequestAvailability}>
                    Request Availability
                  </MenuItem>
                  <MenuItem onClick={() => signOut()}>Sign out</MenuItem>
                </Menu>
              </>
            ) : (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  flexGrow: 1,
                  justifyContent: 'flex-end',
                }}
              >
                <Stack direction="row" spacing={2} sx={{ flexGrow: 1 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={onAddEmployee}
                  >
                    Add Employee
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={onRequestAvailability}
                  >
                    Request Availability
                  </Button>
                </Stack>
                <Typography color="textSecondary" mx={2}>
                  {session.data?.user?.email}
                </Typography>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => signOut()}
                >
                  Sign out
                </Button>
              </Box>
            )}
          </>
        )}
      </Toolbar>
    </AppBar>
  )
}

export default Navbar
