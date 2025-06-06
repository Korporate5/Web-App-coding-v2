import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Header from './components/Header';
import FontBoard from './components/FontBoard';
import FontControls from './components/FontControls';
import AIRecommendations from './components/AIRecommendations';
import { loadFonts, getPopularFonts, getAIRecommendations } from './services/fontService';
import './styles/App.css';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#5CFF5C', // Lime green
    },
    secondary: {
      main: '#00B2FF', // Bright blue
    },
    background: {
      default: '#121212',
      paper: '#1E1E1E',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#AAAAAA',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 900,
      textTransform: 'uppercase',
    },
    h2: {
      fontWeight: 800,
      textTransform: 'uppercase',
    },
    h3: {
      fontWeight: 800,
      textTransform: 'uppercase',
    },
    h4: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 700,
    },
    button: {
      fontWeight: 600,
      textTransform: 'uppercase',
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#1E1E1E',
          backgroundImage: 'none',
          border: '1px solid #333',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'uppercase',
          fontWeight: 600,
        },
        containedPrimary: {
          color: '#000000',
        },
        containedSecondary: {
          color: '#000000',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#333',
            },
            '&:hover fieldset': {
              borderColor: '#555',
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

function App() {
  const [availableFonts, setAvailableFonts] = useState([]);
  const [selectedFonts, setSelectedFonts] = useState([]);
  const [sampleText, setSampleText] = useState('Typography is the art and technique of arranging type.');
  const [mood, setMood] = useState('professional');
  const [customPrompt, setCustomPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    // Load fonts from Google Fonts API
    const fetchFonts = async () => {
      try {
        setLoading(true);
        const fonts = await getPopularFonts();
        setAvailableFonts(fonts);
        
        // Load initial fonts
        const initialFontFamilies = [
          'Playfair Display',
          'Open Sans',
          'Roboto',
          'Montserrat',
          'Lora'
        ];
        
        loadFonts(initialFontFamilies);
        
        // Set initial selected fonts
        setSelectedFonts([
          { family: 'Playfair Display', category: 'serif', variant: 'regular', size: 48, role: 'heading' },
          { family: 'Open Sans', category: 'sans-serif', variant: 'regular', size: 16, role: 'body' },
        ]);
        
        // Get initial recommendations based on the initial selected fonts
        const initialFonts = [
          { family: 'Playfair Display', category: 'serif', variant: 'regular', size: 48, role: 'heading' },
          { family: 'Open Sans', category: 'sans-serif', variant: 'regular', size: 16, role: 'body' },
        ];
        const initialRecommendations = await getAIRecommendations('professional', initialFonts, '');
        setRecommendations(initialRecommendations);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching fonts:', error);
        setLoading(false);
      }
    };
    
    fetchFonts();
  }, []);

  const handleAddFont = (font) => {
    setSelectedFonts([...selectedFonts, font]);
  };

  const handleRemoveFont = (index) => {
    const newSelectedFonts = [...selectedFonts];
    newSelectedFonts.splice(index, 1);
    setSelectedFonts(newSelectedFonts);
  };

  const handleUpdateFont = (index, updatedFont) => {
    const newSelectedFonts = [...selectedFonts];
    newSelectedFonts[index] = { ...newSelectedFonts[index], ...updatedFont };
    setSelectedFonts(newSelectedFonts);
  };

  const handleMoodChange = async (newMood) => {
    setMood(newMood);
    try {
      setLoading(true);
      setCustomPrompt(''); // Clear custom prompt when selecting a predefined mood
      const newRecommendations = await getAIRecommendations(newMood, selectedFonts, '');
      setRecommendations(newRecommendations);
    } catch (error) {
      console.error('Error getting recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCustomPromptChange = async (newPrompt) => {
    setCustomPrompt(newPrompt);
    if (newPrompt.trim() !== '') {
      try {
        setLoading(true);
        const newRecommendations = await getAIRecommendations('', selectedFonts, newPrompt);
        setRecommendations(newRecommendations);
      } catch (error) {
        console.error('Error getting recommendations:', error);
      } finally {
        setLoading(false);
      }
    }
  };
  
  // Update recommendations when selected fonts change
  useEffect(() => {
    const updateRecommendations = async () => {
      if (selectedFonts.length > 0) {
        try {
          setLoading(true);
          const newRecommendations = await getAIRecommendations(mood, selectedFonts, customPrompt);
          setRecommendations(newRecommendations);
        } catch (error) {
          console.error('Error updating recommendations:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    
    // Only update when fonts change, not on initial render
    if (selectedFonts.length > 0) {
      updateRecommendations();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(selectedFonts)]);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="app">
        <Header />
        <main className="main-content">
          <div className="controls-container">
            <FontControls 
              availableFonts={availableFonts}
              selectedFonts={selectedFonts}
              onAddFont={handleAddFont}
              onRemoveFont={handleRemoveFont}
              onUpdateFont={handleUpdateFont}
              onSampleTextChange={setSampleText}
              onMoodChange={handleMoodChange}
              currentMood={mood}
              loading={loading}
            />
            <AIRecommendations 
              recommendations={recommendations} 
              onSelectRecommendation={handleAddFont}
              loading={loading}
              currentMood={mood}
              customPrompt={customPrompt}
            />
          </div>
          <FontBoard 
            selectedFonts={selectedFonts} 
            sampleText={sampleText} 
          />
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;

