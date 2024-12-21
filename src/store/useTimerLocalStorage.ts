// store/useLocalStorage.ts
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from './useTimerStore';


export function useLocalStorage() {
  // Access the timers array from Redux
  const timers = useSelector((state: RootState) => state.timers);

  useEffect(() => {
    try {
      const serializedTimers = JSON.stringify(timers);
      localStorage.setItem('timers', serializedTimers);
    } catch (err) {
      console.error('Failed to save timers to localStorage:', err);
    }
  }, [timers]);
}
