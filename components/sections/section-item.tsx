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
import { useUserCards } from '@/hooks/use-user-cards';
import type { SectionItemProps } from '@/types';

export function SectionItem({
  editMode,
  sectionName,
  onSectionNameChange,
  onDeleteSection,
}: SectionItemProps) {
  const { cards, addCard, deleteCard, updateCardName } = useUserCards();

  return (
    <section
      className="grid gap-2 items-center"
      style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(20rem, 1fr))' }}
    >
      <div className="col-span-full flex items-center justify-between h-10 gap-2">
        {editMode ? (
          <Input
            value={sectionName}
            onChange={(e) => onSectionNameChange?.(e.target.value)}
            className="font-bold uppercase w-auto"
            placeholder='Nome sezione'
          />
        ) : (
          <h2 className="font-bold uppercase">{sectionName}</h2>
        )}

        {editMode && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline">
                <ListX className="w-fit" />
                Elimina sezione
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Elimina sezione</AlertDialogTitle>
                <AlertDialogDescription>
                  Sei sicuro di voler eliminare questa sezione? Questa azione non può essere annullata.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annulla</AlertDialogCancel>
                <AlertDialogAction
                  onClick={onDeleteSection}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Elimina
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      {cards.map((card) => (
        <UserCard
          key={card.id}
          id={card.id}
          name={card.name}
          progressValue={card.progressValue}
          editMode={editMode}
          onNameChange={(name) => updateCardName(card.id, name)}
          onDelete={() => deleteCard(card.id)}
        />
      ))}

      {editMode && (
        <Button variant="outline" className="w-full h-full" onClick={addCard} >
          <Plus />Nuova postazione
        </Button>
      )}
    </section>
  );
}

