import React, { useContext, useEffect } from 'react';
import { ResumeContext } from './context/ResumeContext';
import Editor from './components/Editor/Editor';
import Preview from './components/Preview/Preview';
import { getTemplateById } from './utils/themeConfig';

function App() {
  const { theme } = useContext(ResumeContext);

  useEffect(() => {
    const template = getTemplateById(theme);
    
    // Set layout attribute
    document.body.setAttribute('data-layout', template.layout);
    document.body.setAttribute('data-header-align', template.headerAlignment);
    document.body.setAttribute('data-header-style', template.headerStyle);
    
    // Set CSS Variables dynamically
    document.documentElement.style.setProperty('--primary-color', template.primaryColor);
    document.documentElement.style.setProperty('--accent-color', template.accentColor);
    document.documentElement.style.setProperty('--font-heading', template.fontHeading);
    document.documentElement.style.setProperty('--font-body', template.fontBody);
    
    // Optional: Load Google Fonts dynamically based on selection
    const fontLink = document.getElementById('dynamic-fonts');
    if (!fontLink) {
      const link = document.createElement('link');
      link.id = 'dynamic-fonts';
      link.rel = 'stylesheet';
      const headingFont = template.fontHeading.split(',')[0].replace(/['"]/g, '').trim().replace(/ /g, '+');
      const bodyFont = template.fontBody.split(',')[0].replace(/['"]/g, '').trim().replace(/ /g, '+');
      link.href = `https://fonts.googleapis.com/css2?family=${headingFont}:wght@400;600;700&family=${bodyFont}:wght@400;500;600&display=swap`;
      document.head.appendChild(link);
    } else {
      const headingFont = template.fontHeading.split(',')[0].replace(/['"]/g, '').trim().replace(/ /g, '+');
      const bodyFont = template.fontBody.split(',')[0].replace(/['"]/g, '').trim().replace(/ /g, '+');
      fontLink.href = `https://fonts.googleapis.com/css2?family=${headingFont}:wght@400;600;700&family=${bodyFont}:wght@400;500;600&display=swap`;
    }

  }, [theme]);

  return (
    <div className="app-container">
      <div className="editor-panel">
        <Editor />
      </div>
      <div className="preview-panel">
        <Preview />
      </div>
    </div>
  );
}

export default App;
