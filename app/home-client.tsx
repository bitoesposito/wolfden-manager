"use client"

import { Header } from '@/components/layout/header';
import { SectionItem } from '@/components/sections/section-item';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Plus } from 'lucide-react';
import { useEditMode } from '@/hooks/use-edit-mode';
import { useSections } from '@/hooks/use-sections';

export function HomeClient() {
  const { editMode, toggleEditMode } = useEditMode();
  const { sections, addSection, deleteSection, updateSectionName } = useSections();

  return (
    <main className="flex flex-col gap-2">
      <Header editMode={editMode} toggleEditMode={toggleEditMode} />

      {sections.map((section) => (
        <SectionItem
          key={section.id}
          editMode={editMode}
          sectionName={section.name}
          onSectionNameChange={(name) => updateSectionName(section.id, name)}
          onDeleteSection={() => deleteSection(section.id)}
        />
      ))}

      {editMode && (
        <>
          <Separator className="col-span-full my-2" />
          <Button variant="outline" className="w-full col-span-full" onClick={addSection} >
            <Plus />Nuova sezione
          </Button>
        </>
      )}
    </main>
  );
}

