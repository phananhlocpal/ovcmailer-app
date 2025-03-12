import { Button } from '@mui/material';
import { styled } from '@mui/material/styles';

export const StyledButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(1, 0),
  padding: theme.spacing(1.5),
  borderRadius: 8,
  textTransform: 'none',
  fontWeight: 600,
}));
