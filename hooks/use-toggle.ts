"use client";

import { useCallback, useState } from "react";

/** Returns a stable callback for toggling boolean state. */
export function useToggle(initial = false) {
  const [value, setValue] = useState(initial);
  const toggle = useCallback(() => setValue((v) => !v), []);
  return [value, toggle] as const;
}
