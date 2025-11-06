"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Play, SkipForward, Pause, X, ClockPlus, ClockFading, ChevronDown } from "lucide-react"
import { ButtonGroup } from "./ui/button-group"

export default function UserCard() {
  return (
    <Card className="p-3 gap-1">
      <CardHeader className="flex px-0 items-center">
        <CardTitle className="text-ellipsis overflow-hidden w-full whitespace-nowrap">Name</CardTitle>

        <div className="flex items-center gap-1">
          <Play className="text-muted-foreground" size={16} />
          <span className="text-sm text-muted-foreground mr-2">00:00</span>
          <SkipForward className="text-muted-foreground" size={16} />
          <span className="text-sm text-muted-foreground">00:00</span>
        </div>

        <Button variant="outline"><X/></Button>
      </CardHeader>
      
      <CardContent className="px-0 flex gap-2 items-center">
        <Progress value={66} />

        <div className="flex items-center gap-1">
          <ButtonGroup>
            <Button variant="outline"><ClockPlus /></Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="!pl-2">
                  <ChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="[--radius:1rem]">
                <DropdownMenuItem>+30 minuti</DropdownMenuItem>
                <DropdownMenuItem>+1 ora</DropdownMenuItem>
                <DropdownMenuItem>+2 ore</DropdownMenuItem>
                <DropdownMenuItem>Altro...</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </ButtonGroup>

          <Button variant="outline"><ClockFading /></Button>
        </div>
      </CardContent>
    </Card>
  )
}
