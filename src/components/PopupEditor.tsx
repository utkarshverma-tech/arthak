import { useRef } from 'react';
import { useResumeStore, SectionType } from '@/store/resumeStore';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Trash2, GripVertical, Upload, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const inputCls = 'bg-[#FFFFFF] border-[#D4C9B8] text-[#2C2420] focus-visible:ring-[#1a1a2e]';
const labelCls = 'text-[#2C2420] text-sm font-medium';

function SortableExpItem({ id, exp, updateExp, removeExp }: any) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div ref={setNodeRef} style={style} className="border border-[#E8E0D4] p-4 rounded-lg bg-[#FFFFFF] flex flex-col gap-4 relative group">
      <div className="flex justify-between items-center">
        <button {...attributes} {...listeners} className="cursor-grab text-[#8B7355] hover:text-[#1a1a2e]">
          <GripVertical className="h-4 w-4" />
        </button>
        <Button variant="ghost" size="icon" onClick={() => removeExp(id)} className="h-6 w-6 text-red-500 opacity-50 group-hover:opacity-100 hover:text-red-600 hover:bg-red-500/10">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5"><Label className={labelCls}>Company</Label><Input className={inputCls} value={exp.company} onChange={e => updateExp(id, { company: e.target.value })} /></div>
        <div className="space-y-1.5"><Label className={labelCls}>Position</Label><Input className={inputCls} value={exp.position} onChange={e => updateExp(id, { position: e.target.value })} /></div>
        <div className="space-y-1.5"><Label className={labelCls}>Location</Label><Input className={inputCls} value={exp.location} onChange={e => updateExp(id, { location: e.target.value })} /></div>
        <div className="flex gap-2">
          <div className="flex-1 space-y-1.5"><Label className={labelCls}>Start</Label><Input className={inputCls} value={exp.startDate} onChange={e => updateExp(id, { startDate: e.target.value })} placeholder="2022" /></div>
          <div className="flex-1 space-y-1.5"><Label className={labelCls}>End</Label><Input className={inputCls} value={exp.endDate} onChange={e => updateExp(id, { endDate: e.target.value })} disabled={exp.current} placeholder="2024" /></div>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id={`cur-${id}`} checked={exp.current} onCheckedChange={(c) => updateExp(id, { current: !!c, endDate: c ? 'Present' : '' })} className="border-[#D4C9B8] data-[state=checked]:bg-[#1a1a2e]" />
        <Label htmlFor={`cur-${id}`} className={labelCls}>I currently work here</Label>
      </div>
      <div className="space-y-1.5">
        <Label className={labelCls}>Description <span className="text-[#8B7355] font-normal">(one bullet per line)</span></Label>
        <Textarea className={`${inputCls} h-28`} value={exp.description} onChange={e => updateExp(id, { description: e.target.value })} placeholder="Led a team of 5 engineers&#10;Reduced load time by 40%&#10;Shipped 3 major features" />
      </div>
    </div>
  );
}

export function PopupEditor() {
  const { activeSection, setActiveSection, data, updatePersonalDetails, updateExperiences, updateEducation, updateProjects, updateSkills, updateLanguages } = useResumeStore();

  if (!activeSection) return null;

  const handleClose = () => setActiveSection(null);
  const sectionLabel = data.sections.find(s => s.type === activeSection)?.label || activeSection;

  const renderContent = () => {
    switch (activeSection) {
      case SectionType.PersonalDetails: return <PersonalDetailsEditor />;
      case SectionType.Summary:
        return (
          <div className="space-y-2">
            <Label className={labelCls}>Professional Summary</Label>
            <Textarea className={`${inputCls} h-52`} value={data.personalDetails.summary} onChange={e => updatePersonalDetails({ summary: e.target.value })} placeholder="Write 2-4 sentences about your professional background and key strengths..." />
          </div>
        );
      case SectionType.Experience:     return <ExperienceEditor />;
      case SectionType.Education:      return <EducationEditor />;
      case SectionType.Projects:       return <ProjectsEditor />;
      case SectionType.Skills:         return <SkillsEditor />;
      case SectionType.Languages:      return <LanguagesEditor />;
      case SectionType.Certificates:   return <CertificatesEditor />;
      case SectionType.Awards:         return <AwardsEditor />;
      case SectionType.Achievements:   return <AchievementsEditor />;
      case SectionType.References:     return <ReferencesEditor />;
      case SectionType.CustomSection:  return <CustomSectionEditor />;
      default:
        return <div className="p-4 text-center text-[#8B7355]">Section editor not available.</div>;
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-[#FAF8F5] border border-[#E8E0D4] w-full max-w-2xl max-h-[85vh] flex flex-col rounded-xl shadow-2xl overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E0D4] bg-white shrink-0">
            <h2 className="text-lg font-semibold text-[#2C2420]">{sectionLabel}</h2>
            <Button variant="ghost" size="icon" onClick={handleClose} className="text-[#8B7355] hover:text-[#1a1a2e] hover:bg-[#EDE8DF]">
              <X className="h-5 w-5" />
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto p-6 text-[#2C2420]">
            {renderContent()}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function PersonalDetailsEditor() {
  const { data, updatePersonalDetails } = useResumeStore();
  const fileRef = useRef<HTMLInputElement>(null);

  const handlePhotoFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => updatePersonalDetails({ photo: ev.target?.result as string });
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-4 p-4 bg-white border border-[#E8E0D4] rounded-lg">
        <div className="w-16 h-16 rounded-full bg-[#EDE8DF] border-2 border-[#D4C9B8] flex items-center justify-center overflow-hidden shrink-0">
          {data.personalDetails.photo
            ? <img src={data.personalDetails.photo} alt="Profile" className="w-full h-full object-cover" />
            : <User className="w-7 h-7 text-[#8B7355]" />
          }
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-[#2C2420] mb-1">Profile Photo</p>
          <p className="text-xs text-[#8B7355] mb-2">Upload a photo or paste a URL</p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-[#D4C9B8] text-[#2C2420] hover:bg-[#EDE8DF] gap-1.5"
              onClick={() => fileRef.current?.click()}
            >
              <Upload className="w-3.5 h-3.5" /> Upload Photo
            </Button>
            {data.personalDetails.photo && (
              <Button variant="ghost" size="sm" className="text-red-500 hover:bg-red-50 hover:text-red-600" onClick={() => updatePersonalDetails({ photo: '' })}>
                Remove
              </Button>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoFile} />
        </div>
      </div>
      <div className="text-xs text-[#8B7355] -mt-2">Or paste a photo URL:</div>
      <Input className={inputCls} value={data.personalDetails.photo || ''} onChange={e => updatePersonalDetails({ photo: e.target.value })} placeholder="https://example.com/your-photo.jpg" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5"><Label className={labelCls}>First Name</Label><Input className={inputCls} value={data.personalDetails.firstName} onChange={e => updatePersonalDetails({ firstName: e.target.value })} /></div>
        <div className="space-y-1.5"><Label className={labelCls}>Last Name</Label><Input className={inputCls} value={data.personalDetails.lastName} onChange={e => updatePersonalDetails({ lastName: e.target.value })} /></div>
        <div className="space-y-1.5 sm:col-span-2"><Label className={labelCls}>Professional Title</Label><Input className={inputCls} value={data.personalDetails.title} onChange={e => updatePersonalDetails({ title: e.target.value })} placeholder="e.g. Senior Software Engineer" /></div>
        <div className="space-y-1.5"><Label className={labelCls}>Email</Label><Input className={inputCls} value={data.personalDetails.email} onChange={e => updatePersonalDetails({ email: e.target.value })} /></div>
        <div className="space-y-1.5"><Label className={labelCls}>Phone</Label><Input className={inputCls} value={data.personalDetails.phone} onChange={e => updatePersonalDetails({ phone: e.target.value })} /></div>
        <div className="space-y-1.5"><Label className={labelCls}>Location</Label><Input className={inputCls} value={data.personalDetails.location} onChange={e => updatePersonalDetails({ location: e.target.value })} /></div>
        <div className="space-y-1.5"><Label className={labelCls}>Website</Label><Input className={inputCls} value={data.personalDetails.website} onChange={e => updatePersonalDetails({ website: e.target.value })} /></div>
        <div className="space-y-1.5"><Label className={labelCls}>LinkedIn</Label><Input className={inputCls} value={data.personalDetails.linkedin} onChange={e => updatePersonalDetails({ linkedin: e.target.value })} /></div>
        <div className="space-y-1.5"><Label className={labelCls}>GitHub</Label><Input className={inputCls} value={data.personalDetails.github} onChange={e => updatePersonalDetails({ github: e.target.value })} /></div>
        <div className="space-y-1.5"><Label className={labelCls}>Portfolio</Label><Input className={inputCls} value={data.personalDetails.portfolio} onChange={e => updatePersonalDetails({ portfolio: e.target.value })} /></div>
      </div>
    </div>
  );
}

function ExperienceEditor() {
  const { data, updateExperiences } = useResumeStore();
  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));
  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oi = data.experiences.findIndex(s => s.id === active.id);
      const ni = data.experiences.findIndex(s => s.id === over.id);
      updateExperiences(arrayMove(data.experiences, oi, ni));
    }
  };
  const addExp = () => updateExperiences([...data.experiences, { id: `exp-${Date.now()}`, company: '', position: '', location: '', startDate: '', endDate: '', current: false, description: '' }]);
  const updateExp = (id: string, u: any) => updateExperiences(data.experiences.map(e => e.id === id ? { ...e, ...u } : e));
  const removeExp = (id: string) => updateExperiences(data.experiences.filter(e => e.id !== id));
  return (
    <div className="flex flex-col gap-4">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={data.experiences.map(s => s.id)} strategy={verticalListSortingStrategy}>
          {data.experiences.map(exp => <SortableExpItem key={exp.id} id={exp.id} exp={exp} updateExp={updateExp} removeExp={removeExp} />)}
        </SortableContext>
      </DndContext>
      <Button variant="outline" onClick={addExp} className="w-full border-[#1a1a2e] text-[#1a1a2e] hover:bg-[#1a1a2e]/10"><Plus className="h-4 w-4 mr-2" />Add Experience</Button>
    </div>
  );
}

function EducationEditor() {
  const { data, updateEducation } = useResumeStore();
  const addEdu = () => updateEducation([...data.education, { id: `edu-${Date.now()}`, institution: '', degree: '', location: '', startDate: '', endDate: '', gpa: '', description: '' }]);
  const updateEdu = (id: string, u: any) => updateEducation(data.education.map(e => e.id === id ? { ...e, ...u } : e));
  const removeEdu = (id: string) => updateEducation(data.education.filter(e => e.id !== id));
  return (
    <div className="flex flex-col gap-4">
      {data.education.map(edu => (
        <div key={edu.id} className="border border-[#E8E0D4] p-4 rounded-lg bg-white flex flex-col gap-3 relative group">
          <Button variant="ghost" size="icon" onClick={() => removeEdu(edu.id)} className="absolute top-2 right-2 h-6 w-6 text-red-500 opacity-50 group-hover:opacity-100"><Trash2 className="h-4 w-4" /></Button>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
            <div className="space-y-1.5"><Label className={labelCls}>Degree</Label><Input className={inputCls} value={edu.degree} onChange={e => updateEdu(edu.id, { degree: e.target.value })} /></div>
            <div className="space-y-1.5"><Label className={labelCls}>Institution</Label><Input className={inputCls} value={edu.institution} onChange={e => updateEdu(edu.id, { institution: e.target.value })} /></div>
            <div className="space-y-1.5"><Label className={labelCls}>Location</Label><Input className={inputCls} value={edu.location} onChange={e => updateEdu(edu.id, { location: e.target.value })} /></div>
            <div className="space-y-1.5"><Label className={labelCls}>GPA</Label><Input className={inputCls} value={edu.gpa} onChange={e => updateEdu(edu.id, { gpa: e.target.value })} /></div>
            <div className="space-y-1.5"><Label className={labelCls}>Start</Label><Input className={inputCls} value={edu.startDate} onChange={e => updateEdu(edu.id, { startDate: e.target.value })} /></div>
            <div className="space-y-1.5"><Label className={labelCls}>End</Label><Input className={inputCls} value={edu.endDate} onChange={e => updateEdu(edu.id, { endDate: e.target.value })} /></div>
          </div>
          <div className="space-y-1.5"><Label className={labelCls}>Description</Label><Textarea className={inputCls} value={edu.description} onChange={e => updateEdu(edu.id, { description: e.target.value })} /></div>
        </div>
      ))}
      <Button variant="outline" onClick={addEdu} className="w-full border-[#1a1a2e] text-[#1a1a2e] hover:bg-[#1a1a2e]/10"><Plus className="h-4 w-4 mr-2" />Add Education</Button>
    </div>
  );
}

function ProjectsEditor() {
  const { data, updateProjects } = useResumeStore();
  const addProj = () => updateProjects([...data.projects, { id: `proj-${Date.now()}`, title: '', role: '', description: '', techStack: '', github: '', liveUrl: '', startDate: '', endDate: '' }]);
  const updateProj = (id: string, u: any) => updateProjects(data.projects.map(e => e.id === id ? { ...e, ...u } : e));
  const removeProj = (id: string) => updateProjects(data.projects.filter(e => e.id !== id));
  return (
    <div className="flex flex-col gap-4">
      {data.projects.map(proj => (
        <div key={proj.id} className="border border-[#E8E0D4] p-4 rounded-lg bg-white flex flex-col gap-3 relative group">
          <Button variant="ghost" size="icon" onClick={() => removeProj(proj.id)} className="absolute top-2 right-2 h-6 w-6 text-red-500 opacity-50 group-hover:opacity-100"><Trash2 className="h-4 w-4" /></Button>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
            <div className="space-y-1.5"><Label className={labelCls}>Project Title</Label><Input className={inputCls} value={proj.title} onChange={e => updateProj(proj.id, { title: e.target.value })} /></div>
            <div className="space-y-1.5"><Label className={labelCls}>Your Role</Label><Input className={inputCls} value={proj.role} onChange={e => updateProj(proj.id, { role: e.target.value })} /></div>
            <div className="space-y-1.5"><Label className={labelCls}>Tech Stack</Label><Input className={inputCls} value={proj.techStack} onChange={e => updateProj(proj.id, { techStack: e.target.value })} placeholder="React, Node.js, PostgreSQL" /></div>
            <div className="space-y-1.5"><Label className={labelCls}>Live URL</Label><Input className={inputCls} value={proj.liveUrl} onChange={e => updateProj(proj.id, { liveUrl: e.target.value })} /></div>
            <div className="space-y-1.5"><Label className={labelCls}>GitHub URL</Label><Input className={inputCls} value={proj.github} onChange={e => updateProj(proj.id, { github: e.target.value })} /></div>
            <div className="flex gap-2">
              <div className="flex-1 space-y-1.5"><Label className={labelCls}>Start</Label><Input className={inputCls} value={proj.startDate} onChange={e => updateProj(proj.id, { startDate: e.target.value })} /></div>
              <div className="flex-1 space-y-1.5"><Label className={labelCls}>End</Label><Input className={inputCls} value={proj.endDate} onChange={e => updateProj(proj.id, { endDate: e.target.value })} /></div>
            </div>
          </div>
          <div className="space-y-1.5"><Label className={labelCls}>Description</Label><Textarea className={`${inputCls} h-24`} value={proj.description} onChange={e => updateProj(proj.id, { description: e.target.value })} /></div>
        </div>
      ))}
      <Button variant="outline" onClick={addProj} className="w-full border-[#1a1a2e] text-[#1a1a2e] hover:bg-[#1a1a2e]/10"><Plus className="h-4 w-4 mr-2" />Add Project</Button>
    </div>
  );
}

function SkillsEditor() {
  const { data, updateSkills } = useResumeStore();
  const addSkill = () => updateSkills([...data.skills, { id: `skill-${Date.now()}`, name: '', category: '', highlighted: false }]);
  const updateSkill = (id: string, u: any) => updateSkills(data.skills.map(e => e.id === id ? { ...e, ...u } : e));
  const removeSkill = (id: string) => updateSkills(data.skills.filter(e => e.id !== id));
  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs text-[#8B7355]">Highlighted skills appear with a filled accent color in the resume.</p>
      {data.skills.map(skill => (
        <div key={skill.id} className="flex items-center gap-3">
          <Input className={`${inputCls} flex-1`} value={skill.name} onChange={e => updateSkill(skill.id, { name: e.target.value })} placeholder="Skill name" />
          <Input className={`${inputCls} w-32`} value={skill.category} onChange={e => updateSkill(skill.id, { category: e.target.value })} placeholder="Category" />
          <div className="flex items-center gap-1.5 shrink-0">
            <Checkbox id={`hl-${skill.id}`} checked={skill.highlighted} onCheckedChange={c => updateSkill(skill.id, { highlighted: !!c })} className="border-[#D4C9B8] data-[state=checked]:bg-[#1a1a2e]" />
            <Label htmlFor={`hl-${skill.id}`} className="text-xs text-[#2C2420] cursor-pointer">Star</Label>
          </div>
          <Button variant="ghost" size="icon" onClick={() => removeSkill(skill.id)} className="h-8 w-8 text-red-400 hover:text-red-600 hover:bg-red-50 shrink-0"><Trash2 className="h-4 w-4" /></Button>
        </div>
      ))}
      <Button variant="outline" onClick={addSkill} className="w-full border-[#1a1a2e] text-[#1a1a2e] hover:bg-[#1a1a2e]/10 mt-1"><Plus className="h-4 w-4 mr-2" />Add Skill</Button>
    </div>
  );
}

function LanguagesEditor() {
  const { data, updateLanguages } = useResumeStore();
  const addLang = () => updateLanguages([...data.languages, { id: `lang-${Date.now()}`, language: '', level: 'Fluent' }]);
  const updateLang = (id: string, u: any) => updateLanguages(data.languages.map(e => e.id === id ? { ...e, ...u } : e));
  const removeLang = (id: string) => updateLanguages(data.languages.filter(e => e.id !== id));
  return (
    <div className="flex flex-col gap-3">
      {data.languages.map(lang => (
        <div key={lang.id} className="flex items-center gap-3">
          <Input className={`${inputCls} flex-1`} value={lang.language} onChange={e => updateLang(lang.id, { language: e.target.value })} placeholder="Language name" />
          <select value={lang.level} onChange={e => updateLang(lang.id, { level: e.target.value })} className="h-10 w-40 rounded-md border border-[#D4C9B8] bg-white px-3 text-sm text-[#2C2420] focus:outline-none focus:ring-2 focus:ring-[#1a1a2e]">
            <option>Native</option>
            <option>Fluent</option>
            <option>Intermediate</option>
            <option>Basic</option>
          </select>
          <Button variant="ghost" size="icon" onClick={() => removeLang(lang.id)} className="h-8 w-8 text-red-400 hover:text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" /></Button>
        </div>
      ))}
      <Button variant="outline" onClick={addLang} className="w-full border-[#1a1a2e] text-[#1a1a2e] hover:bg-[#1a1a2e]/10 mt-1"><Plus className="h-4 w-4 mr-2" />Add Language</Button>
    </div>
  );
}

function CertificatesEditor() {
  const { data, updateCertificates } = useResumeStore();
  const add = () => updateCertificates([...data.certificates, { id: `cert-${Date.now()}`, title: '', issuer: '', date: '', url: '', description: '' }]);
  const update = (id: string, u: any) => updateCertificates(data.certificates.map(e => e.id === id ? { ...e, ...u } : e));
  const remove = (id: string) => updateCertificates(data.certificates.filter(e => e.id !== id));
  return (
    <div className="flex flex-col gap-4">
      {data.certificates.map(cert => (
        <div key={cert.id} className="border border-[#E8E0D4] p-4 rounded-lg bg-white flex flex-col gap-3 relative group">
          <Button variant="ghost" size="icon" onClick={() => remove(cert.id)} className="absolute top-2 right-2 h-6 w-6 text-red-500 opacity-50 group-hover:opacity-100"><Trash2 className="h-4 w-4" /></Button>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
            <div className="space-y-1.5 sm:col-span-2"><Label className={labelCls}>Certificate Title</Label><Input className={inputCls} value={cert.title} onChange={e => update(cert.id, { title: e.target.value })} /></div>
            <div className="space-y-1.5"><Label className={labelCls}>Issuer</Label><Input className={inputCls} value={cert.issuer} onChange={e => update(cert.id, { issuer: e.target.value })} placeholder="e.g. Google, AWS" /></div>
            <div className="space-y-1.5"><Label className={labelCls}>Date</Label><Input className={inputCls} value={cert.date} onChange={e => update(cert.id, { date: e.target.value })} placeholder="e.g. 2023" /></div>
            <div className="space-y-1.5 sm:col-span-2"><Label className={labelCls}>Credential URL</Label><Input className={inputCls} value={cert.url} onChange={e => update(cert.id, { url: e.target.value })} placeholder="https://..." /></div>
          </div>
          <div className="space-y-1.5"><Label className={labelCls}>Description</Label><Textarea className={inputCls} value={cert.description} onChange={e => update(cert.id, { description: e.target.value })} /></div>
        </div>
      ))}
      <Button variant="outline" onClick={add} className="w-full border-[#1a1a2e] text-[#1a1a2e] hover:bg-[#1a1a2e]/10"><Plus className="h-4 w-4 mr-2" />Add Certificate</Button>
    </div>
  );
}

function AwardsEditor() {
  const { data, setData } = useResumeStore();
  const add = () => setData({ awards: [...data.awards, { id: `award-${Date.now()}`, title: '', issuer: '', date: '', description: '' }] });
  const update = (id: string, u: any) => setData({ awards: data.awards.map(e => e.id === id ? { ...e, ...u } : e) });
  const remove = (id: string) => setData({ awards: data.awards.filter(e => e.id !== id) });
  return (
    <div className="flex flex-col gap-4">
      {data.awards.map(award => (
        <div key={award.id} className="border border-[#E8E0D4] p-4 rounded-lg bg-white flex flex-col gap-3 relative group">
          <Button variant="ghost" size="icon" onClick={() => remove(award.id)} className="absolute top-2 right-2 h-6 w-6 text-red-500 opacity-50 group-hover:opacity-100"><Trash2 className="h-4 w-4" /></Button>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
            <div className="space-y-1.5 sm:col-span-2"><Label className={labelCls}>Award Title</Label><Input className={inputCls} value={award.title} onChange={e => update(award.id, { title: e.target.value })} /></div>
            <div className="space-y-1.5"><Label className={labelCls}>Issuer / Organisation</Label><Input className={inputCls} value={award.issuer} onChange={e => update(award.id, { issuer: e.target.value })} /></div>
            <div className="space-y-1.5"><Label className={labelCls}>Date</Label><Input className={inputCls} value={award.date} onChange={e => update(award.id, { date: e.target.value })} /></div>
          </div>
          <div className="space-y-1.5"><Label className={labelCls}>Description</Label><Textarea className={inputCls} value={award.description} onChange={e => update(award.id, { description: e.target.value })} /></div>
        </div>
      ))}
      <Button variant="outline" onClick={add} className="w-full border-[#1a1a2e] text-[#1a1a2e] hover:bg-[#1a1a2e]/10"><Plus className="h-4 w-4 mr-2" />Add Award</Button>
    </div>
  );
}

function AchievementsEditor() {
  const { data, setData } = useResumeStore();
  const add = () => setData({ achievements: [...data.achievements, { id: `ach-${Date.now()}`, title: '', date: '', description: '' }] });
  const update = (id: string, u: any) => setData({ achievements: data.achievements.map(e => e.id === id ? { ...e, ...u } : e) });
  const remove = (id: string) => setData({ achievements: data.achievements.filter(e => e.id !== id) });
  return (
    <div className="flex flex-col gap-4">
      {data.achievements.map(ach => (
        <div key={ach.id} className="border border-[#E8E0D4] p-4 rounded-lg bg-white flex flex-col gap-3 relative group">
          <Button variant="ghost" size="icon" onClick={() => remove(ach.id)} className="absolute top-2 right-2 h-6 w-6 text-red-500 opacity-50 group-hover:opacity-100"><Trash2 className="h-4 w-4" /></Button>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
            <div className="space-y-1.5 sm:col-span-2"><Label className={labelCls}>Achievement</Label><Input className={inputCls} value={ach.title} onChange={e => update(ach.id, { title: e.target.value })} /></div>
            <div className="space-y-1.5"><Label className={labelCls}>Date</Label><Input className={inputCls} value={ach.date} onChange={e => update(ach.id, { date: e.target.value })} /></div>
          </div>
          <div className="space-y-1.5"><Label className={labelCls}>Description</Label><Textarea className={inputCls} value={ach.description} onChange={e => update(ach.id, { description: e.target.value })} /></div>
        </div>
      ))}
      <Button variant="outline" onClick={add} className="w-full border-[#1a1a2e] text-[#1a1a2e] hover:bg-[#1a1a2e]/10"><Plus className="h-4 w-4 mr-2" />Add Achievement</Button>
    </div>
  );
}

function ReferencesEditor() {
  const { data, setData } = useResumeStore();
  const add = () => setData({ references: [...data.references, { id: `ref-${Date.now()}`, name: '', title: '', company: '', email: '', phone: '' }] });
  const update = (id: string, u: any) => setData({ references: data.references.map(e => e.id === id ? { ...e, ...u } : e) });
  const remove = (id: string) => setData({ references: data.references.filter(e => e.id !== id) });
  return (
    <div className="flex flex-col gap-4">
      {data.references.map(ref => (
        <div key={ref.id} className="border border-[#E8E0D4] p-4 rounded-lg bg-white flex flex-col gap-3 relative group">
          <Button variant="ghost" size="icon" onClick={() => remove(ref.id)} className="absolute top-2 right-2 h-6 w-6 text-red-500 opacity-50 group-hover:opacity-100"><Trash2 className="h-4 w-4" /></Button>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
            <div className="space-y-1.5"><Label className={labelCls}>Full Name</Label><Input className={inputCls} value={ref.name} onChange={e => update(ref.id, { name: e.target.value })} /></div>
            <div className="space-y-1.5"><Label className={labelCls}>Job Title</Label><Input className={inputCls} value={ref.title} onChange={e => update(ref.id, { title: e.target.value })} /></div>
            <div className="space-y-1.5"><Label className={labelCls}>Company</Label><Input className={inputCls} value={ref.company} onChange={e => update(ref.id, { company: e.target.value })} /></div>
            <div className="space-y-1.5"><Label className={labelCls}>Email</Label><Input className={inputCls} value={ref.email} onChange={e => update(ref.id, { email: e.target.value })} /></div>
            <div className="space-y-1.5"><Label className={labelCls}>Phone</Label><Input className={inputCls} value={ref.phone} onChange={e => update(ref.id, { phone: e.target.value })} /></div>
          </div>
        </div>
      ))}
      <Button variant="outline" onClick={add} className="w-full border-[#1a1a2e] text-[#1a1a2e] hover:bg-[#1a1a2e]/10"><Plus className="h-4 w-4 mr-2" />Add Reference</Button>
    </div>
  );
}

function CustomSectionEditor() {
  const { data, setData } = useResumeStore();
  const add = () => setData({ customSections: [...data.customSections, { id: `custom-${Date.now()}`, title: 'Custom Section', content: '' }] });
  const update = (id: string, u: any) => setData({ customSections: data.customSections.map(e => e.id === id ? { ...e, ...u } : e) });
  const remove = (id: string) => setData({ customSections: data.customSections.filter(e => e.id !== id) });
  return (
    <div className="flex flex-col gap-4">
      {data.customSections.map(cs => (
        <div key={cs.id} className="border border-[#E8E0D4] p-4 rounded-lg bg-white flex flex-col gap-3 relative group">
          <Button variant="ghost" size="icon" onClick={() => remove(cs.id)} className="absolute top-2 right-2 h-6 w-6 text-red-500 opacity-50 group-hover:opacity-100"><Trash2 className="h-4 w-4" /></Button>
          <div className="space-y-1.5 mt-1"><Label className={labelCls}>Section Title</Label><Input className={inputCls} value={cs.title} onChange={e => update(cs.id, { title: e.target.value })} /></div>
          <div className="space-y-1.5"><Label className={labelCls}>Content</Label><Textarea className={`${inputCls} h-32`} value={cs.content} onChange={e => update(cs.id, { content: e.target.value })} /></div>
        </div>
      ))}
      <Button variant="outline" onClick={add} className="w-full border-[#1a1a2e] text-[#1a1a2e] hover:bg-[#1a1a2e]/10"><Plus className="h-4 w-4 mr-2" />Add Custom Block</Button>
    </div>
  );
}