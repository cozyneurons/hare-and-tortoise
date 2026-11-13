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
  
  // Deterministic collision check: only true when simulator explicitly reached COLLISION status
  const isCollision = currentStep?.status === 'COLLISION';
  const areBothOnSameNode = currentStep && currentStep.slowIndex !== null && currentStep.slowIndex === currentStep.fastIndex && !isCollision;

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
        const midY = Math.max(node.y, target.y) + 75;
        pathD = `M ${node.x} ${node.y} Q ${midX} ${midY} ${target.x} ${target.y}`;
      } else {
        pathD = `M ${node.x} ${node.y} L ${target.x} ${target.y}`;
      }

      return (
        <g key={`edge-${node.id}-${target.id}`}>
          {/* Active outline trail glow */}
          {isHighlighted && (
            <path
              d={pathD}
              fill="none"
              stroke={isSlowEdge ? '#2A9D8F' : '#E76F51'}
              strokeWidth="10"
              strokeOpacity="0.45"
            />
          )}

          {/* Base Outer Dark Conduit Cable */}
          <path
            d={pathD}
            fill="none"
            stroke="#0D1F18"
            strokeWidth={isHighlighted ? '7' : '5'}
            strokeDasharray={isBackEdge ? '6,4' : undefined}
            shapeRendering="crispEdges"
          />

          {/* Inner Core Transmission Line */}
          <path
            d={pathD}
            fill="none"
            stroke={
              isHighlighted
                ? (isSlowEdge ? '#2A9D8F' : '#E76F51')
                : '#FAF7EE'
            }
            strokeWidth={isHighlighted ? '4' : '2.5'}
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
      {/* Lab Monitor Frame Header */}
      <div className="absolute top-0 left-0 right-0 h-9 bg-gb-olive border-b-3 border-gb-ink px-3 flex items-center justify-between text-xs sm:text-[13px] font-pixel text-gb-cream z-10 shadow-sm font-bold">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-retro-success border border-gb-ink animate-pulse" />
          <span className="font-bold tracking-wide">RESEARCH MONITOR // V-64</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gb-pale">
            MODE: {mode.toUpperCase().replace('-', ' ')}
          </span>
          <span className="px-2 py-0.5 bg-gb-forest border border-gb-ink text-xs text-hare font-bold">
            LIVE LCD
          </span>
        </div>
      </div>

      {/* Array tape for Find Duplicate Mode (Styled as Poké-Ball Item Belt) */}
      {mode === 'find-duplicate' && numsArray.length > 0 && (
        <div className="absolute top-11 left-3 right-3 z-10 flex flex-wrap items-center justify-between gap-1 p-2 bg-gb-cream border-2 border-gb-ink shadow-pixel-sm">
          <div className="font-pixel text-xs sm:text-[13px] text-gb-ink font-bold">
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
                  className={`flex flex-col items-center px-2 py-0.5 border-2 border-gb-ink font-pixel text-xs transition-all ${
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
                  <span className="text-[9px] opacity-75">#{idx}</span>
                  <span className="font-bold">{val}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Main SVG Visualization Screen */}
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-full max-h-[500px] select-none mt-9 bg-gb-cream"
        shapeRendering="crispEdges"
      >
        <defs>
          {/* Tactical Game Boy Dot Matrix Screen Pattern */}
          <pattern id="monitor-grid-dots" width="20" height="20" patternUnits="userSpaceOnUse">
            <rect x="0" y="0" width="20" height="20" fill="#FAF7EE" />
            <circle cx="2" cy="2" r="1.5" fill="#D8CCA8" opacity="0.65" />
          </pattern>

          {/* Standard High-Contrast Conduit Arrow */}
          <marker
            id="arrow-retro"
            viewBox="0 0 12 12"
            refX="30"
            refY="6"
            markerWidth="8"
            markerHeight="8"
            orient="auto-start-reverse"
          >
            <path d="M 1 2 L 10 6 L 1 10 z" fill="#0D1F18" stroke="#0D1F18" strokeWidth="1" />
            <path d="M 2 4 L 7 6 L 2 8 z" fill="#FAF7EE" />
          </marker>

          {/* Active Highlight Conduit Arrow */}
          <marker
            id="arrow-retro-active"
            viewBox="0 0 12 12"
            refX="30"
            refY="6"
            markerWidth="9"
            markerHeight="9"
            orient="auto-start-reverse"
          >
            <path d="M 1 2 L 10 6 L 1 10 z" fill="#0D1F18" stroke="#0D1F18" strokeWidth="1.5" />
            <path d="M 2 4 L 7 6 L 2 8 z" fill="#E9C46A" />
          </marker>
        </defs>

        {/* Crisp LCD Screen Ground */}
        <rect width={width} height={height} fill="url(#monitor-grid-dots)" />

        {/* Directed Conduit Paths */}
        {renderEdges()}

        {/* Null Terminator for non-cyclic lists (Rendered as dead-end road sign) */}
        {mode !== 'find-duplicate' && (cyclePos === null || cyclePos < 0) && layoutNodes.length > 0 && (
          <g transform={`translate(${layoutNodes[layoutNodes.length - 1].x + 75}, ${layoutNodes[layoutNodes.length - 1].y})`}>
            {/* Conduit to NULL */}
            <line x1="-45" y1="0" x2="-8" y2="0" stroke="#0D1F18" strokeWidth="5" strokeDasharray="4,4" />
            <line x1="-45" y1="0" x2="-8" y2="0" stroke="#FAF7EE" strokeWidth="2" strokeDasharray="4,4" />
            {/* 3D Drop Shadow */}
            <rect x="-4" y="-14" width="56" height="28" fill="#0D1F18" />
            {/* Outer Sign Frame */}
            <rect x="-6" y="-16" width="56" height="28" fill="#F2E8CF" stroke="#0D1F18" strokeWidth="3" />
            <rect x="-4" y="-14" width="52" height="24" fill="#FFFFFF" />
            <text x="22" y="1" textAnchor="middle" fill="#E63946" fontSize="9" fontWeight="bold" fontFamily="'Press Start 2P', monospace">
              NULL
            </text>
          </g>
        )}

        {/* Nodes (Rendered as 100% Solid Foreground 3D Stepping Stone Poké-Platforms) */}
        {layoutNodes.map(node => {
          const isSlowOnNode = currentStep?.slowIndex === node.id;
          const isFastOnNode = currentStep?.fastIndex === node.id;
          const isCycleEntry = node.isCycleEntry;
          const isMiddle = mode === 'find-middle' && currentStep?.status === 'FOUND_MIDDLE' && currentStep?.middleIndex === node.id;
          const isDup = mode === 'find-duplicate' && currentStep?.status === 'FOUND_DUPLICATE' && currentStep?.duplicateValue === node.id;

          // Solid Opaque Styling
          let fillColor = '#FFFFFF';
          let borderColor = '#0D1F18';
          let headerBg = '#386641';
          let borderWidth = 3;

          if (isSlowOnNode && isFastOnNode) {
            borderColor = '#E63946';
            headerBg = '#E63946';
            borderWidth = 4;
          } else if (isSlowOnNode) {
            borderColor = '#2A9D8F';
            headerBg = '#2A9D8F';
            borderWidth = 4;
          } else if (isFastOnNode) {
            borderColor = '#E76F51';
            headerBg = '#E76F51';
            borderWidth = 4;
          }

          if (isDup) {
            fillColor = '#FFF2B2';
            if (!isSlowOnNode && !isFastOnNode) {
              borderColor = '#E76F51';
              headerBg = '#E76F51';
            }
          } else if (isMiddle) {
            fillColor = '#E3F8C4';
            if (!isSlowOnNode && !isFastOnNode) {
              borderColor = '#38B000';
              headerBg = '#38B000';
            }
          } else if (isCycleEntry) {
            fillColor = '#FDE6B0';
            if (!isSlowOnNode && !isFastOnNode) {
              borderColor = '#E63946';
              headerBg = '#E63946';
            }
          } else if (node.isInCycle) {
            fillColor = '#FAF7EE';
          }

          return (
            <g
              key={`node-${node.id}`}
              transform={`translate(${node.x}, ${node.y})`}
              className="cursor-pointer"
            >
              {/* Layer 1: Solid 3D Pixel Drop Shadow (Offset +4px in X and Y) */}
              <rect x="-22" y="-22" width="52" height="52" fill="#0D1F18" />

              {/* Layer 2: Main Solid Platform Face */}
              <rect
                x="-26"
                y="-26"
                width="52"
                height="52"
                fill={fillColor}
                stroke={borderColor}
                strokeWidth={borderWidth}
              />

              {/* Layer 3: 3D Pixel Bevel Highlights */}
              <rect x="-24" y="-24" width="48" height="2" fill="#FFFFFF" opacity="0.9" />
              <rect x="-24" y="-24" width="2" height="48" fill="#FFFFFF" opacity="0.9" />
              <rect x="-24" y="22" width="48" height="2" fill="#D0C4A0" />
              <rect x="22" y="-24" width="2" height="48" fill="#D0C4A0" />

              {/* Layer 4: Node ID Header Banner */}
              <rect
                x="-24"
                y="-24"
                width="48"
                height="13"
                fill={headerBg}
              />
              <text
                x="0"
                y="-15"
                textAnchor="middle"
                fill="#FFFFFF"
                fontSize="7.5"
                fontWeight="bold"
                fontFamily="'Press Start 2P', monospace"
              >
                #{node.id}
              </text>

              {/* Layer 5: Bold Centered Node Value */}
              <text
                x="0"
                y="14"
                textAnchor="middle"
                fill="#0D1F18"
                fontSize="15"
                fontWeight="bold"
                fontFamily="'Press Start 2P', monospace"
              >
                {node.value}
              </text>

              {/* Badges: Cycle Entry / Middle / Duplicate */}
              {isCycleEntry && (
                <g transform="translate(0, -36)">
                  <rect x="-35" y="-9" width="70" height="18" fill="#0D1F18" />
                  <rect x="-37" y="-11" width="70" height="18" fill="#E63946" stroke="#0D1F18" strokeWidth="2" />
                  <text textAnchor="middle" dy="3" fill="#FFFFFF" fontSize="8" fontWeight="bold" fontFamily="'Press Start 2P', monospace">
                    ENTRY μ
                  </text>
                </g>
              )}

              {isMiddle && (
                <g transform="translate(0, -36)">
                  <rect x="-37" y="-9" width="74" height="18" fill="#0D1F18" />
                  <rect x="-39" y="-11" width="74" height="18" fill="#38B000" stroke="#0D1F18" strokeWidth="2" />
                  <text textAnchor="middle" dy="3" fill="#FFFFFF" fontSize="8" fontWeight="bold" fontFamily="'Press Start 2P', monospace">
                    MIDDLE!
                  </text>
                </g>
              )}

              {isDup && (
                <g transform="translate(0, -36)">
                  <rect x="-40" y="-9" width="80" height="18" fill="#0D1F18" />
                  <rect x="-42" y="-11" width="80" height="18" fill="#E9C46A" stroke="#0D1F18" strokeWidth="2" />
                  <text textAnchor="middle" dy="3" fill="#0D1F18" fontSize="8" fontWeight="bold" fontFamily="'Press Start 2P', monospace">
                    DUPE VAL!
                  </text>
                </g>
              )}
            </g>
          );
        })}

        {/* Collision Animation (Pixel Starburst & Banner) */}
        {isCollision && slowNode && (
          <g transform={`translate(${slowNode.x}, ${slowNode.y})`}>
            {/* Native SVG Starburst Flash centering on the collision node */}
            <PixelCollisionBurst size={64} x={-32} y={-32} />

            {/* Concentric Energy Rings */}
            <circle r="30" fill="none" stroke="#E63946" strokeWidth="2" strokeDasharray="4,3" opacity="0.85" />
            
            {/* Elevated Collision Dialogue Box - Placed cleanly above or below to avoid any overlap */}
            <g transform={`translate(0, ${slowNode.y < 100 ? 62 : -72})`}>
              <rect x="-80" y="-13" width="160" height="26" fill="#0D1F18" />
              <rect x="-82" y="-15" width="160" height="26" fill="#FAF5E6" stroke="#E63946" strokeWidth="2.5" />
              <text x="0" y="3" textAnchor="middle" fill="#E63946" fontSize="9" fontWeight="bold" fontFamily="'Press Start 2P', monospace">
                ★ COLLISION! ★
              </text>
            </g>
          </g>
        )}

        {/* Tortoise Pixel Character Sprite Marker (Slow 1x) */}
        {slowNode && (
          <g
            transform={`translate(${
              isCollision
                ? slowNode.x - 38
                : areBothOnSameNode
                ? slowNode.x - 36
                : slowNode.x
            }, ${
              isCollision
                ? slowNode.y - 20
                : slowNode.y - 48
            })`}
            className="transition-all duration-300"
          >
            {/* Native SVG Tortoise Sprite */}
            <PixelTortoiseSprite size={30} x={-15} y={-30} />
            {/* Tortoise Label Tag */}
            <rect x="-28" y="2" width="56" height="16" fill="#0D1F18" />
            <rect x="-30" y="0" width="56" height="16" fill="#2A9D8F" stroke="#0D1F18" strokeWidth="2" />
            <text x="-2" y="11" textAnchor="middle" fill="#FFFFFF" fontSize="8" fontWeight="bold" fontFamily="'Press Start 2P', monospace">
              SLOW 1x
            </text>
          </g>
        )}

        {/* Hare Pixel Character Sprite Marker (Fast 2x) */}
        {fastNode && (
          <g
            transform={`translate(${
              isCollision
                ? fastNode.x + 38
                : areBothOnSameNode
                ? fastNode.x + 36
                : fastNode.x
            }, ${
              isCollision
                ? fastNode.y - 20
                : areBothOnSameNode
                ? fastNode.y - 48
                : fastNode.y - 48
            })`}
            className="transition-all duration-300"
          >
            {/* Native SVG Hare Sprite */}
            <PixelHareSprite size={30} x={-15} y={-30} />
            {/* Hare Label Tag */}
            <rect x="-28" y="2" width="56" height="16" fill="#0D1F18" />
            <rect x="-30" y="0" width="56" height="16" fill="#E76F51" stroke="#0D1F18" strokeWidth="2" />
            <text x="-2" y="11" textAnchor="middle" fill="#FFFFFF" fontSize="8" fontWeight="bold" fontFamily="'Press Start 2P', monospace">
              FAST 2x
            </text>
          </g>
        )}
      </svg>
    </div>
  );
};
