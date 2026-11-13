export type AlgorithmMode = 
  | 'cycle-detection'
  | 'cycle-entry'
  | 'find-middle'
  | 'find-duplicate';

export type SimulationPhase = 
  | 'DETECTION'       // Phase 1: fast (2x) and slow (1x) running
  | 'ENTRY_FINDING'   // Phase 2: pointer from head + pointer from meeting point (1x each)
  | 'SEARCH'          // Find middle or general search
  | 'COMPLETED'       // Reached target successfully
  | 'TERMINATED';     // Terminated (e.g., null reached, no cycle)

export type SimulationStatus = 
  | 'IDLE'
  | 'RUNNING'
  | 'COLLISION'
  | 'FOUND_CYCLE'
  | 'NO_CYCLE'
  | 'FOUND_ENTRY'
  | 'FOUND_MIDDLE'
  | 'FOUND_DUPLICATE';

export interface CodeHighlight {
  python: number;
  cpp: number;
  java: number;
}

export interface SimulationStep {
  stepIndex: number;
  iteration: number;
  slowIndex: number | null;
  fastIndex: number | null;
  prevSlowIndex: number | null;
  prevFastIndex: number | null;
  phase: SimulationPhase;
  status: SimulationStatus;
  title: string;
  explanation: string;
  detailedReasoning: string;
  codeLine: CodeHighlight;
  variables: Record<string, string | number | boolean | null>;
  mathNotes?: {
    mu?: number;
    lambda?: number;
    k?: number;
    distanceSlow?: number;
    distanceFast?: number;
    equation?: string;
  };
  highlightedNodes?: number[];
  highlightedEdge?: { from: number; to: number } | null;
  middleIndex?: number | null;
  duplicateValue?: number | null;
}

export interface ListNodeItem {
  id: number;
  value: string | number;
  next: number | null;
}

export interface GraphNodeLayout {
  id: number;
  value: string | number;
  x: number;
  y: number;
  next: number | null;
  isCycleEntry?: boolean;
  isInCycle?: boolean;
  isMiddle?: boolean;
  isDuplicate?: boolean;
}

export interface AlgorithmSimulationResult {
  mode: AlgorithmMode;
  nodes: ListNodeItem[];
  steps: SimulationStep[];
  hasCycle: boolean;
  cycleEntryIndex?: number | null;
  meetingPointIndex?: number | null;
  middleIndex?: number | null;
  duplicateValue?: number | null;
  stats: {
    totalIterations: number;
    totalPointerMoves: number;
    cycleLength?: number;
    nonCycleLength?: number;
  };
}

export interface CodeTemplate {
  python: string;
  cpp: string;
  java: string;
}
