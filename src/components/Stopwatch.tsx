import { useState, useRef, useEffect, useCallback } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";

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
    <div className="flex flex-col items-center gap-4">
      <h2 className="text-lg font-semibold text-foreground self-start">Stopwatch</h2>
      <span className="font-mono text-4xl font-medium text-foreground tracking-wider">
        {format(ms)}
      </span>
      <div className="flex gap-3">
        <button
          onClick={() => setRunning(!running)}
          className="rounded-lg bg-primary px-4 py-2 text-primary-foreground hover:opacity-90 transition-opacity flex items-center gap-2 text-sm font-medium"
        >
          {running ? <Pause size={16} /> : <Play size={16} />}
          {running ? "Pause" : "Start"}
        </button>
        <button
          onClick={reset}
          className="rounded-lg border border-border px-4 py-2 text-foreground hover:bg-muted transition-colors flex items-center gap-2 text-sm font-medium"
        >
          <RotateCcw size={16} />
          Reset
        </button>
      </div>
    </div>
  );
};

export default Stopwatch;
