"use client"

import { Header } from '@/components/layout/header';
import { SectionItem } from '@/components/sections/section-item';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Kbd } from '@/components/ui/kbd';
import { Plus, PencilRuler } from 'lucide-react';
import { useEditMode } from '@/hooks';
import { useI18n } from '@/hooks/use-i18n';
import { useAppStore } from '@/store';

export function HomeClient() {
  const { editMode, toggleEditMode } = useEditMode();
  const { sections, addSection, deleteSection, updateSectionName, getCardsBySection } = useAppStore();
  const { t } = useI18n();

  // Wrapper per toggleEditMode che:
  // - Elimina le sezioni vuote quando si esce dalla modalità modifica
  // - Aggiunge una sezione automaticamente quando si entra in modalità modifica senza sezioni
  const handleToggleEditMode = () => {
    // Se stiamo uscendo dalla modalità modifica (editMode è true e sta per diventare false)
    if (editMode) {
      // Elimina tutte le sezioni senza postazioni
      sections.forEach((section) => {
        const cards = getCardsBySection(section.id);
        if (cards.length === 0) {
          deleteSection(section.id);
        }
      });
    } else {
      // Se stiamo entrando in modalità modifica (editMode è false e sta per diventare true)
      // e non ci sono sezioni, aggiungi automaticamente una sezione
      if (sections.length === 0) {
        addSection();
      }
    }
    // Toggle della modalità modifica
    toggleEditMode();
  };

  return (
    <main className="flex flex-col gap-3">
      <Header editMode={editMode} toggleEditMode={handleToggleEditMode} />

      {sections.length === 0 && !editMode ? (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
          <p className="text-lg font-semibold text-muted-foreground mb-2">
            {t('home.noSections')}
          </p>
          <p className="text-sm text-muted-foreground flex items-center gap-1 flex-wrap justify-center">
            {(() => {
              const text = t('home.noSectionsDescription');
              const parts = text.split('{editButton}');
              return parts.map((part, index) => (
                <span key={index}>
                  {part}
                  {index < parts.length - 1 && (
                    <Kbd className="inline-flex items-center gap-1">
                      <PencilRuler className="h-3 w-3" />
                    </Kbd>
                  )}
                </span>
              ));
            })()}
          </p>
        </div>
      ) : (
        sections.map((section) => (
          <SectionItem
            key={section.id}
            editMode={editMode}
            sectionId={section.id}
            sectionName={section.name}
            onSectionNameChange={(name) => updateSectionName(section.id, name)}
            onDeleteSection={() => deleteSection(section.id)}
          />
        ))
      )}

      {editMode && (
        <>
          <Separator className="col-span-full my-2" />
          <Button variant="outline" className="w-full col-span-full" onClick={addSection} >
            <Plus />{t('home.newSection')}
          </Button>
        </>
      )}
    </main>
  );
}

