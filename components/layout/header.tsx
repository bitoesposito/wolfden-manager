"use client"

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PencilRuler, Moon, Sun, Check, Volume2, VolumeX, Play } from 'lucide-react';
import { useTheme } from 'next-themes';
import { getCurrentTimeStringWithSeconds } from '@/lib/utils/time';
import { useI18n } from '@/hooks/use-i18n';
import { useAudio } from '@/hooks/use-audio';
import type { HeaderProps } from '@/types';
import { Logo } from './logo';
import { initializeAudio, playTimerExpiredSound } from '@/lib/utils/sound';

export function Header({ editMode, toggleEditMode }: HeaderProps) {
  const { setTheme } = useTheme();
  const { t } = useI18n();
  const { muted, toggle: toggleAudio } = useAudio();
  const [timeString, setTimeString] = useState(getCurrentTimeStringWithSeconds());

  // Initialize audio on mount to unlock playback
  useEffect(() => {
    initializeAudio();
  }, []);

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeString(getCurrentTimeStringWithSeconds());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <header className="flex items-center justify-between">
      <div className="flex gap-2 items-center select-none">
        <Logo className="w-12 h-12" />
          <div className="flex flex-col gap-0">
            <h1 className="text-2xl font-bold whitespace-nowrap overflow-hidden text-ellipsis flex items-center gap-2 m-0 p-0 leading-none">
            {t('header.title')} 
          </h1>
          <span className="text-muted-foreground text-sm font-bold whitespace-nowrap overflow-hidden text-ellipsis">{t('header.subtitle')}</span>
          </div>
      </div>
      <div className="flex items-center gap-1">
        <span className="select-none px-2 text-center text-sm sm:block hidden">
          {timeString}
        </span>
        <Button
          variant="outline"
          size="icon"
          onClick={toggleAudio}
          title={muted ? t('header.audioMuted') : t('header.audioUnmuted')}
        >
          {muted ? (
            <VolumeX className="h-[1.2rem] w-[1.2rem]" />
          ) : (
            <Volume2 className="h-[1.2rem] w-[1.2rem]" />
          )}
          <span className="sr-only">{t('header.toggleAudio')}</span>
        </Button>
        {/* <Button
          variant="outline"
          size="icon"
          onClick={() => playTimerExpiredSound()}
          title="Test audio (debug)"
        >
          <Play className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Test audio</span>
        </Button> */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
              <span className="sr-only">{t('header.toggleTheme')}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme('light')}>{t('header.theme.light')}</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme('dark')}>{t('header.theme.dark')}</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme('system')}>{t('header.theme.system')}</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button 
          variant={editMode ? "success" : "outline"} 
          onClick={toggleEditMode}
        >
          {editMode ? <Check /> : <PencilRuler />}
          <span className="sm:block hidden">{editMode ? t('header.saveChanges') : t('header.toggleEditMode')}</span>
        </Button>
      </div>
    </header>
  );
}

