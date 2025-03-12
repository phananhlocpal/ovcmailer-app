import { Paper } from '@mui/material';
import { styled } from '@mui/material/styles';

export const SignInPaper = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(8),
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  maxWidth: 400,
  margin: 'auto',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  borderRadius: 16,
}));