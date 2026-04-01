import { useState, useRef, useEffect, useCallback } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";

const presets = [
  { label: "5m", seconds: 300 },
  { label: "10m", seconds: 600 },
  { label: "15m", seconds: 900 },
  { label: "25m", seconds: 1500 },
];

const CountdownTimer = () => {
  const [totalSeconds, setTotalSeconds] = useState(300);
  const [remaining, setRemaining] = useState(300);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running && remaining > 0) {
      intervalRef.current = setInterval(() => {
        setRemaining((p) => {
          if (p <= 1) {
            setRunning(false);
            return 0;
          }
          return p - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, remaining]);

  const reset = () => {
    setRunning(false);
    setRemaining(totalSeconds);
  };

  const selectPreset = (seconds: number) => {
    setRunning(false);
    setTotalSeconds(seconds);
    setRemaining(seconds);
  };

  const format = useCallback((s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }, []);

  const progress = totalSeconds > 0 ? (remaining / totalSeconds) * 100 : 0;

  return (
    <div className="flex flex-col items-center gap-4">
      <h2 className="text-lg font-semibold text-foreground self-start">Timer</h2>

      <div className="flex gap-2">
        {presets.map((p) => (
          <button
            key={p.label}
            onClick={() => selectPreset(p.seconds)}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              totalSeconds === p.seconds
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="relative w-36 h-36 flex items-center justify-center">
        <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="44" fill="none" strokeWidth="6" className="stroke-muted" />
          <circle
            cx="50"
            cy="50"
            r="44"
            fill="none"
            strokeWidth="6"
            strokeLinecap="round"
            className="stroke-primary transition-all duration-1000"
            strokeDasharray={`${2 * Math.PI * 44}`}
            strokeDashoffset={`${2 * Math.PI * 44 * (1 - progress / 100)}`}
          />
        </svg>
        <span className="font-mono text-2xl font-medium text-foreground">
          {format(remaining)}
        </span>
      </div>

      {remaining === 0 && (
        <p className="text-sm font-medium text-accent animate-fade-in">Time's up!</p>
      )}

      <div className="flex gap-3">
        <button
          onClick={() => remaining > 0 && setRunning(!running)}
          disabled={remaining === 0}
          className="rounded-lg bg-primary px-4 py-2 text-primary-foreground hover:opacity-90 transition-opacity flex items-center gap-2 text-sm font-medium disabled:opacity-50"
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

export default CountdownTimer;
