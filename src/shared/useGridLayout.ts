import { isNil } from "lodash";
import { useLayoutEffect, useState } from "react";
import type { RefObject } from "react";

const MIN_COLUMN_COUNT = 1;

export type GridLayout = {
  columnCount: number;
  offsetTop: number;
};

const measureGrid = (container: HTMLElement, minColumnWidth: number): GridLayout => ({
  columnCount: Math.max(MIN_COLUMN_COUNT, Math.floor(container.clientWidth / minColumnWidth)),
  offsetTop: container.offsetTop,
});

// Returns null until measured. Measuring in a layout effect lands before paint, so a grid rendered
// from cached data never flashes with the wrong number of columns.
export const useGridLayout = (
  containerRef: RefObject<HTMLElement | null>,
  minColumnWidth: number,
): GridLayout | null => {
  const [layout, setLayout] = useState<GridLayout | null>(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (isNil(container)) {
      return;
    }
    setLayout(measureGrid(container, minColumnWidth));
    const observer = new ResizeObserver(() => setLayout(measureGrid(container, minColumnWidth)));
    observer.observe(container);
    return () => observer.disconnect();
  }, [containerRef, minColumnWidth]);

  return layout;
};
