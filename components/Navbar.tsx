import { signOut, useSession } from 'next-auth/react'
import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  Box,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import Logo from './Logo'
import { usePathname } from 'next/navigation'

const Navbar: React.FC = () => {
  const theme = useTheme()

  const session = useSession()
  const signedIn = session.data?.user

  const pathname = usePathname()
  const showSignOut = signedIn && pathname.startsWith('/dashboard')

  const showUserEmail = useMediaQuery(theme.breakpoints.up('md')) && showSignOut

  return (
    <AppBar position="static" sx={{ bgcolor: 'white' }}>
      <Toolbar>
        <Logo style={{ marginRight: 16 }} />
        <Box
          display={'flex'}
          justifyContent={'flex-end'}
          width={'100%'}
          alignItems={'center'}
        >
          {showUserEmail && (
            <Typography color="textSecondary" mx={2}>
              {session.data?.user?.email}
            </Typography>
          )}
          {showSignOut && (
            <Button variant="contained" color="error" onClick={() => signOut()}>
              Sign out
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Navbar
