import { GraphNodeLayout, ListNodeItem } from '../types/simulation';

export interface LayoutDimensions {
  width: number;
  height: number;
}

export function computeGraphLayout(
  nodes: ListNodeItem[],
  cyclePos: number | null,
  dimensions: LayoutDimensions
): GraphNodeLayout[] {
  if (nodes.length === 0) return [];

  const { width, height } = dimensions;
  const paddingX = Math.min(60, width * 0.08);
  const centerY = height / 2;

  // Case 1: No cycle (Linear List)
  if (cyclePos === null || cyclePos < 0 || cyclePos >= nodes.length) {
    const availableWidth = width - paddingX * 2;
    const spacingX = Math.min(95, availableWidth / Math.max(1, nodes.length));
    const startX = Math.max(paddingX, (width - (nodes.length - 1) * spacingX) / 2);

    return nodes.map((node, i) => ({
      id: node.id,
      value: node.value,
      x: startX + i * spacingX,
      y: centerY,
      next: node.next,
      isCycleEntry: false,
      isInCycle: false,
    }));
  }

  // Case 2: Pure Cycle at Head (cyclePos === 0)
  if (cyclePos === 0) {
    const radius = Math.min(width * 0.35, height * 0.36, 150);
    const centerX = width / 2;
    const count = nodes.length;

    return nodes.map((node, i) => {
      // Angle: start at top (-PI/2) and go clockwise
      const angle = -Math.PI / 2 + (2 * Math.PI * i) / count;
      return {
        id: node.id,
        value: node.value,
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
        next: node.next,
        isCycleEntry: i === 0,
        isInCycle: true,
      };
    });
  }

  // Case 3: Mixed (Prefix chain + Cycle ring)
  const mu = cyclePos; // Prefix length
  const lambda = nodes.length - cyclePos; // Loop length

  // Let's divide the width: left portion for prefix, right portion for loop
  const loopRadius = Math.min(width * 0.22, height * 0.34, 120);
  const loopCenterX = width - paddingX - loopRadius - 10;
  const loopCenterY = centerY;

  const prefixStartX = paddingX + 20;
  // Node mu (entry) will sit at the leftmost point of the loop: loopCenterX - loopRadius
  const entryX = loopCenterX - loopRadius;

  const prefixSpacing = (entryX - prefixStartX) / Math.max(1, mu);

  return nodes.map((node, i) => {
    if (i < mu) {
      // Linear prefix
      return {
        id: node.id,
        value: node.value,
        x: prefixStartX + i * prefixSpacing,
        y: centerY,
        next: node.next,
        isCycleEntry: false,
        isInCycle: false,
      };
    } else {
      // Node inside cycle
      const cycleIndex = i - mu; // 0 is entry
      // For entry (cycleIndex = 0), we want it at angle Math.PI (leftmost)
      const angle = Math.PI + (2 * Math.PI * cycleIndex) / lambda;
      return {
        id: node.id,
        value: node.value,
        x: loopCenterX + loopRadius * Math.cos(angle),
        y: loopCenterY + loopRadius * Math.sin(angle),
        next: node.next,
        isCycleEntry: i === cyclePos,
        isInCycle: true,
      };
    }
  });
}

// Layout for Array as Functional Graph (Find Duplicate)
export function computeFunctionalGraphLayout(
  nums: number[],
  dimensions: LayoutDimensions
): GraphNodeLayout[] {
  const { width, height } = dimensions;
  const n = nums.length;
  if (n === 0) return [];

  // Arrange index nodes horizontally with curve arcs or two-row layout
  const paddingX = Math.min(50, width * 0.06);
  const availableWidth = width - paddingX * 2;
  const spacingX = Math.min(85, availableWidth / Math.max(1, n));
  const startX = Math.max(paddingX, (width - (n - 1) * spacingX) / 2);
  const centerY = height * 0.52;

  return nums.map((val, idx) => ({
    id: idx,
    value: `${val}`,
    x: startX + idx * spacingX,
    y: centerY,
    next: val < nums.length ? val : null,
    isCycleEntry: false,
    isInCycle: false,
  }));
}
