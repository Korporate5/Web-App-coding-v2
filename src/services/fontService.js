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
    
    // Determine which roles we need to recommend for
    const currentRoles = currentFonts.map(font => font.role);
    const needsPrimary = !currentRoles.includes('heading');
    const needsSecondary = !currentRoles.includes('body');
    // Always recommend accent fonts
    const needsAccent = true;
    
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
    
    // Determine font pairings based on existing selections
    let recommendations = [];
    
    // Helper function to determine font role compatibility
    const getFontRoleRecommendations = (font) => {
      // Default roles this font would be good for
      let roles = [];
      
      // Serif fonts are typically good for headings and sometimes body
      if (font.category === 'serif') {
        roles.push('heading');
        if (Math.random() > 0.5) roles.push('body'); // Some serif fonts work well for body text
      }
      // Sans-serif fonts are versatile - good for both headings and body
      else if (font.category === 'sans-serif') {
        roles.push('heading');
        roles.push('body');
      }
      // Display fonts are best for headings and accents
      else if (font.category === 'display') {
        roles.push('heading');
        roles.push('accent');
      }
      // Handwriting fonts are best for accents
      else if (font.category === 'handwriting') {
        roles.push('accent');
      }
      // Monospace fonts are good for accents and sometimes body
      else if (font.category === 'monospace') {
        roles.push('accent');
        if (Math.random() > 0.7) roles.push('body'); // Occasionally monospace works for body
      }
      
      // If we have current fonts, adjust recommendations based on compatibility
      if (currentFonts.length > 0) {
        // Find primary/heading font if it exists
        const primaryFont = currentFonts.find(f => f.role === 'heading');
        // Find secondary/body font if it exists
        const secondaryFont = currentFonts.find(f => f.role === 'body');
        
        if (primaryFont) {
          // If primary font is serif, recommend sans-serif for body and vice versa
          if (primaryFont.category === 'serif' && font.category === 'sans-serif') {
            roles = roles.filter(r => r !== 'heading'); // Remove heading role
            if (!roles.includes('body')) roles.push('body');
          }
          // If primary font is sans-serif, serif can work well for body
          else if (primaryFont.category === 'sans-serif' && font.category === 'serif') {
            roles = roles.filter(r => r !== 'heading'); // Remove heading role
            if (!roles.includes('body')) roles.push('body');
          }
          // If primary font is display, recommend serif or sans-serif for body
          else if (primaryFont.category === 'display' && 
                  (font.category === 'serif' || font.category === 'sans-serif')) {
            roles = roles.filter(r => r !== 'heading'); // Remove heading role
            if (!roles.includes('body')) roles.push('body');
          }
        }
        
        if (secondaryFont) {
          // If secondary font is sans-serif, serif or display can work for headings
          if (secondaryFont.category === 'sans-serif' && 
              (font.category === 'serif' || font.category === 'display')) {
            roles = roles.filter(r => r !== 'body'); // Remove body role
            if (!roles.includes('heading')) roles.push('heading');
          }
          // If secondary font is serif, sans-serif or display can work for headings
          else if (secondaryFont.category === 'serif' && 
                  (font.category === 'sans-serif' || font.category === 'display')) {
            roles = roles.filter(r => r !== 'body'); // Remove body role
            if (!roles.includes('heading')) roles.push('heading');
          }
        }
      }
      
      // Always include accent as a possibility for variety
      if (!roles.includes('accent') && Math.random() > 0.6) {
        roles.push('accent');
      }
      
      return roles;
    };
    
    // Process each filtered font to add role recommendations
    filteredFonts.forEach(font => {
      const recommendedRoles = getFontRoleRecommendations(font);
      recommendations.push({
        ...font,
        recommendedRoles
      });
    });
    
    // Sort recommendations to prioritize fonts that fill needed roles
    recommendations.sort((a, b) => {
      // Prioritize fonts that can be used for roles we need
      const aFillsNeeded = (needsPrimary && a.recommendedRoles.includes('heading')) || 
                          (needsSecondary && a.recommendedRoles.includes('body'));
      const bFillsNeeded = (needsPrimary && b.recommendedRoles.includes('heading')) || 
                          (needsSecondary && b.recommendedRoles.includes('body'));
      
      if (aFillsNeeded && !bFillsNeeded) return -1;
      if (!aFillsNeeded && bFillsNeeded) return 1;
      return 0;
    });
    
    // Return top 5 recommendations
    return recommendations.slice(0, 5);
  } catch (error) {
    console.error('Error getting AI recommendations:', error);
    
    // Fallback to static recommendations if API fails
    const mockRecommendations = {
      'professional': [
        { family: 'Roboto', category: 'sans-serif', recommendedRoles: ['heading', 'body'] },
        { family: 'Merriweather', category: 'serif', recommendedRoles: ['heading', 'body'] },
        { family: 'Source Sans Pro', category: 'sans-serif', recommendedRoles: ['body', 'accent'] },
      ],
      'creative': [
        { family: 'Pacifico', category: 'display', recommendedRoles: ['heading', 'accent'] },
        { family: 'Amatic SC', category: 'handwriting', recommendedRoles: ['heading', 'accent'] },
        { family: 'Caveat', category: 'handwriting', recommendedRoles: ['accent'] },
      ],
      'elegant': [
        { family: 'Cormorant Garamond', category: 'serif', recommendedRoles: ['heading', 'body'] },
        { family: 'Playfair Display', category: 'serif', recommendedRoles: ['heading'] },
        { family: 'Cinzel', category: 'serif', recommendedRoles: ['heading', 'accent'] },
      ],
      'playful': [
        { family: 'Comic Neue', category: 'handwriting', recommendedRoles: ['body', 'accent'] },
        { family: 'Fredoka One', category: 'display', recommendedRoles: ['heading', 'accent'] },
        { family: 'Bubblegum Sans', category: 'display', recommendedRoles: ['heading', 'accent'] },
      ],
      'modern': [
        { family: 'Montserrat', category: 'sans-serif', recommendedRoles: ['heading', 'body'] },
        { family: 'Raleway', category: 'sans-serif', recommendedRoles: ['heading', 'body'] },
        { family: 'Poppins', category: 'sans-serif', recommendedRoles: ['heading', 'body', 'accent'] },
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