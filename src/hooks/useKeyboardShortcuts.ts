import { useEffect } from "react";

export function useKeyboardShortcuts(handlers: Record<string, () => void>) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        handlers.search?.();
      }

      // Escape
      if (e.key === "Escape") {
        e.preventDefault();
        handlers.escape?.();
      }

      // Cmd+N or Ctrl+N
      if ((e.metaKey || e.ctrlKey) && e.key === "n") {
        e.preventDefault();
        handlers.create?.();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlers]);
}