import { describe, it, expect } from 'vitest';
import { simulateFloydCycleDetection } from './floydCycleDetection';
import { simulateCycleEntry } from './cycleEntry';
import { simulateFindMiddle } from './findMiddle';
import { simulateFindDuplicate, validateDuplicateArray } from './findDuplicate';

describe("Floyd's Cycle Detection Tests", () => {
  it('detects cycle in a standard linked list with cycle', () => {
    // 6 nodes, cycle starts at index 2 (2 -> 3 -> 4 -> 5 -> 2)
    const result = simulateFloydCycleDetection({ nodeCount: 6, cyclePos: 2 });
    expect(result.hasCycle).toBe(true);
    expect(result.meetingPointIndex).not.toBeNull();
    const lastStep = result.steps[result.steps.length - 1];
    expect(lastStep.status).toBe('COLLISION');
    expect(lastStep.phase).toBe('COMPLETED');
    expect(lastStep.slowIndex).toBe(lastStep.fastIndex);
  });

  it('detects no cycle when cyclePos is -1', () => {
    const result = simulateFloydCycleDetection({ nodeCount: 5, cyclePos: -1 });
    expect(result.hasCycle).toBe(false);
    expect(result.meetingPointIndex).toBeNull();
    const lastStep = result.steps[result.steps.length - 1];
    expect(lastStep.status).toBe('NO_CYCLE');
  });

  it('handles empty linked list', () => {
    const result = simulateFloydCycleDetection({ nodeCount: 0, cyclePos: -1 });
    expect(result.hasCycle).toBe(false);
    expect(result.nodes.length).toBe(0);
    expect(result.steps.length).toBe(1);
    expect(result.steps[0].status).toBe('NO_CYCLE');
  });

  it('handles single node without cycle', () => {
    const result = simulateFloydCycleDetection({ nodeCount: 1, cyclePos: -1 });
    expect(result.hasCycle).toBe(false);
  });

  it('handles single node with self-loop', () => {
    const result = simulateFloydCycleDetection({ nodeCount: 1, cyclePos: 0 });
    expect(result.hasCycle).toBe(true);
    expect(result.meetingPointIndex).toBe(0);
  });

  it('handles cycle beginning at the head (cyclePos = 0)', () => {
    const result = simulateFloydCycleDetection({ nodeCount: 4, cyclePos: 0 });
    expect(result.hasCycle).toBe(true);
    expect(result.meetingPointIndex).not.toBeNull();
  });

  it('handles cycle beginning near the end (tail self-loop)', () => {
    const result = simulateFloydCycleDetection({ nodeCount: 5, cyclePos: 4 });
    expect(result.hasCycle).toBe(true);
    expect(result.meetingPointIndex).toBe(4);
  });

  it('handles various cycle lengths (lambda = 2, 3, 5, 8)', () => {
    for (const lambda of [2, 3, 5, 8]) {
      const nodeCount = 10;
      const cyclePos = nodeCount - lambda;
      const result = simulateFloydCycleDetection({ nodeCount, cyclePos });
      expect(result.hasCycle).toBe(true);
      expect(result.meetingPointIndex).toBeGreaterThanOrEqual(cyclePos);
      expect(result.meetingPointIndex).toBeLessThan(nodeCount);
    }
  });
});

describe('Cycle Entry Identification Tests', () => {
  it('correctly identifies cycle entry point for various configurations', () => {
    const testCases = [
      { nodeCount: 7, cyclePos: 2 },
      { nodeCount: 8, cyclePos: 0 }, // Entry at head
      { nodeCount: 6, cyclePos: 5 }, // Entry at tail
      { nodeCount: 9, cyclePos: 4 },
      { nodeCount: 12, cyclePos: 7 },
    ];

    for (const tc of testCases) {
      const result = simulateCycleEntry({ nodeCount: tc.nodeCount, cyclePos: tc.cyclePos });
      expect(result.hasCycle).toBe(true);
      expect(result.cycleEntryIndex).toBe(tc.cyclePos);
      const lastStep = result.steps[result.steps.length - 1];
      expect(lastStep.status).toBe('FOUND_ENTRY');
      expect(lastStep.slowIndex).toBe(tc.cyclePos);
      expect(lastStep.fastIndex).toBe(tc.cyclePos);
    }
  });

  it('handles cycle entry when there is no cycle', () => {
    const result = simulateCycleEntry({ nodeCount: 5, cyclePos: -1 });
    expect(result.hasCycle).toBe(false);
    expect(result.cycleEntryIndex).toBeNull();
    const lastStep = result.steps[result.steps.length - 1];
    expect(lastStep.status).toBe('NO_CYCLE');
  });

  it('verifies mathematical relationship in step annotations', () => {
    const result = simulateCycleEntry({ nodeCount: 8, cyclePos: 3 });
    const collisionStep = result.steps.find(s => s.status === 'COLLISION');
    expect(collisionStep).toBeDefined();
    expect(collisionStep?.mathNotes?.mu).toBe(3);
    expect(collisionStep?.mathNotes?.lambda).toBe(5);
  });
});

describe('Find Middle of Linked List Tests', () => {
  it('finds middle for odd-length linked list', () => {
    // Length 5: indices 0, 1, 2, 3, 4 -> middle index 2
    const result = simulateFindMiddle({ nodeCount: 5, convention: 'second' });
    expect(result.middleIndex).toBe(2);
    const lastStep = result.steps[result.steps.length - 1];
    expect(lastStep.status).toBe('FOUND_MIDDLE');
    expect(lastStep.slowIndex).toBe(2);
  });

  it('finds second middle for even-length linked list', () => {
    // Length 6: indices 0, 1, 2, 3, 4, 5 -> second middle index 3
    const result = simulateFindMiddle({ nodeCount: 6, convention: 'second' });
    expect(result.middleIndex).toBe(3);
  });

  it('finds first middle when convention is set to first', () => {
    // Length 6: indices 0, 1, 2, 3, 4, 5 -> first middle index 2
    const result = simulateFindMiddle({ nodeCount: 6, convention: 'first' });
    expect(result.middleIndex).toBe(2);
  });

  it('handles single-node list', () => {
    const result = simulateFindMiddle({ nodeCount: 1 });
    expect(result.middleIndex).toBe(0);
  });

  it('handles 2-node list', () => {
    const secondResult = simulateFindMiddle({ nodeCount: 2, convention: 'second' });
    expect(secondResult.middleIndex).toBe(1);

    const firstResult = simulateFindMiddle({ nodeCount: 2, convention: 'first' });
    expect(firstResult.middleIndex).toBe(0);
  });

  it('handles empty list', () => {
    const result = simulateFindMiddle({ nodeCount: 0 });
    expect(result.middleIndex).toBeNull();
  });
});

describe('Find Duplicate Number (Array-Based Floyd) Tests', () => {
  it('correctly finds duplicate in classic LeetCode test case [1, 3, 4, 2, 2]', () => {
    const nums = [1, 3, 4, 2, 2];
    const result = simulateFindDuplicate(nums);
    expect(result.duplicateValue).toBe(2);
    const lastStep = result.steps[result.steps.length - 1];
    expect(lastStep.status).toBe('FOUND_DUPLICATE');
    expect(lastStep.slowIndex).toBe(2);
  });

  it('correctly finds duplicate in [3, 1, 3, 4, 2]', () => {
    const nums = [3, 1, 3, 4, 2];
    const result = simulateFindDuplicate(nums);
    expect(result.duplicateValue).toBe(3);
  });

  it('finds duplicate in [1, 1]', () => {
    const nums = [1, 1];
    const result = simulateFindDuplicate(nums);
    expect(result.duplicateValue).toBe(1);
  });

  it('finds duplicate in larger array with multiple repeats [2, 5, 9, 6, 9, 3, 8, 9, 7, 1]', () => {
    const nums = [2, 5, 9, 6, 9, 3, 8, 9, 7, 1];
    const result = simulateFindDuplicate(nums);
    expect(result.duplicateValue).toBe(9);
  });

  it('validates array constraints properly', () => {
    // Array length < 2
    expect(validateDuplicateArray([1]).isValid).toBe(false);
    // Number out of range (> n)
    expect(validateDuplicateArray([1, 4, 2]).isValid).toBe(false); // n=2, 4 > 2
    // Number 0 which is < 1
    expect(validateDuplicateArray([0, 1]).isValid).toBe(false);
    // Valid array
    expect(validateDuplicateArray([2, 2, 1]).isValid).toBe(true);
  });
});

describe('Simulation Engine Step Determinism & Integrity', () => {
  it('guarantees sequential step indices starting at 0', () => {
    const result = simulateFloydCycleDetection({ nodeCount: 8, cyclePos: 3 });
    result.steps.forEach((step, idx) => {
      expect(step.stepIndex).toBe(idx);
    });
  });

  it('all step pointer positions correspond to valid node indices or null', () => {
    const result = simulateCycleEntry({ nodeCount: 7, cyclePos: 2 });
    result.steps.forEach((step) => {
      if (step.slowIndex !== null) {
        expect(step.slowIndex).toBeGreaterThanOrEqual(0);
        expect(step.slowIndex).toBeLessThan(7);
      }
      if (step.fastIndex !== null) {
        expect(step.fastIndex).toBeGreaterThanOrEqual(0);
        expect(step.fastIndex).toBeLessThan(7);
      }
    });
  });
});
