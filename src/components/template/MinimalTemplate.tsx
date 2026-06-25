import React from 'react';
import { useResumeStore, SectionType, ResumeData, DesignSettings } from '@/store/resumeStore';

interface TemplateProps {
  data: ResumeData;
  settings: DesignSettings;
}

export const MinimalTemplate = React.forwardRef<HTMLDivElement, TemplateProps>(
  ({ data, settings }, ref) => {
    const setActiveSection = useResumeStore((state) => state.setActiveSection);

    const cssVars = {
      '--accent-color': settings.accentColor,
      '--font-family': settings.fontFamily,
      '--font-size': `${settings.fontSize}px`,
      '--line-height': settings.lineHeight,
      '--spacing': `${settings.spacing}px`,
      '--margins': `${settings.margins}px`,
      '--spacing-large': `${settings.spacing * 4.2}px`,
      '--spacing-medium': `${settings.spacing * 2.6}px`,
      '--spacing-small': `${settings.spacing * 1.6}px`,
      '--font-size-xxs': `${settings.fontSize - 3}px`,
      '--font-size-xs': `${settings.fontSize - 2}px`,
      '--font-size-sm': `${settings.fontSize - 1}px`,
      '--font-size-base': `${settings.fontSize}px`,
      '--font-size-lg': `${settings.fontSize + 1}px`,
      '--font-size-xl': `${settings.fontSize + 2}px`,
    } as React.CSSProperties;

    const visibleSections = data.sections.filter(s => s.visible).sort((a, b) => a.order - b.order);

    const SectionHeader = ({ title, type, isFirst }: { title: string, type: SectionType, isFirst?: boolean }) => (
      <div 
        className="cursor-pointer group-hover:ring-2 ring-blue-400/40 border-b pb-1" 
        onClick={(e) => { e.stopPropagation(); setActiveSection(type); }}
        style={{
          borderColor: 'var(--accent-color)',
          marginTop: isFirst ? 0 : 'var(--spacing-large)',
          marginBottom: 'var(--spacing-small)',
        }}
      >
        <h2 className="uppercase font-semibold tracking-[0.15em]" style={{ color: 'var(--accent-color)', fontVariant: 'small-caps', fontSize: 'var(--font-size-sm)' }}>{title}</h2>
      </div>
    );

    const renderSectionContent = (type: SectionType) => {
      switch (type) {
        case SectionType.Summary:
          return (
            <p className="leading-[var(--line-height)] text-gray-700" style={{ fontSize: 'var(--font-size-sm)' }}>
              {data.personalDetails.summary}
            </p>
          );
        
        case SectionType.Experience:
          return (
            <div className="flex flex-col" style={{ gap: 'var(--spacing-large)' }}>
              {data.experiences.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-gray-900" style={{ fontSize: 'var(--font-size-base)' }}>{exp.company}</h3>
                    <span className="text-gray-500 whitespace-nowrap ml-4 font-medium" style={{ fontSize: 'var(--font-size-xs)' }}>
                      {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  <div className="italic" style={{ color: 'var(--accent-color)', fontSize: 'var(--font-size-sm)', marginBottom: 'calc(var(--spacing) * 0.3px + 1px)' }}>{exp.position}</div>
                  <div className="text-gray-700 whitespace-pre-wrap" style={{ fontSize: 'var(--font-size-sm)', lineHeight: 'var(--line-height)' }}>
                    {exp.description}
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
                   <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-gray-900" style={{ fontSize: 'var(--font-size-base)' }}>{edu.institution}</h3>
                    <span className="text-gray-500 whitespace-nowrap ml-4 font-medium" style={{ fontSize: 'var(--font-size-xs)' }}>
                      {edu.startDate} – {edu.endDate}
                    </span>
                  </div>
                  <div className="italic" style={{ color: 'var(--accent-color)', fontSize: 'var(--font-size-sm)', marginBottom: 'calc(var(--spacing) * 0.2px + 1px)' }}>{edu.degree}</div>
                  {edu.description && (
                    <p className="text-gray-700 mt-1" style={{ fontSize: 'var(--font-size-sm)', lineHeight: 'var(--line-height)' }}>
                      {edu.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          );

        case SectionType.Projects:
          return (
            <div className="flex flex-col" style={{ gap: 'var(--spacing-large)' }}>
              {data.projects.map((proj) => (
                <div key={proj.id}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-gray-900" style={{ fontSize: 'var(--font-size-base)' }}>
                      {proj.title}
                    </h3>
                    <span className="text-gray-500 whitespace-nowrap ml-4 font-medium" style={{ fontSize: 'var(--font-size-xs)' }}>
                      {proj.startDate} – {proj.endDate}
                    </span>
                  </div>
                  <div className="italic" style={{ color: 'var(--accent-color)', fontSize: 'var(--font-size-sm)', marginBottom: 'calc(var(--spacing) * 0.3px + 1px)' }}>{proj.role} {proj.liveUrl && `· ${proj.liveUrl}`}</div>
                  <p className="text-gray-700 mb-1" style={{ fontSize: 'var(--font-size-sm)', lineHeight: 'var(--line-height)' }}>
                    {proj.description}
                  </p>
                </div>
              ))}
            </div>
          );

        case SectionType.Skills:
          const allSkills = data.skills;
          return (
            <div className="leading-relaxed text-gray-700" style={{ fontSize: 'var(--font-size-sm)' }}>
              {allSkills.map((skill, i) => (
                <span key={skill.id}>
                  <span className={skill.highlighted ? "font-semibold" : ""} style={skill.highlighted ? { color: 'var(--accent-color)' } : {}}>
                    {skill.name}
                  </span>
                  {i < allSkills.length - 1 ? ', ' : ''}
                </span>
              ))}
            </div>
          );

        case SectionType.Languages:
          return (
            <div className="flex flex-col" style={{ gap: 'calc(var(--spacing) * 0.4px)' }}>
              {data.languages.map((lang) => (
                <div key={lang.id} className="text-gray-700" style={{ fontSize: 'var(--font-size-sm)' }}>
                  <span className="font-semibold text-gray-900">{lang.language}</span> — {lang.level}
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
                      <h3 className="font-bold text-gray-900" style={{ fontSize: 'var(--font-size-base)' }}>{item.title || item.name}</h3>
                      <span className="text-gray-500 whitespace-nowrap ml-4 font-medium" style={{ fontSize: 'var(--font-size-xs)' }}>
                        {item.date}
                      </span>
                    </div>
                    {(item.issuer || item.company) && <div className="italic" style={{ color: 'var(--accent-color)', fontSize: 'var(--font-size-sm)', marginBottom: 'calc(var(--spacing) * 0.2px + 1px)' }}>{item.issuer || item.company} {item.url && `· ${item.url}`}</div>}
                    {item.description && <div className="text-gray-700 mt-1" style={{ fontSize: 'var(--font-size-sm)', lineHeight: 'var(--line-height)' }}>{item.description}</div>}
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
        style={{
          ...cssVars,
          fontFamily: `var(--font-family)`,
          paddingLeft: 'var(--margins)',
          paddingRight: 'var(--margins)',
          paddingTop: 'calc(var(--margins) * 0.95)',
          paddingBottom: 'calc(var(--margins) * 0.95)',
        }}
      >
        {/* Header SECTION */}
        <div 
          className="w-full flex flex-col items-center text-center cursor-pointer hover:ring-2 ring-blue-400/40 transition-all"
          onClick={() => setActiveSection(SectionType.PersonalDetails)}
          style={{ marginBottom: 'var(--spacing-large)' }}
        >
          <h1 className="font-bold text-black leading-tight" style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: 'calc(var(--font-size) * 2.8)', marginBottom: 'var(--spacing-small)' }}>
            {data.personalDetails.firstName} {data.personalDetails.lastName}
          </h1>
          <div className="w-24 h-px" style={{ backgroundColor: 'var(--accent-color)', marginBottom: 'var(--spacing-medium)' }}></div>
          <div className="italic" style={{ color: 'var(--accent-color)', fontSize: 'calc(var(--font-size) * 1.2)', marginBottom: 'var(--spacing-medium)' }}>
            {data.personalDetails.title}
          </div>

          <div className="flex flex-wrap justify-center text-gray-500 uppercase tracking-wider" style={{ fontSize: 'var(--font-size-xxs)' }}>
             {data.personalDetails.email && <span>{data.personalDetails.email}</span>}
             {data.personalDetails.phone && <><span className="mx-2">·</span><span>{data.personalDetails.phone}</span></>}
             {data.personalDetails.location && <><span className="mx-2">·</span><span>{data.personalDetails.location}</span></>}
             {data.personalDetails.website && <><span className="mx-2">·</span><span>{data.personalDetails.website.replace('https://', '')}</span></>}
             {data.personalDetails.linkedin && <><span className="mx-2">·</span><span>{data.personalDetails.linkedin.replace('https://', '')}</span></>}
          </div>
        </div>

        {/* BODY - Single Column */}
        <div className="flex flex-col">
          {visibleSections.filter(s => s.type !== SectionType.PersonalDetails).map((section, idx) => (
            <div 
              key={section.id} 
              className="group relative cursor-pointer hover:ring-2 ring-blue-400/40 rounded -m-2 p-2 transition-all"
              onClick={() => setActiveSection(section.type)}
            >
              <SectionHeader title={section.label} type={section.type} isFirst={idx === 0} />
              <div>
                {renderSectionContent(section.type)}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
);

MinimalTemplate.displayName = 'MinimalTemplate';