import { useState, useRef, useEffect, useCallback } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const Stopwatch = () => {
  const [ms, setMs] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => setMs((p) => p + 10), 10);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);

  const reset = () => {
    setRunning(false);
    setMs(0);
  };

  const format = useCallback((t: number) => {
    const mins = Math.floor(t / 60000);
    const secs = Math.floor((t % 60000) / 1000);
    const centis = Math.floor((t % 1000) / 10);
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}.${String(centis).padStart(2, "0")}`;
  }, []);

  return (
    <div className="flex flex-col items-center gap-6 h-full justify-between">
      <div className="flex items-center justify-between w-full">
        <h2 className="text-xl font-bold text-foreground tracking-tight">Stopwatch</h2>
        <div className={cn(
          "w-3 h-3 rounded-full animate-pulse",
          running ? "bg-primary" : "bg-muted"
        )} />
      </div>

      <div className="flex flex-col items-center justify-center flex-1">
        <span className="font-mono text-5xl font-bold text-primary tracking-tighter tabular-nums drop-shadow-sm">
          {format(ms)}
        </span>
        <p className="text-xs font-medium text-muted-foreground mt-2 uppercase tracking-widest">
          Minutes : Seconds . MS
        </p>
      </div>

      <div className="flex gap-4 w-full">
        <Button
          onClick={() => setRunning(!running)}
          className="flex-1 rounded-xl h-12 text-sm font-bold shadow-sm transition-all hover:translate-y-[-1px]"
          variant={running ? "secondary" : "default"}
        >
          {running ? (
            <>
              <Pause size={18} className="mr-2" />
              Pause
            </>
          ) : (
            <>
              <Play size={18} className="mr-2" />
              Start
            </>
          )}
        </Button>
        <Button
          onClick={reset}
          variant="outline"
          className="rounded-xl h-12 w-12 p-0 shadow-sm transition-all hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20"
          aria-label="Reset stopwatch"
        >
          <RotateCcw size={18} />
        </Button>
      </div>
    </div>
  );
};

export default Stopwatch;

