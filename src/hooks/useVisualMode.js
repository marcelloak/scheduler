import { useState } from 'react'

export default function useVisualMode(initialMode) {
  const [mode, setMode] = useState(initialMode)
  const [history, setHistory] = useState([initialMode])

  const transition = function(mode, replace = false) {
    setHistory(prev => {
      if (replace) prev.pop();
      return [...prev, mode]
    });
    setMode(mode);
  }

  const back = function() {
    if (history.length < 2) return;
    history.pop();
    setMode(history[history.length - 1]);
  }

  return {mode, transition, back }
}