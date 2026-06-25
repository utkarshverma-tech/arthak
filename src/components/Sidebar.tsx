import React, { useState, useRef, useEffect } from 'react';
import { useResumeStore, SectionType, getDefaultColumn } from '@/store/resumeStore';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Eye, EyeOff, Plus, Layers, LayoutTemplate, Sparkles, Award, Star, Users, FileBadge, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';

function SortableItem({ id, section }: { id: string, section: any }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const { updateSections, data, setActiveSection, settings } = useResumeStore();

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const toggleVisibility = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newSections = data.sections.map(s => s.id === id ? { ...s, visible: !s.visible } : s);
    updateSections(newSections);
  };

  const activeColumn = section.column || getDefaultColumn(section.type, settings.template);

  const toggleColumn = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newColumn: 'left' | 'right' = activeColumn === 'left' ? 'right' : 'left';
    const newSections = data.sections.map(s => s.id === id ? { ...s, column: newColumn } : s);
    updateSections(newSections);
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className="flex items-center gap-2 p-3 bg-[#FFFFFF] hover:bg-[#EDE8DF] rounded-lg border border-[#E8E0D4] hover:border-[#1a1a2e] text-sm group cursor-pointer transition-all shadow-sm"
      onClick={() => setActiveSection(section.type)}
    >
      <button {...attributes} {...listeners} className="cursor-grab p-1 text-[#8B7355] hover:text-[#1a1a2e] opacity-50 group-hover:opacity-100 transition-opacity">
        <GripVertical className="h-4 w-4" />
      </button>
      <span className="flex-1 font-medium text-[#2C2420] truncate">{section.label}</span>
      
      {settings.template !== 'minimal' && (
        <button 
          onClick={toggleColumn}
          title={`Click to move to ${activeColumn === 'left' ? 'Right' : 'Left'} column`}
          className="px-2 py-0.5 text-[10px] font-bold rounded bg-gray-100 hover:bg-[#1a1a2e] hover:text-white text-[#8B7355] transition-all border border-gray-200 uppercase tracking-wider shrink-0"
        >
          {activeColumn}
        </button>
      )}

      <button onClick={toggleVisibility} className="p-1 text-[#8B7355] hover:text-[#1a1a2e] opacity-50 group-hover:opacity-100 transition-opacity">
        {section.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
      </button>
    </div>
  );
}

export function Sidebar() {
  const { data, updateSections, addSection } = useResumeStore();
  const [showAddMenu, setShowAddMenu] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0, width: 0 });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = data.sections.findIndex((s) => s.id === active.id);
      const newIndex = data.sections.findIndex((s) => s.id === over.id);
      const reordered = arrayMove(data.sections, oldIndex, newIndex);
      const updated = reordered.map((s, i) => ({ ...s, order: i }));
      updateSections(updated);
    }
  };

  const ALL_ADDABLE = [
    { type: SectionType.Certificates, icon: FileBadge, label: 'Certificates' },
    { type: SectionType.Awards,       icon: Award,     label: 'Awards' },
    { type: SectionType.Achievements, icon: Star,      label: 'Achievements' },
    { type: SectionType.References,   icon: Users,     label: 'References' },
    { type: SectionType.CustomSection,icon: Code,      label: 'Custom Section' },
  ];

  const availableSections = ALL_ADDABLE.filter(
    sec => !data.sections.some(s => s.type === sec.type)
  );

  const openMenu = () => {
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      const menuHeight = availableSections.length * 40 + 8;
      const spaceBelow = window.innerHeight - rect.bottom;
      const top = spaceBelow < menuHeight + 8
        ? rect.top - menuHeight - 4
        : rect.bottom + 4;
      setMenuPos({ top, left: rect.left, width: rect.width });
    }
    setShowAddMenu(v => !v);
  };

  useEffect(() => {
    if (!showAddMenu) return;
    const close = () => setShowAddMenu(false);
    window.addEventListener('scroll', close, true);
    return () => window.removeEventListener('scroll', close, true);
  }, [showAddMenu]);

  return (
    <div className="w-full lg:w-[260px] h-full lg:border-r border-[#E8E0D4] bg-[#FAF8F5] flex flex-col shrink-0 no-print">
      <div className="p-3 border-b border-[#E8E0D4] flex items-center justify-around text-[#8B7355]">
        <button className="flex flex-col items-center gap-1.5 p-2 text-[#1a1a2e] bg-[#EDE8DF] rounded-md w-full">
          <Layers className="w-4 h-4" />
          <span className="text-[10px] uppercase tracking-wider font-semibold">Sections</span>
        </button>
        <button className="flex flex-col items-center gap-1.5 p-2 hover:text-[#1a1a2e] w-full transition-colors">
          <LayoutTemplate className="w-4 h-4" />
          <span className="text-[10px] uppercase tracking-wider font-semibold">Templates</span>
        </button>
        <button className="flex flex-col items-center gap-1.5 p-2 hover:text-[#1a1a2e] w-full transition-colors">
          <Sparkles className="w-4 h-4" />
          <span className="text-[10px] uppercase tracking-wider font-semibold">AI</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
        <div className="text-[10px] font-bold text-[#8B7355] uppercase tracking-[0.2em] mb-1">Sections</div>
        <div className="flex flex-col gap-2">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={data.sections.map(s => s.id)} strategy={verticalListSortingStrategy}>
              {data.sections.map((section) => (
                <SortableItem key={section.id} id={section.id} section={section} />
              ))}
            </SortableContext>
          </DndContext>
        </div>

        <Button
          ref={btnRef}
          variant="outline"
          className="w-full justify-center mt-2 border-[#1a1a2e] text-[#1a1a2e] hover:bg-[#1a1a2e]/10"
          onClick={openMenu}
          disabled={availableSections.length === 0}
        >
          <Plus className="h-4 w-4 mr-2" />
          {availableSections.length === 0 ? 'All sections added' : 'Add Section'}
        </Button>
      </div>

      {showAddMenu && (
        <>
          <div className="fixed inset-0 z-[60]" onClick={() => setShowAddMenu(false)} />
          <div
            className="fixed z-[70] bg-white border border-[#E8E0D4] rounded-xl shadow-2xl overflow-hidden py-1"
            style={{ top: menuPos.top, left: menuPos.left, width: menuPos.width, minWidth: 220 }}
          >
            <div className="px-3 py-2 text-[10px] font-bold text-[#8B7355] uppercase tracking-widest border-b border-[#E8E0D4] mb-1">
              Add a section
            </div>
            {availableSections.map(sec => (
              <button
                key={sec.type}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-[#2C2420] hover:bg-[#EDE8DF] transition-colors font-medium"
                onClick={() => { addSection(sec.type); setShowAddMenu(false); }}
              >
                <sec.icon className="w-4 h-4 text-[#8B7355] shrink-0" />
                {sec.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}