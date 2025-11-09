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
import { toast } from 'sonner';

export function HomeClient() {
  const { editMode, toggleEditMode } = useEditMode();
  const { sections, addSection, deleteSection, updateSectionName, getCardsBySection, addCard } = useAppStore();
  const { t } = useI18n();

  /**
   * Wrapper for toggleEditMode that:
   * - Validates section and card names before exiting edit mode
   * - Deletes empty sections when exiting edit mode
   * - Automatically adds a section when entering edit mode with no sections
   */
  const handleToggleEditMode = () => {
    if (editMode) {
      // Exiting edit mode: validate names first
      let emptySections = 0;
      let emptyCards = 0;

      sections.forEach((section) => {
        // Check if section name is empty or only whitespace
        if (!section.name || section.name.trim() === '') {
          emptySections++;
        }

        // Check cards in this section
        const cards = getCardsBySection(section.id);
        cards.forEach((card) => {
          if (!card.name || card.name.trim() === '') {
            emptyCards++;
          }
        });
      });

      // If there are validation errors, show toast and don't exit edit mode
      if (emptySections > 0 || emptyCards > 0) {
        let description = '';
        
        if (emptySections > 0 && emptyCards > 0) {
          const sectionWord = emptySections === 1 ? t('validation.sectionSingular') : t('validation.sectionPlural');
          const cardWord = emptyCards === 1 ? t('validation.cardSingular') : t('validation.cardPlural');
          const validName = t('validation.noValidNamePlural');
          description = `${emptySections} ${sectionWord} e ${emptyCards} ${cardWord} ${validName}. ${t('validation.pleaseFixNames')}`;
        } else if (emptySections > 0) {
          const sectionWord = emptySections === 1 ? t('validation.sectionSingular') : t('validation.sectionPlural');
          const validName = emptySections === 1 ? t('validation.noValidName') : t('validation.noValidNamePlural');
          description = `${emptySections} ${sectionWord} ${validName}. ${t('validation.pleaseFixNames')}`;
        } else {
          const cardWord = emptyCards === 1 ? t('validation.cardSingular') : t('validation.cardPlural');
          const validName = emptyCards === 1 ? t('validation.noValidName') : t('validation.noValidNamePlural');
          description = `${emptyCards} ${cardWord} ${validName}. ${t('validation.pleaseFixNames')}`;
        }

        toast.error(t('validation.emptyNames'), {
          description,
        });
        
        return; // Don't exit edit mode
      }

      // Handle sections without stations
      sections.forEach((section) => {
        const cards = getCardsBySection(section.id);
        if (cards.length === 0) {
          // If section has a valid name, add a default station instead of deleting
          if (section.name && section.name.trim() !== '') {
            addCard(section.id);
          } else {
            // If section has no name, delete it
            deleteSection(section.id);
          }
        }
      });
    } else {
      // Entering edit mode: add a section if none exist
      if (sections.length === 0) {
        addSection();
      }
    }
    
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
        sections.map((section) => {
          const cards = getCardsBySection(section.id);
          return (
            <SectionItem
              key={section.id}
              editMode={editMode}
              sectionId={section.id}
              sectionName={section.name}
              totalSections={sections.length}
              hasCards={cards.length > 0}
              onSectionNameChange={(name) => updateSectionName(section.id, name)}
              onDeleteSection={() => deleteSection(section.id)}
            />
          );
        })
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

