import { 
  AlgorithmSimulationResult, 
  ListNodeItem, 
  SimulationStep 
} from '../types/simulation';

export interface CycleDetectionOptions {
  nodeCount: number;
  cyclePos: number; // -1 for no cycle, or 0..nodeCount-1
  customLabels?: string[];
}

export function buildLinkedList(nodeCount: number, cyclePos: number, customLabels?: string[]): ListNodeItem[] {
  if (nodeCount <= 0) return [];
  
  const nodes: ListNodeItem[] = [];
  for (let i = 0; i < nodeCount; i++) {
    const defaultLabel = String.fromCharCode(65 + (i % 26)) + (i >= 26 ? Math.floor(i / 26) : '');
    nodes.push({
      id: i,
      value: customLabels && customLabels[i] !== undefined ? customLabels[i] : defaultLabel,
      next: i < nodeCount - 1 ? i + 1 : (cyclePos >= 0 && cyclePos < nodeCount ? cyclePos : null),
    });
  }
  return nodes;
}

export function simulateFloydCycleDetection(options: CycleDetectionOptions): AlgorithmSimulationResult {
  const { nodeCount, cyclePos, customLabels } = options;
  const nodes = buildLinkedList(nodeCount, cyclePos, customLabels);

  const steps: SimulationStep[] = [];
  let totalPointerMoves = 0;

  // Edge case: Empty list
  if (nodes.length === 0) {
    steps.push({
      stepIndex: 0,
      iteration: 0,
      slowIndex: null,
      fastIndex: null,
      prevSlowIndex: null,
      prevFastIndex: null,
      phase: 'TERMINATED',
      status: 'NO_CYCLE',
      title: 'Empty List',
      explanation: 'Head pointer is null. An empty list cannot contain a cycle.',
      detailedReasoning: 'No traversal is possible. The algorithm terminates immediately with false.',
      codeLine: { python: 4, cpp: 4, java: 4 },
      variables: { slow: null, fast: null, hasCycle: false },
    });
    return {
      mode: 'cycle-detection',
      nodes,
      steps,
      hasCycle: false,
      stats: { totalIterations: 0, totalPointerMoves: 0 }
    };
  }

  // Step 0: Initialization
  let slow: number | null = 0;
  let fast: number | null = 0;
  let iteration = 0;

  steps.push({
    stepIndex: steps.length,
    iteration: 0,
    slowIndex: slow,
    fastIndex: fast,
    prevSlowIndex: null,
    prevFastIndex: null,
    phase: 'DETECTION',
    status: 'IDLE',
    title: 'Initialize Pointers',
    explanation: `Slow (Tortoise) and Fast (Hare) both placed at Head node [${nodes[0].value}].`,
    detailedReasoning: 'Both pointers begin at the start of the linked list. The search space is initialized.',
    codeLine: { python: 5, cpp: 6, java: 6 },
    variables: { 
      'slow.val': nodes[slow].value, 
      'fast.val': nodes[fast].value,
      'iteration': 0 
    },
    highlightedNodes: [0],
  });

  let hasCycle = false;
  let meetingPointIndex: number | null = null;
  const maxIterations = nodeCount * 3 + 20; // Safeguard against infinite loops

  while (fast !== null && nodes[fast].next !== null && iteration < maxIterations) {
    iteration++;
    const prevSlow = slow;
    const prevFast = fast;

    // Slow moves 1 step
    const nextSlow: number | null = slow !== null ? nodes[slow].next : null;
    totalPointerMoves += 1;

    // Fast moves 2 steps
    const fastNext: number | null = fast !== null ? nodes[fast].next : null;
    const fastNextNext: number | null = fastNext !== null ? nodes[fastNext].next : null;
    totalPointerMoves += 2;

    slow = nextSlow;
    fast = fastNextNext;

    // Check collision
    if (slow !== null && fast !== null && slow === fast) {
      hasCycle = true;
      meetingPointIndex = slow;

      steps.push({
        stepIndex: steps.length,
        iteration,
        slowIndex: slow,
        fastIndex: fast,
        prevSlowIndex: prevSlow,
        prevFastIndex: prevFast,
        phase: 'COMPLETED',
        status: 'COLLISION',
        title: `Collision at Node [${nodes[slow].value}]!`,
        explanation: `Slow and Fast pointers converged on Node [${nodes[slow].value}] (Index ${slow}).`,
        detailedReasoning: `Because Fast moves at 2x and Slow at 1x, their relative closing speed within the cycle is 1 node per iteration. A collision is mathematically guaranteed. Cycle detected!`,
        codeLine: { python: 10, cpp: 11, java: 11 },
        variables: { 
          'slow.val': nodes[slow].value, 
          'fast.val': nodes[fast].value, 
          'slow == fast': true,
          'hasCycle': true 
        },
        highlightedNodes: [slow],
      });
      break;
    }

    // Fast reached null or fast.next reached null
    if (fast === null || nodes[fast].next === null) {
      steps.push({
        stepIndex: steps.length,
        iteration,
        slowIndex: slow,
        fastIndex: fast,
        prevSlowIndex: prevSlow,
        prevFastIndex: prevFast,
        phase: 'TERMINATED',
        status: 'NO_CYCLE',
        title: 'End of List Reached',
        explanation: fast === null 
          ? `Fast pointer reached null. No cycle exists.` 
          : `Fast pointer reached terminal Node [${nodes[fast].value}], whose next is null.`,
        detailedReasoning: 'A singly linked list with a cycle has no null-terminating node. Since Fast encountered null, the structure is strictly linear.',
        codeLine: { python: 12, cpp: 14, java: 14 },
        variables: { 
          'slow.val': slow !== null ? nodes[slow].value : null, 
          'fast': fast !== null ? nodes[fast].value : 'null', 
          'hasCycle': false 
        },
        highlightedNodes: slow !== null ? [slow] : [],
      });
      break;
    }

    // Normal running step
    steps.push({
      stepIndex: steps.length,
      iteration,
      slowIndex: slow,
      fastIndex: fast,
      prevSlowIndex: prevSlow,
      prevFastIndex: prevFast,
      phase: 'DETECTION',
      status: 'RUNNING',
      title: `Iteration ${iteration}`,
      explanation: `Slow stepped 1x to Node [${nodes[slow!].value}], Fast leaped 2x to Node [${nodes[fast].value}].`,
      detailedReasoning: `Slow advanced 1 node. Fast advanced 2 nodes. Pointers are currently at distinct locations (slow=${slow}, fast=${fast}). Traversing continues.`,
      codeLine: { python: 7, cpp: 8, java: 8 },
      variables: { 
        'slow.val': nodes[slow!].value, 
        'fast.val': nodes[fast].value,
        'slow == fast': false 
      },
      highlightedNodes: [slow!, fast],
    });
  }

  // Calculate cycle info if cycle exists
  let cycleLength: number | undefined;
  let nonCycleLength: number | undefined;
  if (cyclePos >= 0 && cyclePos < nodeCount) {
    cycleLength = nodeCount - cyclePos;
    nonCycleLength = cyclePos;
  }

  return {
    mode: 'cycle-detection',
    nodes,
    steps,
    hasCycle,
    meetingPointIndex,
    stats: {
      totalIterations: iteration,
      totalPointerMoves,
      cycleLength,
      nonCycleLength,
    }
  };
}
