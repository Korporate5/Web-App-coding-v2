import React, { useRef } from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import ArticleIcon from '@mui/icons-material/Article';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

// Sample article content for the preview
const sampleArticleContent = {
  title: "The Art of Typography",
  subtitle: "How fonts shape our digital experience",
  paragraphs: [
    "Typography is more than just selecting pretty fonts. It's an art form that balances aesthetics with readability, emotion with function. The right typeface can convey authority, playfulness, elegance, or innovation without a single word being read.",
    "When pairing fonts, contrast is key. A serif heading with a sans-serif body text creates visual hierarchy while maintaining readability. The weight, spacing, and size of each font contributes to the overall harmony of the design.",
    "Color, alignment, and spacing work together with font choices to create a cohesive visual language. This language speaks to users before they've read a single word, setting expectations and guiding their experience."
  ],
  quote: "Design is thinking made visual.",
  quoteAuthor: "Saul Bass",
  caption: "Typography affects everything from readability to emotional response."
};

function FontBoard({ selectedFonts, sampleText }) {
  const articlePreviewRef = useRef(null);

  const handleExport = () => {
    if (!articlePreviewRef.current || selectedFonts.length === 0) return;

    try {
      // Check if jsPDF and html2canvas are available from CDN
      if (window && window.jspdf && window.html2canvas) {
        exportAsPDF();
      } else {
        // Fallback to text export
        exportAsText();
      }
    } catch (error) {
      console.error('Error exporting font selection:', error);
      alert('There was an error exporting the font selection. Falling back to text export.');
      exportAsText();
    }
  };

  const exportAsPDF = async () => {
    try {
      // Find heading and body fonts
      const headingFont = selectedFonts.find(f => f.role === 'heading') || 
                        selectedFonts.find(f => f.size >= 24) || 
                        selectedFonts[0];
                        
      const subheadingFont = selectedFonts.find(f => f.role === 'subheading') || 
                          selectedFonts.find(f => f.size >= 18 && f.size < 24) || 
                          headingFont;
                          
      const bodyFont = selectedFonts.find(f => f.role === 'body') || 
                      selectedFonts.find(f => f.size < 18) || 
                      (selectedFonts.length > 1 ? selectedFonts[1] : selectedFonts[0]);
                      
      const captionFont = selectedFonts.find(f => f.role === 'caption') || 
                        bodyFont;

      // Create a clone of the article preview with font annotations
      const previewClone = articlePreviewRef.current.cloneNode(true);
      previewClone.style.backgroundColor = '#fff';
      previewClone.style.color = '#000';
      previewClone.style.padding = '30px';
      previewClone.style.position = 'absolute';
      previewClone.style.left = '-9999px';
      
      // Set the exact dimensions from the image
      previewClone.style.width = '533.79px';
      previewClone.style.height = '147.98px';
      
      // Make all text black
      const allTextElements = previewClone.querySelectorAll('*');
      allTextElements.forEach(el => {
        if (el.style) {
          el.style.color = '#000';
        }
      });
      
      // Create a two-column layout
      previewClone.style.display = 'flex';
      previewClone.style.flexDirection = 'row';
      previewClone.style.justifyContent = 'space-between';
      previewClone.style.padding = '0';
      previewClone.style.overflow = 'hidden';
      
      // Clear existing content
      while (previewClone.firstChild) {
        previewClone.removeChild(previewClone.firstChild);
      }
      
      // Create left column (for graphic/logo)
      const leftColumn = document.createElement('div');
      leftColumn.style.width = '238.21px';
      leftColumn.style.height = '147.98px';
      leftColumn.style.backgroundColor = '#fff';
      leftColumn.style.position = 'relative';
      
      // Add diagonal stripes to left column (similar to the image)
      const stripes = document.createElement('div');
      stripes.style.width = '100%';
      stripes.style.height = '100%';
      stripes.style.position = 'absolute';
      stripes.style.top = '0';
      stripes.style.left = '0';
      stripes.style.backgroundImage = 'linear-gradient(45deg, #000 25%, transparent 25%, transparent 50%, #000 50%, #000 75%, transparent 75%, transparent)';
      stripes.style.backgroundSize = '20px 20px';
      leftColumn.appendChild(stripes);
      
      // Create right column (for text)
      const rightColumn = document.createElement('div');
      rightColumn.style.width = '255.63px';
      rightColumn.style.height = '147.98px';
      rightColumn.style.backgroundColor = '#fff';
      rightColumn.style.display = 'flex';
      rightColumn.style.flexDirection = 'column';
      rightColumn.style.justifyContent = 'center';
      
      // Add font information to right column
      const fontTitle = document.createElement('div');
      fontTitle.style.fontFamily = `"${headingFont.family}", ${headingFont.category}`;
      fontTitle.style.fontSize = '36px';
      fontTitle.style.fontWeight = 'bold';
      fontTitle.style.color = '#000';
      fontTitle.style.marginBottom = '10px';
      fontTitle.textContent = headingFont.family;
      
      const fontSubtitle = document.createElement('div');
      fontSubtitle.style.fontFamily = `"${bodyFont.family}", ${bodyFont.category}`;
      fontSubtitle.style.fontSize = '24px';
      fontSubtitle.style.color = '#000';
      fontSubtitle.style.marginBottom = '10px';
      fontSubtitle.textContent = 'Design';
      
      rightColumn.appendChild(fontTitle);
      rightColumn.appendChild(fontSubtitle);
      
      // Add columns to the preview
      previewClone.appendChild(leftColumn);
      previewClone.appendChild(rightColumn);
      
      document.body.appendChild(previewClone);
      
      // Generate PDF using CDN-loaded libraries
      const html2canvas = window.html2canvas;
      const { jsPDF } = window.jspdf;
      
      const canvas = await html2canvas(previewClone, {
        scale: 2, // Higher scale for better quality
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      
      document.body.removeChild(previewClone);
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [533.79, 147.98]
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, 533.79, 147.98);
      pdf.save('font-selection.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('There was an error generating the PDF. Falling back to text export.');
      exportAsText();
    }
  };

  const exportAsText = () => {
    // Find heading and body fonts
    const headingFont = selectedFonts.find(f => f.role === 'heading') || 
                      selectedFonts.find(f => f.size >= 24) || 
                      selectedFonts[0];
                      
    const subheadingFont = selectedFonts.find(f => f.role === 'subheading') || 
                        selectedFonts.find(f => f.size >= 18 && f.size < 24) || 
                        headingFont;
                        
    const bodyFont = selectedFonts.find(f => f.role === 'body') || 
                    selectedFonts.find(f => f.size < 18) || 
                    (selectedFonts.length > 1 ? selectedFonts[1] : selectedFonts[0]);
                    
    const captionFont = selectedFonts.find(f => f.role === 'caption') || 
                      bodyFont;

    // Create a text representation of the font information
    const fontInfo = `\nFont Selection Summary\n\nHeading Font: ${headingFont.family}, ${headingFont.size}px, ${headingFont.variant}\nSubheading Font: ${subheadingFont.family}, ${subheadingFont.size}px, ${subheadingFont.variant}\nBody Font: ${bodyFont.family}, ${bodyFont.size}px, ${bodyFont.variant}\nCaption Font: ${captionFont.family}, ${captionFont.size}px, ${captionFont.variant}\n\n`;
    
    // Create a text representation of the article content
    const articleContent = `${sampleArticleContent.title} (${headingFont.family}, ${headingFont.size}px)\n${sampleArticleContent.subtitle} (${subheadingFont.family}, ${subheadingFont.size}px)\n\n${sampleArticleContent.paragraphs.join('\n\n')} (${bodyFont.family}, ${bodyFont.size}px)\n\n"${sampleArticleContent.quote}" \u2014 ${sampleArticleContent.quoteAuthor} (${headingFont.family}, ${Math.min(headingFont.size * 0.8, 32)}px)\n\n${sampleArticleContent.caption} (${captionFont.family}, ${Math.max(captionFont.size * 0.8, 12)}px)`;
    
    // Combine the font info and article content
    const exportContent = fontInfo + articleContent;
    
    // Create a blob and download it
    const blob = new Blob([exportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'font-selection.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Paper 
      className="font-board custom-scrollbar" 
      elevation={0}
      sx={{ 
        backgroundColor: '#1E1E1E',
        border: '1px solid #333',
        borderRadius: '16px',
        p: 3
      }}
    >
      <Box className="font-board-header">
        <Box>
          <Typography 
            variant="h2" 
            className="font-board-title"
            sx={{ 
              fontSize: { xs: '20px', sm: '24px' },
              fontWeight: 800,
              letterSpacing: 0.5,
              textTransform: 'uppercase'
            }}
          >
            Font Preview
          </Typography>
          <Typography 
            variant="body2" 
            className="font-board-subtitle"
            sx={{ color: '#999' }}
          >
            See how your selected fonts look together
          </Typography>
        </Box>
        <FormatQuoteIcon sx={{ fontSize: 40, color: '#5CFF5C' }} />
      </Box>

      {selectedFonts.length === 0 ? (
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            height: '300px',
            backgroundColor: '#252525',
            borderRadius: '12px',
            p: 3
          }}
        >
          <Typography variant="h5" color="textSecondary" align="center" sx={{ mb: 2 }}>
            Add fonts to see them displayed here
          </Typography>
          <Typography variant="body2" color="textSecondary" align="center">
            Select fonts from the controls panel or use AI recommendations
          </Typography>
        </Box>
      ) : (
        <>
          {/* Individual font previews */}
          {selectedFonts.map((font, index) => (
            <Box key={index} className="font-pair-card" sx={{ mb: 3 }}>
              <Box className="font-pair-header">
                <Typography className="font-pair-title" sx={{ fontWeight: 700 }}>
                  {font.family} ({font.variant})
                </Typography>
                <Chip 
                  label={font.role || 'Text'} 
                  size="small"
                  className={`font-pair-role ${font.role === 'body' ? 'body' : ''}`}
                  sx={{ 
                    backgroundColor: font.role === 'body' ? '#00B2FF' : '#5CFF5C',
                    color: '#000',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    fontSize: '11px'
                  }}
                />
              </Box>
              <Typography 
                className="font-sample"
                style={{
                  fontFamily: `"${font.family}", ${font.category}`,
                  fontSize: `${font.size}px`,
                  fontWeight: font.variant.includes('bold') ? 'bold' : 'normal',
                  fontStyle: font.variant.includes('italic') ? 'italic' : 'normal',
                  lineHeight: 1.3,
                }}
              >
                {sampleText}
              </Typography>
              <Typography variant="caption" sx={{ display: 'block', mt: 2, color: '#777' }}>
                {font.size}px • {font.category}
              </Typography>
            </Box>
          ))}
          
          {/* Article Preview Section */}
          <Box sx={{ mt: 5, mb: 3 }}>
            <Divider sx={{ mb: 4 }} />
            <Box className="font-board-header" sx={{ mb: 3 }}>
              <Box>
                <Typography 
                  variant="h2" 
                  className="font-board-title"
                  sx={{ 
                    fontSize: { xs: '20px', sm: '24px' },
                    fontWeight: 800,
                    letterSpacing: 0.5,
                    textTransform: 'uppercase'
                  }}
                >
                  Article Preview
                </Typography>
                <Typography 
                  variant="body2" 
                  className="font-board-subtitle"
                  sx={{ color: '#999' }}
                >
                  See how your selected fonts work in a real-world context
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Button
                  variant="outlined"
                  startIcon={<FileDownloadIcon />}
                  onClick={handleExport}
                  disabled={selectedFonts.length === 0}
                  sx={{
                    mr: 2,
                    color: '#00B2FF',
                    borderColor: '#00B2FF',
                    '&:hover': {
                      backgroundColor: '#00B2FF22',
                      borderColor: '#00B2FF'
                    }
                  }}
                >
                  Export with Font Info
                </Button>
                <ArticleIcon sx={{ fontSize: 40, color: '#00B2FF' }} />
              </Box>
            </Box>
            
            {/* Article content using the selected fonts */}
            <Box 
              className="article-preview" 
              ref={articlePreviewRef}
              sx={{ 
                backgroundColor: '#252525', 
                borderRadius: '12px',
                p: 4,
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Find heading and body fonts */}
              {(() => {
                const headingFont = selectedFonts.find(f => f.role === 'heading') || 
                                  selectedFonts.find(f => f.size >= 24) || 
                                  selectedFonts[0];
                                  
                const subheadingFont = selectedFonts.find(f => f.role === 'subheading') || 
                                     selectedFonts.find(f => f.size >= 18 && f.size < 24) || 
                                     headingFont;
                                     
                const bodyFont = selectedFonts.find(f => f.role === 'body') || 
                                selectedFonts.find(f => f.size < 18) || 
                                (selectedFonts.length > 1 ? selectedFonts[1] : selectedFonts[0]);
                                
                const captionFont = selectedFonts.find(f => f.role === 'caption') || 
                                  bodyFont;
                
                return (
                  <>
                    {/* Article Title */}
                    <Typography 
                      variant="h1" 
                      gutterBottom
                      sx={{ 
                        fontFamily: `"${headingFont.family}", ${headingFont.category}`,
                        fontSize: `${Math.min(headingFont.size * 1.2, 60)}px`,
                        fontWeight: headingFont.variant.includes('bold') ? 'bold' : 800,
                        fontStyle: headingFont.variant.includes('italic') ? 'italic' : 'normal',
                        lineHeight: 1.2,
                        mb: 1,
                        color: '#fff'
                      }}
                    >
                      {sampleArticleContent.title}
                    </Typography>
                    
                    {/* Article Subtitle */}
                    <Typography 
                      variant="h2" 
                      gutterBottom
                      sx={{ 
                        fontFamily: `"${subheadingFont.family}", ${subheadingFont.category}`,
                        fontSize: `${Math.min(subheadingFont.size, 28)}px`,
                        fontWeight: subheadingFont.variant.includes('bold') ? 'bold' : 600,
                        fontStyle: subheadingFont.variant.includes('italic') ? 'italic' : 'normal',
                        lineHeight: 1.3,
                        mb: 3,
                        color: '#ccc'
                      }}
                    >
                      {sampleArticleContent.subtitle}
                    </Typography>
                    
                    {/* Article Paragraphs */}
                    {sampleArticleContent.paragraphs.map((paragraph, idx) => (
                      <Typography 
                        key={idx} 
                        paragraph
                        sx={{ 
                          fontFamily: `"${bodyFont.family}", ${bodyFont.category}`,
                          fontSize: `${bodyFont.size}px`,
                          fontWeight: bodyFont.variant.includes('bold') ? 'bold' : 'normal',
                          fontStyle: bodyFont.variant.includes('italic') ? 'italic' : 'normal',
                          lineHeight: 1.6,
                          mb: 2,
                          color: '#eee'
                        }}
                      >
                        {paragraph}
                      </Typography>
                    ))}
                    
                    {/* Blockquote */}
                    <Box 
                      sx={{ 
                        borderLeft: '4px solid #00B2FF', 
                        pl: 3, 
                        my: 4,
                        py: 1
                      }}
                    >
                      <Typography 
                        sx={{ 
                          fontFamily: `"${headingFont.family}", ${headingFont.category}`,
                          fontSize: `${Math.min(headingFont.size * 0.8, 32)}px`,
                          fontWeight: headingFont.variant.includes('bold') ? 'bold' : 600,
                          fontStyle: 'italic',
                          lineHeight: 1.4,
                          color: '#fff'
                        }}
                      >
                        "{sampleArticleContent.quote}"
                      </Typography>
                      <Typography 
                        sx={{ 
                          fontFamily: `"${bodyFont.family}", ${bodyFont.category}`,
                          fontSize: `${bodyFont.size}px`,
                          fontWeight: bodyFont.variant.includes('bold') ? 'bold' : 'normal',
                          fontStyle: bodyFont.variant.includes('italic') ? 'italic' : 'normal',
                          mt: 1,
                          color: '#aaa'
                        }}
                      >
                        — {sampleArticleContent.quoteAuthor}
                      </Typography>
                    </Box>
                    
                    {/* Caption */}
                    <Typography 
                      variant="caption"
                      sx={{ 
                        fontFamily: `"${captionFont.family}", ${captionFont.category}`,
                        fontSize: `${Math.max(captionFont.size * 0.8, 12)}px`,
                        fontWeight: captionFont.variant.includes('bold') ? 'bold' : 'normal',
                        fontStyle: captionFont.variant.includes('italic') ? 'italic' : 'normal',
                        display: 'block',
                        mt: 4,
                        color: '#999',
                        textAlign: 'center'
                      }}
                    >
                      {sampleArticleContent.caption}
                    </Typography>
                  </>
                );
              })()}
            </Box>
          </Box>
        </>
      )}
    </Paper>
  );
}

export default FontBoard;