import { createContext, useState, useEffect } from 'react';

export const ResumeContext = createContext();

const defaultResumeData = {
  personalInfo: {
    fullName: 'John Doe',
    jobTitle: 'Software Engineer',
    email: 'john.doe@example.com',
    phone: '(555) 123-4567',
    location: 'San Francisco, CA',
    website: 'johndoe.dev',
    summary: 'A passionate software engineer with experience in building dynamic web applications. Strong background in React, Node.js, and modern web technologies.',
  },
  experience: [
    {
      id: '1',
      title: 'Senior Developer',
      company: 'Tech Solutions Inc.',
      startDate: '2020-01',
      endDate: 'Present',
      description: 'Lead a team of 5 developers to build scalable web applications. Improved performance by 30% and implemented robust testing strategies.',
    },
    {
      id: '2',
      title: 'Web Developer',
      company: 'Creative Agency',
      startDate: '2017-06',
      endDate: '2019-12',
      description: 'Developed responsive websites for various clients. Collaborated closely with designers to ensure high-fidelity implementations.',
    }
  ],
  education: [
    {
      id: '1',
      degree: 'Bachelor of Science in Computer Science',
      school: 'University of Technology',
      startDate: '2013-09',
      endDate: '2017-05',
      description: 'Graduated with Honors. Specialized in Software Engineering.',
    }
  ],
  skills: ['JavaScript', 'React', 'Node.js', 'CSS/HTML', 'Git', 'Agile Methodology'],
};

export const ResumeProvider = ({ children }) => {
  // Try to load from localStorage first
  const [resumeData, setResumeData] = useState(() => {
    const saved = localStorage.getItem('resumeData');
    return saved ? JSON.parse(saved) : defaultResumeData;
  });

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('resumeTheme') || 'stockholm';
  });

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('resumeData', JSON.stringify(resumeData));
  }, [resumeData]);

  useEffect(() => {
    localStorage.setItem('resumeTheme', theme);
  }, [theme]);

  const updatePersonalInfo = (data) => {
    setResumeData((prev) => ({ ...prev, personalInfo: { ...prev.personalInfo, ...data } }));
  };

  const addExperience = () => {
    setResumeData((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        { id: Date.now().toString(), title: '', company: '', startDate: '', endDate: '', description: '' },
      ],
    }));
  };

  const updateExperience = (id, data) => {
    setResumeData((prev) => ({
      ...prev,
      experience: prev.experience.map((exp) => (exp.id === id ? { ...exp, ...data } : exp)),
    }));
  };

  const removeExperience = (id) => {
    setResumeData((prev) => ({
      ...prev,
      experience: prev.experience.filter((exp) => exp.id !== id),
    }));
  };

  const addEducation = () => {
    setResumeData((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        { id: Date.now().toString(), degree: '', school: '', startDate: '', endDate: '', description: '' },
      ],
    }));
  };

  const updateEducation = (id, data) => {
    setResumeData((prev) => ({
      ...prev,
      education: prev.education.map((edu) => (edu.id === id ? { ...edu, ...data } : edu)),
    }));
  };

  const removeEducation = (id) => {
    setResumeData((prev) => ({
      ...prev,
      education: prev.education.filter((edu) => edu.id !== id),
    }));
  };

  const updateSkills = (skillsArray) => {
    setResumeData((prev) => ({ ...prev, skills: skillsArray }));
  };

  return (
    <ResumeContext.Provider
      value={{
        resumeData,
        theme,
        setTheme,
        updatePersonalInfo,
        addExperience,
        updateExperience,
        removeExperience,
        addEducation,
        updateEducation,
        removeEducation,
        updateSkills,
        setResumeData,
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
};
