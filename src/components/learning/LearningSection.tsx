import React, { useState } from 'react';
import { 
  BookOpen, 
  Calculator, 
  CheckCircle2, 
  ChevronRight
} from 'lucide-react';

export const LearningSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [demoMu, setDemoMu] = useState<number>(3);
  const [demoLambda, setDemoLambda] = useState<number>(5);

  const modules = [
    {
      id: 'fundamentals',
      title: '01. Fundamentals of Two Pointers',
      subtitle: 'The Intuition Behind Hare & Tortoise',
      content: (
        <div className="space-y-4">
          <p className="text-sm text-slate-300 leading-relaxed">
            The <strong>Hare and Tortoise Algorithm</strong>, officially known as <strong>Floyd's Cycle-Finding Algorithm</strong>, 
            is an algorithmic paradigm invented by Robert W. Floyd in 1967. 
            It utilizes two pointer references advancing through a sequence or graph structure at <em>different velocities</em>.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-3 font-mono text-xs">
            <div className="p-3.5 rounded-lg bg-arcade-950 border border-cyan-500/40">
              <div className="flex items-center gap-2 text-cyan-400 font-bold mb-1">
                <span>🐢 TORTOISE (SLOW POINTER)</span>
              </div>
              <p className="text-slate-400 leading-normal">
                Moves at <strong>1 node per step</strong>: <code className="text-cyan-300">slow = slow.next</code>. 
                Serves as the baseline measuring stick of list traversal.
              </p>
            </div>
            <div className="p-3.5 rounded-lg bg-arcade-950 border border-amber-500/40">
              <div className="flex items-center gap-2 text-amber-400 font-bold mb-1">
                <span>🐇 HARE (FAST POINTER)</span>
              </div>
              <p className="text-slate-400 leading-normal">
                Moves at <strong>2 nodes per step</strong>: <code className="text-amber-300">fast = fast.next.next</code>. 
                Probes ahead into unexplored territory at twice the speed.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-arcade-850 border border-arcade-800 text-xs text-slate-300 leading-relaxed">
            <strong className="text-lime-accent">Why Constant Space O(1)?</strong><br />
            Traditional cycle detection requires allocating a hash set to store node memory addresses ($O(N)$ extra memory). 
            Floyd's algorithm requires only two pointer memory addresses stored in CPU registers, enabling cycle detection inside memory-constrained firmware, kernel drivers, and embedded systems.
          </div>
        </div>
      ),
    },

    {
      id: 'why-twice-speed',
      title: '02. Why Move Fast Exactly Twice as Fast?',
      subtitle: 'The Mathematics of Relative Speed & Closing Rate',
      content: (
        <div className="space-y-4">
          <p className="text-sm text-slate-300 leading-relaxed">
            A frequent question is: <em>Why 2x speed? Could fast move at 3x, 4x, or 5x speed?</em>
          </p>

          <div className="p-4 rounded-lg bg-arcade-950 border border-arcade-800 text-xs font-mono space-y-2">
            <div className="text-lime-accent font-bold">RELATIVE CLOSING SPEED ANALYSIS:</div>
            <div className="text-slate-300">
              Let speed of Tortoise be <code>v_slow = 1</code> step/iteration.<br />
              Let speed of Hare be <code>v_fast = 2</code> steps/iteration.
            </div>
            <div className="p-2.5 rounded bg-arcade-900 border border-arcade-800 text-white font-bold">
              Relative Velocity: &Delta;v = v_fast - v_slow = 2 - 1 = 1 node/iteration.
            </div>
            <p className="text-slate-400 font-sans text-xs pt-1">
              Because the relative distance between Hare and Tortoise decreases by <strong>strictly 1 node each iteration</strong> inside a loop of length &lambda;, the distance modulo &lambda; strictly decrements:
              <br />
              <code className="text-cyan-300">d, d - 1, d - 2, ..., 2, 1, 0 (COLLISION!)</code>
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-rose-950/30 border border-rose-900/50 text-xs text-rose-200">
            <strong>What happens if Fast moves at 3x speed?</strong><br />
            If Fast moved at 3x speed, relative speed would be &Delta;v = 3 - 1 = 2 nodes/iteration. 
            If the cycle length &lambda; were even and the starting distance were odd, Fast could leap <em>over</em> Slow and never collide, causing an infinite loop unless parity is explicitly managed! 
            A speed difference of exactly 1 guarantees collision without any risk of skipping.
          </div>
        </div>
      ),
    },

    {
      id: 'cycle-detection',
      title: '03. How Cycle Detection Works',
      subtitle: 'Guaranteed Finite Termination',
      content: (
        <div className="space-y-4">
          <p className="text-sm text-slate-300 leading-relaxed">
            Floyd's algorithm establishes that any linked structure is either strictly linear or ends in a closed cycle.
          </p>

          <div className="space-y-2 font-mono text-xs">
            <div className="p-3 rounded-lg bg-arcade-950 border border-arcade-800 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-emerald-400">Case A: No Cycle (Linear List)</strong>
                <p className="text-slate-400 font-sans text-xs mt-0.5">
                  Hare reaches <code className="text-slate-200">null</code> or <code className="text-slate-200">fast.next == null</code> in at most &lceil;N / 2&rceil; iterations. 
                  Algorithm returns <strong>false</strong> in $O(N)$ time.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-arcade-950 border border-arcade-800 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-cyan-400">Case B: Cycle Exists</strong>
                <p className="text-slate-400 font-sans text-xs mt-0.5">
                  Once Tortoise enters the cycle, Hare is already somewhere inside the cycle. 
                  Because the distance between them shrinks by 1 at every step, they must collide before Tortoise completes a single complete revolution around the cycle!
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },

    {
      id: 'math-derivation',
      title: '04. Finding the Cycle Entry (Mathematical Proof)',
      subtitle: 'The Famous μ = m·λ - k Derivation',
      content: (
        <div className="space-y-4">
          <p className="text-sm text-slate-300 leading-relaxed">
            Finding where a cycle begins is one of the most elegant proofs in algorithmic computer science.
          </p>

          {/* Mathematical Proof Box */}
          <div className="p-4 rounded-xl bg-arcade-950 border border-pink-900/40 text-xs font-mono space-y-3">
            <div className="text-pink-400 font-bold flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              <span>THE FLOYD DISTANCE THEOREM:</span>
            </div>

            <div className="space-y-1 text-slate-300">
              <div>&bull; Let <strong>&mu; (mu)</strong> = distance from Head to Cycle Entry.</div>
              <div>&bull; Let <strong>&lambda; (lambda)</strong> = length of the Cycle.</div>
              <div>&bull; Let <strong>k</strong> = distance from Cycle Entry to the Meeting Point M.</div>
            </div>

            <div className="p-3 rounded bg-arcade-900 border border-arcade-800 text-slate-200 space-y-1 leading-relaxed">
              <div>Total distance walked by Slow: <code>d_slow = &mu; + k</code></div>
              <div>Total distance walked by Fast: <code>d_fast = &mu; + k + m &middot; &lambda;</code> (for integer m &ge; 1)</div>
              <div>Since Fast runs twice as fast: <code>d_fast = 2 &middot; d_slow</code></div>
              <div className="text-lime-accent font-bold pt-1">
                &mu; + k + m &middot; &lambda; = 2(&mu; + k) = 2&mu; + 2k
              </div>
              <div className="text-cyan-300 font-bold">
                m &middot; &lambda; = &mu; + k
              </div>
              <div className="text-pink-300 font-bold text-sm pt-1">
                &mu; = m &middot; &lambda; - k = (m - 1)&lambda; + (&lambda; - k)
              </div>
            </div>

            <p className="text-slate-400 font-sans text-xs">
              <strong>The Crucial Insight:</strong> The distance from the Head to the Cycle Entry is <strong>&mu;</strong>. 
              The distance from the Meeting Point M forward along the cycle back to the Entry is <strong>(&lambda; - k)</strong>.
              <br /><br />
              Therefore, if we place one pointer at the <strong>Head</strong> and one pointer at the <strong>Meeting Point</strong>, and move both forward at <strong>1 step per iteration</strong>, they will traverse equal distances modulo &lambda; and <strong>collide precisely at the cycle entry node!</strong>
            </p>
          </div>

          {/* Interactive Calculator Slider */}
          <div className="p-4 rounded-xl bg-arcade-900 border border-arcade-800 text-xs font-mono">
            <div className="font-bold text-slate-300 mb-2">INTERACTIVE PROOF CALCULATOR:</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-slate-400 block mb-1">Prefix Length (&mu;): {demoMu}</label>
                <input
                  type="range"
                  min={1}
                  max={8}
                  value={demoMu}
                  onChange={(e) => setDemoMu(Number(e.target.value))}
                  className="w-full h-1 bg-arcade-800 rounded accent-cyan-400"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Cycle Length (&lambda;): {demoLambda}</label>
                <input
                  type="range"
                  min={2}
                  max={10}
                  value={demoLambda}
                  onChange={(e) => setDemoLambda(Number(e.target.value))}
                  className="w-full h-1 bg-arcade-800 rounded accent-pink-400"
                />
              </div>
            </div>
            <div className="mt-3 p-2.5 rounded bg-arcade-950 border border-arcade-800 text-slate-300">
              For &mu; = {demoMu} and &lambda; = {demoLambda}:<br />
              Meeting offset k = ({demoLambda} - ({demoMu} % {demoLambda})) % {demoLambda} = {((demoLambda - (demoMu % demoLambda)) % demoLambda)}<br />
              Remaining loop distance to entry: &lambda; - k = {demoLambda - ((demoLambda - (demoMu % demoLambda)) % demoLambda)} nodes.<br />
              <span className="text-lime-accent font-semibold">&there4; Head pointer and Meeting pointer synchronize perfectly in {demoMu} steps!</span>
            </div>
          </div>
        </div>
      ),
    },

    {
      id: 'find-middle',
      title: '05. Finding the Middle of a Linked List',
      subtitle: 'Single-Pass Linear Search',
      content: (
        <div className="space-y-4">
          <p className="text-sm text-slate-300 leading-relaxed">
            Finding the middle node of a singly linked list in a single pass without querying or precomputing the length.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-3.5 rounded-lg bg-arcade-950 border border-arcade-800">
              <div className="text-lime-accent font-bold mb-1">ODD LENGTH LIST (e.g. 5 nodes)</div>
              <p className="text-slate-400 font-sans leading-normal">
                Nodes: [0, 1, 2, 3, 4]<br />
                Fast stops at tail node 4 (<code className="text-slate-300">fast.next == null</code>).<br />
                Slow is at exact middle node 2.
              </p>
            </div>
            <div className="p-3.5 rounded-lg bg-arcade-950 border border-arcade-800">
              <div className="text-cyan-400 font-bold mb-1">EVEN LENGTH LIST (e.g. 6 nodes)</div>
              <p className="text-slate-400 font-sans leading-normal">
                Nodes: [0, 1, 2, 3, 4, 5]<br />
                Fast steps past tail into <code className="text-slate-300">null</code>.<br />
                Slow is at second middle node 3 (&lfloor;N/2&rfloor;).
              </p>
            </div>
          </div>
        </div>
      ),
    },

    {
      id: 'functional-graphs',
      title: '06. Interpreting Arrays as Functional Graphs',
      subtitle: 'LeetCode 287: Find Duplicate Number in O(1) Space',
      content: (
        <div className="space-y-4">
          <p className="text-sm text-slate-300 leading-relaxed">
            The problem statement: <em>Given array <code className="text-cyan-300">nums</code> of length n + 1 with elements in range [1, n], find the duplicate without modifying the array and with O(1) extra space.</em>
          </p>

          <div className="p-4 rounded-xl bg-arcade-950 border border-arcade-800 text-xs font-mono space-y-2">
            <div className="text-lime-accent font-bold">THE GRAPH MAPPING:</div>
            <p className="text-slate-300 font-sans">
              Treat each array index <code className="text-slate-200">i</code> as a node in a directed graph. 
              The value stored at that index, <code className="text-slate-200">nums[i]</code>, represents the directed next pointer:
            </p>
            <div className="p-2 rounded bg-arcade-900 text-cyan-300 font-bold">
              i &rarr; nums[i]
            </div>
            <p className="text-slate-400 font-sans text-xs">
              <strong>Pigeonhole Principle:</strong> With $n+1$ values mapped into $n$ distinct pigeonholes $[1, n]$, at least one value must repeat. 
              A duplicate value means multiple distinct indices point to the same target index (in-degree &ge; 2). 
              In a functional graph where every node has out-degree 1, an in-degree &ge; 2 is the entrance to a cycle! 
              Floyd's cycle detection immediately pinpoints the duplicate value as the cycle entrance.
            </p>
          </div>
        </div>
      ),
    },

    {
      id: 'complexity-table',
      title: '07. Complexity Analysis Matrix',
      subtitle: 'Rigorous Big-O Bounds Across All Applications',
      content: (
        <div className="space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono border border-arcade-800 rounded-lg overflow-hidden">
              <thead className="bg-arcade-950 text-slate-400 border-b border-arcade-800">
                <tr>
                  <th className="p-3">Application</th>
                  <th className="p-3">Time Complexity</th>
                  <th className="p-3">Auxiliary Space</th>
                  <th className="p-3">Hash Set Alternative</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-arcade-800 text-slate-300 bg-arcade-900/60">
                <tr>
                  <td className="p-3 font-semibold text-white">Cycle Detection</td>
                  <td className="p-3 text-lime-accent">O(N)</td>
                  <td className="p-3 text-cyan-400">O(1) Constant</td>
                  <td className="p-3 text-slate-400">O(N) Space</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-white">Cycle Entry Search</td>
                  <td className="p-3 text-lime-accent">O(N)</td>
                  <td className="p-3 text-cyan-400">O(1) Constant</td>
                  <td className="p-3 text-slate-400">O(N) Space</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-white">Find Middle Node</td>
                  <td className="p-3 text-lime-accent">O(N)</td>
                  <td className="p-3 text-cyan-400">O(1) Constant</td>
                  <td className="p-3 text-slate-400">O(1) (2 passes)</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-white">Find Duplicate Number</td>
                  <td className="p-3 text-lime-accent">O(N)</td>
                  <td className="p-3 text-cyan-400">O(1) Constant</td>
                  <td className="p-3 text-slate-400">O(N) Space or modifies array</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-arcade-900 border border-arcade-750 text-xs font-mono text-cyan-400 mb-2">
          <BookOpen className="w-3.5 h-3.5" />
          <span>THEORY & MATHEMATICAL PROOFS</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Master the Principles Behind the Algorithm
        </h2>
        <p className="text-sm text-slate-400 mt-1 max-w-2xl">
          Deep-dive into formal mathematical derivations, relative closing velocities, functional graphs, and time-space invariants.
        </p>
      </div>

      {/* Main Learning Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Module Nav Column (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-2">
          {modules.map((m, idx) => {
            const isCurrent = activeTab === idx;
            return (
              <button
                key={m.id}
                onClick={() => setActiveTab(idx)}
                className={`flex items-center justify-between p-3.5 rounded-xl border text-left transition-all ${
                  isCurrent
                    ? 'bg-arcade-850 border-lime-accent text-white shadow-glow-lime'
                    : 'bg-arcade-900 border-arcade-800 text-slate-400 hover:text-slate-200 hover:border-arcade-700'
                }`}
              >
                <div>
                  <div className="text-xs font-bold font-mono tracking-tight text-white mb-0.5">
                    {m.title}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {m.subtitle}
                  </div>
                </div>
                <ChevronRight
                  className={`w-4 h-4 shrink-0 transition-transform ${
                    isCurrent ? 'text-lime-accent translate-x-1' : 'text-slate-600'
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* Content Viewer Column (8 cols) */}
        <div className="lg:col-span-8 p-6 bg-arcade-900 border border-arcade-800 rounded-2xl shadow-xl">
          <div className="border-b border-arcade-800 pb-4 mb-5">
            <span className="text-xs font-mono text-lime-accent uppercase tracking-wider font-semibold">
              Module {activeTab + 1} of {modules.length}
            </span>
            <h3 className="text-xl font-bold text-white mt-1">
              {modules[activeTab].title}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {modules[activeTab].subtitle}
            </p>
          </div>

          <div>{modules[activeTab].content}</div>
        </div>
      </div>
    </div>
  );
};
