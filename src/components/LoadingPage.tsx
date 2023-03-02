import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';

export default function LoadingPage() {
  return (
    <Box sx={{ display: 'flex' }}>
        <Typography>
            Chargement...
        </Typography>
        <CircularProgress />
    </Box>
  );
}