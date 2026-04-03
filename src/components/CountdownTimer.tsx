import { useState, useRef, useEffect, useCallback } from "react";
import { Play, Pause, RotateCcw, Timer as TimerIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const presets = [
  { label: "5m", seconds: 300 },
  { label: "10m", seconds: 600 },
  { label: "25m", seconds: 1500 },
  { label: "1h", seconds: 3600 },
];

const CountdownTimer = () => {
  const [totalSeconds, setTotalSeconds] = useState(1500);
  const [remaining, setRemaining] = useState(1500);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3");
  }, []);

  useEffect(() => {
    if (running && remaining > 0) {
      intervalRef.current = setInterval(() => {
        setRemaining((p) => {
          if (p <= 1) {
            setRunning(false);
            audioRef.current?.play().catch(e => console.error("Audio play failed", e));
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
    const hrs = Math.floor(s / 3600);
    const mins = Math.floor((s % 3600) / 60);
    const secs = s % 60;
    return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }, []);

  const progress = totalSeconds > 0 ? (remaining / totalSeconds) * 100 : 0;

  return (
    <div className="flex flex-col gap-6 h-full justify-between">
      <div className="flex items-center justify-between w-full">
        <h2 className="text-xl font-bold text-foreground tracking-tight">Focus Timer</h2>
        <TimerIcon size={20} className={cn(
          "transition-colors duration-500",
          running ? "text-primary animate-pulse" : "text-muted-foreground"
        )} />
      </div>

      <div className="flex flex-col gap-4 flex-1 justify-center">
        <div className="flex flex-col items-center">
          <span className="font-mono text-5xl font-bold text-foreground tracking-tighter tabular-nums">
            {format(remaining)}
          </span>
          {remaining === 0 && (
            <p className="text-xs font-bold text-destructive mt-2 uppercase tracking-widest animate-bounce">
              Time's up!
            </p>
          )}
        </div>
        
        <div className="space-y-2 w-full px-2">
          <Progress value={progress} className="h-2 w-full bg-secondary" />
          <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">
            <span>Remaining: {Math.round(progress)}%</span>
            <span>{totalSeconds / 60}m Total</span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 justify-center mb-2">
        {presets.map((p) => (
          <button
            key={p.label}
            onClick={() => selectPreset(p.seconds)}
            className={cn(
              "rounded-lg px-3 py-1.5 text-xs font-bold transition-all border shadow-sm",
              totalSeconds === p.seconds
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background text-muted-foreground hover:bg-muted border-border hover:border-primary/30"
            )}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="flex gap-4 w-full">
        <Button
          onClick={() => remaining > 0 && setRunning(!running)}
          disabled={remaining === 0}
          className="flex-1 rounded-xl h-12 text-sm font-bold shadow-sm transition-all hover:translate-y-[-1px] disabled:opacity-50"
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
          className="rounded-xl h-12 w-12 p-0 shadow-sm transition-all hover:bg-muted"
          aria-label="Reset timer"
        >
          <RotateCcw size={18} />
        </Button>
      </div>
    </div>
  );
};

export default CountdownTimer;

