
import { useState } from "react";
import Nav from "@/components/Nav";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/litepaper/Sidebar";
import SectionContent from "@/components/litepaper/SectionContent";
import { sections } from "@/data/litepaperSections";

const Litepaper = () => {
  const [activeSection, setActiveSection] = useState("introduction");
  const [openSections, setOpenSections] = useState<string[]>([]);

  const getAllSectionsFlat = (): string[] => {
    const flatSections: string[] = [];
    sections.forEach(section => {
      flatSections.push(section.id);
      if (section.subsections) {
        section.subsections.forEach(subsection => {
          flatSections.push(subsection.id);
        });
      }
    });
    return flatSections;
  };

  const findNextSection = (): string => {
    const flatSections = getAllSectionsFlat();
    const currentIndex = flatSections.indexOf(activeSection);
    if (currentIndex === -1 || currentIndex === flatSections.length - 1) {
      return flatSections[0];
    }
    return flatSections[currentIndex + 1];
  };

  const findPreviousSection = (): string => {
    const flatSections = getAllSectionsFlat();
    const currentIndex = flatSections.indexOf(activeSection);
    if (currentIndex === -1 || currentIndex === 0) {
      return flatSections[flatSections.length - 1];
    }
    return flatSections[currentIndex - 1];
  };

  const handleNextSection = () => {
    const nextSection = findNextSection();
    setActiveSection(nextSection);
  };

  const handlePreviousSection = () => {
    const prevSection = findPreviousSection();
    setActiveSection(prevSection);
  };

  const toggleSection = (sectionId: string) => {
    setOpenSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const handleSectionClick = (sectionId: string) => {
    setActiveSection(sectionId);
  };

  const handleSubsectionClick = (subsectionId: string) => {
    setActiveSection(subsectionId);
  };

  return (
    <div className="min-h-screen bg-black">
      <Nav />
      
      <div className="pt-20 flex">
        <Sidebar
          sections={sections}
          activeSection={activeSection}
          openSections={openSections}
          onSectionClick={handleSectionClick}
          onSubsectionClick={handleSubsectionClick}
          onToggleSection={toggleSection}
        />

        <div className="pl-64 w-full">
          <ScrollArea className="h-[calc(100vh-5rem)]">
            <div className="container max-w-4xl mx-auto px-8 py-12">
              <div className="space-y-12">
                <div className="text-center space-y-4">
                  <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 via-teal-300 to-yellow-400">
                    LedgerFund Litepaper
                  </h1>
                  <p className="text-lg text-gray-400">
                    Version 1.0 - February 2024
                  </p>
                </div>

                <SectionContent sectionId={activeSection} />

                <div className="flex justify-between items-center pt-8 mt-12 border-t border-white/10">
                  <Button 
                    variant="ghost" 
                    className="text-white/60 hover:text-white"
                    onClick={handlePreviousSection}
                  >
                    ← Previous
                  </Button>
                  <Button 
                    variant="ghost"
                    className="text-white/60 hover:text-white"
                    onClick={handleNextSection}
                  >
                    Next →
                  </Button>
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default Litepaper;
