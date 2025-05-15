import React, { useState } from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';import ButtonGroup from '@mui/material/ButtonGroup';import AddIcon from '@mui/icons-material/Add';
import CircularProgress from '@mui/material/CircularProgress';import TuneIcon from '@mui/icons-material/Tune';import { loadFonts } from '../services/fontService';

function FontControls({
  availableFonts,
  selectedFonts,
  onAddFont,
  onRemoveFont,
  onUpdateFont,
  onSampleTextChange,
  onMoodChange,
  onCustomPromptChange,
  currentMood,
  customPrompt,
  loading
}) {
  const [newFontFamily, setNewFontFamily] = useState('');
  const [newFontVariant, setNewFontVariant] = useState('regular');
  const [newFontSize, setNewFontSize] = useState(16);
  const [newFontRole, setNewFontRole] = useState('body');
  const [sampleText, setSampleText] = useState('Typography is the art and technique of arranging type.');
  const [searchQuery, setSearchQuery] = useState('');

  const handleAddFont = () => {
    if (!newFontFamily) return;
    
    const selectedFont = availableFonts.find(font => font.family === newFontFamily);
    if (!selectedFont) return;
    
    const newFont = {
      family: selectedFont.family,
      category: selectedFont.category,
      variant: newFontVariant,
      size: newFontSize,
      role: newFontRole
    };
    
    // Load the font if it's not already loaded
    loadFonts([newFontFamily]);
    
    onAddFont(newFont);
    
    // Reset form
    setNewFontFamily('');
    setNewFontVariant('regular');
    setNewFontSize(16);
    setNewFontRole('body');
  };

  const handleSampleTextChange = (e) => {
    setSampleText(e.target.value);
    onSampleTextChange(e.target.value);
  };

  const moods = [
    { value: 'professional', label: 'Professional', color: '#5CFF5C' },
    { value: 'creative', label: 'Creative', color: '#00B2FF' },
    { value: 'elegant', label: 'Elegant', color: '#5CFF5C' },
    { value: 'playful', label: 'Playful', color: '#00B2FF' },
    { value: 'modern', label: 'Modern', color: '#5CFF5C' },
  ];

  // Filter fonts based on search query
  const filteredFonts = availableFonts.filter(font => 
    font.family.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          className="control-card-number"
          sx={{ 
            backgroundColor: '#5CFF5C',
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
          1
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
          Font Controls
        </Typography>
      </Box>
      
      <Box sx={{ mt: 3 }}>
        <Typography 
          variant="subtitle1" 
          sx={{ 
            mb: 1.5, 
            fontWeight: 700, 
            fontSize: '16px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}
        >
          Project Mood
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
          {moods.map((mood) => (
            <Button
              key={mood.value}
              variant={currentMood === mood.value && !customPrompt ? 'contained' : 'outlined'}
              onClick={() => onMoodChange(mood.value)}
              disabled={loading}
              sx={{
                backgroundColor: currentMood === mood.value && !customPrompt ? mood.color : 'transparent',
                color: currentMood === mood.value && !customPrompt ? '#000' : '#fff',
                borderColor: mood.color,
                '&:hover': {
                  backgroundColor: currentMood === mood.value && !customPrompt ? mood.color : `${mood.color}33`,
                  borderColor: mood.color
                },
                mb: 1,
                mr: 1
              }}
            >
              {mood.label}
            </Button>
          ))}
        </Box>
        
        <Typography 
          variant="subtitle1" 
          sx={{ 
            mb: 1.5, 
            fontWeight: 700, 
            fontSize: '16px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}
        >
          Custom Prompt
        </Typography>
        <TextField
          fullWidth
          placeholder="Describe your desired style or feeling..."
          value={customPrompt}
          onChange={(e) => onCustomPromptChange(e.target.value)}
          variant="outlined"
          size="small"
          disabled={loading}
          sx={{
            mb: 3,
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: '#444',
              },
              '&:hover fieldset': {
                borderColor: '#666',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#00B2FF',
              },
            },
          }}
          helperText="Try 'elegant and modern' or 'playful for kids' or 'professional for finance'"
        />
      </Box>
      
      <Box sx={{ mb: 3 }}>
        <Typography 
          variant="subtitle1" 
          sx={{ 
            mb: 1.5, 
            fontWeight: 700, 
            fontSize: '16px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}
        >
          Sample Text
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={2}
          value={sampleText}
          onChange={handleSampleTextChange}
          variant="outlined"
          size="small"          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: '#444',
              },
              '&:hover fieldset': {
                borderColor: '#666',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#5CFF5C',
              },
            },
          }}        />
      </Box>
      
      <Box sx={{ mb: 3 }}>
        <Typography 
          variant="subtitle1" 
          sx={{ 
            mb: 1.5, 
            fontWeight: 700, 
            fontSize: '16px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <TuneIcon sx={{ mr: 1, fontSize: 20 }} />
          Add New Font
        </Typography>
        
        <TextField
          fullWidth
          size="small"
          label="Search Fonts"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ 
            mb: 2,
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: '#444',
              },
              '&:hover fieldset': {
                borderColor: '#666',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#5CFF5C',
              },
            },
          }}
          disabled={loading}
        />
        
        <FormControl 
          fullWidth 
          size="small" 
          sx={{ mb: 2 }}
        >
          <InputLabel>Font Family</InputLabel>
          <Select
            value={newFontFamily}
            onChange={(e) => setNewFontFamily(e.target.value)}
            label="Font Family"
            disabled={loading}            sx={{
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#444',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#666',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#5CFF5C',
              },
            }}          >
            {loading ? (
              <MenuItem value="">Loading fonts...</MenuItem>
            ) : filteredFonts.length === 0 ? (
              <MenuItem value="">No fonts found</MenuItem>
            ) : (
              filteredFonts.slice(0, 100).map((font) => (
                <MenuItem 
                  key={font.family} 
                  value={font.family}
                  sx={{
                    fontFamily: `"${font.family}", ${font.category}`,
                  }}
                >
                  {font.family}
                </MenuItem>
              ))
            )}
          </Select>
        </FormControl>
        
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <FormControl 
            fullWidth 
            size="small"
          >
            <InputLabel>Variant</InputLabel>
            <Select
              value={newFontVariant}
              onChange={(e) => setNewFontVariant(e.target.value)}
              label="Variant"
              disabled={loading}
              sx={{
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#444',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#666',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#5CFF5C',
                },
              }}
            >
              <MenuItem value="regular">Regular</MenuItem>
              <MenuItem value="bold">Bold</MenuItem>
              <MenuItem value="italic">Italic</MenuItem>
              <MenuItem value="bold italic">Bold Italic</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl 
            fullWidth 
            size="small"
          >
            <InputLabel>Role</InputLabel>
            <Select
              value={newFontRole}
              onChange={(e) => setNewFontRole(e.target.value)}
              label="Role"
              disabled={loading}
              sx={{
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#444',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#666',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#5CFF5C',
                },
              }}
            >
              <MenuItem value="heading">Heading</MenuItem>
              <MenuItem value="subheading">Subheading</MenuItem>
              <MenuItem value="body">Body Text</MenuItem>
              <MenuItem value="caption">Caption</MenuItem>
              <MenuItem value="accent">Accent</MenuItem>
            </Select>
          </FormControl>
        </Box>
        
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" gutterBottom sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Size: {newFontSize}px</span>
            <span style={{ color: '#999' }}>{newFontSize < 16 ? 'Small' : newFontSize < 24 ? 'Medium' : newFontSize < 36 ? 'Large' : 'X-Large'}</span>
          </Typography>
          <Slider
            value={newFontSize}
            onChange={(e, newValue) => setNewFontSize(newValue)}
            min={8}
            max={72}
            step={1}
            valueLabelDisplay="auto"
            disabled={loading}            sx={{
              color: '#5CFF5C',
              '& .MuiSlider-thumb': {
                '&:hover, &.Mui-focusVisible': {
                  boxShadow: '0px 0px 0px 8px rgba(92, 255, 92, 0.16)',
                },
              },
            }}          />
        </Box>


        
        <Button 
          variant="contained" 
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <AddIcon />}
          onClick={handleAddFont}
          fullWidth
          disabled={loading || !newFontFamily}          sx={{
            backgroundColor: '#5CFF5C',
            color: '#000',
            '&:hover': {
              backgroundColor: '#4AEE4A',
            },
            fontWeight: 600,
            py: 1
          }}        >
          {loading ? 'Loading...' : 'Add Font'}
        </Button>
      </Box>
      
      <Box sx={{ mt: 3 }}>
        <Typography 
          variant="subtitle1" 
          sx={{ 
            mb: 1.5, 
            fontWeight: 700, 
            fontSize: '16px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}
        >
          Current Fonts
        </Typography>
        
        {selectedFonts.length === 0 ? (
          <Box 
            sx={{ 
              backgroundColor: '#252525', 
              p: 2, 
              borderRadius: '8px',
              textAlign: 'center'
            }}
          >
            <Typography variant="body2" color="textSecondary">
              No fonts added yet
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {selectedFonts.map((font, index) => (
              <Chip
                key={index}
                label={`${font.family} (${font.role})`}
                onDelete={() => onRemoveFont(index)}
                disabled={loading}                sx={{
                  backgroundColor: font.role === 'heading' ? '#5CFF5C33' : '#00B2FF33',
                  color: font.role === 'heading' ? '#5CFF5C' : '#00B2FF',
                  borderColor: font.role === 'heading' ? '#5CFF5C' : '#00B2FF',
                  border: '1px solid',
                  '& .MuiChip-deleteIcon': {
                    color: font.role === 'heading' ? '#5CFF5C' : '#00B2FF',
                    '&:hover': {
                      color: '#fff',
                    },
                  },
                }}              />
            ))}
          </Box>
        )}
      </Box>
    </Paper>
  );
}

export default FontControls;