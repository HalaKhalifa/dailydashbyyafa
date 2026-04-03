import { useState } from "react";
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import Navbar from "@/components/Navbar";
import { useTasks } from "@/hooks/useTasks";
import TodoList from "@/components/TodoList";
import DailyFocus from "@/components/DailyFocus";
import { cn } from "@/lib/utils";

const MonthlyCalendar = () => {
  const { taskMap } = useTasks();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const dateKey = format(selectedDate, "yyyy-MM-dd");

  // Find all dates that have tasks
  const daysWithTasks = Object.keys(taskMap).filter(key => taskMap[key].length > 0)
    .map(dateStr => new Date(dateStr));

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto max-w-5xl px-6 py-12 lg:px-8">
        <style>{`
          .has-tasks {
            position: relative;
          }
          .has-tasks::after {
            content: '';
            position: absolute;
            bottom: 4px;
            left: 50%;
            transform: translateX(-50%);
            width: 4px;
            height: 4px;
            background-color: #ef4444; /* red-500 */
            border-radius: 50%;
          }
        `}</style>
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
              modifiers={{ hasTasks: daysWithTasks }}
              modifiersClassNames={{ hasTasks: "has-tasks" }}
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
