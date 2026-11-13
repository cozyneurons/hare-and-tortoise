import React, { useMemo } from 'react';
import { 
  AlgorithmMode, 
  GraphNodeLayout, 
  ListNodeItem, 
  SimulationStep 
} from '../../types/simulation';
import { computeFunctionalGraphLayout, computeGraphLayout } from '../../utils/graphLayout';

interface GraphCanvasProps {
  mode: AlgorithmMode;
  nodes: ListNodeItem[];
  cyclePos: number | null;
  currentStep: SimulationStep | null;
  numsArray?: number[];
  dimensions?: { width: number; height: number };
}

export const GraphCanvas: React.FC<GraphCanvasProps> = ({
  mode,
  nodes,
  cyclePos,
  currentStep,
  numsArray = [],
  dimensions = { width: 850, height: 420 },
}) => {
  const { width, height } = dimensions;

  // Compute node layouts
  const layoutNodes: GraphNodeLayout[] = useMemo(() => {
    if (mode === 'find-duplicate' && numsArray.length > 0) {
      return computeFunctionalGraphLayout(numsArray, dimensions);
    }
    return computeGraphLayout(nodes, cyclePos, dimensions);
  }, [mode, nodes, cyclePos, numsArray, dimensions]);

  // Lookup node by id
  const nodeMap = useMemo(() => {
    const map = new Map<number, GraphNodeLayout>();
    layoutNodes.forEach(n => map.set(n.id, n));
    return map;
  }, [layoutNodes]);

  const slowNode = currentStep && currentStep.slowIndex !== null ? nodeMap.get(currentStep.slowIndex) : null;
  const fastNode = currentStep && currentStep.fastIndex !== null ? nodeMap.get(currentStep.fastIndex) : null;
  const isCollision = currentStep && currentStep.slowIndex !== null && currentStep.slowIndex === currentStep.fastIndex;

  // Path generator for edges
  const renderEdges = () => {
    return layoutNodes.map(node => {
      if (node.next === null) return null;
      const target = nodeMap.get(node.next);
      if (!target) return null;

      // Check if this edge is active/highlighted
      const isSlowEdge = currentStep && currentStep.prevSlowIndex === node.id && currentStep.slowIndex === target.id;
      const isFastEdge = currentStep && currentStep.prevFastIndex === node.id && currentStep.fastIndex === target.id;
      const isHighlighted = isSlowEdge || isFastEdge;

      // Special handling for cycle back-edge
      const isBackEdge = node.id >= target.id && node.isInCycle && target.isInCycle;

      let pathD = '';
      if (mode === 'find-duplicate') {
        // Curved arc above or below nodes for array functional graph
        const dx = target.x - node.x;
        const midX = (node.x + target.x) / 2;
        const arcHeight = Math.min(100, Math.max(40, Math.abs(dx) * 0.45));
        const curveY = dx > 0 ? node.y - arcHeight : node.y + arcHeight;
        pathD = `M ${node.x} ${node.y} Q ${midX} ${curveY} ${target.x} ${target.y}`;
      } else if (isBackEdge) {
        // Curve loopback edge
        const midX = (node.x + target.x) / 2;
        const midY = Math.max(node.y, target.y) + 70;
        pathD = `M ${node.x} ${node.y} Q ${midX} ${midY} ${target.x} ${target.y}`;
      } else {
        // Straight line
        pathD = `M ${node.x} ${node.y} L ${target.x} ${target.y}`;
      }

      return (
        <g key={`edge-${node.id}-${target.id}`}>
          {/* Subtle glow background if active */}
          {isHighlighted && (
            <path
              d={pathD}
              fill="none"
              stroke={isSlowEdge ? '#06b6d4' : '#f59e0b'}
              strokeWidth="6"
              strokeOpacity="0.4"
              strokeLinecap="round"
              className="animate-pulse"
            />
          )}
          {/* Base edge */}
          <path
            d={pathD}
            fill="none"
            stroke={isHighlighted ? (isSlowEdge ? '#06b6d4' : '#f59e0b') : '#1e293b'}
            strokeWidth={isHighlighted ? '2.5' : '2'}
            strokeDasharray={isBackEdge ? '5,4' : undefined}
            markerEnd={isHighlighted ? 'url(#arrow-active)' : 'url(#arrow-default)'}
            className="transition-all duration-300"
          />
        </g>
      );
    });
  };

  return (
    <div className="relative w-full h-full min-h-[380px] flex flex-col justify-center items-center bg-arcade-950/90 rounded-xl border border-arcade-800/80 overflow-hidden shadow-2xl">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 arcade-grid pointer-events-none opacity-40" />

      {/* Array tape for Find Duplicate Mode */}
      {mode === 'find-duplicate' && numsArray.length > 0 && (
        <div className="absolute top-3 left-4 right-4 z-10 flex flex-wrap items-center justify-between gap-2 px-4 py-2 bg-arcade-900/90 border border-arcade-800 rounded-lg text-xs font-mono shadow-md backdrop-blur">
          <div className="flex items-center gap-2 text-slate-400">
            <span className="text-lime-accent font-semibold">ARRAY TAPE:</span>
            <span className="text-[11px] text-slate-400">index [i] &rarr; value nums[i]</span>
          </div>
          <div className="flex items-center gap-1 overflow-x-auto py-1 max-w-full">
            {numsArray.map((val, idx) => {
              const isSlow = currentStep?.slowIndex === idx;
              const isFast = currentStep?.fastIndex === idx;
              const isDup = currentStep?.status === 'FOUND_DUPLICATE' && currentStep?.slowIndex === idx;

              return (
                <div
                  key={`tape-${idx}`}
                  className={`flex flex-col items-center px-2 py-1 rounded border transition-all duration-300 min-w-[42px] ${
                    isDup
                      ? 'bg-lime-accent/20 border-lime-accent text-lime-accent font-bold scale-105 shadow-glow-lime'
                      : isSlow && isFast
                      ? 'bg-purple-900/40 border-purple-400 text-purple-200'
                      : isSlow
                      ? 'bg-tortoise-bg border-tortoise-cyan text-tortoise-glow font-bold'
                      : isFast
                      ? 'bg-hare-bg border-hare-amber text-hare-glow font-bold'
                      : 'bg-arcade-850 border-arcade-800 text-slate-300'
                  }`}
                >
                  <span className="text-[10px] text-slate-400">i:{idx}</span>
                  <span className="text-sm font-semibold">{val}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SVG Canvas Area */}
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-full max-h-[500px] select-none"
      >
        <defs>
          {/* Arrow markers */}
          <marker
            id="arrow-default"
            viewBox="0 0 10 10"
            refX="25"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#334155" />
          </marker>
          <marker
            id="arrow-active"
            viewBox="0 0 10 10"
            refX="25"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#10f57a" />
          </marker>

          {/* Radial glow gradient */}
          <radialGradient id="collision-pulse" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ec4899" stopOpacity="0.8" />
            <stop offset="60%" stopColor="#a855f7" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#070a10" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Directed Edges */}
        {renderEdges()}

        {/* Null Terminator for non-cyclic lists */}
        {mode !== 'find-duplicate' && (cyclePos === null || cyclePos < 0) && layoutNodes.length > 0 && (
          <g transform={`translate(${layoutNodes[layoutNodes.length - 1].x + 65}, ${layoutNodes[layoutNodes.length - 1].y})`}>
            <line x1="-35" y1="0" x2="-10" y2="0" stroke="#334155" strokeWidth="2" strokeDasharray="3,3" />
            <rect x="-8" y="-14" width="46" height="28" rx="6" fill="#0d131f" stroke="#334155" strokeWidth="1" />
            <text x="15" y="4" textAnchor="middle" fill="#64748b" fontSize="11" fontFamily="monospace" fontWeight="bold">
              NULL
            </text>
          </g>
        )}

        {/* Nodes */}
        {layoutNodes.map(node => {
          const isSlow = currentStep?.slowIndex === node.id;
          const isFast = currentStep?.fastIndex === node.id;
          const isCycleEntry = node.isCycleEntry;
          const isMiddle = mode === 'find-middle' && currentStep?.status === 'FOUND_MIDDLE' && currentStep?.middleIndex === node.id;
          const isDup = mode === 'find-duplicate' && currentStep?.status === 'FOUND_DUPLICATE' && currentStep?.duplicateValue === node.id;

          // Determine node border and background colors
          let fillColor = '#0e1424';
          let strokeColor = '#1e293b';
          let strokeWidth = 2;

          if (isDup || isMiddle) {
            fillColor = 'rgba(16, 245, 122, 0.15)';
            strokeColor = '#10f57a';
            strokeWidth = 3;
          } else if (isCycleEntry) {
            fillColor = 'rgba(236, 72, 153, 0.12)';
            strokeColor = '#ec4899';
            strokeWidth = 2.5;
          } else if (node.isInCycle) {
            strokeColor = '#3b82f6';
          }

          return (
            <g
              key={`node-${node.id}`}
              transform={`translate(${node.x}, ${node.y})`}
              className="cursor-pointer transition-transform duration-300 hover:scale-105"
            >
              {/* Outer glow ring for cycle entry */}
              {isCycleEntry && (
                <circle
                  r="28"
                  fill="none"
                  stroke="#ec4899"
                  strokeWidth="1.5"
                  strokeDasharray="4,4"
                  className="animate-spin"
                  style={{ transformOrigin: 'center', animationDuration: '10s' }}
                  opacity="0.6"
                />
              )}

              {/* Main Node Circle */}
              <circle
                r="22"
                fill={fillColor}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                className="transition-all duration-300"
              />

              {/* Inner subtle glow */}
              {(isSlow || isFast) && (
                <circle
                  r="22"
                  fill="none"
                  stroke={isSlow && isFast ? '#ec4899' : isSlow ? '#06b6d4' : '#f59e0b'}
                  strokeWidth="3"
                  className="animate-pulse"
                />
              )}

              {/* Node Value */}
              <text
                textAnchor="middle"
                dy="5"
                fill="#f1f5f9"
                fontSize="13"
                fontWeight="700"
                fontFamily="monospace"
              >
                {node.value}
              </text>

              {/* Node ID label below */}
              <text
                textAnchor="middle"
                dy="36"
                fill="#64748b"
                fontSize="10"
                fontFamily="monospace"
              >
                #{node.id}
              </text>

              {/* Badge for Cycle Entry or Middle */}
              {isCycleEntry && (
                <g transform="translate(0, -32)">
                  <rect x="-30" y="-8" width="60" height="16" rx="4" fill="#831843" stroke="#ec4899" strokeWidth="1" />
                  <text textAnchor="middle" dy="4" fill="#fbcfe8" fontSize="9" fontWeight="bold" fontFamily="monospace">
                    ENTRY (μ)
                  </text>
                </g>
              )}

              {isMiddle && (
                <g transform="translate(0, -32)">
                  <rect x="-30" y="-8" width="60" height="16" rx="4" fill="#064e3b" stroke="#10f57a" strokeWidth="1" />
                  <text textAnchor="middle" dy="4" fill="#a7f3d0" fontSize="9" fontWeight="bold" fontFamily="monospace">
                    MIDDLE
                  </text>
                </g>
              )}

              {isDup && (
                <g transform="translate(0, -32)">
                  <rect x="-36" y="-8" width="72" height="16" rx="4" fill="#064e3b" stroke="#10f57a" strokeWidth="1" />
                  <text textAnchor="middle" dy="4" fill="#a7f3d0" fontSize="9" fontWeight="bold" fontFamily="monospace">
                    DUPLICATE!
                  </text>
                </g>
              )}
            </g>
          );
        })}

        {/* Collision Shockwave Animation */}
        {isCollision && slowNode && (
          <g transform={`translate(${slowNode.x}, ${slowNode.y})`}>
            <circle r="45" fill="url(#collision-pulse)" className="animate-ping-slow" />
            <circle r="36" fill="none" stroke="#ec4899" strokeWidth="2.5" className="animate-pulse" />
          </g>
        )}

        {/* Tortoise Pointer Indicator (Slow, 1x) */}
        {slowNode && (
          <g
            transform={`translate(${slowNode.x}, ${slowNode.y + (isCollision ? -48 : -44)})`}
            className="pointer-events-none transition-all duration-300"
          >
            <rect
              x="-48"
              y="-12"
              width="96"
              height="22"
              rx="11"
              fill="#083344"
              stroke="#06b6d4"
              strokeWidth="1.5"
              filter="drop-shadow(0 2px 8px rgba(6, 182, 212, 0.4))"
            />
            {/* Speed dot */}
            <circle cx="-38" cy="-1" r="3" fill="#06b6d4" className="animate-ping" />
            <text
              x="2"
              y="3"
              textAnchor="middle"
              fill="#e0f2fe"
              fontSize="10"
              fontWeight="bold"
              fontFamily="monospace"
            >
              🐢 SLOW (1x)
            </text>
          </g>
        )}

        {/* Hare Pointer Indicator (Fast, 2x) */}
        {fastNode && !isCollision && (
          <g
            transform={`translate(${fastNode.x}, ${fastNode.y + 42})`}
            className="pointer-events-none transition-all duration-300"
          >
            <rect
              x="-46"
              y="-12"
              width="92"
              height="22"
              rx="11"
              fill="#451a03"
              stroke="#f59e0b"
              strokeWidth="1.5"
              filter="drop-shadow(0 2px 8px rgba(245, 158, 11, 0.4))"
            />
            {/* Speed dot */}
            <circle cx="-36" cy="-1" r="3" fill="#f59e0b" className="animate-ping" />
            <text
              x="2"
              y="3"
              textAnchor="middle"
              fill="#fef3c7"
              fontSize="10"
              fontWeight="bold"
              fontFamily="monospace"
            >
              🐇 FAST (2x)
            </text>
          </g>
        )}

        {/* Combined Collision Banner */}
        {isCollision && slowNode && (
          <g
            transform={`translate(${slowNode.x}, ${slowNode.y + 44})`}
            className="pointer-events-none transition-all duration-300"
          >
            <rect
              x="-65"
              y="-13"
              width="130"
              height="24"
              rx="12"
              fill="#500724"
              stroke="#ec4899"
              strokeWidth="2"
              filter="drop-shadow(0 0 12px rgba(236, 72, 153, 0.6))"
            />
            <text
              x="0"
              y="4"
              textAnchor="middle"
              fill="#fdf2f8"
              fontSize="11"
              fontWeight="bold"
              fontFamily="monospace"
            >
              ⚡ COLLISION! (1x=2x)
            </text>
          </g>
        )}
      </svg>
    </div>
  );
};
