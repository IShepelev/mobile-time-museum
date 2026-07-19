"use client";

import { useSyncExternalStore } from "react";
import { getServerSnapshot, getSnapshot, subscribe, type MuseumData } from "./store";

/**
 * React binding for the CMS working copy. Any component that calls this
 * re-renders whenever the store changes (add/edit/delete/publish).
 *
 * On the server (and the very first client render before hydration) it
 * returns the seed data so markup matches; localStorage is only read on the
 * client, after which the subscription keeps everything in sync.
 */
export function useMuseum(): MuseumData {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
