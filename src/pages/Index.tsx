import TodoList from "@/components/TodoList";
import Stopwatch from "@/components/Stopwatch";
import CountdownTimer from "@/components/CountdownTimer";
import DailyFocus from "@/components/DailyFocus";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-foreground tracking-tight">
            Focus Flow
          </h1>
          <p className="text-muted-foreground mt-1">Stay productive, one task at a time.</p>
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
