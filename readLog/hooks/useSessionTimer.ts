import { useEffect, useRef, useState } from "react";

type UseSessionTimerReturn = {
  sessionSeconds: number;
  isRunning: boolean;
  sessionStartTime: number | null;
  handleStart: () => void;
  handleStop: () => void;
};

export function useSessionTimer(): UseSessionTimerReturn {
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(
        () => setSessionSeconds((s) => s + 1),
        1000,
      );
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  // function handleStart() {
  //   if (!isRunning) {
  //     setSessionStartTime(Date.now());
  //     setIsRunning(true);
  //   }
  // }
  function handleStart() {
    if (!isRunning) {
      if (sessionStartTime === null) {
        setSessionStartTime(Date.now()); // only set on first start
      }
      setIsRunning(true);
    }
  }

  function handleStop() {
    setIsRunning(false);
  }

  return {
    sessionSeconds,
    isRunning,
    sessionStartTime,
    handleStart,
    handleStop,
  };
}
