import React from 'react';
import { useResumeStore } from '@/store/resumeStore';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

const COLORS = [
  '#0d9488', // Teal
  '#2ea043', // Green
  '#eab308', // Gold
  '#2563eb', // Blue
  '#4f46e5', // Indigo
  '#9333ea', // Purple
  '#db2777', // Pink
  '#dc2626', // Red
  '#ea580c', // Orange
  '#475569', // Slate
  '#18181b', // Black
  '#78350f', // Brown
];

const FONTS = [
  { value: 'Inter', label: 'Inter — Modern' },
  { value: 'Playfair Display', label: 'Playfair Display — Elegant' },
  { value: 'Georgia', label: 'Georgia — Classic' },
  { value: 'system-ui', label: 'System Default' },
];

export function DesignPanel() {
  const { settings, setSettings, data, updateSections } = useResumeStore();

  return (
    <div className="w-full lg:w-[300px] h-full lg:border-l border-[#E8E0D4] bg-[#FAF8F5] flex flex-col shrink-0 overflow-y-auto no-print text-[#2C2420]">
      <div className="flex border-b border-[#E8E0D4] sticky top-0 bg-[#FAF8F5] z-10">
        <button className="flex-1 py-3 text-xs font-bold tracking-widest uppercase border-b-2 border-[#1a1a2e] text-[#1a1a2e]">
          Design
        </button>
        <button className="flex-1 py-3 text-xs font-bold tracking-widest uppercase text-[#8B7355] hover:text-[#1a1a2e]">
          Sections
        </button>
      </div>

      <div className="p-6 flex flex-col gap-8">
        <div className="space-y-4">
          <div className="text-[10px] font-bold text-[#8B7355] uppercase tracking-[0.2em]">Template</div>
          <div className="grid grid-cols-3 gap-3">
            <div 
              className={`aspect-[1/1.4] bg-white rounded-md border-2 p-1 flex flex-col gap-1 cursor-pointer transition-all ${settings.template === 'premium' ? 'border-[#1a1a2e] shadow-sm' : 'border-[#E8E0D4] hover:border-[#8B7355]'}`}
              onClick={() => setSettings({ template: 'premium' })}
            >
              <div className="w-full h-4 bg-[#1a1a2e]/20 rounded-sm"></div>
              <div className="w-1/2 h-2 bg-slate-200 rounded-sm"></div>
              <div className="w-full h-1 bg-slate-100 rounded-sm mt-1"></div>
              <div className="w-full h-1 bg-slate-100 rounded-sm"></div>
            </div>
            <div 
              className={`aspect-[1/1.4] bg-white rounded-md border-2 p-1 flex gap-1 cursor-pointer transition-all ${settings.template === 'hybrid' ? 'border-[#1a1a2e] shadow-sm' : 'border-[#E8E0D4] hover:border-[#8B7355]'}`}
              onClick={() => setSettings({ template: 'hybrid' })}
            >
              <div className="w-1/3 h-full bg-slate-100 rounded-sm flex justify-center pt-2"><div className="w-4 h-4 bg-slate-200 rounded-full" /></div>
              <div className="w-2/3 h-full flex flex-col gap-1">
                <div className="w-full h-3 bg-slate-200 rounded-sm"></div>
                <div className="w-full h-1 bg-[#1a1a2e]/20 rounded-sm mt-1"></div>
              </div>
            </div>
            <div 
              className={`aspect-[1/1.4] bg-white rounded-md border-2 p-1 flex flex-col gap-1 cursor-pointer items-center transition-all ${settings.template === 'minimal' ? 'border-[#1a1a2e] shadow-sm' : 'border-[#E8E0D4] hover:border-[#8B7355]'}`}
              onClick={() => setSettings({ template: 'minimal' })}
            >
               <div className="w-3/4 h-3 bg-slate-200 rounded-sm mt-1 mb-1 self-start ml-1"></div>
               <div className="w-full h-[1px] bg-slate-200 mb-1" />
               <div className="w-full h-1 bg-slate-100 rounded-sm mt-1"></div>
               <div className="w-full h-1 bg-slate-100 rounded-sm"></div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center text-[10px] font-medium text-[#8B7355]">
            <span>Premium</span>
            <span>Hybrid</span>
            <span>Minimal</span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="text-[10px] font-bold text-[#8B7355] uppercase tracking-[0.2em]">Accent Color</div>
          <div className="grid grid-cols-6 gap-2">
            {COLORS.map((color) => (
              <button
                key={color}
                className={`w-full aspect-square rounded-md border-2 transition-all ${settings.accentColor === color ? 'border-[#1a1a2e] scale-110 shadow-sm z-10' : 'border-transparent hover:scale-110 hover:z-10 shadow-sm'}`}
                style={{ backgroundColor: color }}
                onClick={() => setSettings({ accentColor: color })}
              />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="text-[10px] font-bold text-[#8B7355] uppercase tracking-[0.2em]">Typography</div>
          <Select value={settings.fontFamily} onValueChange={(v) => setSettings({ fontFamily: v })}>
            <SelectTrigger className="bg-[#FFFFFF] border-[#D4C9B8] text-[#2C2420]">
              <SelectValue placeholder="Select font" />
            </SelectTrigger>
            <SelectContent className="bg-[#FFFFFF] border-[#E8E0D4] text-[#2C2420]">
              {FONTS.map(f => (
                <SelectItem key={f.value} value={f.value} style={{ fontFamily: f.value }} className="hover:bg-[#EDE8DF] focus:bg-[#EDE8DF] focus:text-[#1a1a2e] cursor-pointer">
                  {f.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="text-[10px] font-bold text-[#8B7355] uppercase tracking-[0.2em]">Font Size</div>
            <span className="text-xs font-mono text-[#8B7355] bg-[#FFFFFF] px-1.5 py-0.5 rounded border border-[#E8E0D4]">{settings.fontSize}px</span>
          </div>
          <Slider 
            value={[settings.fontSize]} 
            min={10} max={16} step={1}
            onValueChange={([v]) => setSettings({ fontSize: v })}
            className="[&_[role=slider]]:bg-[#1a1a2e] [&_[role=slider]]:border-[#1a1a2e] [&_.relative_.absolute]:bg-[#1a1a2e]"
          />
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="text-[10px] font-bold text-[#8B7355] uppercase tracking-[0.2em]">Line Height</div>
            <span className="text-xs font-mono text-[#8B7355] bg-[#FFFFFF] px-1.5 py-0.5 rounded border border-[#E8E0D4]">{settings.lineHeight}</span>
          </div>
          <Slider 
            value={[settings.lineHeight]} 
            min={1.0} max={2.0} step={0.1}
            onValueChange={([v]) => setSettings({ lineHeight: v })}
            className="[&_[role=slider]]:bg-[#1a1a2e] [&_[role=slider]]:border-[#1a1a2e] [&_.relative_.absolute]:bg-[#1a1a2e]"
          />
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="text-[10px] font-bold text-[#8B7355] uppercase tracking-[0.2em]">Spacing</div>
            <span className="text-xs font-mono text-[#8B7355] bg-[#FFFFFF] px-1.5 py-0.5 rounded border border-[#E8E0D4]">{settings.spacing}</span>
          </div>
          <Slider 
            value={[settings.spacing]} 
            min={2} max={10} step={1}
            onValueChange={([v]) => setSettings({ spacing: v })}
            className="[&_[role=slider]]:bg-[#1a1a2e] [&_[role=slider]]:border-[#1a1a2e] [&_.relative_.absolute]:bg-[#1a1a2e]"
          />
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="text-[10px] font-bold text-[#8B7355] uppercase tracking-[0.2em]">Margins</div>
            <span className="text-xs font-mono text-[#8B7355] bg-[#FFFFFF] px-1.5 py-0.5 rounded border border-[#E8E0D4]">{settings.margins}px</span>
          </div>
          <Slider 
            value={[settings.margins]} 
            min={12} max={48} step={4}
            onValueChange={([v]) => setSettings({ margins: v })}
            className="[&_[role=slider]]:bg-[#1a1a2e] [&_[role=slider]]:border-[#1a1a2e] [&_.relative_.absolute]:bg-[#1a1a2e]"
          />
        </div>

        <div className="h-px bg-[#E8E0D4] w-full" />

        <div className="space-y-4">
          <div className="text-[10px] font-bold text-[#8B7355] uppercase tracking-[0.2em]">Section Visibility</div>
          <div className="flex flex-col gap-3">
            {data.sections.map((section) => (
              <div key={section.id} className="flex items-center justify-between">
                <span className="text-sm font-medium text-[#2C2420]">{section.label}</span>
                <Switch 
                  checked={section.visible} 
                  onCheckedChange={(checked) => {
                    updateSections(data.sections.map(s => s.id === section.id ? { ...s, visible: checked } : s));
                  }}
                  className="data-[state=checked]:bg-[#1a1a2e]"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}