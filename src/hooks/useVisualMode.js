import { useState } from 'react'

export default function useVisualMode(initialMode) {
  const [mode, setMode] = useState(initialMode)
  const [history, setHistory] = useState([initialMode])

  // Transitions to given mode, adding to the history or replacing the last mode based on given replace boolean
  const transition = function(mode, replace = false) {
    setHistory(prev => {
      if (replace) prev.pop();
      return [...prev, mode]
    });
    setMode(mode);
  }

  // Transitions to previous mode in history
  const back = function() {
    if (history.length < 2) return;
    history.pop();
    setMode(history[history.length - 1]);
  }

  return {mode, transition, back }
}
