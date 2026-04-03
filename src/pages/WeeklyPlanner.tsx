import { useTasks } from "@/hooks/useTasks";
import DailyFocus from "@/components/DailyFocus";
import TodoList from "@/components/TodoList";
import { addDays, format, startOfWeek } from "date-fns";
import Navbar from "@/components/Navbar";

const WeeklyPlanner = () => {
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 }); // Start on Monday
  
  const days = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(weekStart, i);
    return {
      date: format(date, "yyyy-MM-dd"),
      label: format(date, "EEEE, MMM d"),
    };
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto max-w-5xl px-6 py-12 lg:px-8">
        <header className="mb-12">
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">Weekly Planner</h1>
          <p className="text-muted-foreground mt-2">Manage your week at a glance 🗓️</p>
        </header>

        <div className="grid gap-8 divide-y divide-border">
          {days.map((day) => (
            <DaySection key={day.date} date={day.date} label={day.label} />
          ))}
        </div>
      </div>
    </div>
  );
};

const DaySection = ({ date, label }: { date: string; label: string }) => {
  return (
    <div className="py-8 first:pt-0">
      <h2 className="text-2xl font-semibold text-primary mb-6">{label}</h2>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-6">
          <DailyFocus dateContext={date} />
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <TodoList dateContext={date} />
        </div>
      </div>
    </div>
  );
};

export default WeeklyPlanner;
