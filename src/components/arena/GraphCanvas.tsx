import React, { useMemo } from 'react';
import { 
  AlgorithmMode, 
  GraphNodeLayout, 
  ListNodeItem, 
  SimulationStep 
} from '../../types/simulation';
import { computeFunctionalGraphLayout, computeGraphLayout } from '../../utils/graphLayout';
import { PixelHareSprite, PixelTortoiseSprite, PixelCollisionBurst } from '../pixel/PixelSprites';

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

  const nodeMap = useMemo(() => {
    const map = new Map<number, GraphNodeLayout>();
    layoutNodes.forEach(n => map.set(n.id, n));
    return map;
  }, [layoutNodes]);

  const slowNode = currentStep && currentStep.slowIndex !== null ? nodeMap.get(currentStep.slowIndex) : null;
  const fastNode = currentStep && currentStep.fastIndex !== null ? nodeMap.get(currentStep.fastIndex) : null;
  const isCollision = currentStep && currentStep.slowIndex !== null && currentStep.slowIndex === currentStep.fastIndex;

  // Render edge paths
  const renderEdges = () => {
    return layoutNodes.map(node => {
      if (node.next === null) return null;
      const target = nodeMap.get(node.next);
      if (!target) return null;

      const isSlowEdge = currentStep && currentStep.prevSlowIndex === node.id && currentStep.slowIndex === target.id;
      const isFastEdge = currentStep && currentStep.prevFastIndex === node.id && currentStep.fastIndex === target.id;
      const isHighlighted = isSlowEdge || isFastEdge;
      const isBackEdge = node.id >= target.id && node.isInCycle && target.isInCycle;

      let pathD = '';
      if (mode === 'find-duplicate') {
        const dx = target.x - node.x;
        const midX = (node.x + target.x) / 2;
        const arcHeight = Math.min(90, Math.max(35, Math.abs(dx) * 0.45));
        const curveY = dx > 0 ? node.y - arcHeight : node.y + arcHeight;
        pathD = `M ${node.x} ${node.y} Q ${midX} ${curveY} ${target.x} ${target.y}`;
      } else if (isBackEdge) {
        const midX = (node.x + target.x) / 2;
        const midY = Math.max(node.y, target.y) + 70;
        pathD = `M ${node.x} ${node.y} Q ${midX} ${midY} ${target.x} ${target.y}`;
      } else {
        pathD = `M ${node.x} ${node.y} L ${target.x} ${target.y}`;
      }

      return (
        <g key={`edge-${node.id}-${target.id}`}>
          {/* Active outline trail */}
          {isHighlighted && (
            <path
              d={pathD}
              fill="none"
              stroke={isSlowEdge ? '#2A9D8F' : '#E76F51'}
              strokeWidth="8"
              strokeOpacity="0.4"
            />
          )}
          {/* Base Pixel Cable / Conduit */}
          <path
            d={pathD}
            fill="none"
            stroke={isHighlighted ? (isSlowEdge ? '#2A9D8F' : '#E76F51') : '#0D1F18'}
            strokeWidth={isHighlighted ? '4' : '3'}
            strokeDasharray={isBackEdge ? '6,4' : undefined}
            markerEnd={isHighlighted ? 'url(#arrow-retro-active)' : 'url(#arrow-retro)'}
            shapeRendering="crispEdges"
          />
        </g>
      );
    });
  };

  return (
    <div className="relative w-full h-full min-h-[380px] flex flex-col justify-center items-center bg-gb-forest border-4 border-gb-ink shadow-pixel rounded-none overflow-hidden select-none">
      {/* Laboratory Flooring Background */}
      <div className="absolute inset-0 lab-floor opacity-65 pointer-events-none" />

      {/* Lab Monitor Frame Header */}
      <div className="absolute top-0 left-0 right-0 h-7 bg-gb-olive border-b-2 border-gb-ink px-3 flex items-center justify-between text-[9px] font-pixel text-gb-cream z-10">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-retro-success border border-gb-ink animate-pulse" />
          <span>RESEARCH MONITOR // V-64</span>
        </div>
        <div className="text-gb-pale">
          MODE: {mode.toUpperCase().replace('-', ' ')}
        </div>
      </div>

      {/* Array tape for Find Duplicate Mode (Styled as Poké-Ball Item Belt) */}
      {mode === 'find-duplicate' && numsArray.length > 0 && (
        <div className="absolute top-9 left-3 right-3 z-10 flex flex-wrap items-center justify-between gap-1 p-2 bg-gb-cream border-2 border-gb-ink shadow-pixel-sm">
          <div className="font-pixel text-[9px] text-gb-ink">
            POKÉ-BELT (ARRAY): <span className="text-hare">SLOT[i] &rarr; VAL</span>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
            {numsArray.map((val, idx) => {
              const isSlow = currentStep?.slowIndex === idx;
              const isFast = currentStep?.fastIndex === idx;
              const isDup = currentStep?.status === 'FOUND_DUPLICATE' && currentStep?.slowIndex === idx;

              return (
                <div
                  key={`belt-${idx}`}
                  className={`flex flex-col items-center px-1.5 py-0.5 border-2 border-gb-ink font-pixel text-[9px] transition-all ${
                    isDup
                      ? 'bg-retro-warning text-gb-ink font-bold animate-bounce-pixel'
                      : isSlow && isFast
                      ? 'bg-retro-purple text-white'
                      : isSlow
                      ? 'bg-tortoise text-white'
                      : isFast
                      ? 'bg-hare text-white'
                      : 'bg-gb-surface text-gb-ink'
                  }`}
                >
                  <span className="text-[7px] opacity-75">#{idx}</span>
                  <span className="font-bold">{val}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Main SVG Visualization */}
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-full max-h-[500px] select-none mt-4"
        shapeRendering="crispEdges"
      >
        <defs>
          <marker
            id="arrow-retro"
            viewBox="0 0 10 10"
            refX="22"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 8 5 L 0 9 z" fill="#0D1F18" />
          </marker>
          <marker
            id="arrow-retro-active"
            viewBox="0 0 10 10"
            refX="22"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 8 5 L 0 9 z" fill="#E9C46A" />
          </marker>
        </defs>

        {/* Directed Paths */}
        {renderEdges()}

        {/* Null Terminator for non-cyclic lists (Rendered as dead-end road sign) */}
        {mode !== 'find-duplicate' && (cyclePos === null || cyclePos < 0) && layoutNodes.length > 0 && (
          <g transform={`translate(${layoutNodes[layoutNodes.length - 1].x + 65}, ${layoutNodes[layoutNodes.length - 1].y})`}>
            <line x1="-35" y1="0" x2="-8" y2="0" stroke="#0D1F18" strokeWidth="3" strokeDasharray="4,4" />
            <rect x="-6" y="-12" width="44" height="24" fill="#0D1F18" stroke="#0D1F18" strokeWidth="2" />
            <rect x="-4" y="-10" width="40" height="20" fill="#F2E8CF" />
            <text x="16" y="4" textAnchor="middle" fill="#0D1F18" fontSize="9" fontFamily="'Press Start 2P', monospace">
              NULL
            </text>
          </g>
        )}

        {/* Nodes (Rendered as Stepping Stone Poké-Platforms) */}
        {layoutNodes.map(node => {
          const isSlowOnNode = currentStep?.slowIndex === node.id;
          const isFastOnNode = currentStep?.fastIndex === node.id;
          const isCycleEntry = node.isCycleEntry;
          const isMiddle = mode === 'find-middle' && currentStep?.status === 'FOUND_MIDDLE' && currentStep?.middleIndex === node.id;
          const isDup = mode === 'find-duplicate' && currentStep?.status === 'FOUND_DUPLICATE' && currentStep?.duplicateValue === node.id;

          let fillColor = '#F2E8CF';
          let borderColor = '#0D1F18';

          if (isSlowOnNode && isFastOnNode) {
            borderColor = '#E63946';
          } else if (isSlowOnNode) {
            borderColor = '#2A9D8F';
          } else if (isFastOnNode) {
            borderColor = '#E76F51';
          }

          if (isDup || isMiddle) {
            fillColor = '#A7C957';
          } else if (isCycleEntry) {
            fillColor = '#F4A261';
          } else if (node.isInCycle) {
            fillColor = '#FAF5E6';
          }

          return (
            <g
              key={`node-${node.id}`}
              transform={`translate(${node.x}, ${node.y})`}
              className="cursor-pointer"
            >
              {/* Outer platform shadow */}
              <rect x="-20" y="-20" width="44" height="44" fill="#0D1F18" />

              {/* Main square tile platform */}
              <rect
                x="-22"
                y="-22"
                width="40"
                height="40"
                fill={fillColor}
                stroke={borderColor}
                strokeWidth={isSlowOnNode || isFastOnNode ? 4 : 3}
              />

              {/* Inner bevel corner pixels */}
              <rect x="-19" y="-19" width="3" height="3" fill="#FFFFFF" />
              <rect x="13" y="13" width="3" height="3" fill="#D8CCA8" />

              {/* Node ID label top-left */}
              <text
                x="-14"
                y="-10"
                fill="#386641"
                fontSize="7"
                fontFamily="'Press Start 2P', monospace"
              >
                #{node.id}
              </text>

              {/* Node Value in Center */}
              <text
                textAnchor="middle"
                dy="8"
                fill="#0D1F18"
                fontSize="12"
                fontWeight="bold"
                fontFamily="'Press Start 2P', monospace"
              >
                {node.value}
              </text>

              {/* Entry / Middle / Duplicate Badges */}
              {isCycleEntry && (
                <g transform="translate(0, -32)">
                  <rect x="-28" y="-7" width="56" height="14" fill="#E63946" stroke="#0D1F18" strokeWidth="2" />
                  <text textAnchor="middle" dy="4" fill="#FFFFFF" fontSize="7" fontFamily="'Press Start 2P', monospace">
                    ENTRY &mu;
                  </text>
                </g>
              )}

              {isMiddle && (
                <g transform="translate(0, -32)">
                  <rect x="-30" y="-7" width="60" height="14" fill="#38B000" stroke="#0D1F18" strokeWidth="2" />
                  <text textAnchor="middle" dy="4" fill="#FFFFFF" fontSize="7" fontFamily="'Press Start 2P', monospace">
                    MIDDLE!
                  </text>
                </g>
              )}

              {isDup && (
                <g transform="translate(0, -32)">
                  <rect x="-34" y="-7" width="68" height="14" fill="#E9C46A" stroke="#0D1F18" strokeWidth="2" />
                  <text textAnchor="middle" dy="4" fill="#0D1F18" fontSize="7" fontFamily="'Press Start 2P', monospace">
                    DUPE VAL!
                  </text>
                </g>
              )}
            </g>
          );
        })}

        {/* Collision Animation (Pixel Starburst) */}
        {isCollision && slowNode && (
          <g transform={`translate(${slowNode.x}, ${slowNode.y})`}>
            <foreignObject x="-24" y="-24" width="48" height="48">
              <PixelCollisionBurst size={48} />
            </foreignObject>
            <rect x="-65" y="-38" width="130" height="22" fill="#FAF5E6" stroke="#0D1F18" strokeWidth="3" />
            <text x="0" y="-23" textAnchor="middle" fill="#E63946" fontSize="8" fontFamily="'Press Start 2P', monospace">
              ★ COLLISION! ★
            </text>
          </g>
        )}

        {/* Tortoise Pixel Character Sprite Marker (Slow 1x) */}
        {slowNode && (
          <g
            transform={`translate(${slowNode.x}, ${slowNode.y + (isCollision ? -48 : -44)})`}
            className="transition-all duration-300"
          >
            <foreignObject x="-14" y="-26" width="28" height="28">
              <PixelTortoiseSprite size={28} />
            </foreignObject>
            <rect x="-34" y="-8" width="68" height="16" fill="#2A9D8F" stroke="#0D1F18" strokeWidth="2" />
            <text x="0" y="3" textAnchor="middle" fill="#FFFFFF" fontSize="7" fontFamily="'Press Start 2P', monospace">
              SLOW 1x
            </text>
          </g>
        )}

        {/* Hare Pixel Character Sprite Marker (Fast 2x) */}
        {fastNode && !isCollision && (
          <g
            transform={`translate(${fastNode.x}, ${fastNode.y + 38})`}
            className="transition-all duration-300"
          >
            <foreignObject x="-14" y="10" width="28" height="28">
              <PixelHareSprite size={28} />
            </foreignObject>
            <rect x="-34" y="-6" width="68" height="16" fill="#E76F51" stroke="#0D1F18" strokeWidth="2" />
            <text x="0" y="5" textAnchor="middle" fill="#FFFFFF" fontSize="7" fontFamily="'Press Start 2P', monospace">
              FAST 2x
            </text>
          </g>
        )}
      </svg>
    </div>
  );
};
