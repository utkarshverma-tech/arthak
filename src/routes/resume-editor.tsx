import { createFileRoute } from "@tanstack/react-router";
import { useResumeStore } from "@/store/resumeStore";
import { useEffect, useRef, useState } from "react";
import { TopBar } from "@/components/TopBar";
import { Sidebar } from "@/components/Sidebar";
import { DesignPanel } from "@/components/DesignPanel";
import { ArthakTemplate } from "@/components/template/ArthakTemplate";
import { HybridTemplate } from "@/components/template/HybridTemplate";
import { MinimalTemplate } from "@/components/template/MinimalTemplate";
import { PopupEditor } from "@/components/PopupEditor";
import { ZoomIn, ZoomOut, Layers, Eye, Palette } from "lucide-react";

type SearchParams = {
  template?: string;
};

export const Route = createFileRoute("/resume-editor")({
  validateSearch: (search: Record<string, unknown>): SearchParams => {
    return {
      template: (search.template as string) || "premium",
    };
  },
  component: ResumeEditorPage,
});

function ResumeEditorPage() {
  const { template } = Route.useSearch();
  const { data, settings, zoom, setZoom, setSettings } = useResumeStore();
  const printRef = useRef<HTMLDivElement>(null);
  
  // State for mobile responsiveness
  const [activeTab, setActiveTab] = useState<'edit' | 'preview' | 'design'>('edit');
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Sync template from URL search parameter
  useEffect(() => {
    if (template === "minimal" || template === "hybrid" || template === "premium") {
      setSettings({ template });
    } else if (template === "modern") {
      setSettings({ template: "hybrid" });
    } else if (template === "professional" || template === "executive") {
      setSettings({ template: "premium" });
    }
  }, [template, setSettings]);

  const isMobile = windowWidth < 1024; // lg breakpoint in Tailwind
  
  // Calculate dynamic scale factor to fit the template in mobile screen width
  const scale = isMobile ? Math.min(1, (windowWidth - 32) / 794) : (zoom / 100);

  return (
    <div className="h-screen w-full flex flex-col bg-[#F5F0E8] overflow-hidden text-[#2C2420]">
      <TopBar printRef={printRef} />
      
      <div className="flex-1 flex overflow-hidden relative">
        {/* Edit Forms Sidebar */}
        {(!isMobile || activeTab === 'edit') && <Sidebar />}
        
        {/* Center Resume Preview Panel */}
        {(!isMobile || activeTab === 'preview') && (
          <div className="flex-1 overflow-auto bg-[#F5F0E8] bg-dot-pattern flex flex-col relative print:bg-white print:overflow-visible">
            <div className="flex-1 p-4 sm:p-8 md:p-12 pb-32 flex justify-center items-start print:p-0">
              <div 
                style={{ 
                  width: `${794 * scale}px`, 
                  height: `${1123 * scale}px`,
                  overflow: 'hidden'
                }}
                className="print:overflow-visible print:w-auto print:h-auto shrink-0 shadow-lg print:shadow-none"
              >
                <div 
                  style={{ 
                    transform: `scale(${scale})`, 
                    transformOrigin: 'top left',
                  }}
                  className="transition-transform duration-200 print:transform-none"
                >
                  {settings.template === 'premium' && <ArthakTemplate ref={printRef} data={data} settings={settings} />}
                  {settings.template === 'hybrid' && <HybridTemplate ref={printRef} data={data} settings={settings} />}
                  {settings.template === 'minimal' && <MinimalTemplate ref={printRef} data={data} settings={settings} />}
                </div>
              </div>
            </div>
            
            {/* Zoom / Page indicator bar */}
            {(!isMobile || activeTab === 'preview') && (
              <div className="fixed bottom-20 lg:bottom-6 left-1/2 -translate-x-1/2 bg-[#FFFFFF] border border-[#E8E0D4] text-[#2C2420] px-4 py-2 rounded-full text-sm font-medium shadow-lg pointer-events-none no-print flex items-center gap-4 z-30">
                <span className="text-[#8B7355] uppercase tracking-wider text-xs font-semibold">Page 1 / 1</span>
                {!isMobile && (
                  <>
                    <div className="w-px h-4 bg-[#E8E0D4]"></div>
                    <div className="flex items-center gap-2 pointer-events-auto">
                      <button onClick={() => setZoom((z) => Math.max(50, z - 10))} className="hover:text-[#1a1a2e]"><ZoomOut className="w-4 h-4" /></button>
                      <span className="w-10 text-center">{zoom}%</span>
                      <button onClick={() => setZoom((z) => Math.min(150, z + 10))} className="hover:text-[#1a1a2e]"><ZoomIn className="w-4 h-4" /></button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {/* Design Settings Panel */}
        {(!isMobile || activeTab === 'design') && <DesignPanel />}
      </div>

      {/* Bottom Navigation for Mobile Devices */}
      {isMobile && (
        <div className="h-[64px] border-t border-[#E8E0D4] bg-[#FFFFFF] flex items-center justify-around no-print shrink-0 shadow-lg text-[#8B7355] z-40">
          <button 
            onClick={() => setActiveTab('edit')} 
            className={`flex flex-col items-center gap-1.5 p-2 w-full transition-all ${activeTab === 'edit' ? 'text-[#1a1a2e] font-semibold scale-105' : 'hover:text-[#1a1a2e]'}`}
          >
            <Layers className="w-5 h-5" />
            <span className="text-[10px] uppercase tracking-wider">Sections</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('preview')} 
            className={`flex flex-col items-center gap-1.5 p-2 w-full transition-all ${activeTab === 'preview' ? 'text-[#1a1a2e] font-semibold scale-105' : 'hover:text-[#1a1a2e]'}`}
          >
            <Eye className="w-5 h-5" />
            <span className="text-[10px] uppercase tracking-wider">Preview</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('design')} 
            className={`flex flex-col items-center gap-1.5 p-2 w-full transition-all ${activeTab === 'design' ? 'text-[#1a1a2e] font-semibold scale-105' : 'hover:text-[#1a1a2e]'}`}
          >
            <Palette className="w-5 h-5" />
            <span className="text-[10px] uppercase tracking-wider">Design</span>
          </button>
        </div>
      )}

      <PopupEditor />
    </div>
  );
}
