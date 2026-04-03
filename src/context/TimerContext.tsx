import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";

interface TimerContextType {
  // Countdown Timer
  remaining: number;
  totalSeconds: number;
  timerRunning: boolean;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  setTimerSeconds: (s: number) => void;
  
  // Stopwatch
  stopwatchSeconds: number;
  stopwatchRunning: boolean;
  startStopwatch: () => void;
  pauseStopwatch: () => void;
  resetStopwatch: () => void;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export const TimerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Countdown State
  const [totalSeconds, setTotalSeconds] = useState(1500);
  const [remaining, setRemaining] = useState(1500);
  const [timerRunning, setTimerRunning] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Stopwatch State
  const [stopwatchMs, setStopwatchMs] = useState(0);
  const [stopwatchRunning, setStopwatchRunning] = useState(false);

  useEffect(() => {
    audioRef.current = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3");
  }, []);

  // Update Tab Title
  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${String(secs).padStart(2, "0")}`;
  };

  useEffect(() => {
    if (timerRunning && remaining > 0) {
      document.title = `${formatTime(remaining)} - Daily Dash`;
    } else {
      document.title = "Daily Dash";
    }
    return () => { document.title = "Daily Dash"; };
  }, [timerRunning, remaining]);

  // Countdown Loop
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerRunning && remaining > 0) {
      interval = setInterval(() => {
        setRemaining((p) => {
          if (p <= 1) {
            setTimerRunning(false);
            audioRef.current?.play().catch(() => {});
            return 0;
          }
          return p - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning, remaining]);

  // Stopwatch Loop
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (stopwatchRunning) {
      interval = setInterval(() => {
        setStopwatchMs((p) => p + 10);
      }, 10);
    }
    return () => clearInterval(interval);
  }, [stopwatchRunning]);

  const startTimer = () => remaining > 0 && setTimerRunning(true);
  const pauseTimer = () => setTimerRunning(false);
  const resetTimer = () => {
    setTimerRunning(false);
    setRemaining(totalSeconds);
  };
  const setTimerSeconds = (s: number) => {
    setTimerRunning(false);
    setTotalSeconds(s);
    setRemaining(s);
  };

  const startStopwatch = () => setStopwatchRunning(true);
  const pauseStopwatch = () => setStopwatchRunning(false);
  const resetStopwatch = () => {
    setStopwatchRunning(false);
    setStopwatchMs(0);
  };

  return (
    <TimerContext.Provider value={{
      remaining, totalSeconds, timerRunning, startTimer, pauseTimer, resetTimer, setTimerSeconds,
      stopwatchSeconds: stopwatchMs, stopwatchRunning, startStopwatch, pauseStopwatch, resetStopwatch
    }}>
      {children}
    </TimerContext.Provider>
  );
};

export const useTimer = () => {
  const context = useContext(TimerContext);
  if (!context) throw new Error("useTimer must be used within a TimerProvider");
  return context;
};
