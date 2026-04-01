import TodoList from "@/components/TodoList";
import Stopwatch from "@/components/Stopwatch";
import CountdownTimer from "@/components/CountdownTimer";
import DailyFocus from "@/components/DailyFocus";
import { ThemeToggle } from "@/components/ThemeToggle";

const Index = () => {
  return (
    <div className="min-h-screen bg-background transition-colors duration-500">
      <div className="mx-auto max-w-5xl px-6 py-12 lg:px-8">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 animate-in fade-in slide-in-from-top-4 duration-700">
          <div>
            <h1 className="text-4xl font-bold text-foreground tracking-tight sm:text-5xl lg:text-6xl">
              Daily Dash
            </h1>
            <p className="text-muted-foreground mt-4 text-lg font-medium opacity-80">
              Stay focused, you got this 💪
            </p>
          </div>
          <ThemeToggle />
        </header>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Daily Focus - full width */}
          <div className="md:col-span-2 rounded-xl border border-border bg-card p-6">
            <DailyFocus />
          </div>

          {/* Todo List */}
          <div className="rounded-xl border border-border bg-card p-6 md:row-span-2">
            <TodoList />
          </div>

          {/* Stopwatch */}
          <div className="rounded-xl border border-border bg-card p-6">
            <Stopwatch />
          </div>

          {/* Countdown Timer */}
          <div className="rounded-xl border border-border bg-card p-6">
            <CountdownTimer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
