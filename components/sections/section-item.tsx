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
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline">
                  <ListX className="w-fit" />
                  {t('section.delete')}
                </Button>
              </AlertDialogTrigger>
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
          )}
        </div>
      )}

      {cards.map((card) => (
        <UserCard
          key={card.id}
          sectionId={sectionId}
          id={card.id}
          name={card.name}
          progressValue={card.progressValue}
          editMode={editMode}
          timer={card.timer}
        />
      ))}

      {editMode && (
        <Button variant="outline" className="w-full h-full" onClick={() => addCard(sectionId)} >
          <Plus />{t('section.newCard')}
        </Button>
      )}
    </section>
  );
}

