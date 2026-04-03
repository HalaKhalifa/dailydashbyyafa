import { useTasks } from "@/hooks/useTasks";
import DailyFocus from "@/components/DailyFocus";
import TodoList from "@/components/TodoList";
import { addDays, format, subDays } from "date-fns";
import Navbar from "@/components/Navbar";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const WeeklyPlanner = () => {
  const todayDate = new Date();
  const startDate = subDays(todayDate, 1); // Start from yesterday
  const todayString = format(todayDate, "yyyy-MM-dd");
  
  const days = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(startDate, i);
    return {
      date: format(date, "yyyy-MM-dd"),
      label: format(date, "EEEE, MMM d"),
      isToday: format(date, "yyyy-MM-dd") === todayString
    };
  });

  const todayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (todayRef.current) {
      setTimeout(() => {
        todayRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background pb-20">
      <Navbar />
      <div className="mx-auto max-w-5xl px-6 py-12 lg:px-8">
        <header className="mb-12">
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">Weekly Planner</h1>
          <p className="text-muted-foreground mt-2">Manage your week at a glance 🗓️</p>
        </header>

        <div className="grid gap-12 divide-y divide-border">
          {days.map((day) => (
            <div key={day.date} ref={day.isToday ? todayRef : null}>
              <DaySection date={day.date} label={day.label} isToday={day.isToday} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const DaySection = ({ date, label, isToday }: { date: string; label: string; isToday: boolean }) => {
  return (
    <div className={cn("py-12 first:pt-0", isToday && "relative")}>
      {isToday && (
         <div className="absolute -left-4 top-12 bottom-12 w-1 bg-primary rounded-full hidden lg:block" />
      )}
      <div className="flex items-center gap-3 mb-6">
        <h2 className={cn("text-2xl font-bold", isToday ? "text-primary" : "text-foreground opacity-80")}>
          {label}
        </h2>
        {isToday && (
          <span className="bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full">
            Today
          </span>
        )}
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
          <DailyFocus dateContext={date} />
        </div>
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
          <TodoList dateContext={date} />
        </div>
      </div>
    </div>
  );
};

export default WeeklyPlanner;
