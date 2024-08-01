import { LoadingButton } from '@mui/lab'
import { FormEventHandler } from 'react'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

type FormProps = {
  onSubmit: FormEventHandler<HTMLFormElement>
  children: React.ReactNode
  status: 'idle' | 'loading' | 'success' | 'error'
  disabled?: boolean
  submitButtonText?: string
}

const Form: React.FC<FormProps> = ({
  onSubmit,
  children,
  status,
  disabled,
  submitButtonText,
}) => {
  return (
    <form onSubmit={onSubmit}>
      {children}
      <LoadingButton
        type="submit"
        variant="contained"
        color={status === 'success' ? 'success' : 'primary'}
        fullWidth
        loading={status === 'loading'}
        loadingPosition="start"
        startIcon={status === 'success' && <CheckCircleIcon />}
        disabled={disabled || status === 'loading'}
      >
        {status === 'success' ? 'Success' : submitButtonText || 'Submit'}
      </LoadingButton>
    </form>
  )
}

export default Form
