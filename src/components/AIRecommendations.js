import React from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import CircularProgress from '@mui/material/CircularProgress';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import TitleIcon from '@mui/icons-material/Title';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import BrushIcon from '@mui/icons-material/Brush';
import { loadFonts } from '../services/fontService';

function AIRecommendations({ recommendations, onSelectRecommendation, loading, currentMood, customPrompt = null }) {
  const handleSelectFont = (font, role) => {
    // Load the font
    loadFonts([font.family]);
    
    // Set default size based on role
    let size = 16;
    if (role === 'heading') size = 48;
    else if (role === 'accent') size = 24;
    
    // Create a new font object with settings based on role
    const newFont = {
      ...font,
      variant: 'regular',
      size: size,
      role: role === 'heading' ? 'heading' : role === 'body' ? 'body' : 'accent'
    };
    
    onSelectRecommendation(newFont);
  };
  // Map mood to color
  const getMoodColor = (mood) => {
    const moodColors = {
      'professional': '#5CFF5C', // Lime green
      'creative': '#00B2FF', // Bright blue
      'elegant': '#5CFF5C',
      'playful': '#00B2FF',
      'modern': '#5CFF5C'
    };
    return moodColors[mood] || '#5CFF5C';
  };

  const moodColor = getMoodColor(currentMood);
  const moodNumber = currentMood === 'professional' || currentMood === 'elegant' || currentMood === 'modern' ? 1 : 2;
  return (
    <Paper 
      elevation={0} 
      sx={{ 
        backgroundColor: '#1E1E1E',
        border: '1px solid #333',
        borderRadius: '16px',
        p: 3
      }}
    >
      <Box className="control-card-header">
        <Box 
          className={`control-card-number ${moodNumber === 2 ? 'blue' : ''}`}
          sx={{ 
            backgroundColor: moodColor,
            color: '#000',
            width: 40,
            height: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '8px',
            mr: 2,
            fontWeight: 800
          }}
        >
          2
        </Box>
        <Typography 
          variant="h3" 
          className="control-card-title"
          sx={{ 
            fontSize: { xs: '18px', sm: '22px' },
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: 0.5
          }}
        >
          AI Recommendations
        </Typography>
      </Box>
      
      <Box sx={{ mt: 3 }}>
        <Typography variant="body2" sx={{ mb: 2, color: '#AAA' }}>
          Based on your <Chip 
            label={currentMood} 
            size="small" 
            sx={{ 
              backgroundColor: moodColor, 
              color: '#000', 
              fontWeight: 600,
              fontSize: '11px',
              height: 22,
              ml: 1
            }} 
          /> mood and current font selection
        </Typography>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress size={30} sx={{ color: moodColor }} />
          </Box>
        ) : recommendations.length === 0 ? (
          <Typography variant="body2" color="textSecondary">
            Select a mood to get font recommendations
          </Typography>
        ) : (
          <List sx={{ p: 0 }}>
            {recommendations.map((font, index) => (
              <Paper 
                key={index} 
                elevation={0}
                sx={{ 
                  mb: 2, 
                  backgroundColor: '#252525',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: moodColor,
                    boxShadow: `0 0 10px ${moodColor}40`
                  }
                }}
              >
                <Box sx={{ p: 2 }}>
                  <ListItemText 
                    primary={font.family} 
                    secondary={font.category}
                    primaryTypographyProps={{
                      style: {
                        fontFamily: `"${font.family}", ${font.category}`,
                        fontWeight: 600,
                        fontSize: '16px'
                      }
                    }}
                    secondaryTypographyProps={{
                      style: {
                        textTransform: 'uppercase',
                        fontSize: '11px',
                        letterSpacing: '0.5px',
                        color: '#999'
                      }
                    }}
                  />
                  
                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" sx={{ color: '#AAA', mr: 1 }}>
                      Recommended for:
                    </Typography>
                    <ButtonGroup size="small" variant="outlined" sx={{ '& .MuiButton-root': { minWidth: 'auto' } }}>
                      {font.recommendedRoles && font.recommendedRoles.includes('heading') && (
                        <Button 
                          onClick={() => handleSelectFont(font, 'heading')}
                          startIcon={<TitleIcon />}
                          sx={{ 
                            borderColor: '#444',
                            color: '#FFF',
                            '&:hover': { borderColor: moodColor, color: moodColor }
                          }}
                        >
                          Primary
                        </Button>
                      )}
                      {font.recommendedRoles && font.recommendedRoles.includes('body') && (
                        <Button 
                          onClick={() => handleSelectFont(font, 'body')}
                          startIcon={<TextFieldsIcon />}
                          sx={{ 
                            borderColor: '#444',
                            color: '#FFF',
                            '&:hover': { borderColor: moodColor, color: moodColor }
                          }}
                        >
                          Secondary
                        </Button>
                      )}
                      {font.recommendedRoles && font.recommendedRoles.includes('accent') && (
                        <Button 
                          onClick={() => handleSelectFont(font, 'accent')}
                          startIcon={<BrushIcon />}
                          sx={{ 
                            borderColor: '#444',
                            color: '#FFF',
                            '&:hover': { borderColor: moodColor, color: moodColor }
                          }}
                        >
                          Accent
                        </Button>
                      )}
                    </ButtonGroup>
                  </Box>
                </Box>
              </Paper>
            ))}
          </List>
        )}
      </Box>
      
      <Box sx={{ 
        mt: 3, 
        pt: 2, 
        borderTop: '1px solid #333',
        display: 'flex',
        alignItems: 'center'
      }}>
        <AutoAwesomeIcon sx={{ mr: 1, color: moodColor, fontSize: 18 }} />
        <Typography variant="caption" color="textSecondary">
          {customPrompt ? 
            'AI-powered recommendations based on your custom prompt' : 
            'AI-powered recommendations that complement your current font selection'}
        </Typography>
      </Box>
    </Paper>
  );
}

export default AIRecommendations;