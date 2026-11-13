import { 
  AlgorithmSimulationResult, 
  SimulationStep 
} from '../types/simulation';
import { buildLinkedList } from './floydCycleDetection';

export interface CycleEntryOptions {
  nodeCount: number;
  cyclePos: number; // -1 for no cycle, or 0..nodeCount-1
  customLabels?: string[];
}

export function simulateCycleEntry(options: CycleEntryOptions): AlgorithmSimulationResult {
  const { nodeCount, cyclePos, customLabels } = options;
  const nodes = buildLinkedList(nodeCount, cyclePos, customLabels);

  const steps: SimulationStep[] = [];
  let totalPointerMoves = 0;

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
      explanation: 'Head is null. No cycle entry exists.',
      detailedReasoning: 'No nodes to traverse.',
      codeLine: { python: 4, cpp: 3, java: 3 },
      variables: { slow: null, fast: null },
    });
    return {
      mode: 'cycle-entry',
      nodes,
      steps,
      hasCycle: false,
      cycleEntryIndex: null,
      stats: { totalIterations: 0, totalPointerMoves: 0 }
    };
  }

  // If no cycle requested
  if (cyclePos < 0 || cyclePos >= nodeCount) {
    // Run normal detection that finds no cycle
    let slow: number | null = 0;
    let fast: number | null = 0;
    let iteration = 0;

    steps.push({
      stepIndex: 0,
      iteration: 0,
      slowIndex: slow,
      fastIndex: fast,
      prevSlowIndex: null,
      prevFastIndex: null,
      phase: 'DETECTION',
      status: 'IDLE',
      title: 'Phase 1: Detection Start',
      explanation: 'Tortoise (Slow, 1x) and Hare (Fast, 2x) placed at Head.',
      detailedReasoning: 'We must first determine if a cycle exists and locate the meeting point.',
      codeLine: { python: 6, cpp: 6, java: 6 },
      variables: { slow: 0, fast: 0, phase: 'Phase 1: Detection' },
      highlightedNodes: [0],
    });

    while (fast !== null && nodes[fast].next !== null) {
      iteration++;
      const prevSlow = slow;
      const prevFast = fast;

      slow = slow !== null ? nodes[slow].next : null;
      const fastNext: number | null = fast !== null ? nodes[fast].next : null;
      fast = fastNext !== null ? nodes[fastNext].next : null;
      totalPointerMoves += 3;

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
          title: 'No Cycle Found',
          explanation: 'Fast reached null. Without a cycle, there is no entry point.',
          detailedReasoning: 'Phase 2 cannot begin because list has no loop.',
          codeLine: { python: 13, cpp: 12, java: 12 },
          variables: { fast: null, cycleEntry: null },
          highlightedNodes: slow !== null ? [slow] : [],
        });
        break;
      }

      steps.push({
        stepIndex: steps.length,
        iteration,
        slowIndex: slow,
        fastIndex: fast,
        prevSlowIndex: prevSlow,
        prevFastIndex: prevFast,
        phase: 'DETECTION',
        status: 'RUNNING',
        title: `Phase 1: Iteration ${iteration}`,
        explanation: `Slow at [${nodes[slow!].value}], Fast at [${nodes[fast].value}].`,
        detailedReasoning: 'Advancing pointers at 1x and 2x.',
        codeLine: { python: 8, cpp: 8, java: 8 },
        variables: { slow: slow!, fast },
        highlightedNodes: [slow!, fast],
      });
    }

    return {
      mode: 'cycle-entry',
      nodes,
      steps,
      hasCycle: false,
      cycleEntryIndex: null,
      stats: { totalIterations: iteration, totalPointerMoves }
    };
  }

  // List DOES have a cycle: Run Phase 1, then Phase 2
  const mu = cyclePos; // Distance from head to cycle entry
  const lambda = nodeCount - cyclePos; // Cycle length

  let slow: number | null = 0;
  let fast: number | null = 0;
  let iteration = 0;

  // Step 0
  steps.push({
    stepIndex: steps.length,
    iteration: 0,
    slowIndex: slow,
    fastIndex: fast,
    prevSlowIndex: null,
    prevFastIndex: null,
    phase: 'DETECTION',
    status: 'IDLE',
    title: 'Phase 1: Detect Meeting Point',
    explanation: `Slow (1x) and Fast (2x) start at Head [${nodes[0].value}]. Target cycle entry is at Index ${cyclePos} ([${nodes[cyclePos].value}]).`,
    detailedReasoning: `Before finding the cycle entry, pointers must collide inside the cycle. μ = ${mu} (prefix), λ = ${lambda} (cycle length).`,
    codeLine: { python: 6, cpp: 6, java: 6 },
    variables: { slow: nodes[0].value, fast: nodes[0].value, phase: '1: Detect Collision' },
    mathNotes: { mu, lambda },
    highlightedNodes: [0],
  });

  let meetingNode: number | null = null;
  const maxIterations = nodeCount * 3 + 20;

  // Phase 1 Loop
  while (fast !== null && nodes[fast].next !== null && iteration < maxIterations) {
    iteration++;
    const prevSlow = slow;
    const prevFast = fast;

    slow = slow !== null ? nodes[slow].next : null;
    const fastNext: number | null = fast !== null ? nodes[fast].next : null;
    fast = fastNext !== null ? nodes[fastNext].next : null;
    totalPointerMoves += 3;

    if (slow !== null && fast !== null && slow === fast) {
      meetingNode = slow;
      // Calculate k: distance from cyclePos to meetingNode along cycle
      let k = (meetingNode - cyclePos + lambda) % lambda;
      
      steps.push({
        stepIndex: steps.length,
        iteration,
        slowIndex: slow,
        fastIndex: fast,
        prevSlowIndex: prevSlow,
        prevFastIndex: prevFast,
        phase: 'DETECTION',
        status: 'COLLISION',
        title: `Phase 1 Complete: Collision at [${nodes[slow].value}]!`,
        explanation: `Slow and Fast collided at Node [${nodes[slow].value}] (Index ${slow}). Meeting point locked!`,
        detailedReasoning: `Meeting point M is node ${slow}. Distance from entry k = ${k}. From proof: μ = m·λ - k. We now begin Phase 2.`,
        codeLine: { python: 11, cpp: 10, java: 10 },
        variables: { 
          'meetingNode': nodes[slow].value, 
          'k (dist from entry)': k,
          'mu (prefix len)': mu,
          'lambda (cycle len)': lambda,
        },
        mathNotes: {
          mu,
          lambda,
          k,
          equation: `μ = m·λ - k => (${mu} = 1·${lambda} - ${k})`
        },
        highlightedNodes: [slow],
      });
      break;
    }

    steps.push({
      stepIndex: steps.length,
      iteration,
      slowIndex: slow,
      fastIndex: fast,
      prevSlowIndex: prevSlow,
      prevFastIndex: prevFast,
      phase: 'DETECTION',
      status: 'RUNNING',
      title: `Phase 1: Iteration ${iteration}`,
      explanation: `Slow stepped to [${nodes[slow!].value}], Fast leaped to [${nodes[fast!].value}].`,
      detailedReasoning: `Pointers are closing the distance inside the cycle. Closing rate = 1 node / step.`,
      codeLine: { python: 8, cpp: 8, java: 8 },
      variables: { slow: nodes[slow!].value, fast: nodes[fast!].value },
      mathNotes: { mu, lambda },
      highlightedNodes: [slow!, fast!],
    });
  }

  // PHASE 2: Cycle Entry Identification
  if (meetingNode !== null) {
    let ptr1: number = 0; // Starts at head
    let ptr2: number = meetingNode; // Starts at meeting node

    const k = (meetingNode - cyclePos + lambda) % lambda;

    // Check if already matching at cycle entry (e.g. mu = 0 and meeting point is at head)
    if (ptr1 === ptr2) {
      steps.push({
        stepIndex: steps.length,
        iteration,
        slowIndex: ptr1,
        fastIndex: ptr2,
        prevSlowIndex: meetingNode,
        prevFastIndex: meetingNode,
        phase: 'COMPLETED',
        status: 'FOUND_ENTRY',
        title: `Cycle Entry Located: Node [${nodes[ptr1].value}]!`,
        explanation: `Meeting point was directly at Head/Cycle Entry [${nodes[ptr1].value}] (μ = 0).`,
        detailedReasoning: `Since the entire list is a cycle starting at head (μ = 0), the collision occurred at the entry.`,
        codeLine: { python: 21, cpp: 20, java: 20 },
        variables: { 'Cycle Entry': nodes[ptr1].value, 'Entry Index': ptr1 },
        highlightedNodes: [ptr1],
      });
      return {
        mode: 'cycle-entry',
        nodes,
        steps,
        hasCycle: true,
        cycleEntryIndex: cyclePos,
        meetingPointIndex: meetingNode,
        stats: {
          totalIterations: iteration,
          totalPointerMoves,
          cycleLength: lambda,
          nonCycleLength: mu,
        }
      };
    }

    // Transition step to Phase 2
    steps.push({
      stepIndex: steps.length,
      iteration,
      slowIndex: ptr1,
      fastIndex: ptr2,
      prevSlowIndex: meetingNode,
      prevFastIndex: meetingNode,
      phase: 'ENTRY_FINDING',
      status: 'RUNNING',
      title: 'Phase 2: Reset Pointer 1 to Head',
      explanation: `Ptr 1 (Slow) reset to Head [${nodes[0].value}]. Ptr 2 (Hare) remains at Meeting Node [${nodes[ptr2].value}]. Both will now move 1 step at a time!`,
      detailedReasoning: `Distance from Head to Entry is μ = ${mu}. Distance from Meeting Point to Entry along the loop is (λ - k) = ${lambda - k}. Because μ ≡ (λ - k) (mod λ), they will meet precisely at the entry node!`,
      codeLine: { python: 16, cpp: 15, java: 15 },
      variables: { 
        'ptr1 (Head)': nodes[0].value, 
        'ptr2 (Meeting)': nodes[ptr2].value, 
        'speed': 'Both move 1x' 
      },
      mathNotes: {
        mu,
        lambda,
        k,
        equation: `Dist(Head -> Entry) = μ (${mu}) = Dist(Meeting -> Entry) = ${lambda - k}`
      },
      highlightedNodes: [ptr1, ptr2],
    });

    let phase2Step = 0;

    // Move both 1 step until ptr1 === ptr2
    while (ptr1 !== ptr2 && phase2Step < maxIterations) {
      phase2Step++;
      iteration++;
      const prev1 = ptr1;
      const prev2 = ptr2;

      ptr1 = nodes[ptr1].next!;
      ptr2 = nodes[ptr2].next!;
      totalPointerMoves += 2;

      if (ptr1 === ptr2) {
        steps.push({
          stepIndex: steps.length,
          iteration,
          slowIndex: ptr1,
          fastIndex: ptr2,
          prevSlowIndex: prev1,
          prevFastIndex: prev2,
          phase: 'COMPLETED',
          status: 'FOUND_ENTRY',
          title: `Cycle Entry Located: Node [${nodes[ptr1].value}]!`,
          explanation: `Both pointers met at Node [${nodes[ptr1].value}] (Index ${ptr1}). This is the exact start of the cycle!`,
          detailedReasoning: `Ptr 1 walked exactly μ = ${mu} steps from Head. Ptr 2 walked μ steps from meeting point M and completed the loop to reach the entry. Mathematical certainty confirmed!`,
          codeLine: { python: 21, cpp: 20, java: 20 },
          variables: { 
            'Cycle Entry': nodes[ptr1].value, 
            'Entry Index': ptr1,
            'Algorithm': 'SUCCESS'
          },
          mathNotes: {
            mu,
            lambda,
            k,
            equation: `Collision at Node ${nodes[ptr1].value} confirms μ = ${mu}`
          },
          highlightedNodes: [ptr1],
        });
        break;
      } else {
        steps.push({
          stepIndex: steps.length,
          iteration,
          slowIndex: ptr1,
          fastIndex: ptr2,
          prevSlowIndex: prev1,
          prevFastIndex: prev2,
          phase: 'ENTRY_FINDING',
          status: 'RUNNING',
          title: `Phase 2: Step ${phase2Step} (Both 1x)`,
          explanation: `Ptr 1 moved to [${nodes[ptr1].value}], Ptr 2 moved to [${nodes[ptr2].value}].`,
          detailedReasoning: `Both pointers move synchronously at 1 step/iteration. Distance remaining to entry for Ptr 1: ${mu - phase2Step}.`,
          codeLine: { python: 18, cpp: 17, java: 17 },
          variables: { 
            'ptr1': nodes[ptr1].value, 
            'ptr2': nodes[ptr2].value,
            'stepsRemaining': mu - phase2Step
          },
          mathNotes: { mu, lambda, k },
          highlightedNodes: [ptr1, ptr2],
        });
      }
    }
  }

  return {
    mode: 'cycle-entry',
    nodes,
    steps,
    hasCycle: true,
    cycleEntryIndex: cyclePos,
    meetingPointIndex: meetingNode,
    stats: {
      totalIterations: iteration,
      totalPointerMoves,
      cycleLength: lambda,
      nonCycleLength: mu,
    }
  };
}
