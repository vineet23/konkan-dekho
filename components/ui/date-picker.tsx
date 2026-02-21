"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  date?: Date | DateRange;
  onDateChange?: (date: Date | DateRange | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  disabledDates?: Date[];
  className?: string;
  mode?: "single" | "range";
}

export function DatePicker({
  date,
  onDateChange,
  placeholder = "Pick a date",
  disabled = false,
  disabledDates,
  className,
  mode = "single",
}: DatePickerProps) {
  const displayValue = () => {
    if (mode === "range" && date && "from" in date) {
      if (date.from && date.to) {
        return `${format(date.from, "dd MMM yyyy")} - ${format(
          date.to,
          "dd MMM yyyy"
        )}`;
      }
      if (date.from) {
        return `${format(date.from, "dd MMM yyyy")} - ...`;
      }
    } else if (mode === "single" && date instanceof Date) {
      return format(date, "dd MMM yyyy");
    }
    return placeholder;
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal h-10 px-3",
            !date && "text-muted-foreground",
            className
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
          <span className="truncate">{displayValue()}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        {mode === "range" ? (
          <Calendar
            mode="range"
            selected={date as DateRange | undefined}
            onSelect={(selectedRange: DateRange | undefined) => {
              if (selectedRange?.from && selectedRange?.to && disabledDates) {
                const start = selectedRange.from < selectedRange.to ? selectedRange.from : selectedRange.to;
                const end = selectedRange.from > selectedRange.to ? selectedRange.from : selectedRange.to;

                const isInvalid = disabledDates.some((d) => {
                  const dateTime = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
                  const startTime = new Date(start.getFullYear(), start.getMonth(), start.getDate()).getTime();
                  const endTime = new Date(end.getFullYear(), end.getMonth(), end.getDate()).getTime();
                  return dateTime >= startTime && dateTime <= endTime;
                });

                if (isInvalid) {
                  // Prevent the range selection and keep only the latest selected date as the new start date
                  if (onDateChange) {
                    onDateChange({ from: selectedRange.to, to: undefined });
                  }
                  return;
                }
              }
              if (onDateChange) onDateChange(selectedRange);
            }}
            disabled={disabledDates}
            initialFocus
          />
        ) : (
          <Calendar
            mode="single"
            selected={date as Date | undefined}
            onSelect={onDateChange as (date: Date | undefined) => void}
            disabled={disabledDates}
            initialFocus
          />
        )}
      </PopoverContent>
    </Popover>
  );
}
