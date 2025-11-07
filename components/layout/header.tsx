"use client"

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PencilRuler, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { getCurrentTimeString } from '@/lib/utils/time';
import type { HeaderProps } from '@/types';

export function Header({ editMode, toggleEditMode }: HeaderProps) {
  const { setTheme } = useTheme();
  const timeString = getCurrentTimeString();

  return (
    <header className="flex items-center justify-between">
      <h1 className="text-2xl font-bold whitespace-nowrap overflow-hidden text-ellipsis">
        WolfDen <span className="text-muted-foreground text-sm">LAN MANAGER</span>
      </h1>
      <div className="flex items-center gap-1">
        <Input
          type="time"
          id="time-picker"
          step="1"
          disabled
          className="select-none w-fit"
          defaultValue={timeString}
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme('light')}>Light</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme('dark')}>Dark</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme('system')}>System</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button variant="outline" onClick={toggleEditMode}>
          <PencilRuler />
        </Button>
      </div>
    </header>
  );
}

