import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    primary: {
      main: '#384259',
    },
    secondary: {
      main: '#6c757d',
    },
    success: {
      main: '#28a745',
      light: '#d4edda',
    },
    error: {
      main: '#dc3545',
    },
    background: {
      default: '#f8f9fa',
      paper: '#fff',
    },
    text: {
      primary: '#212529',
      secondary: '#6c757d',
    },
  },
})

export default theme
