import React, { useContext } from 'react';
import { ResumeContext } from '../../context/ResumeContext';
import Toolbar from '../Toolbar/Toolbar';
import './Preview.css';

const Preview = () => {
  const { resumeData } = useContext(ResumeContext);
  const { personalInfo, experience, education, skills } = resumeData;

  return (
    <>
      <Toolbar />
      <div className="resume-paper" id="resume-preview-content">
        <header className="resume-header">
          <h1 className="resume-name">{personalInfo.fullName || 'Your Name'}</h1>
          <h2 className="resume-title">{personalInfo.jobTitle}</h2>
          
          <div className="resume-contact">
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span>{personalInfo.phone}</span>}
            {personalInfo.location && <span>{personalInfo.location}</span>}
            {personalInfo.website && <span>{personalInfo.website}</span>}
          </div>
        </header>

        <div className="resume-layout">
          <div className="resume-sidebar">
            {personalInfo.summary && (
              <section className="resume-section summary-section">
                <h3 className="section-title">Professional Summary</h3>
                <p className="section-content">{personalInfo.summary}</p>
              </section>
            )}

            {skills.length > 0 && skills[0] !== "" && (
              <section className="resume-section skills-section">
                <h3 className="section-title">Skills</h3>
                <div className="skills-list">
                  {skills.map((skill, index) => (
                    skill.trim() && <span key={index} className="skill-tag">{skill.trim()}</span>
                  ))}
                </div>
              </section>
            )}
          </div>

          <div className="resume-main">
            {experience.length > 0 && (
              <section className="resume-section">
                <h3 className="section-title">Experience</h3>
                <div className="timeline">
                  {experience.map((exp) => (
                    <div key={exp.id} className="timeline-item">
                      <div className="timeline-header">
                        <h4 className="item-title">{exp.title}</h4>
                        <span className="item-date">
                          {exp.startDate} {exp.startDate && exp.endDate && '-'} {exp.endDate}
                        </span>
                      </div>
                      <div className="item-subtitle">{exp.company}</div>
                      <p className="item-desc">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {education.length > 0 && (
              <section className="resume-section">
                <h3 className="section-title">Education</h3>
                <div className="timeline">
                  {education.map((edu) => (
                    <div key={edu.id} className="timeline-item">
                      <div className="timeline-header">
                        <h4 className="item-title">{edu.degree}</h4>
                        <span className="item-date">
                          {edu.startDate} {edu.startDate && edu.endDate && '-'} {edu.endDate}
                        </span>
                      </div>
                      <div className="item-subtitle">{edu.school}</div>
                      <p className="item-desc">{edu.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Preview;
