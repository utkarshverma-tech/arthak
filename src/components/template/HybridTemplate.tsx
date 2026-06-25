import React from 'react';
import { useResumeStore, SectionType, ResumeData, DesignSettings, getDefaultColumn } from '@/store/resumeStore';
import { Mail, Phone, MapPin, Globe, Linkedin, Github } from 'lucide-react';

interface TemplateProps {
  data: ResumeData;
  settings: DesignSettings;
}

export const HybridTemplate = React.forwardRef<HTMLDivElement, TemplateProps>(
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

    const visibleSections = data.sections.filter(s => s.visible).sort((a, b) => a.order - b.order);

    const leftColumnSections = visibleSections.filter(s => {
      const col = s.column || getDefaultColumn(s.type, 'hybrid');
      return col === 'left' && s.type !== SectionType.PersonalDetails && s.type !== SectionType.Summary;
    });
    const rightColumnSections = visibleSections.filter(s => {
      const col = s.column || getDefaultColumn(s.type, 'hybrid');
      return col === 'right';
    });

    const SectionHeader = ({ title, type, isFirst }: { title: string, type: SectionType, isFirst?: boolean }) => (
      <div 
        className="cursor-pointer group-hover:ring-2 ring-blue-400/40 pb-1 border-b border-gray-200 flex items-center gap-2" 
        onClick={(e) => { e.stopPropagation(); setActiveSection(type); }}
        style={{
          marginTop: isFirst ? 0 : 'var(--spacing-large)',
          marginBottom: 'var(--spacing-small)',
        }}
      >
        <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: 'var(--accent-color)' }}></div>
        <h2 className="uppercase font-bold text-gray-800 tracking-wider" style={{ fontSize: 'var(--font-size-base)' }}>{title}</h2>
      </div>
    );

    const renderSectionContent = (type: SectionType, column?: 'left' | 'right') => {
      switch (type) {
        case SectionType.Experience:
          return (
            <div className="flex flex-col" style={{ gap: 'var(--spacing-large)' }}>
              {data.experiences.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h3 className="font-bold text-gray-800" style={{ fontSize: 'var(--font-size-xl)' }}>{exp.position}</h3>
                    <span className="text-gray-500 whitespace-nowrap ml-4 font-medium" style={{ fontSize: 'var(--font-size-sm)' }}>
                      {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  <div className="font-medium" style={{ color: 'var(--accent-color)', fontSize: 'var(--font-size-base)', marginBottom: 'calc(var(--spacing) * 0.4px)' }}>{exp.company} | {exp.location}</div>
                  <div className="text-gray-600" style={{ fontSize: 'var(--font-size-base)', lineHeight: 'var(--line-height)' }}>
                    {exp.description.split('\n').map((line, i) => {
                      const trimmed = line.trim();
                      if (!trimmed) return null;
                      return (
                        <div key={i} className="flex items-start gap-2 mb-1">
                          <div className="w-1.5 h-1.5 rounded-full shrink-0 mt-[6px]" style={{ backgroundColor: 'var(--accent-color)' }}></div>
                          <span>{trimmed.replace(/^[-•*]\s*/, '')}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          );

        case SectionType.Projects:
          return (
            <div className="flex flex-col" style={{ gap: 'var(--spacing-medium)' }}>
              {data.projects.map((proj) => (
                <div key={proj.id}>
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h3 className="font-bold text-gray-800" style={{ fontSize: 'var(--font-size-lg)' }}>
                      {proj.title}
                    </h3>
                    <span className="text-gray-500 whitespace-nowrap ml-4" style={{ fontSize: 'var(--font-size-xs)' }}>
                      {proj.startDate} – {proj.endDate}
                    </span>
                  </div>
                  <div className="font-medium" style={{ color: 'var(--accent-color)', fontSize: 'var(--font-size-sm)', marginBottom: 'calc(var(--spacing) * 0.25px)' }}>{proj.role} {proj.liveUrl && `| ${proj.liveUrl}`}</div>
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
          const hardSkills = data.skills.filter(s => s.highlighted);
          const softSkills = data.skills.filter(s => !s.highlighted);
          return (
            <div className="flex flex-col" style={{ gap: 'var(--spacing-medium)' }}>
              {hardSkills.length > 0 && (
                <div>
                  <div className="font-bold text-gray-500 uppercase tracking-wider mb-2" style={{ fontSize: 'var(--font-size-xs)' }}>Hard Skills</div>
                  <div className="flex flex-col" style={{ gap: 'calc(var(--spacing) * 0.25px + 1px)' }}>
                    {hardSkills.map(skill => (
                      <div key={skill.id} className="text-gray-700 font-medium" style={{ fontSize: 'var(--font-size-sm)' }}>{skill.name}</div>
                    ))}
                  </div>
                </div>
              )}
              {softSkills.length > 0 && (
                <div>
                  <div className="font-bold text-gray-500 uppercase tracking-wider mb-2" style={{ fontSize: 'var(--font-size-xs)', marginTop: 'var(--spacing-small)' }}>Soft Skills</div>
                  <div className="flex flex-wrap" style={{ gap: 'calc(var(--spacing) * 0.3px + 3px)' }}>
                    {softSkills.map(skill => (
                      <span key={skill.id} className="px-2 py-0.5 rounded bg-gray-100 text-gray-600" style={{ fontSize: 'var(--font-size-xs)' }}>
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );

        case SectionType.Education:
          return (
            <div className="flex flex-col" style={{ gap: 'var(--spacing-medium)' }}>
              {data.education.map((edu) => (
                <div key={edu.id}>
                  <h3 className="font-bold text-gray-800 leading-tight mb-1" style={{ fontSize: 'var(--font-size-base)' }}>{edu.degree}</h3>
                  <div className="italic mb-1" style={{ color: 'var(--accent-color)', fontSize: 'var(--font-size-sm)' }}>{edu.institution}</div>
                  <div className="text-gray-500" style={{ fontSize: 'var(--font-size-xs)' }}>
                     {edu.startDate} – {edu.endDate} {edu.location ? `| ${edu.location}` : ''}
                  </div>
                </div>
              ))}
            </div>
          );

        case SectionType.Languages:
          return (
            <div className="flex flex-col" style={{ gap: 'var(--spacing-small)', marginTop: 'var(--spacing-small)' }}>
              {data.languages.map((lang) => (
                <div key={lang.id} className="flex flex-col">
                  <span className="font-bold text-gray-800" style={{ fontSize: 'var(--font-size-sm)' }}>{lang.language}</span>
                  <span className="italic text-gray-600" style={{ fontSize: 'var(--font-size-xs)' }}>{lang.level} Proficiency</span>
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
                    <div className="font-bold text-gray-800" style={{ fontSize: 'var(--font-size-base)' }}>{item.title || item.name}</div>
                    {(item.issuer || item.company) && <div className="mt-0.5" style={{ color: 'var(--accent-color)', fontSize: 'var(--font-size-sm)' }}>{item.issuer || item.company}</div>}
                    {(item.date || item.url) && <div className="text-gray-500 mt-0.5" style={{ fontSize: 'var(--font-size-xs)' }}>{item.date} {item.url && `| ${item.url}`}</div>}
                    {item.description && <div className="text-gray-600 mt-1" style={{ fontSize: 'var(--font-size-sm)', lineHeight: 'var(--line-height)' }}>{item.description}</div>}
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
        className="resume-template-container w-[794px] min-h-[1123px] bg-white shadow-xl mx-auto origin-top transition-transform duration-200 flex flex-col"
        style={{ ...cssVars, fontFamily: `var(--font-family)` }}
      >
        {/* Top Section */}
        <div 
          className="w-full bg-white flex items-center cursor-pointer hover:ring-2 ring-blue-400/40 transition-all" 
          onClick={() => setActiveSection(SectionType.PersonalDetails)}
          style={{
            paddingLeft: 'var(--margins)',
            paddingRight: 'var(--margins)',
            paddingTop: 'var(--margins)',
            paddingBottom: 'calc(var(--margins) * 0.6)',
            gap: 'var(--margins)',
          }}
        >
          <div className="shrink-0">
            {data.personalDetails.photo ? (
              <img src={data.personalDetails.photo} alt="Profile" className="w-[110px] h-[110px] rounded-full object-cover border-4" style={{ borderColor: 'var(--accent-color)' }} />
            ) : (
              <div className="w-[110px] h-[110px] rounded-full flex items-center justify-center text-3xl font-bold text-white border-4" style={{ backgroundColor: 'var(--accent-color)', borderColor: 'var(--accent-color)' }}>
                {data.personalDetails.firstName?.[0]}{data.personalDetails.lastName?.[0]}
              </div>
            )}
          </div>
          <div className="flex-1">
            <h1 
              className="font-bold text-gray-900 leading-none mb-1" 
              style={{ 
                fontFamily: '"Playfair Display", Georgia, serif',
                fontSize: 'calc(var(--font-size) * 3.2)'
              }}
            >
              {data.personalDetails.firstName} {data.personalDetails.lastName}
            </h1>
            <div 
              className="tracking-wide uppercase font-semibold mb-3" 
              style={{ 
                color: 'var(--accent-color)',
                fontSize: 'calc(var(--font-size) * 1.33)'
              }}
            >
              {data.personalDetails.title}
            </div>
            {(!data.sections.find(s => s.type === SectionType.Summary)?.visible || !leftColumnSections.find(s => s.type === SectionType.Summary)) && data.personalDetails.summary && (
              <p 
                className="text-gray-600 border-l-2 pl-4" 
                style={{ 
                  borderColor: 'var(--accent-color)',
                  fontSize: 'var(--font-size-sm)',
                  lineHeight: 'var(--line-height)'
                }}
              >
                {data.personalDetails.summary}
              </p>
            )}
          </div>
        </div>

        {/* Contact Bar */}
        <div 
          className="w-full flex flex-wrap justify-between items-center text-white font-medium" 
          style={{ 
            backgroundColor: 'var(--accent-color)',
            paddingLeft: 'var(--margins)',
            paddingRight: 'var(--margins)',
            paddingTop: 'calc(var(--spacing) * 2px + 4px)',
            paddingBottom: 'calc(var(--spacing) * 2px + 4px)',
            fontSize: 'var(--font-size-sm)'
          }}
        >
          {data.personalDetails.email && (
            <div className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" />{data.personalDetails.email}</div>
          )}
          {data.personalDetails.phone && (
            <div className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" />{data.personalDetails.phone}</div>
          )}
          {data.personalDetails.location && (
            <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{data.personalDetails.location}</div>
          )}
          {data.personalDetails.linkedin && (
            <div className="flex items-center gap-1.5"><Linkedin className="w-3.5 h-3.5" />{data.personalDetails.linkedin.replace('https://', '')}</div>
          )}
          {data.personalDetails.website && (
            <div className="flex items-center gap-1.5"><Globe className="w-3.5 h-3.5" />{data.personalDetails.website.replace('https://', '')}</div>
          )}
        </div>

        {/* Two Column Body */}
        <div 
          className="flex flex-1 w-full" 
          style={{
            marginTop: 'var(--spacing-large)',
            marginBottom: 'var(--spacing-large)',
            paddingLeft: 'var(--margins)',
            paddingRight: 'var(--margins)',
            gap: 'var(--margins)'
          }}
        >
          {/* Left Column (60%) */}
          <div className="w-[60%] flex flex-col" style={{ gap: 'var(--spacing-large)' }}>
            {leftColumnSections.map((section, idx) => (
              <div key={section.id} className="group relative cursor-pointer hover:ring-2 ring-blue-400/40 rounded -m-1 p-1 transition-all" onClick={() => setActiveSection(section.type)}>
                <SectionHeader title={section.label} type={section.type} isFirst={idx === 0} />
                {renderSectionContent(section.type, 'left')}
              </div>
            ))}
          </div>
          
          {/* Right Column (40%) */}
          <div className="w-[40%] flex flex-col" style={{ gap: 'var(--spacing-large)' }}>
             {rightColumnSections.map((section, idx) => (
                <div key={section.id} className="group relative cursor-pointer hover:ring-2 ring-blue-400/40 rounded -m-1 p-1 transition-all" onClick={() => setActiveSection(section.type)}>
                  <SectionHeader title={section.label} type={section.type} isFirst={idx === 0} />
                  {renderSectionContent(section.type, 'right')}
                </div>
             ))}
          </div>
        </div>

      </div>
    );
  }
);
HybridTemplate.displayName = 'HybridTemplate';
