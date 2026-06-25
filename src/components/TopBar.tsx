import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Download, Undo, Redo, ZoomIn, ZoomOut, Moon, Sun, LayoutGrid, Type, Palette, AlignLeft } from 'lucide-react';
import { useResumeStore } from '@/store/resumeStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface TopBarProps {
  printRef: React.RefObject<HTMLDivElement | null>;
}

export function TopBar({ printRef }: TopBarProps) {
  const { data, setData, undo, redo, historyIndex, history } = useResumeStore();

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: data.name || 'Resume',
  });

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  return (
    <div className="h-[52px] border-b border-[#E8E0D4] bg-[#FFFFFF] flex items-center justify-between px-3 sm:px-4 sticky top-0 z-20 shrink-0 shadow-sm no-print text-[#2C2420]">
      <div className="flex items-center gap-2 sm:gap-4 flex-1 max-w-[160px] sm:max-w-none sm:w-1/3">
        <div className="font-bold text-lg sm:text-xl tracking-tight text-[#1a1a2e]">Arthak</div>
        <div className="h-5 sm:h-6 w-px bg-[#E8E0D4] mx-1 sm:mx-2"></div>
        <Input 
          value={data.name} 
          onChange={(e) => setData({ name: e.target.value })}
          className="h-8 w-full max-w-[90px] sm:max-w-[200px] border-transparent hover:border-[#E8E0D4] focus-visible:ring-1 focus-visible:ring-[#1a1a2e] bg-transparent font-medium text-[#2C2420]"
        />
      </div>

      <div className="hidden md:flex items-center justify-center gap-6 w-1/3 text-[#8B7355]">
        <button className="flex flex-col items-center gap-1 hover:text-[#1a1a2e] transition-colors">
          <LayoutGrid className="w-4 h-4" />
          <span className="text-[10px] uppercase tracking-wider font-semibold">Layout</span>
        </button>
        <button className="flex flex-col items-center gap-1 hover:text-[#1a1a2e] transition-colors">
          <Type className="w-4 h-4" />
          <span className="text-[10px] uppercase tracking-wider font-semibold">Fonts</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-[#1a1a2e]">
          <Palette className="w-4 h-4" />
          <span className="text-[10px] uppercase tracking-wider font-semibold">Themes</span>
        </button>
        <button className="flex flex-col items-center gap-1 hover:text-[#1a1a2e] transition-colors">
          <AlignLeft className="w-4 h-4" />
          <span className="text-[10px] uppercase tracking-wider font-semibold">Format</span>
        </button>
      </div>

      <div className="flex items-center justify-end gap-1 sm:gap-3 flex-1 sm:w-1/3">
        <div className="flex items-center mr-1 sm:mr-2">
          <Button variant="ghost" size="icon" onClick={undo} disabled={!canUndo} className="h-8 w-8 text-[#8B7355] hover:text-[#1a1a2e] hover:bg-[#EDE8DF]">
            <Undo className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={redo} disabled={!canRedo} className="h-8 w-8 text-[#8B7355] hover:text-[#1a1a2e] hover:bg-[#EDE8DF]">
            <Redo className="h-4 w-4" />
          </Button>
        </div>
        
        <Button onClick={() => handlePrint()} className="gap-1.5 bg-[#1a1a2e] hover:bg-[#1a1a2e]/90 text-white font-medium shadow-sm h-9 px-3 sm:px-4">
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">Download</span>
        </Button>
      </div>
    </div>
  );
}