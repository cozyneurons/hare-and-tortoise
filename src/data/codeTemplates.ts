import { AlgorithmMode, CodeTemplate } from '../types/simulation';

export const CODE_TEMPLATES: Record<AlgorithmMode, CodeTemplate> = {
  'cycle-detection': {
    python: `# Floyd's Cycle Detection (Tortoise and Hare)
def hasCycle(head: Optional[ListNode]) -> bool:
    if not head or not head.next:
        return False
    slow, fast = head, head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            return True  # Collision: Cycle detected!
            
    return False  # Fast reached end: No cycle`,
    cpp: `// Floyd's Cycle Detection (Tortoise and Hare)
bool hasCycle(ListNode* head) {
    if (!head || !head->next) {
        return false;
    }
    ListNode *slow = head, *fast = head;
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
        if (slow == fast) {
            return true; // Collision: Cycle detected!
        }
    }
    return false; // Fast reached null
}`,
    java: `// Floyd's Cycle Detection (Tortoise and Hare)
public boolean hasCycle(ListNode head) {
    if (head == null || head.next == null) {
        return false;
    }
    ListNode slow = head, fast = head;
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
        if (slow == fast) {
            return true; // Collision: Cycle detected!
        }
    }
    return false; // Fast reached null
}`
  },

  'cycle-entry': {
    python: `# Floyd's Algorithm: Find Cycle Start Node
def detectCycle(head: Optional[ListNode]) -> Optional[ListNode]:
    if not head or not head.next:
        return None
    # Phase 1: Detect Meeting Point
    slow, fast = head, head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            break
    else:
        return None  # No cycle exists

    # Phase 2: Locate Cycle Entry (Both move 1x)
    p1, p2 = head, slow
    while p1 != p2:
        p1 = p1.next
        p2 = p2.next
        
    return p1  # Collide at cycle entry!`,
    cpp: `// Floyd's Algorithm: Find Cycle Start Node
ListNode* detectCycle(ListNode* head) {
    if (!head || !head->next) return nullptr;

    // Phase 1: Detect Meeting Point
    ListNode *slow = head, *fast = head;
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
        if (slow == fast) break;
    }
    if (!fast || !fast->next) return nullptr;

    // Phase 2: Locate Cycle Entry (Both move 1x)
    ListNode *p1 = head, *p2 = slow;
    while (p1 != p2) {
        p1 = p1->next;
        p2 = p2->next;
    }
    return p1; // Collide at cycle entry!
}`,
    java: `// Floyd's Algorithm: Find Cycle Start Node
public ListNode detectCycle(ListNode head) {
    if (head == null || head.next == null) return null;

    // Phase 1: Detect Meeting Point
    ListNode slow = head, fast = head;
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
        if (slow == fast) break;
    }
    if (fast == null || fast.next == null) return null;

    // Phase 2: Locate Cycle Entry (Both move 1x)
    ListNode p1 = head, p2 = slow;
    while (p1 != p2) {
        p1 = p1.next;
        p2 = p2.next;
    }
    return p1; // Collide at cycle entry!
}`
  },

  'find-middle': {
    python: `# Find Middle of Linked List (Second middle convention)
def middleNode(head: Optional[ListNode]) -> Optional[ListNode]:
    if not head:
        return None
    slow = head
    fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        
    return slow  # Slow points to middle`,
    cpp: `// Find Middle of Linked List (Second middle convention)
ListNode* middleNode(ListNode* head) {
    if (!head) return nullptr;
    ListNode *slow = head;
    ListNode *fast = head;
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
    }
    return slow; // Slow points to middle
}`,
    java: `// Find Middle of Linked List (Second middle convention)
public ListNode middleNode(ListNode head) {
    if (head == null) return null;
    ListNode slow = head;
    ListNode fast = head;
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
    }
    return slow; // Slow points to middle
}`
  },

  'find-duplicate': {
    python: `# Find Duplicate Number (Array as Functional Graph)
def findDuplicate(nums: List[int]) -> int:
    # Phase 1: Hare & Tortoise collision
    slow = nums[0]
    fast = nums[0]
    while True:
        slow = nums[slow]
        fast = nums[nums[fast]]
        if slow == fast:
            break

    # Phase 2: Find cycle entry (duplicate value)
    p1 = 0
    p2 = slow
    while p1 != p2:
        p1 = nums[p1]
        p2 = nums[p2]

    return p1  # Duplicate number located!`,
    cpp: `// Find Duplicate Number (Array as Functional Graph)
int findDuplicate(vector<int>& nums) {
    // Phase 1: Hare & Tortoise collision
    int slow = nums[0];
    int fast = nums[0];
    do {
        slow = nums[slow];
        fast = nums[nums[fast]];
    } while (slow != fast);

    // Phase 2: Find cycle entry (duplicate value)
    int p1 = 0;
    int p2 = slow;
    while (p1 != p2) {
        p1 = nums[p1];
        p2 = nums[p2];
    }
    return p1; // Duplicate number located!
}`,
    java: `// Find Duplicate Number (Array as Functional Graph)
public int findDuplicate(int[] nums) {
    // Phase 1: Hare & Tortoise collision
    int slow = nums[0];
    int fast = nums[0];
    do {
        slow = nums[slow];
        fast = nums[nums[fast]];
    } while (slow != fast);

    // Phase 2: Find cycle entry (duplicate value)
    int p1 = 0;
    int p2 = slow;
    while (p1 != p2) {
        p1 = nums[p1];
        p2 = nums[p2];
    }
    return p1; // Duplicate number located!
}`
  }
};
