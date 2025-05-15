import WebFont from 'webfontloader';
import axios from 'axios';

// Google Fonts API key
const GOOGLE_FONTS_API_KEY = 'AIzaSyCd0T-KZJrPpd-THf1wZ6x3UCaYQJd-GW0';
const GOOGLE_FONTS_API_URL = 'https://www.googleapis.com/webfonts/v1/webfonts';

// Load fonts using WebFontLoader
export const loadFonts = (fontFamilies) => {
  if (!fontFamilies || fontFamilies.length === 0) return;
  
  WebFont.load({
    google: {
      families: fontFamilies
    },
    timeout: 2000
  });
};

// Fetch fonts from Google Fonts API
export const fetchGoogleFonts = async (sort = 'popularity') => {
  try {
    const response = await axios.get(GOOGLE_FONTS_API_URL, {
      params: {
        key: GOOGLE_FONTS_API_KEY,
        sort: sort // 'popularity', 'trending', 'alpha'
      }
    });
    
    return response.data.items.map(font => ({
      family: font.family,
      category: font.category,
      variants: font.variants,
      lastModified: font.lastModified,
      files: font.files
    }));
  } catch (error) {
    console.error('Error fetching Google Fonts:', error);
    return [];
  }
};

// Get AI recommendations based on mood and current fonts
export const getAIRecommendations = async (mood, currentFonts = [], customPrompt = '') => {
  try {
    // Fetch a larger set of fonts to choose from
    const allFonts = await fetchGoogleFonts();
    
    // Filter fonts based on mood or custom prompt
    let filteredFonts = [];
    
    // If there's a custom prompt, use it to filter fonts
    if (customPrompt && customPrompt.trim() !== '') {
      // Convert prompt to lowercase for case-insensitive matching
      const prompt = customPrompt.toLowerCase();
      
      // Map common descriptive terms to font categories
      const promptMappings = {
        // Professional/Business terms
        'professional': ['sans-serif', 'serif'],
        'business': ['sans-serif', 'serif'],
        'corporate': ['sans-serif'],
        'formal': ['serif'],
        'serious': ['serif', 'sans-serif'],
        
        // Creative terms
        'creative': ['display', 'handwriting'],
        'artistic': ['display', 'handwriting'],
        'unique': ['display'],
        'expressive': ['handwriting', 'display'],
        
        // Elegant/Luxury terms
        'elegant': ['serif'],
        'luxury': ['serif'],
        'sophisticated': ['serif'],
        'classy': ['serif'],
        'premium': ['serif'],
        
        // Playful terms
        'playful': ['handwriting', 'display'],
        'fun': ['handwriting', 'display'],
        'casual': ['handwriting'],
        'friendly': ['handwriting'],
        'childlike': ['handwriting'],
        'kids': ['handwriting', 'display'],
        
        // Modern terms
        'modern': ['sans-serif'],
        'minimal': ['sans-serif'],
        'clean': ['sans-serif'],
        'tech': ['sans-serif'],
        'digital': ['sans-serif'],
        'futuristic': ['sans-serif'],
        
        // Vintage/Retro terms
        'vintage': ['serif', 'display'],
        'retro': ['display'],
        'classic': ['serif'],
        'old': ['serif'],
        'traditional': ['serif'],
        
        // Emotional terms
        'happy': ['handwriting', 'display'],
        'sad': ['serif'],
        'serious': ['serif', 'sans-serif'],
        'romantic': ['handwriting', 'serif'],
        'bold': ['sans-serif', 'display'],
        'strong': ['sans-serif'],
        'delicate': ['serif', 'handwriting'],
        'soft': ['handwriting'],
        
        // Industry-specific terms
        'fashion': ['serif', 'display'],
        'tech': ['sans-serif'],
        'food': ['handwriting', 'display'],
        'travel': ['sans-serif', 'handwriting'],
        'education': ['serif', 'sans-serif'],
        'health': ['sans-serif'],
        'finance': ['sans-serif', 'serif'],
        'sports': ['sans-serif', 'display'],
        'music': ['display', 'handwriting'],
        'art': ['display', 'handwriting'],
      };
      
      // Check if any words in the prompt match our mappings
      const promptWords = prompt.split(/\s+/);
      let matchedCategories = new Set();
      
      promptWords.forEach(word => {
        for (const [key, categories] of Object.entries(promptMappings)) {
          if (word.includes(key) || key.includes(word)) {
            categories.forEach(category => matchedCategories.add(category));
          }
        }
      });
      
      // If we found matches, filter by those categories
      if (matchedCategories.size > 0) {
        const categoryArray = Array.from(matchedCategories);
        filteredFonts = allFonts.filter(font => 
          categoryArray.includes(font.category)
        );
      } else {
        // If no specific matches, default to all fonts
        filteredFonts = allFonts;
      }
    } else {
      // Use the predefined mood filters if no custom prompt
      switch (mood) {
        case 'professional':
          // For professional, prefer sans-serif and serif fonts
          filteredFonts = allFonts.filter(font => 
            ['sans-serif', 'serif'].includes(font.category)
          );
          break;
        case 'creative':
          // For creative, prefer display and handwriting fonts
          filteredFonts = allFonts.filter(font => 
            ['display', 'handwriting'].includes(font.category)
          );
          break;
        case 'elegant':
          // For elegant, prefer serif fonts
          filteredFonts = allFonts.filter(font => 
            font.category === 'serif'
          );
          break;
        case 'playful':
          // For playful, prefer handwriting and display fonts
          filteredFonts = allFonts.filter(font => 
            ['handwriting', 'display'].includes(font.category)
          );
          break;
        case 'modern':
          // For modern, prefer sans-serif fonts
          filteredFonts = allFonts.filter(font => 
            font.category === 'sans-serif'
          );
          break;
        default:
          filteredFonts = allFonts;
      }
    }
    
    // Exclude fonts that are already selected
    const currentFontFamilies = currentFonts.map(font => font.family);
    filteredFonts = filteredFonts.filter(font => 
      !currentFontFamilies.includes(font.family)
    );
    
    // Return top 5 recommendations
    return filteredFonts.slice(0, 5);
  } catch (error) {
    console.error('Error getting AI recommendations:', error);
    
    // Fallback to static recommendations if API fails
    const mockRecommendations = {
      'professional': [
        { family: 'Roboto', category: 'sans-serif' },
        { family: 'Merriweather', category: 'serif' },
        { family: 'Source Sans Pro', category: 'sans-serif' },
      ],
      'creative': [
        { family: 'Pacifico', category: 'display' },
        { family: 'Amatic SC', category: 'handwriting' },
        { family: 'Caveat', category: 'handwriting' },
      ],
      'elegant': [
        { family: 'Cormorant Garamond', category: 'serif' },
        { family: 'Playfair Display', category: 'serif' },
        { family: 'Cinzel', category: 'serif' },
      ],
      'playful': [
        { family: 'Comic Neue', category: 'handwriting' },
        { family: 'Fredoka One', category: 'display' },
        { family: 'Bubblegum Sans', category: 'display' },
      ],
      'modern': [
        { family: 'Montserrat', category: 'sans-serif' },
        { family: 'Raleway', category: 'sans-serif' },
        { family: 'Poppins', category: 'sans-serif' },
      ],
    };
    
    return mockRecommendations[mood] || [];
  }
};

// Get popular Google Fonts
export const getPopularFonts = async () => {
  try {
    // Fetch popular fonts from Google Fonts API
    return await fetchGoogleFonts('popularity');
  } catch (error) {
    console.error('Error fetching popular fonts:', error);
    
    // Fallback to static list if API fails
    return [
      { family: 'Roboto', category: 'sans-serif', variants: ['regular', 'bold', 'italic', 'bold italic'] },
      { family: 'Open Sans', category: 'sans-serif', variants: ['regular', 'bold', 'italic', 'bold italic'] },
      { family: 'Lato', category: 'sans-serif', variants: ['regular', 'bold', 'italic', 'bold italic'] },
      { family: 'Montserrat', category: 'sans-serif', variants: ['regular', 'bold', 'italic', 'bold italic'] },
      { family: 'Roboto Condensed', category: 'sans-serif', variants: ['regular', 'bold', 'italic', 'bold italic'] },
      { family: 'Source Sans Pro', category: 'sans-serif', variants: ['regular', 'bold', 'italic', 'bold italic'] },
      { family: 'Oswald', category: 'sans-serif', variants: ['regular', 'bold'] },
      { family: 'Raleway', category: 'sans-serif', variants: ['regular', 'bold', 'italic', 'bold italic'] },
      { family: 'Merriweather', category: 'serif', variants: ['regular', 'bold', 'italic', 'bold italic'] },
      { family: 'Playfair Display', category: 'serif', variants: ['regular', 'bold', 'italic', 'bold italic'] },
      { family: 'Lora', category: 'serif', variants: ['regular', 'bold', 'italic', 'bold italic'] },
      { family: 'PT Serif', category: 'serif', variants: ['regular', 'bold', 'italic', 'bold italic'] },
      { family: 'Roboto Slab', category: 'serif', variants: ['regular', 'bold'] },
      { family: 'Noto Serif', category: 'serif', variants: ['regular', 'bold', 'italic', 'bold italic'] },
      { family: 'Pacifico', category: 'display', variants: ['regular'] },
      { family: 'Dancing Script', category: 'handwriting', variants: ['regular', 'bold'] },
      { family: 'Caveat', category: 'handwriting', variants: ['regular', 'bold'] },
      { family: 'Permanent Marker', category: 'display', variants: ['regular'] },
      { family: 'Amatic SC', category: 'handwriting', variants: ['regular', 'bold'] },
      { family: 'Architects Daughter', category: 'handwriting', variants: ['regular'] },
    ];
  }
};