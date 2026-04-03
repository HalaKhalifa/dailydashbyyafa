import { useState } from "react";
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import Navbar from "@/components/Navbar";
import { useTasks } from "@/hooks/useTasks";
import TodoList from "@/components/TodoList";
import DailyFocus from "@/components/DailyFocus";
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const MonthlyCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const dateKey = format(selectedDate, "yyyy-MM-dd");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto max-w-5xl px-6 py-12 lg:px-8">
        <header className="mb-12">
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">Monthly Calendar</h1>
          <p className="text-muted-foreground mt-2">Plan ahead and track your consistency 📅</p>
        </header>

        <div className="grid gap-8 lg:grid-cols-[auto,1fr]">
          <div className="rounded-xl border border-border bg-card p-6 h-fit shadow-sm">
            <DayPicker
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="mx-auto"
              classNames={{
                day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                day_today: "bg-accent text-accent-foreground font-bold underline",
              }}
            />
          </div>

          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <DailyFocus dateContext={dateKey} />
            </div>
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <TodoList dateContext={dateKey} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthlyCalendar;
