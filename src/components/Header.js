import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import FormatSizeIcon from '@mui/icons-material/FormatSize';

function Header() {
  return (
    <AppBar position="static" sx={{ 
      backgroundColor: '#121212', 
      borderBottom: '1px solid #333',
      boxShadow: 'none',
      mb: 2
    }}>
      <Toolbar sx={{ maxWidth: 1400, width: '100%', mx: 'auto' }}>
        <FormatSizeIcon sx={{ 
          mr: 2, 
          fontSize: 36, 
          color: '#5CFF5C' // Lime green
        }} />
        <Box>
          <Typography 
            variant="h1" 
            component="div" 
            sx={{ 
              flexGrow: 1, 
              fontSize: { xs: '24px', sm: '32px' },
              fontWeight: 900,
              letterSpacing: 1,
              textTransform: 'uppercase'
            }}
          >
            Typographic Mood Board
          </Typography>
          <Typography 
            variant="subtitle1" 
            sx={{ 
              color: '#999', 
              mt: 0.5,
              fontSize: { xs: '12px', sm: '14px' }
            }}
          >
            Mix and match typefaces in real-time with AI recommendations
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;