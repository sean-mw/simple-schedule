import { useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Alert,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

type ModalProps = {
  title: string
  subtitle?: string
  errorMessage?: string
  onClose: () => void
  children: React.ReactNode
}

const Modal: React.FC<ModalProps> = ({
  title,
  subtitle,
  errorMessage,
  onClose,
  children,
}) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  return (
    <Dialog
      open={true}
      onClose={onClose}
      aria-labelledby="modal-title"
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: '8px',
          maxWidth: '600px',
          width: '100%',
          position: 'relative',
        },
      }}
    >
      <DialogTitle
        id="modal-title"
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="h6">{title}</Typography>
        <IconButton onClick={onClose} aria-label="close">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {subtitle && (
          <Typography variant="h5" align="center" gutterBottom mb={2}>
            {subtitle}
          </Typography>
        )}
        {errorMessage && (
          <Alert severity="error" sx={subtitle ? { my: 2 } : { mb: 2 }}>
            {errorMessage}
          </Alert>
        )}
        {children}
      </DialogContent>
    </Dialog>
  )
}

export default Modal
