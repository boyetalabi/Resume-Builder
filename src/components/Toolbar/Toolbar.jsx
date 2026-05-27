import React, { useContext } from 'react';
import { ResumeContext } from '../../context/ResumeContext';
import { Download, FileText } from 'lucide-react';
import { exportToPDF, exportToWord } from '../../utils/exportUtils';
import { templates } from '../../utils/themeConfig';

const Toolbar = () => {
  const { theme, setTheme, resumeData } = useContext(ResumeContext);

  const handleExportPDF = () => {
    const element = document.getElementById('resume-preview-content');
    exportToPDF(element, resumeData.personalInfo.fullName);
  };

  const handleExportWord = () => {
    const element = document.getElementById('resume-preview-content');
    exportToWord(element, resumeData.personalInfo.fullName);
  };

  return (
    <div className="toolbar">
      <div className="theme-selector">
        <label htmlFor="theme-select" style={{ marginRight: '0.5rem', fontWeight: 500 }}>
          Template:
        </label>
        <select
          id="theme-select"
          className="form-control"
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          style={{ width: '150px', display: 'inline-block' }}
        >
          {templates.map(t => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>
      </div>
      <div className="toolbar-actions">
        <button onClick={handleExportPDF} className="btn btn-secondary">
          <Download size={16} /> PDF
        </button>
        <button onClick={handleExportWord} className="btn btn-primary">
          <FileText size={16} /> Word
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
