import type { Project } from "@simplix-react/gantt-core";
import { createContext, useContext, useRef } from "react";
import type { ReactNode } from "react";
import { useStore } from "zustand";

import { createGanttStore } from "../model/gantt-store";
import type { CreateGanttStoreOptions, GanttStore, GanttStoreState } from "../model/gantt-store";

const GanttStoreContext = createContext<GanttStore | null>(null);

/** Props for {@link GanttProvider}. */
export interface GanttProviderProps extends CreateGanttStoreOptions {
  /** The plan the chart opens with. Later changes are made through the store. */
  defaultProject: Project;
  children: ReactNode;
}

/**
 * Owns the store of one chart. Charts under different providers share no
 * state.
 *
 * @throws ScheduleError when `defaultProject` cannot be scheduled.
 */
export function GanttProvider({ defaultProject, children, ...options }: GanttProviderProps) {
  const storeRef = useRef<GanttStore | null>(null);
  const optionsRef = useRef(options);
  optionsRef.current = options;
  if (!storeRef.current) {
    storeRef.current = createGanttStore(defaultProject, {
      ...options,
      // Read the latest callback on every change so a re-rendered parent is not left with a stale one.
      onChange: (project, schedule, changes) => optionsRef.current.onChange?.(project, schedule, changes),
    });
  }
  return <GanttStoreContext.Provider value={storeRef.current}>{children}</GanttStoreContext.Provider>;
}

/** The store of the enclosing chart, for imperative access. */
export function useGanttStore(): GanttStore {
  const store = useContext(GanttStoreContext);
  if (!store) throw new Error("useGanttStore must be used inside a GanttProvider");
  return store;
}

/** Subscribes to a slice of the enclosing chart's state. */
export function useGantt<T>(selector: (state: GanttStoreState) => T): T {
  return useStore(useGanttStore(), selector);
}
