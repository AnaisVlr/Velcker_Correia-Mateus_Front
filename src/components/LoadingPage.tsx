import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import '../styles/App.css';

export default function LoadingPage() {
  return (
    <Box sx={{ display: 'flex' }}>
        <CircularProgress className="circularLoading" size={50} color='primary'/>
    </Box>
  );
}