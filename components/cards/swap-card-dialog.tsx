/**
 * Dialog per selezionare una postazione con cui scambiare il timer
 * Mostra tutte le postazioni organizzate per sezione con ricerca
 */

"use client";

import { useState, useMemo, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Search, Clock } from 'lucide-react';
import { useI18n } from '@/hooks/use-i18n';
import { useAppStore } from '@/store/app-store';
import { cn } from '@/lib/utils';
import { getRemainingSeconds, formatRemainingTime } from '@/lib/utils/time';

interface SwapCardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentSectionId: number;
  currentCardId: number;
  currentCardName: string;
  onConfirm: (targetSectionId: number, targetCardId: number) => void;
}

/**
 * Dialog per selezionare una postazione con cui scambiare il timer
 * Filtra le postazioni per escludere quella corrente
 * Organizza per sezione e permette la ricerca
 */
export function SwapCardDialog({
  open,
  onOpenChange,
  currentSectionId,
  currentCardId,
  currentCardName,
  onConfirm,
}: SwapCardDialogProps) {
  const { t } = useI18n();
  const { getAllCards } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTime, setCurrentTime] = useState(Date.now());

  // Update current time every second to refresh remaining time display
  useEffect(() => {
    if (!open) return;
    
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, [open]);

  // Ottieni tutte le postazioni disponibili (esclusa quella corrente)
  const availableCards = useMemo(() => {
    return getAllCards().filter(
      (item) =>
        !(item.sectionId === currentSectionId && item.card.id === currentCardId)
    );
  }, [getAllCards, currentSectionId, currentCardId]);

  // Raggruppa per sezione e filtra per ricerca
  const groupedCards = useMemo(() => {
    const filtered = availableCards.filter((item) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        item.card.name.toLowerCase().includes(searchLower) ||
        item.sectionName.toLowerCase().includes(searchLower)
      );
    });

    // Raggruppa per sezione
    const grouped = new Map<string, typeof filtered>();
    filtered.forEach((item) => {
      const sectionName = item.sectionName;
      if (!grouped.has(sectionName)) {
        grouped.set(sectionName, []);
      }
      grouped.get(sectionName)!.push(item);
    });

    return Array.from(grouped.entries()).map(([sectionName, cards]) => ({
      sectionName,
      cards,
    }));
  }, [availableCards, searchQuery, currentTime]);

  const handleSelect = (sectionId: number, cardId: number) => {
    onConfirm(sectionId, cardId);
    onOpenChange(false);
    setSearchQuery('');
  };

  const handleClose = () => {
    onOpenChange(false);
    setSearchQuery('');
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{t('swapCardDialog.title')}</DialogTitle>
          <DialogDescription>
            {t('swapCardDialog.description', { cardName: currentCardName })}
          </DialogDescription>
        </DialogHeader>

        {/* Campo di ricerca */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder={t('swapCardDialog.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Lista postazioni organizzate per sezione */}
        <div className="flex-1 overflow-y-auto min-h-0 space-y-4">
          {groupedCards.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              {searchQuery
                ? t('swapCardDialog.noResults')
                : t('swapCardDialog.noCardsAvailable')}
            </div>
          ) : (
            groupedCards.map(({ sectionName, cards }) => (
              <div key={sectionName} className="space-y-2">
                <div className="text-sm font-semibold text-muted-foreground px-2 uppercase">
                  {sectionName}
                </div>
                <Separator />
                <div className="space-y-1">
                  {cards.map(({ sectionId, card }) => (
                    <Button
                      key={`${sectionId}-${card.id}`}
                      variant="ghost"
                      className={cn(
                        'w-full justify-start h-auto py-3 px-3',
                        'hover:bg-accent'
                      )}
                      onClick={() => handleSelect(sectionId, card.id)}
                    >
                      <div className="flex items-center gap-3 w-full">
                        <div className="flex-1 text-left">
                          <div className="font-medium flex justify-between items-center">{card.name}
                          {card.timer?.isActive && card.timer.endTime && (
                            <div className="text-xs flex gap-1 text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {formatRemainingTime(
                                getRemainingSeconds(card.timer.endTime, card.timer.startTime)
                              )}
                            </div>
                          )}
                          </div>
                          
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

