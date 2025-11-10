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
import { ListX, Plus } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { UserCard } from '@/components/cards/user-card';
import { useAppStore } from '@/store';
import { useSectionCards } from '@/hooks';
import { useI18n } from '@/hooks/use-i18n';
import type { SectionItemProps } from '@/types';
import { toast } from 'sonner';
import { parseShiftTooltip, parseEditButtonTooltip } from '@/lib/utils/text-parser';

export function SectionItem({
  editMode,
  sectionId,
  sectionName,
  totalSections,
  hasCards,
  onSectionNameChange,
  onDeleteSection,
}: SectionItemProps) {
  const { addCard, deleteCard } = useAppStore();
  const cards = useSectionCards(sectionId);
  const { t } = useI18n();

  // Show header only if in editMode or if there's a title to display
  const showHeader = editMode || sectionName !== '';
  
  // If last section, "delete section" will delete stations instead of the section
  const isLastSection = totalSections === 1;

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
                          // If Shift is pressed, delete directly without opening dialog
                          if (e.shiftKey) {
                            e.preventDefault();
                            e.stopPropagation();
                            // If last section with stations, delete all stations
                            if (isLastSection && hasCards) {
                              cards.forEach((card) => {
                                deleteCard(sectionId, card.id);
                              });
                              toast.info(t('section.lastSectionStationsDeleted'), {
                                description: t('section.lastSectionStationsDeletedDescription'),
                              });
                            } else if (!isLastSection && onDeleteSection) {
                              // Otherwise delete section if not the last one
                              onDeleteSection();
                            }
                          }
                        }}
                      >
                        <ListX className="w-fit" />
                        {t('section.delete')}
                      </Button>
                    </AlertDialogTrigger>
                  </TooltipTrigger>
                  <TooltipContent>
                    {parseShiftTooltip(t('section.deleteTooltip'))}
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
                    onClick={() => {
                      // If last section with stations, delete all stations
                      if (isLastSection && hasCards) {
                        cards.forEach((card) => {
                          deleteCard(sectionId, card.id);
                        });
                        toast.info(t('section.lastSectionStationsDeleted'), {
                          description: t('section.lastSectionStationsDeletedDescription'),
                        });
                      } else if (!isLastSection && onDeleteSection) {
                        // Otherwise delete section if not the last one
                        onDeleteSection();
                      }
                    }}
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
            {editMode
              ? t('section.noCardsDescriptionEditMode')
              : parseEditButtonTooltip(t('section.noCardsDescription'))}
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

