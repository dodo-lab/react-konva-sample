import React from 'react';
import './App.css';
import DynamicText from './DynamicTextSample';
import { Box } from '@mui/material';

function App() {
  return (
    <>
      <Box m={4}>
        <DynamicText/>
      </Box>
      <Box m={4}>
        <DynamicText/>
      </Box>
    </>
  );
}

export default App;
