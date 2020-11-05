import { useState } from 'react';

export default function useVisualMode(initialMode) {
  const [mode, setMode] = useState(initialMode);
  const [history, setHistory] = useState([initialMode]);

  // Transitions to given mode, adding to the history or replacing the last mode based on given replace boolean
  const transition = function(mode, replace = false) {
    setHistory(prev => {
      const history = replace ? prev.slice(0, -1) : [...prev];
      return [...history, mode]
    });
    setMode(mode);
  };

  // Transitions to previous mode in history
  const back = function() {
    if (history.length < 2) return;
    setHistory(prev => {
      const history = prev.slice(0, -1);
      setMode(history[history.length - 1]);
      return history;
    });
  };

  return { mode, transition, back };
};