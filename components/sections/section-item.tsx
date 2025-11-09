"use client"

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { ListX, Plus, PencilRuler } from 'lucide-react';
import { Kbd } from '@/components/ui/kbd';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { UserCard } from '@/components/cards/user-card';
import { useAppStore } from '@/store';
import { useSectionCards } from '@/hooks';
import { useI18n } from '@/hooks/use-i18n';
import type { SectionItemProps } from '@/types';

export function SectionItem({
  editMode,
  sectionId,
  sectionName,
  onSectionNameChange,
  onDeleteSection,
}: SectionItemProps) {
  const { addCard } = useAppStore();
  const cards = useSectionCards(sectionId);
  const { t } = useI18n();

  // Mostra il div header solo se siamo in editMode o se c'è un titolo da mostrare
  const showHeader = editMode || sectionName !== '';

  return (
    <section
      className="grid gap-2 items-center"
      style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(20rem, 1fr))' }}
    >
      {showHeader && (
        <div className="col-span-full flex items-center justify-between h-10 gap-2">
          {editMode ? (
            <Input
              value={sectionName}
              onChange={(e) => onSectionNameChange?.(e.target.value)}
              className="font-bold uppercase w-auto"
              placeholder={t('section.name')}
            />
          ) : (
            sectionName !== '' && <h2 className="font-bold uppercase">{sectionName}</h2>
          )}

          {editMode && (
            <TooltipProvider>
              <AlertDialog>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="outline"
                        onClick={(e) => {
                          // Se Shift è premuto, elimina direttamente senza aprire il dialog
                          if (e.shiftKey && onDeleteSection) {
                            e.preventDefault();
                            e.stopPropagation();
                            onDeleteSection();
                          }
                        }}
                      >
                        <ListX className="w-fit" />
                        {t('section.delete')}
                      </Button>
                    </AlertDialogTrigger>
                  </TooltipTrigger>
                  <TooltipContent>
                    {(() => {
                      const text = t('section.deleteTooltip');
                      const parts = text.split('{shift}');
                      return parts.map((part, index) => (
                        <span key={index}>
                          {part}
                          {index < parts.length - 1 && (
                            <Kbd className="inline-flex items-center gap-1 mx-0.5">
                              Shift
                            </Kbd>
                          )}
                        </span>
                      ));
                    })()}
                  </TooltipContent>
                </Tooltip>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>{t('section.delete')}</AlertDialogTitle>
                    <AlertDialogDescription>
                      {t('section.deleteConfirm')}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={onDeleteSection}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      {t('common.delete')}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </TooltipProvider>
          )}
        </div>
      )}

      {cards.length === 0 ? (
        <div className="col-span-full flex flex-col items-center justify-center py-8 px-4 text-center">
          <p className="text-base font-semibold text-muted-foreground mb-1">
            {t('section.noCards')}
          </p>
          <p className="text-sm text-muted-foreground flex items-center gap-1 flex-wrap justify-center">
            {editMode ? (
              t('section.noCardsDescriptionEditMode')
            ) : (
              (() => {
                const text = t('section.noCardsDescription');
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
              })()
            )}
          </p>
        </div>
      ) : (
        cards.map((card) => (
          <UserCard
            key={card.id}
            sectionId={sectionId}
            id={card.id}
            name={card.name}
            progressValue={card.progressValue}
            editMode={editMode}
            timer={card.timer}
          />
        ))
      )}

      {editMode && (
        <Button variant="outline" className={`w-full h-full ${cards.length === 0 ? 'col-span-full' : ''}`} onClick={() => addCard(sectionId)}>
          <Plus />{t('section.newCard')}
        </Button>
      )}
    </section>
  );
}

