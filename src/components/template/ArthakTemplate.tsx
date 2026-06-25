import React from 'react';
import { useResumeStore, SectionType, ResumeData, DesignSettings, getDefaultColumn } from '@/store/resumeStore';
import { Mail, Phone, MapPin, Globe, Linkedin, Github } from 'lucide-react';

interface ArthakTemplateProps {
  data: ResumeData;
  settings: DesignSettings;
}

export const ArthakTemplate = React.forwardRef<HTMLDivElement, ArthakTemplateProps>(
  ({ data, settings }, ref) => {
    const setActiveSection = useResumeStore((state) => state.setActiveSection);

    const cssVars = {
      '--accent-color': settings.accentColor,
      '--font-family': settings.fontFamily,
      '--font-size': `${settings.fontSize}px`,
      '--line-height': settings.lineHeight,
      '--spacing': `${settings.spacing}px`,
      '--margins': `${settings.margins}px`,
      '--spacing-large': `${settings.spacing * 5}px`,
      '--spacing-medium': `${settings.spacing * 4}px`,
      '--spacing-small': `${settings.spacing * 2 + 4}px`,
      '--font-size-xxs': `${settings.fontSize - 3}px`,
      '--font-size-xs': `${settings.fontSize - 2}px`,
      '--font-size-sm': `${settings.fontSize - 1}px`,
      '--font-size-base': `${settings.fontSize}px`,
      '--font-size-lg': `${settings.fontSize + 1}px`,
      '--font-size-xl': `${settings.fontSize + 2}px`,
    } as React.CSSProperties;

    // Convert hex color to slightly darker version or use a dark color mixed with accent
    const getDarkerAccent = () => {
      return '#1a1a2e'; // Always use this for dark header to match premium look as suggested
    };

    const visibleSections = data.sections.filter(s => s.visible).sort((a, b) => a.order - b.order);

    const projectsCol = visibleSections.find(s => s.type === SectionType.Projects)?.column || getDefaultColumn(SectionType.Projects, 'premium');

    const leftColumnSections = visibleSections.filter(s => {
      if (s.type === SectionType.Projects) {
        return projectsCol === 'left' || (projectsCol === 'right' && data.projects.length > 2);
      }
      const col = s.column || getDefaultColumn(s.type, 'premium');
      return col === 'left';
    });
    const rightColumnSections = visibleSections.filter(s => {
      if (s.type === SectionType.Projects) {
        return projectsCol === 'right' && data.projects.length > 0;
      }
      const col = s.column || getDefaultColumn(s.type, 'premium');
      return col === 'right' && s.type !== SectionType.PersonalDetails;
    });

    const SectionHeader = ({ title, type, isFirst }: { title: string, type: SectionType, isFirst?: boolean }) => (
      <div 
        className="cursor-pointer group-hover:ring-2 ring-blue-400/40" 
        onClick={(e) => { e.stopPropagation(); setActiveSection(type); }}
        style={{
          marginTop: isFirst ? 0 : 'var(--spacing-large)',
          marginBottom: 'var(--spacing-small)',
        }}
      >
        <h2 className="uppercase tracking-[0.15em] font-bold text-[var(--accent-color)]" style={{ fontSize: 'var(--font-size-xs)' }}>{title}</h2>
        <div className="w-full h-[2px] bg-[var(--accent-color)] mt-1"></div>
      </div>
    );

    const renderSectionContent = (type: SectionType, column?: 'left' | 'right') => {
      switch (type) {
        case SectionType.Summary:
          return data.personalDetails.summary ? (
            <p className="text-gray-700" style={{ fontSize: 'var(--font-size-base)', lineHeight: 'var(--line-height)' }}>
              {data.personalDetails.summary}
            </p>
          ) : null;
        
        case SectionType.Experience:
          return (
            <div className="flex flex-col" style={{ gap: 'var(--spacing-medium)' }}>
              {data.experiences.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-gray-900" style={{ fontSize: 'var(--font-size-lg)' }}>{exp.company}</h3>
                    <span className="text-gray-500 whitespace-nowrap ml-4 font-medium" style={{ fontSize: 'var(--font-size-xs)' }}>
                      {exp.startDate} – {exp.current ? 'Present' : exp.endDate} | {exp.location}
                    </span>
                  </div>
                  <div className="font-medium" style={{ color: 'var(--accent-color)', fontSize: 'var(--font-size-sm)', marginBottom: 'calc(var(--spacing) * 0.25px)' }}>{exp.position}</div>
                  <div className="text-gray-600 whitespace-pre-wrap" style={{ fontSize: 'var(--font-size-sm)', lineHeight: 'var(--line-height)' }}>
                    {exp.description.split('\n').map((line, i) => 
                      line.trim() ? <div key={i} className="flex"><span className="mr-2">•</span><span>{line.replace(/^[-•*]\s*/, '')}</span></div> : null
                    )}
                  </div>
                </div>
              ))}
            </div>
          );

        case SectionType.Education:
          return (
            <div className="flex flex-col" style={{ gap: 'var(--spacing-medium)' }}>
              {data.education.map((edu) => (
                <div key={edu.id}>
                  <h3 className="font-bold text-gray-900" style={{ fontSize: 'var(--font-size-lg)' }}>{edu.degree}</h3>
                  <div className="flex justify-between items-baseline" style={{ marginBottom: 'calc(var(--spacing) * 0.25px)' }}>
                    <div className="font-medium" style={{ color: 'var(--accent-color)', fontSize: 'var(--font-size-sm)' }}>{edu.institution}</div>
                    <span className="text-gray-500 whitespace-nowrap ml-4 font-medium" style={{ fontSize: 'var(--font-size-xs)' }}>
                      {edu.startDate} – {edu.endDate}
                    </span>
                  </div>
                  {edu.gpa && <div className="text-gray-600" style={{ fontSize: 'var(--font-size-xs)' }}>GPA: {edu.gpa}</div>}
                  {edu.description && (
                    <p className="text-gray-600" style={{ fontSize: 'var(--font-size-sm)', lineHeight: 'var(--line-height)', marginTop: 'calc(var(--spacing) * 0.25px)' }}>
                      {edu.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          );

        case SectionType.Projects:
          const isExplicitLeft = visibleSections.find(s => s.type === SectionType.Projects)?.column === 'left';
          const projectsToRender = isExplicitLeft
            ? data.projects
            : (column === 'left' ? data.projects.slice(2) : data.projects.slice(0, 2));

          if (projectsToRender.length === 0) return null;

          return (
            <div className="flex flex-col" style={{ gap: 'var(--spacing-medium)' }}>
              {projectsToRender.map((proj) => (
                <div key={proj.id}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-gray-900" style={{ fontSize: 'var(--font-size-lg)' }}>
                      {proj.title}
                      {proj.liveUrl && <span className="font-normal ml-2" style={{ color: 'var(--accent-color)', fontSize: 'var(--font-size-xs)' }}>{proj.liveUrl}</span>}
                    </h3>
                    <span className="text-gray-500 whitespace-nowrap ml-4 font-medium" style={{ fontSize: 'var(--font-size-xs)' }}>
                      {proj.startDate} – {proj.endDate}
                    </span>
                  </div>
                  <div className="font-medium" style={{ color: 'var(--accent-color)', fontSize: 'var(--font-size-sm)', marginBottom: 'calc(var(--spacing) * 0.25px)' }}>{proj.role}</div>
                  <p className="text-gray-600" style={{ fontSize: 'var(--font-size-sm)', lineHeight: 'var(--line-height)', marginBottom: 'calc(var(--spacing) * 0.25px)' }}>
                    {proj.description}
                  </p>
                  {proj.techStack && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {proj.techStack.split(',').map(tech => tech.trim()).filter(Boolean).map((tech, i) => (
                        <span key={i} className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-sm" style={{ fontSize: 'var(--font-size-xxs)' }}>{tech}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          );

        case SectionType.Skills:
          const highlighted = data.skills.filter(s => s.highlighted);
          const regular = data.skills.filter(s => !s.highlighted);
          return (
            <div className="flex flex-wrap" style={{ gap: 'calc(var(--spacing) * 0.5px + 4px)', marginTop: 'var(--spacing-small)' }}>
              {highlighted.map((skill) => (
                <span key={skill.id} className="px-3 py-1 rounded-full font-medium bg-[var(--accent-color)] text-white" style={{ fontSize: 'var(--font-size-xs)' }}>
                  {skill.name}
                </span>
              ))}
              {regular.map((skill) => (
                <span key={skill.id} className="px-3 py-1 rounded-full border border-[var(--accent-color)] text-[var(--accent-color)]" style={{ fontSize: 'var(--font-size-xs)' }}>
                  {skill.name}
                </span>
              ))}
            </div>
          );

        case SectionType.Languages:
          const getDots = (level: string) => {
            const val = level === 'Native' ? 5 : level === 'Fluent' ? 4 : level === 'Intermediate' ? 3 : 1;
            return (
              <div className="flex gap-1">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className={`w-2 h-2 rounded-full ${i <= val ? 'bg-[var(--accent-color)]' : 'bg-gray-300'}`}></div>
                ))}
              </div>
            );
          };
          return (
            <div className="grid grid-cols-2" style={{ rowGap: 'var(--spacing-small)', columnGap: 'calc(var(--spacing) * 0.5px + 4px)', marginTop: 'var(--spacing-small)' }}>
              {data.languages.map((lang) => (
                <div key={lang.id} className="flex flex-col gap-1">
                  <span className="font-medium" style={{ fontSize: 'var(--font-size-sm)' }}>{lang.language}</span>
                  {getDots(lang.level)}
                </div>
              ))}
            </div>
          );

        case SectionType.Awards:
        case SectionType.Achievements:
        case SectionType.Certificates:
        case SectionType.References:
        case SectionType.CustomSection:
          const genericItems = data[type.toLowerCase() as keyof ResumeData] as any[];
          if (!genericItems || genericItems.length === 0) return null;
          return (
            <div className="flex flex-col" style={{ gap: 'var(--spacing-medium)' }}>
              {genericItems.map((item: any) => (
                <div key={item.id}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-gray-900" style={{ fontSize: 'var(--font-size-lg)' }}>{item.title || item.name}</h3>
                    {item.date && (
                      <span className="text-gray-500 whitespace-nowrap ml-4 font-medium" style={{ fontSize: 'var(--font-size-xs)' }}>
                        {item.date}
                      </span>
                    )}
                  </div>
                  {(item.issuer || item.company) && (
                    <div className="font-medium" style={{ color: 'var(--accent-color)', fontSize: 'var(--font-size-sm)', marginBottom: 'calc(var(--spacing) * 0.25px)' }}>
                      {item.issuer || item.company} {item.url && `| ${item.url}`}
                    </div>
                  )}
                  {item.description && (
                    <p className="text-gray-600" style={{ fontSize: 'var(--font-size-sm)', lineHeight: 'var(--line-height)' }}>
                      {item.description}
                    </p>
                  )}
                  {item.content && (
                    <p className="text-gray-600 whitespace-pre-wrap" style={{ fontSize: 'var(--font-size-sm)', lineHeight: 'var(--line-height)' }}>
                      {item.content}
                    </p>
                  )}
                </div>
              ))}
            </div>
          );

        default:
          return null;
      }
    };

    return (
      <div 
        ref={ref}
        className="resume-template-container w-[794px] min-h-[1123px] bg-white shadow-xl mx-auto origin-top transition-transform duration-200 overflow-hidden flex flex-col"
        style={{ ...cssVars, fontFamily: `var(--font-family)` }}
      >
        {/* Header SECTION */}
        <div 
          className="w-full bg-[#1a1a2e] text-white flex items-center justify-between cursor-pointer hover:ring-2 ring-blue-400/40 transition-all shrink-0"
          onClick={() => setActiveSection(SectionType.PersonalDetails)}
          style={{ 
            backgroundColor: getDarkerAccent(),
            paddingLeft: 'var(--margins)',
            paddingRight: 'var(--margins)',
            paddingTop: 'calc(var(--margins) * 1.2)',
            paddingBottom: 'calc(var(--margins) * 1.2)'
          }}
        >
          <div className="flex-1 pr-6">
            <h1 className="text-[32px] font-[800] tracking-wide uppercase leading-tight mb-1">
              {data.personalDetails.firstName} {data.personalDetails.lastName}
            </h1>
            <div className="text-[var(--accent-color)] font-medium text-lg mb-3">
              {data.personalDetails.title}
            </div>
            
            {(!data.sections.find(s => s.type === SectionType.Summary)?.visible || !rightColumnSections.find(s => s.type === SectionType.Summary)) && data.personalDetails.summary && (
               <p className="text-white/80 max-w-[90%]" style={{ fontSize: 'var(--font-size-sm)', lineHeight: 'var(--line-height)', marginBottom: 'var(--spacing-medium)' }}>
                 {data.personalDetails.summary}
               </p>
            )}

            <div 
              className="flex flex-wrap text-white/90" 
              style={{ 
                columnGap: 'calc(var(--spacing) * 2px + 8px)', 
                rowGap: 'calc(var(--spacing) * 0.5px + 2px)', 
                fontSize: 'var(--font-size-xs)' 
              }}
            >
              {data.personalDetails.email && (
                <div className="flex items-center gap-1.5"><Mail className="w-3 h-3" />{data.personalDetails.email}</div>
              )}
              {data.personalDetails.phone && (
                <div className="flex items-center gap-1.5"><Phone className="w-3 h-3" />{data.personalDetails.phone}</div>
              )}
              {data.personalDetails.location && (
                <div className="flex items-center gap-1.5"><MapPin className="w-3 h-3" />{data.personalDetails.location}</div>
              )}
              {data.personalDetails.linkedin && (
                <div className="flex items-center gap-1.5"><Linkedin className="w-3 h-3" />{data.personalDetails.linkedin}</div>
              )}
              {data.personalDetails.github && (
                <div className="flex items-center gap-1.5"><Github className="w-3 h-3" />{data.personalDetails.github}</div>
              )}
              {data.personalDetails.website && (
                <div className="flex items-center gap-1.5"><Globe className="w-3 h-3" />{data.personalDetails.website}</div>
              )}
            </div>
          </div>
          
          <div className="shrink-0 flex items-center justify-center">
            {data.personalDetails.photo ? (
              <img src={data.personalDetails.photo} alt="Profile" className="w-[100px] h-[100px] rounded-full object-cover border-4 border-white" />
            ) : (
              <div className="w-[100px] h-[100px] rounded-full bg-[var(--accent-color)] border-4 border-white flex items-center justify-center text-3xl font-bold">
                {data.personalDetails.firstName?.[0]}{data.personalDetails.lastName?.[0]}
              </div>
            )}
          </div>
        </div>

        {/* BODY - Two Columns */}
        <div 
          className="flex flex-1 w-full"
          style={{
            background: 'linear-gradient(to right, #f8f9fa 37%, #e5e7eb 37%, #e5e7eb calc(37% + 1px), #ffffff calc(37% + 1px))'
          }}
        >
          {/* Left Column */}
          <div 
            className="w-[37%] h-full flex flex-col" 
            style={{ 
              paddingLeft: 'var(--margins)', 
              paddingRight: 'calc(var(--margins) * 0.8)', 
              paddingTop: 'var(--margins)', 
              paddingBottom: 'var(--margins)',
              gap: 'var(--spacing-large)'
            }}
          >
            {leftColumnSections.map((section, idx) => {
              const isProjectsSplit = section.type === SectionType.Projects && projectsCol === 'right';
              return (
                <div 
                  key={section.id} 
                  className="group relative cursor-pointer hover:ring-2 ring-blue-400/40 rounded -m-1 p-1 transition-all"
                  onClick={() => setActiveSection(section.type)}
                >
                  {!isProjectsSplit && <SectionHeader title={section.label} type={section.type} isFirst={idx === 0} />}
                  <div>
                    {renderSectionContent(section.type, 'left')}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column */}
          <div 
            className="w-[63%] h-full flex flex-col" 
            style={{ 
              paddingRight: 'var(--margins)', 
              paddingLeft: 'calc(var(--margins) * 0.8)', 
              paddingTop: 'var(--margins)', 
              paddingBottom: 'var(--margins)',
              gap: 'var(--spacing-large)'
            }}
          >
            {rightColumnSections.map((section, idx) => (
              <div 
                key={section.id} 
                className="group relative cursor-pointer hover:ring-2 ring-blue-400/40 rounded -m-1 p-1 transition-all"
                onClick={() => setActiveSection(section.type)}
              >
                <SectionHeader title={section.label} type={section.type} isFirst={idx === 0} />
                <div>
                  {renderSectionContent(section.type, 'right')}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
);

ArthakTemplate.displayName = 'ArthakTemplate';