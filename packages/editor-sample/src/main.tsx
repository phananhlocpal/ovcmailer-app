import React from 'react';
import ReactDOM from 'react-dom/client';

import { CssBaseline, ThemeProvider } from '@mui/material';
import { StyledEngineProvider } from '@mui/material/styles';


import App from './app';
import theme from './theme';


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
    <StyledEngineProvider injectFirst>
      <CssBaseline />
      <App />
      </StyledEngineProvider>
    </ThemeProvider>
  </React.StrictMode>
);
