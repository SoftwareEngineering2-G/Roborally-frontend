"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  date?: Date;
  onDateChange?: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function DatePicker({
  date,
  onDateChange,
  placeholder = "Pick a date",
  disabled = false,
}: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          disabled={disabled}
          className={cn(
            "w-full justify-start text-left font-normal",
            "border-neon-blue/30 bg-surface-dark/50 hover:bg-surface-dark/70",
            "hover:border-neon-blue/50 transition-all",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 text-neon-blue" />
          {date ? format(date, "PPP") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-0 glass-panel border-neon-blue/30 bg-surface-dark"
        align="start"
      >
        <Calendar
          mode="single"
          selected={date}
          onSelect={onDateChange}
          initialFocus
          className="rounded-md bg-transparent"
          classNames={{
            months:
              "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
            month: "space-y-4",
            caption: "flex justify-center pt-1 relative items-center",
            caption_label: "text-sm font-medium text-neon-blue",
            nav: "space-x-1 flex items-center",
            button_previous: cn(
              "absolute left-1 text-neon-blue/70 hover:text-neon-blue hover:bg-surface-light/50 border-neon-blue/20"
            ),
            button_next: cn(
              "absolute right-1 text-neon-blue/70 hover:text-neon-blue hover:bg-surface-light/50 border-neon-blue/20"
            ),
            table: "w-full border-collapse space-y-1",
            weekday:
              "text-neon-blue/60 rounded-md w-9 font-normal text-[0.8rem]",
            day: cn(
              "h-9 w-9 text-center text-sm p-0 relative",
              "text-foreground hover:bg-surface-light/50",
              "[&:has([aria-selected])]:bg-neon-blue/20",
              "[&:has([aria-selected].day-outside)]:bg-accent/50",
              "[&:has([aria-selected].day-range-end)]:rounded-r-md"
            ),
            day_button: cn(
              "h-9 w-9 p-0 font-normal",
              "hover:bg-surface-light/50 hover:text-neon-blue",
              "aria-selected:bg-neon-blue/30 aria-selected:text-neon-blue aria-selected:font-semibold",
              "focus-visible:ring-1 focus-visible:ring-neon-blue/50"
            ),
            range_end: "day-range-end",
            selected: "bg-neon-blue/30 text-neon-blue hover:bg-neon-blue/40",
            today:
              "bg-surface-light text-accent-foreground border border-neon-blue/30",
            outside: "day-outside text-muted-foreground opacity-50",
            disabled: "text-muted-foreground opacity-50",
            range_middle:
              "aria-selected:bg-neon-blue/20 aria-selected:text-accent-foreground",
            hidden: "invisible",
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
