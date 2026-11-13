# CHASE//LOOP — Interactive Hare & Tortoise Algorithm Simulator

> *"Two pointers. Different speeds. One inevitable meeting."*

An arcade-inspired interactive computer science laboratory visualizing **Floyd's Cycle Detection (Tortoise and Hare)** algorithm and its foundational applications in modern computer science.

---

## ⚡ Key Highlights

- **4 Fully Functional Simulation Modes**:
  1. **Floyd's Cycle Detection**: Visualizes singly linked list loop detection and termination invariant ($O(N)$ time, $O(1)$ auxiliary space).
  2. **Cycle Entry Identification**: Two-phase execution demonstrating the mathematical proof $\mu = m\lambda - k$ with dynamic real-time metrics.
  3. **Find Middle Node**: Single-pass traversal for odd and even lists with configurable second-middle ($\lfloor N/2 \rfloor$) and first-middle conventions.
  4. **Find Duplicate Number (LeetCode 287)**: Visualizes arrays of $n+1$ integers in $[1, n]$ as functional graphs ($i \to nums[i]$) where duplicate values create cycle entries with in-degree $\ge 2$.
- **High-Performance SVG & Canvas Visualizer**:
  - Curved loopback spline edges for cycles.
  - Distinct animated indicators for **Tortoise (Cool Cyan, 1x)** and **Hare (Warm Amber, 2x)**.
  - Electric pink collision pulse when $slow == fast$.
  - Array memory tape inspector for functional graph analysis.
- **Synchronized Multi-Language Code Inspector**:
  - Line-by-line synchronized execution across **Python**, **C++**, and **Java**.
  - Live Variable Watch panel reflecting pointer values and collision states.
- **Comprehensive Theory & Learning Center**:
  - Formal proof for relative closing speed ($\Delta v = 2 - 1 = 1$).
  - Full derivation of the cycle-entry distance relationship ($\mu = m\lambda - k$) with an interactive $\mu/\lambda$ calculator.
- **Arcade Challenge Mode**:
  - Predict collisions, identify entry nodes, test loop existence, and locate duplicate elements.
  - Multi-tier difficulties (Beginner, Intermediate, Advanced), streak multipliers, XP scoring, and `localStorage` persistence.
- **Complexity & Memory Lab**:
  - Real-time side-by-side memory meter comparing Floyd's constant $O(1)$ 16-byte register usage with dynamic Hash Set heap allocations up to $N = 50,000$ nodes.
- **Synthesized Retro Arcade Audio Engine**:
  - Built with Web Audio API (zero audio file downloads).
  - Tactile ticks, leaps, collision chords, fanfare chimes, and mute toggle.
- **Keyboard Shortcuts**:
  - `Space`: Play / Pause
  - `→`: Step Forward
  - `←`: Step Backward
  - `R`: Reset Simulation
  - `M`: Toggle Sound FX

---

## 📐 Mathematical Formulation

### 1. Relative Closing Speed
Let the velocity of the Tortoise be $v_{slow} = 1$ node/iteration and the Hare be $v_{fast} = 2$ nodes/iteration.  
Inside a cycle of length $\lambda$, their relative closing velocity is:
$$\Delta v = v_{fast} - v_{slow} = 2 - 1 = 1 \text{ node/iteration}$$
Because the relative gap decrements by strictly $1$ at each iteration modulo $\lambda$, a collision is mathematically guaranteed within $\lambda$ iterations of the Tortoise entering the cycle without any risk of skipping over each other.

### 2. Cycle Entry Identification
Let:
- $\mu$ = length of the linear prefix before the cycle (distance from Head to Cycle Entry).
- $\lambda$ = circumference / length of the cycle.
- $k$ = distance from the Cycle Entry to the collision point $M$ ($0 \le k < \lambda$).

When the pointers collide:
$$d_{slow} = \mu + k$$
$$d_{fast} = \mu + k + m\lambda \quad (m \ge 1)$$
Because the Hare travels at twice the speed of the Tortoise:
$$d_{fast} = 2 \cdot d_{slow}$$
$$\mu + k + m\lambda = 2(\mu + k) = 2\mu + 2k$$
$$m\lambda = \mu + k \implies \mu = m\lambda - k = (m - 1)\lambda + (\lambda - k)$$

This reveals that the distance from the **Head** to the **Cycle Entry** ($\mu$) is identical to the distance from the **Meeting Point** $M$ forward around the loop back to the **Cycle Entry** $(\lambda - k)$. Advancing both pointers at 1 node/step from these two locations guarantees they collide at the cycle entry!

---

## 🛠 Tech Stack

- **Framework**: React 18 with TypeScript (Strict mode)
- **Styling**: Tailwind CSS with custom arcade palette & subtle scanlines
- **Build Tool**: Vite 5
- **Unit Testing**: Vitest (24 unit tests covering all edge cases)
- **Icons**: Lucide React
- **Audio**: Web Audio API Synthesizer

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### Installation
```bash
git clone <repo-url>
cd HareAndTortoise
npm install
```

### Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Run Unit Tests
```bash
npm test
```

### Build for Production
```bash
npm run build
```

---

## 🧪 Tested Edge Cases

The algorithm engine is tested with Vitest covering:
- Singly linked list with standard cycle
- Linear linked list with no cycle (reaches null)
- Single-node list with self-loop
- Single-node list without cycle
- Empty list ($N = 0$)
- Cycle beginning at head ($\mu = 0$)
- Cycle beginning at tail
- Varied cycle lengths ($\lambda = 2, 3, 5, 8$)
- Odd-length middle detection
- Even-length middle detection (second middle & first middle conventions)
- Classic duplicate number array `[1, 3, 4, 2, 2]`
- Duplicate arrays with multiple repeats `[2, 5, 9, 6, 9, 3, 8, 9, 7, 1]`
- Boundary validation for duplicate arrays ($n+1$ length, values in $[1, n]$)
- Step determinism and pointer integrity
