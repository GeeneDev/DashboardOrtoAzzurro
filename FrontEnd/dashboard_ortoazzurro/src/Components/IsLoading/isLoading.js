import './isLoading.css';
import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

//Componente per mostrare uno spinner di caricamento, usato da altri componenti per mostrare una attesa di chiamata ai dati
const IsLoading = () => {
    return (
        <Box sx={{ display: 'flex' }}>
          <CircularProgress />
        </Box>
      );
};

export default IsLoading;