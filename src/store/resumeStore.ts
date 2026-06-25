import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export enum SectionType {
  PersonalDetails = 'PersonalDetails',
  Summary = 'Summary',
  Experience = 'Experience',
  Education = 'Education',
  Projects = 'Projects',
  Skills = 'Skills',
  Certificates = 'Certificates',
  Languages = 'Languages',
  Awards = 'Awards',
  Achievements = 'Achievements',
  References = 'References',
  CustomSection = 'CustomSection',
}

export interface ResumeSection {
  id: string;
  type: SectionType;
  label: string;
  visible: boolean;
  order: number;
  column?: 'left' | 'right';
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa: string;
  description: string;
}

export interface Project {
  id: string;
  title: string;
  role: string;
  description: string;
  techStack: string;
  github: string;
  liveUrl: string;
  startDate: string;
  endDate: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  highlighted: boolean;
}

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  date: string;
  url: string;
  description: string;
}

export interface Language {
  id: string;
  language: string;
  level: string; // native/fluent/intermediate/basic
}

export interface Award {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description: string;
}

export interface Achievement {
  id: string;
  title: string;
  date: string;
  description: string;
}

export interface Reference {
  id: string;
  name: string;
  title: string;
  company: string;
  email: string;
  phone: string;
}

export interface CustomSection {
  id: string;
  title: string;
  content: string;
}

export interface PersonalDetails {
  firstName: string;
  lastName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  github: string;
  portfolio: string;
  summary: string;
  photo: string;
}

export interface DesignSettings {
  accentColor: string;
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  spacing: number;
  margins: number;
  template: 'premium' | 'hybrid' | 'minimal';
}

export interface ResumeData {
  id: string;
  name: string;
  personalDetails: PersonalDetails;
  sections: ResumeSection[];
  experiences: Experience[];
  education: Education[];
  projects: Project[];
  skills: Skill[];
  certificates: Certificate[];
  languages: Language[];
  awards: Award[];
  achievements: Achievement[];
  references: Reference[];
  customSections: CustomSection[];
}

export interface ResumeState {
  data: ResumeData;
  settings: DesignSettings;
  activeSection: SectionType | null;
  zoom: number;
  history: { data: ResumeData; settings: DesignSettings }[];
  historyIndex: number;
  
  // Actions
  setData: (data: Partial<ResumeData>) => void;
  setSettings: (settings: Partial<DesignSettings>) => void;
  setActiveSection: (section: SectionType | null) => void;
  setZoom: (zoom: number | ((prev: number) => number)) => void;
  
  // Undo/Redo
  undo: () => void;
  redo: () => void;
  pushHistory: () => void;
  
  // Specific Update Actions
  updatePersonalDetails: (details: Partial<PersonalDetails>) => void;
  updateSections: (sections: ResumeSection[]) => void;
  addSection: (type: SectionType) => void;
  updateExperiences: (experiences: Experience[]) => void;
  updateEducation: (education: Education[]) => void;
  updateProjects: (projects: Project[]) => void;
  updateSkills: (skills: Skill[]) => void;
  updateCertificates: (certificates: Certificate[]) => void;
  updateLanguages: (languages: Language[]) => void;
}

const seedData: ResumeData = {
  id: 'resume-1',
  name: 'Alex Morgan Resume',
  personalDetails: {
    firstName: 'Alex',
    lastName: 'Morgan',
    title: 'Senior Software Engineer',
    email: 'alex.morgan@email.com',
    phone: '+1 (555) 234-5678',
    location: 'San Francisco, CA',
    website: '',
    linkedin: 'linkedin.com/in/alexmorgan',
    github: 'github.com/alexmorgan',
    portfolio: '',
    summary: 'Passionate software engineer with 6+ years building scalable web applications at high-growth startups. Expertise in React, TypeScript, and cloud infrastructure. Led teams of 4-8 engineers and shipped products used by millions.',
    photo: '',
  },
  sections: [
    { id: 'sec-personal', type: SectionType.PersonalDetails, label: 'Personal Details', visible: true, order: 0 },
    { id: 'sec-summary', type: SectionType.Summary, label: 'Professional Summary', visible: true, order: 1 },
    { id: 'sec-exp', type: SectionType.Experience, label: 'Experience', visible: true, order: 2 },
    { id: 'sec-edu', type: SectionType.Education, label: 'Education', visible: true, order: 3 },
    { id: 'sec-proj', type: SectionType.Projects, label: 'Projects', visible: true, order: 4 },
    { id: 'sec-skills', type: SectionType.Skills, label: 'Skills', visible: true, order: 5 },
    { id: 'sec-lang', type: SectionType.Languages, label: 'Languages', visible: true, order: 6 },
  ],
  experiences: [
    {
      id: 'exp-1',
      company: 'Stripe',
      position: 'Staff Engineer',
      location: 'San Francisco',
      startDate: '2022',
      endDate: 'Present',
      current: true,
      description: 'Led architecture for dashboard redesign serving 3M+ merchants. Built real-time analytics pipeline. Mentored team of 8 engineers.',
    },
    {
      id: 'exp-2',
      company: 'Figma',
      position: 'Senior Engineer',
      location: 'San Francisco',
      startDate: '2019',
      endDate: '2022',
      current: false,
      description: 'Owned collaborative editing infrastructure. Reduced latency by 40%. Shipped multiplayer cursors feature.',
    }
  ],
  education: [
    {
      id: 'edu-1',
      degree: 'BS Computer Science',
      institution: 'Stanford University',
      location: 'Stanford, CA',
      startDate: '2015',
      endDate: '2019',
      gpa: '3.9',
      description: '',
    }
  ],
  projects: [
    {
      id: 'proj-1',
      title: 'OpenMetrics',
      role: 'Creator & Maintainer',
      description: 'Open-source observability platform.',
      techStack: 'TypeScript, Go, Prometheus',
      github: 'github.com/alexmorgan/openmetrics',
      liveUrl: '',
      startDate: '2020',
      endDate: 'Present',
    }
  ],
  skills: [
    { id: 'skill-1', name: 'TypeScript', category: 'Languages', highlighted: true },
    { id: 'skill-2', name: 'React', category: 'Frameworks', highlighted: true },
    { id: 'skill-3', name: 'Node.js', category: 'Backend', highlighted: true },
    { id: 'skill-4', name: 'Go', category: 'Languages', highlighted: false },
    { id: 'skill-5', name: 'PostgreSQL', category: 'Database', highlighted: false },
    { id: 'skill-6', name: 'Redis', category: 'Database', highlighted: false },
    { id: 'skill-7', name: 'AWS', category: 'Cloud', highlighted: false },
    { id: 'skill-8', name: 'Docker', category: 'DevOps', highlighted: false },
    { id: 'skill-9', name: 'Kubernetes', category: 'DevOps', highlighted: false },
  ],
  certificates: [],
  languages: [
    { id: 'lang-1', language: 'English', level: 'Native' },
    { id: 'lang-2', language: 'Spanish', level: 'Fluent' },
  ],
  awards: [],
  achievements: [],
  references: [],
  customSections: [],
};

const defaultSettings: DesignSettings = {
  accentColor: '#0f766e', // Slate Blue/Deep Teal
  fontFamily: 'Inter',
  fontSize: 12,
  lineHeight: 1.5,
  spacing: 4,
  margins: 24,
  template: 'premium',
};

export const getDefaultColumn = (type: SectionType, template: 'premium' | 'hybrid' | 'minimal'): 'left' | 'right' => {
  if (template === 'minimal') return 'left';
  
  if (template === 'premium') {
    const leftColumnTypes = [SectionType.Skills, SectionType.Languages, SectionType.Certificates, SectionType.Awards];
    return leftColumnTypes.includes(type) ? 'left' : 'right';
  }
  
  if (template === 'hybrid') {
    const rightColumnTypes = [SectionType.Skills, SectionType.Education, SectionType.Languages];
    return rightColumnTypes.includes(type) ? 'right' : 'left';
  }
  
  return 'right';
};

export const useResumeStore = create<ResumeState>()(
  persist(
    (set, get) => ({
      data: seedData,
      settings: defaultSettings,
      activeSection: null,
      zoom: 100,
      history: [{ data: seedData, settings: defaultSettings }],
      historyIndex: 0,
      
      pushHistory: () => {
        const { data, settings, history, historyIndex } = get();
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push({ data, settings });
        if (newHistory.length > 50) newHistory.shift();
        set({ history: newHistory, historyIndex: newHistory.length - 1 });
      },

      setData: (newData) => {
        set((state) => ({ data: { ...state.data, ...newData } }));
        get().pushHistory();
      },
      
      setSettings: (newSettings) => {
        set((state) => ({ settings: { ...state.settings, ...newSettings } }));
        get().pushHistory();
      },
      
      setActiveSection: (section) => set({ activeSection: section }),
      
      setZoom: (zoom) => set((state) => ({ 
        zoom: typeof zoom === 'function' ? zoom(state.zoom) : zoom 
      })),
      
      undo: () => {
        const { history, historyIndex } = get();
        if (historyIndex > 0) {
          const newIndex = historyIndex - 1;
          const { data, settings } = history[newIndex];
          set({ data, settings, historyIndex: newIndex });
        }
      },
      
      redo: () => {
        const { history, historyIndex } = get();
        if (historyIndex < history.length - 1) {
          const newIndex = historyIndex + 1;
          const { data, settings } = history[newIndex];
          set({ data, settings, historyIndex: newIndex });
        }
      },

      updatePersonalDetails: (details) => {
        set((state) => ({ data: { ...state.data, personalDetails: { ...state.data.personalDetails, ...details } } }));
        get().pushHistory();
      },
      
      updateSections: (sections) => {
        set((state) => ({ data: { ...state.data, sections } }));
        get().pushHistory();
      },

      addSection: (type: SectionType) => {
        const labels: Record<string, string> = {
          Awards: 'Awards', Achievements: 'Achievements', References: 'References',
          Certificates: 'Certificates', CustomSection: 'Custom Section'
        };
        const newSection: ResumeSection = {
          id: `sec-${Date.now()}`,
          type,
          label: labels[type as string] || type,
          visible: true,
          order: get().data.sections.length,
        };
        set((state) => ({ data: { ...state.data, sections: [...state.data.sections, newSection] } }));
        get().pushHistory();
      },

      updateExperiences: (experiences) => {
        set((state) => ({ data: { ...state.data, experiences } }));
        get().pushHistory();
      },

      updateEducation: (education) => {
        set((state) => ({ data: { ...state.data, education } }));
        get().pushHistory();
      },

      updateProjects: (projects) => {
        set((state) => ({ data: { ...state.data, projects } }));
        get().pushHistory();
      },

      updateSkills: (skills) => {
        set((state) => ({ data: { ...state.data, skills } }));
        get().pushHistory();
      },

      updateCertificates: (certificates) => {
        set((state) => ({ data: { ...state.data, certificates } }));
        get().pushHistory();
      },

      updateLanguages: (languages) => {
        set((state) => ({ data: { ...state.data, languages } }));
        get().pushHistory();
      },

    }),
    {
      name: 'arthak-resume-storage',
      partialize: (state) => ({ data: state.data, settings: state.settings }), // Persist only data and settings
    }
  )
);
