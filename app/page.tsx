import Image from "next/image";
import UserCard from "@/components/userCard";
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { PencilRuler, Plus, ListX } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import SectionItem from "@/components/sectionItem"

export default function Home() {
  // Ottieni l'ora nel fuso orario di Roma
  const now = new Date();
  const formatter = new Intl.DateTimeFormat('it-IT', {
    timeZone: 'Europe/Rome',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });

  const parts = formatter.formatToParts(now);
  const hour = parts.find(p => p.type === 'hour')?.value || '00';
  const minute = parts.find(p => p.type === 'minute')?.value || '00';
  const timeString = `${hour}:${minute}`;

  return (
    <main className="flex flex-col gap-2">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">WolfDen <span className="text-muted-foreground text-sm">LAN MANAGER</span></h1>
        <div className="flex items-center gap-1">
          <Input
            type="time"
            id="time-picker"
            step="1"
            disabled
            className="select-none w-fit"
            defaultValue={timeString}
          />
          <Button variant="outline"><PencilRuler /></Button>
        </div>
      </header>

      <SectionItem />
    </main>
  );
}
