"use client";

import { useCallback, useSyncExternalStore } from "react";
import {
  addExtraLine,
  EXTRAS_STORAGE_KEY,
  MAX_EXTRA_QUANTITY,
  parseStoredExtras,
  type ExtraLine,
} from "@/lib/menu-extras";

const CHANGE_EVENT = "soulbowls:extras-change";
const EMPTY: ExtraLine[] = [];
let cachedRaw: string | null = null;
let cachedLines: ExtraLine[] = EMPTY;

function read(): ExtraLine[] {
  let raw: string | null = null;
  try {
    raw = window.sessionStorage.getItem(EXTRAS_STORAGE_KEY);
  } catch {
    return EMPTY;
  }
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedLines = parseStoredExtras(raw);
  }
  return cachedLines;
}

function write(lines: ExtraLine[]) {
  try {
    if (lines.length) window.sessionStorage.setItem(EXTRAS_STORAGE_KEY, JSON.stringify(lines));
    else window.sessionStorage.removeItem(EXTRAS_STORAGE_KEY);
  } catch {
    // Storage can be unavailable (private mode); the cart simply won't persist.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function subscribe(onChange: () => void) {
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

/** Salads and snacks chosen on the menu, carried into checkout for this tab. */
export function useExtrasCart() {
  const lines = useSyncExternalStore(subscribe, read, () => EMPTY);

  const add = useCallback((line: ExtraLine) => write(addExtraLine(read(), line)), []);
  const setQuantity = useCallback((index: number, quantity: number) => {
    const next = read()
      .map((line, i) => (i === index ? { ...line, quantity: Math.min(MAX_EXTRA_QUANTITY, quantity) } : line))
      .filter((line) => line.quantity > 0);
    write(next);
  }, []);
  const clear = useCallback(() => write([]), []);

  return { lines, add, setQuantity, clear };
}
