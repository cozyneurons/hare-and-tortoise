import { 
  AlgorithmSimulationResult, 
  ListNodeItem, 
  SimulationStep 
} from '../types/simulation';

export interface FindDuplicateValidationResult {
  isValid: boolean;
  error?: string;
  n?: number;
}

export function validateDuplicateArray(nums: number[]): FindDuplicateValidationResult {
  if (!Array.isArray(nums) || nums.length < 2) {
    return { isValid: false, error: 'Array must contain at least 2 elements (n + 1 >= 2).' };
  }
  const n = nums.length - 1;
  for (let i = 0; i < nums.length; i++) {
    const val = nums[i];
    if (!Number.isInteger(val)) {
      return { isValid: false, error: `Value at index ${i} (${val}) must be an integer.` };
    }
    if (val < 1 || val > n) {
      return { 
        isValid: false, 
        error: `Value ${val} at index ${i} is outside valid range [1, ${n}]. Array length is ${nums.length} (n = ${n}).` 
      };
    }
  }
  return { isValid: true, n };
}

export function simulateFindDuplicate(nums: number[]): AlgorithmSimulationResult {
  const validation = validateDuplicateArray(nums);
  if (!validation.isValid) {
    throw new Error(validation.error || 'Invalid array for Floyd duplicate detection.');
  }

  // Construct functional graph nodes:
  // Node 0 -> nums[0], Node 1 -> nums[1], ...
  const nodes: ListNodeItem[] = nums.map((val, idx) => ({
    id: idx,
    value: `idx[${idx}]:${val}`,
    next: val < nums.length ? val : null,
  }));

  const steps: SimulationStep[] = [];
  let totalPointerMoves = 0;

  // Initial State: Head at index 0
  let slow = nums[0];
  let fast = nums[nums[0]];
  let iteration = 1;
  totalPointerMoves = 3;

  steps.push({
    stepIndex: 0,
    iteration: 0,
    slowIndex: 0,
    fastIndex: 0,
    prevSlowIndex: null,
    prevFastIndex: null,
    phase: 'DETECTION',
    status: 'IDLE',
    title: 'Functional Graph Mapped: Start at Index 0',
    explanation: `Array of length ${nums.length} mapped to functional graph i → nums[i]. Pointers begin at head Index 0.`,
    detailedReasoning: `Because elements are in range [1, n], no element points to Index 0. Index 0 is a guaranteed entry point into the graph component containing the cycle.`,
    codeLine: { python: 4, cpp: 4, java: 4 },
    variables: { 
      'array': JSON.stringify(nums), 
      'n': validation.n!, 
      'start': `idx 0 -> ${nums[0]}` 
    },
    highlightedNodes: [0],
  });

  // Step 1: Advance slow 1 step (to nums[0]) and fast 2 steps (to nums[nums[0]])
  steps.push({
    stepIndex: 1,
    iteration: 1,
    slowIndex: slow,
    fastIndex: fast,
    prevSlowIndex: 0,
    prevFastIndex: 0,
    phase: 'DETECTION',
    status: 'RUNNING',
    title: 'Phase 1: First Leap',
    explanation: `Slow stepped 1x to Index ${slow} (nums[0] = ${slow}). Fast leaped 2x to Index ${fast} (nums[nums[0]] = ${fast}).`,
    detailedReasoning: `Fast travels along the array values twice as fast as Slow.`,
    codeLine: { python: 7, cpp: 7, java: 7 },
    variables: { 
      'slow': slow, 
      'nums[slow]': nums[slow], 
      'fast': fast, 
      'nums[fast]': nums[fast] 
    },
    highlightedNodes: [slow, fast],
  });

  // Phase 1 Loop: until slow === fast
  const maxIterations = nums.length * 4 + 20;
  while (slow !== fast && iteration < maxIterations) {
    iteration++;
    const prevSlow = slow;
    const prevFast = fast;

    slow = nums[slow];
    fast = nums[nums[fast]];
    totalPointerMoves += 3;

    if (slow === fast) {
      steps.push({
        stepIndex: steps.length,
        iteration,
        slowIndex: slow,
        fastIndex: fast,
        prevSlowIndex: prevSlow,
        prevFastIndex: prevFast,
        phase: 'DETECTION',
        status: 'COLLISION',
        title: `Phase 1 Collision at Index ${slow}!`,
        explanation: `Slow and Fast collided at Index ${slow} (value = ${nums[slow]}). A cycle is confirmed in the functional graph.`,
        detailedReasoning: `Pointers met inside the loop formed by the duplicate value. Now transition to Phase 2 to locate the cycle entry.`,
        codeLine: { python: 10, cpp: 9, java: 9 },
        variables: { 
          'meetingIndex': slow, 
          'meetingValue': nums[slow], 
          'slow == fast': true 
        },
        highlightedNodes: [slow],
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
        phase: 'DETECTION',
        status: 'RUNNING',
        title: `Phase 1: Iteration ${iteration}`,
        explanation: `Slow at Index ${slow} (val = ${nums[slow]}), Fast at Index ${fast} (val = ${nums[fast]}).`,
        detailedReasoning: `Slow traversed to nums[${prevSlow}] = ${slow}. Fast traversed two hops to nums[nums[${prevFast}]] = ${fast}.`,
        codeLine: { python: 7, cpp: 7, java: 7 },
        variables: { slow, fast, 'nums[slow]': nums[slow], 'nums[fast]': nums[fast] },
        highlightedNodes: [slow, fast],
      });
    }
  }

  // Phase 2: Reset slow to 0, keep fast at collision point, advance both at 1x
  let ptr1 = 0;
  let ptr2 = slow;

  steps.push({
    stepIndex: steps.length,
    iteration,
    slowIndex: ptr1,
    fastIndex: ptr2,
    prevSlowIndex: slow,
    prevFastIndex: fast,
    phase: 'ENTRY_FINDING',
    status: 'RUNNING',
    title: 'Phase 2: Reset Pointer 1 to Index 0',
    explanation: `Ptr 1 reset to Index 0. Ptr 2 remains at collision Index ${ptr2}. Both will advance 1 hop at a time until meeting!`,
    detailedReasoning: `By Floyd's distance theorem, the distance from Index 0 to the duplicate entry equals the distance from collision ${ptr2} forward to the duplicate entry.`,
    codeLine: { python: 13, cpp: 12, java: 12 },
    variables: { 'ptr1': 0, 'ptr2': ptr2, 'speed': '1x step' },
    highlightedNodes: [ptr1, ptr2],
  });

  let phase2Step = 0;
  while (ptr1 !== ptr2 && phase2Step < maxIterations) {
    phase2Step++;
    iteration++;
    const prev1 = ptr1;
    const prev2 = ptr2;

    ptr1 = nums[ptr1];
    ptr2 = nums[ptr2];
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
        status: 'FOUND_DUPLICATE',
        duplicateValue: ptr1,
        title: `Duplicate Number Found: ${ptr1}!`,
        explanation: `Both pointers collided at Index/Value ${ptr1}. The duplicate number in the array is ${ptr1}!`,
        detailedReasoning: `Multiple indices lead to ${ptr1}, creating the cycle entrance. Solved in O(N) time and O(1) auxiliary space without modifying the original array!`,
        codeLine: { python: 19, cpp: 18, java: 18 },
        variables: { 
          'Duplicate Number': ptr1, 
          'Cycle Entry Index': ptr1,
          'Result': `Found ${ptr1}` 
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
        title: `Phase 2: Step ${phase2Step}`,
        explanation: `Ptr 1 moved to Index ${ptr1} (nums[${prev1}] = ${ptr1}), Ptr 2 moved to Index ${ptr2} (nums[${prev2}] = ${ptr2}).`,
        detailedReasoning: `Both pointers stepping 1x towards the cycle entry.`,
        codeLine: { python: 16, cpp: 15, java: 15 },
        variables: { ptr1, ptr2, 'nums[ptr1]': nums[ptr1], 'nums[ptr2]': nums[ptr2] },
        highlightedNodes: [ptr1, ptr2],
      });
    }
  }

  return {
    mode: 'find-duplicate',
    nodes,
    steps,
    hasCycle: true,
    duplicateValue: ptr1,
    meetingPointIndex: slow,
    cycleEntryIndex: ptr1,
    stats: {
      totalIterations: iteration,
      totalPointerMoves,
    }
  };
}
