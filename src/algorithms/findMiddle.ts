import { 
  AlgorithmSimulationResult, 
  ListNodeItem, 
  SimulationStep 
} from '../types/simulation';

export type MiddleConvention = 'second' | 'first';

export interface FindMiddleOptions {
  nodeCount: number;
  convention?: MiddleConvention;
  customLabels?: string[];
}

export function simulateFindMiddle(options: FindMiddleOptions): AlgorithmSimulationResult {
  const { nodeCount, convention = 'second', customLabels } = options;

  // Build linear list (no cycle)
  const nodes: ListNodeItem[] = [];
  for (let i = 0; i < nodeCount; i++) {
    const defaultLabel = String.fromCharCode(65 + (i % 26)) + (i >= 26 ? Math.floor(i / 26) : '');
    nodes.push({
      id: i,
      value: customLabels && customLabels[i] !== undefined ? customLabels[i] : defaultLabel,
      next: i < nodeCount - 1 ? i + 1 : null,
    });
  }

  const steps: SimulationStep[] = [];
  let totalPointerMoves = 0;

  if (nodeCount === 0) {
    steps.push({
      stepIndex: 0,
      iteration: 0,
      slowIndex: null,
      fastIndex: null,
      prevSlowIndex: null,
      prevFastIndex: null,
      phase: 'TERMINATED',
      status: 'FOUND_MIDDLE',
      title: 'Empty List',
      explanation: 'List contains 0 nodes. Middle is null.',
      detailedReasoning: 'No nodes present.',
      codeLine: { python: 2, cpp: 2, java: 2 },
      variables: { slow: null, fast: null, middle: null },
    });
    return {
      mode: 'find-middle',
      nodes,
      steps,
      hasCycle: false,
      middleIndex: null,
      stats: { totalIterations: 0, totalPointerMoves: 0 }
    };
  }

  let slow: number | null = 0;
  let fast: number | null = 0;
  let iteration = 0;

  // Initialization step
  steps.push({
    stepIndex: 0,
    iteration: 0,
    slowIndex: slow,
    fastIndex: fast,
    prevSlowIndex: null,
    prevFastIndex: null,
    phase: 'SEARCH',
    status: 'IDLE',
    title: 'Initialize Pointers at Head',
    explanation: `Slow and Fast placed at Head [${nodes[0].value}]. List length = ${nodeCount} (${nodeCount % 2 === 0 ? 'EVEN' : 'ODD'}).`,
    detailedReasoning: `Convention: "${convention.toUpperCase()} middle node" for even lengths. When Fast advances 2 steps for every 1 step of Slow, Slow travels exactly half the total distance.`,
    codeLine: { python: 5, cpp: 4, java: 4 },
    variables: { 
      'slow': nodes[0].value, 
      'fast': nodes[0].value, 
      'listLength': nodeCount, 
      'parity': nodeCount % 2 === 0 ? 'EVEN' : 'ODD' 
    },
    highlightedNodes: [0],
  });

  if (convention === 'second') {
    // Second middle condition: while (fast !== null && nodes[fast].next !== null)
    while (fast !== null && nodes[fast].next !== null) {
      iteration++;
      const prevSlow = slow;
      const prevFast = fast;

      slow = slow !== null ? nodes[slow].next : null;
      const fastNext: number | null = fast !== null ? nodes[fast].next : null;
      fast = fastNext !== null ? nodes[fastNext].next : null;
      totalPointerMoves += 3;

      const isFinished = fast === null || nodes[fast].next === null;

      if (isFinished) {
        steps.push({
          stepIndex: steps.length,
          iteration,
          slowIndex: slow,
          fastIndex: fast,
          prevSlowIndex: prevSlow,
          prevFastIndex: prevFast,
          phase: 'COMPLETED',
          status: 'FOUND_MIDDLE',
          middleIndex: slow,
          title: `Middle Found: Node [${nodes[slow!].value}]!`,
          explanation: fast === null
            ? `Fast stepped beyond tail into null (even length). Slow is at Node [${nodes[slow!].value}] (Index ${slow}).`
            : `Fast reached tail Node [${nodes[fast].value}] (odd length). Slow is at Node [${nodes[slow!].value}] (Index ${slow}).`,
          detailedReasoning: `List length is ${nodeCount}. Slow traveled $\\lfloor ${nodeCount} / 2 \\rfloor = ${slow}$ steps. Node [${nodes[slow!].value}] is the exact mathematical middle (${nodeCount % 2 === 0 ? 'second middle for even length' : 'exact middle'}).`,
          codeLine: { python: 11, cpp: 10, java: 10 },
          variables: { 
            'middleNode': nodes[slow!].value, 
            'middleIndex': slow, 
            'fast': fast !== null ? nodes[fast].value : 'null',
            'isEven': nodeCount % 2 === 0 
          },
          highlightedNodes: [slow!],
        });
        break;
      } else {
        steps.push({
          stepIndex: steps.length,
          iteration,
          slowIndex: slow,
          fastIndex: fast,
          prevSlowIndex: prevSlow,
          prevFastIndex: prevFast,
          phase: 'SEARCH',
          status: 'RUNNING',
          title: `Iteration ${iteration}`,
          explanation: `Slow stepped to [${nodes[slow!].value}], Fast leaped to [${nodes[fast!].value}].`,
          detailedReasoning: `Slow has traversed ${iteration} node(s); Fast has traversed ${iteration * 2} nodes. Fast is twice as far as Slow.`,
          codeLine: { python: 8, cpp: 7, java: 7 },
          variables: { 
            'slow': nodes[slow!].value, 
            'fast': nodes[fast!].value,
            'slowDistance': iteration,
            'fastDistance': iteration * 2 
          },
          highlightedNodes: [slow!, fast!],
        });
      }
    }
  } else {
    // First middle condition: while (fast.next !== null && fast.next.next !== null)
    while (fast !== null && nodes[fast].next !== null && nodes[nodes[fast].next!].next !== null) {
      iteration++;
      const prevSlow = slow;
      const prevFast = fast;

      slow = slow !== null ? nodes[slow].next : null;
      const fastNext: number | null = fast !== null ? nodes[fast].next : null;
      fast = fastNext !== null ? nodes[fastNext].next : null;
      totalPointerMoves += 3;

      steps.push({
        stepIndex: steps.length,
        iteration,
        slowIndex: slow,
        fastIndex: fast,
        prevSlowIndex: prevSlow,
        prevFastIndex: prevFast,
        phase: 'SEARCH',
        status: 'RUNNING',
        title: `Iteration ${iteration}`,
        explanation: `Slow stepped to [${nodes[slow!].value}], Fast leaped to [${nodes[fast!].value}].`,
        detailedReasoning: `Fast is two steps ahead for every step of Slow.`,
        codeLine: { python: 8, cpp: 7, java: 7 },
        variables: { slow: nodes[slow!].value, fast: nodes[fast!].value },
        highlightedNodes: [slow!, fast!],
      });
    }

    // Final completion step for first middle convention
    steps.push({
      stepIndex: steps.length,
      iteration: iteration + 1,
      slowIndex: slow,
      fastIndex: fast,
      prevSlowIndex: slow,
      prevFastIndex: fast,
      phase: 'COMPLETED',
      status: 'FOUND_MIDDLE',
      middleIndex: slow,
      title: `First Middle Found: Node [${nodes[slow!].value}]!`,
      explanation: `Fast cannot advance two steps further without hitting null. Slow stops at first middle Node [${nodes[slow!].value}] (Index ${slow}).`,
      detailedReasoning: `For length ${nodeCount}, first middle is index $\\lfloor (${nodeCount}-1)/2 \\rfloor = ${slow}$.`,
      codeLine: { python: 11, cpp: 10, java: 10 },
      variables: { 'firstMiddleNode': nodes[slow!].value, 'middleIndex': slow },
      highlightedNodes: [slow!],
    });
  }

  return {
    mode: 'find-middle',
    nodes,
    steps,
    hasCycle: false,
    middleIndex: slow,
    stats: {
      totalIterations: iteration,
      totalPointerMoves,
    }
  };
}
