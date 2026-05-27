import React, { useContext, useState, useRef } from 'react';
import { ResumeContext } from '../../context/ResumeContext';
import { User, Briefcase, GraduationCap, Code, Plus, Trash2, Upload, Sparkles, Loader2 } from 'lucide-react';
import { extractTextFromFile } from '../../utils/fileParser';
import { parseResumeWithAI, enhanceResumeWithAI } from '../../utils/aiUtils';

const Editor = () => {
  const {
    resumeData,
    updatePersonalInfo,
    addExperience,
    updateExperience,
    removeExperience,
    addEducation,
    updateEducation,
    removeEducation,
    updateSkills,
    setResumeData,
  } = useContext(ResumeContext);

  const { personalInfo, experience, education, skills } = resumeData;
  const fileInputRef = useRef(null);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiError, setAiError] = useState('');

  const handlePersonalInfoChange = (e) => {
    updatePersonalInfo({ [e.target.name]: e.target.value });
  };

  const handleSkillsChange = (e) => {
    updateSkills(e.target.value.split(',').map(skill => skill.trim()));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsProcessing(true);
    setAiError('');
    try {
      const rawText = await extractTextFromFile(file);
      const parsedData = await parseResumeWithAI(rawText);
      if (parsedData && parsedData.personalInfo) {
        setResumeData(parsedData);
      } else {
        setAiError('Failed to parse resume properly.');
      }
    } catch (err) {
      setAiError(err.message);
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleAIPrompt = async () => {
    if (!aiPrompt.trim()) return;
    setIsProcessing(true);
    setAiError('');
    try {
      const enhancedData = await enhanceResumeWithAI(resumeData, aiPrompt);
      if (enhancedData && enhancedData.personalInfo) {
        setResumeData(enhancedData);
        setAiPrompt(''); // Clear prompt on success
      } else {
        setAiError('AI returned invalid data.');
      }
    } catch (err) {
      setAiError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="editor">
      {/* AI Assistant & Import Section */}
      <section className="form-section ai-section" style={{ backgroundColor: 'rgba(37, 99, 235, 0.05)', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
        <h2 style={{ color: 'var(--primary-color)' }}><Sparkles size={20} /> AI Assistant</h2>
        
        {aiError && <div style={{ color: '#ef4444', fontSize: '0.875rem', marginBottom: '1rem', padding: '0.5rem', backgroundColor: '#fee2e2', borderRadius: '4px' }}>{aiError}</div>}
        
        <div style={{ marginBottom: '1.5rem' }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
            Upload an existing resume draft (PDF, DOCX, TXT) to instantly populate the editor.
          </p>
          <input
            type="file"
            accept=".pdf,.docx,.txt"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileUpload}
          />
          <button 
            className="btn btn-secondary" 
            onClick={() => fileInputRef.current.click()}
            disabled={isProcessing}
            style={{ width: '100%', justifyContent: 'center' }}
          >
            {isProcessing ? <Loader2 size={16} className="spin" /> : <Upload size={16} />} 
            {isProcessing ? 'Processing File...' : 'Upload Draft Resume'}
          </button>
        </div>

        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
            Prompt the AI to enhance your resume:
          </p>
          <textarea
            className="form-control"
            placeholder="e.g., 'Rewrite my summary to sound more confident' or 'Add leadership keywords to my experience'"
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            disabled={isProcessing}
            style={{ minHeight: '60px', marginBottom: '0.5rem' }}
          />
          <button 
            className="btn btn-primary" 
            onClick={handleAIPrompt}
            disabled={isProcessing || !aiPrompt.trim()}
            style={{ width: '100%', justifyContent: 'center' }}
          >
            {isProcessing ? <Loader2 size={16} className="spin" /> : <Sparkles size={16} />}
            {isProcessing ? 'Applying AI Magic...' : 'Apply Prompt'}
          </button>
        </div>
      </section>
      {/* Personal Info */}
      <section className="form-section">
        <h2><User size={20} /> Personal Information</h2>
        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            className="form-control"
            name="fullName"
            value={personalInfo.fullName}
            onChange={handlePersonalInfoChange}
          />
        </div>
        <div className="form-group">
          <label>Job Title</label>
          <input
            type="text"
            className="form-control"
            name="jobTitle"
            value={personalInfo.jobTitle}
            onChange={handlePersonalInfoChange}
          />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={personalInfo.email}
              onChange={handlePersonalInfoChange}
            />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input
              type="text"
              className="form-control"
              name="phone"
              value={personalInfo.phone}
              onChange={handlePersonalInfoChange}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              className="form-control"
              name="location"
              value={personalInfo.location}
              onChange={handlePersonalInfoChange}
            />
          </div>
          <div className="form-group">
            <label>Website / LinkedIn</label>
            <input
              type="text"
              className="form-control"
              name="website"
              value={personalInfo.website}
              onChange={handlePersonalInfoChange}
            />
          </div>
        </div>
        <div className="form-group">
          <label>Professional Summary</label>
          <textarea
            className="form-control"
            name="summary"
            value={personalInfo.summary}
            onChange={handlePersonalInfoChange}
          />
        </div>
      </section>

      {/* Experience */}
      <section className="form-section">
        <h2><Briefcase size={20} /> Experience</h2>
        {experience.map((exp) => (
          <div key={exp.id} className="item-card">
            <button className="btn-remove" onClick={() => removeExperience(exp.id)} title="Remove Experience">
              <Trash2 size={16} />
            </button>
            <div className="form-group">
              <label>Job Title</label>
              <input
                type="text"
                className="form-control"
                value={exp.title}
                onChange={(e) => updateExperience(exp.id, { title: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Company</label>
              <input
                type="text"
                className="form-control"
                value={exp.company}
                onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Start Date</label>
                <input
                  type="text"
                  placeholder="MM/YYYY"
                  className="form-control"
                  value={exp.startDate}
                  onChange={(e) => updateExperience(exp.id, { startDate: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>End Date</label>
                <input
                  type="text"
                  placeholder="MM/YYYY or Present"
                  className="form-control"
                  value={exp.endDate}
                  onChange={(e) => updateExperience(exp.id, { endDate: e.target.value })}
                />
              </div>
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                className="form-control"
                value={exp.description}
                onChange={(e) => updateExperience(exp.id, { description: e.target.value })}
              />
            </div>
          </div>
        ))}
        <button className="btn-add" onClick={addExperience}>
          <Plus size={16} /> Add Experience
        </button>
      </section>

      {/* Education */}
      <section className="form-section">
        <h2><GraduationCap size={20} /> Education</h2>
        {education.map((edu) => (
          <div key={edu.id} className="item-card">
            <button className="btn-remove" onClick={() => removeEducation(edu.id)} title="Remove Education">
              <Trash2 size={16} />
            </button>
            <div className="form-group">
              <label>Degree</label>
              <input
                type="text"
                className="form-control"
                value={edu.degree}
                onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>School</label>
              <input
                type="text"
                className="form-control"
                value={edu.school}
                onChange={(e) => updateEducation(edu.id, { school: e.target.value })}
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Start Date</label>
                <input
                  type="text"
                  placeholder="YYYY"
                  className="form-control"
                  value={edu.startDate}
                  onChange={(e) => updateEducation(edu.id, { startDate: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>End Date</label>
                <input
                  type="text"
                  placeholder="YYYY or Present"
                  className="form-control"
                  value={edu.endDate}
                  onChange={(e) => updateEducation(edu.id, { endDate: e.target.value })}
                />
              </div>
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                className="form-control"
                value={edu.description}
                onChange={(e) => updateEducation(edu.id, { description: e.target.value })}
              />
            </div>
          </div>
        ))}
        <button className="btn-add" onClick={addEducation}>
          <Plus size={16} /> Add Education
        </button>
      </section>

      {/* Skills */}
      <section className="form-section" style={{ borderBottom: 'none' }}>
        <h2><Code size={20} /> Skills</h2>
        <div className="form-group">
          <label>Comma-separated list</label>
          <input
            type="text"
            className="form-control"
            value={skills.join(', ')}
            onChange={handleSkillsChange}
            placeholder="e.g. JavaScript, React, Node.js"
          />
        </div>
      </section>
    </div>
  );
};

export default Editor;
