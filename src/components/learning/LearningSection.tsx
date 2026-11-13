import React, { useState } from 'react';
import { 
  PixelHareSprite, 
  PixelTortoiseSprite, 
  PixelBadge 
} from '../pixel/PixelSprites';
import { sound } from '../../utils/audio';

export const LearningSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [demoMu, setDemoMu] = useState<number>(3);
  const [demoLambda, setDemoLambda] = useState<number>(5);

  const pokedexEntries = [
    {
      num: 'No. 001',
      title: 'TWO-POINTER BASICS',
      subtitle: 'SPECIES: HARE & TORTOISE ALGORITHM',
      sprite: <PixelTortoiseSprite size={32} />,
      type: 'SEARCH / FAST-SLOW',
      stats: { height: '1x & 2x', weight: 'O(1) SPACE', habitat: 'SINGLY LINKED LIST' },
      content: (
        <div className="space-y-3 font-vt323 text-xl text-gb-ink leading-tight">
          <p>
            Invented by Robert W. Floyd in 1967, this legendary handheld algorithmic technique uses two pointer references advancing through node structures at <em>different velocities</em>.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-2 font-pixel text-[9px]">
            <div className="p-3 bg-gb-cream border-2 border-gb-ink">
              <div className="text-tortoise font-bold mb-1">TORTOISE (SLOW POINTER)</div>
              <p className="font-vt323 text-lg text-gb-ink leading-snug">
                Advances <strong>1 node per turn</strong> (<code className="bg-gb-forest/10 px-1">slow = slow.next</code>). 
                Measures steady traversal pace across the sequence.
              </p>
            </div>
            <div className="p-3 bg-gb-cream border-2 border-gb-ink">
              <div className="text-hare font-bold mb-1">HARE (FAST POINTER)</div>
              <p className="font-vt323 text-lg text-gb-ink leading-snug">
                Advances <strong>2 nodes per turn</strong> (<code className="bg-gb-forest/10 px-1">fast = fast.next.next</code>). 
                Probes into unknown list territory at double speed.
              </p>
            </div>
          </div>

          <div className="p-3 bg-gb-surface border-2 border-gb-ink text-gb-ink">
            <strong className="font-pixel text-[9px] text-gb-forest block mb-1">POKÉDEX DATA ENTRY:</strong>
            Traditional cycle detection consumes a Hash Set ($O(N)$ extra memory). Floyd's algorithm requires only two CPU register memory addresses, enabling instant cycle detection inside RAM-constrained handhelds and embedded systems!
          </div>
        </div>
      ),
    },

    {
      num: 'No. 002',
      title: 'THE 2X VELOCITY LAW',
      subtitle: 'SPECIES: RELATIVE CLOSING SPEED',
      sprite: <PixelHareSprite size={32} />,
      type: 'MATH / KINEMATICS',
      stats: { height: '&Delta;v = 1', weight: '&le; &lambda; TURNS', habitat: 'CLOSED LOOP' },
      content: (
        <div className="space-y-3 font-vt323 text-xl text-gb-ink leading-tight">
          <p>
            <em>Why must the fast pointer move at exactly 2x speed? Could it move at 3x or 4x?</em>
          </p>

          <div className="p-3.5 bg-gb-surface border-2 border-gb-ink">
            <div className="font-pixel text-[9px] text-hare font-bold mb-1">CLOSING SPEED DERIVATION:</div>
            <div>&bull; Tortoise Velocity: <code>v_slow = 1</code> node/turn.</div>
            <div>&bull; Hare Velocity: <code>v_fast = 2</code> nodes/turn.</div>
            <div className="my-1.5 p-2 bg-gb-forest text-gb-cream font-bold">
              Relative Closing Speed: &Delta;v = 2 - 1 = 1 node per turn!
            </div>
            <p className="font-vt323 text-lg text-gb-ink mt-1">
              Because their relative gap decreases by <strong>strictly 1 tile each turn</strong> modulo &lambda;, the distance strictly counts down:
              $d, d-1, d-2, \dots, 2, 1, 0$ (COLLISION!).
            </p>
          </div>

          <div className="p-3 bg-retro-error/15 border-2 border-retro-error text-gb-ink">
            <strong className="font-pixel text-[9px] text-retro-error block mb-0.5">WARNING (THE 3x TRAP):</strong>
            If Fast ran at 3x speed, &Delta;v = 2. In an even-length cycle, Fast could leap <em>over</em> Slow indefinitely without ever landing on the exact same tile! A speed difference of 1 guarantees collision with zero risk of skipping.
          </div>
        </div>
      ),
    },

    {
      num: 'No. 003',
      title: 'CYCLE DETECTION',
      subtitle: 'SPECIES: FINITE TERMINATION',
      sprite: <PixelBadge type="detection" size={32} />,
      type: 'LOGIC / TOPOLOGY',
      stats: { height: 'TRUE/FALSE', weight: 'O(N) TIME', habitat: 'ANY LINKED LIST' },
      content: (
        <div className="space-y-3 font-vt323 text-xl text-gb-ink leading-tight">
          <p>
            Every singly linked list is either strictly linear (terminating in null) or has a closed cycle.
          </p>

          <div className="space-y-2">
            <div className="p-3 bg-gb-surface border-2 border-gb-ink">
              <strong className="font-pixel text-[9px] text-gb-forest block mb-1">SCENARIO A: LINEAR (NO CYCLE)</strong>
              <p>
                Hare encounters <code className="bg-gb-forest/10 px-1">null</code> or <code className="bg-gb-forest/10 px-1">fast.next == null</code> in at most &lceil;N/2&rceil; turns. Algorithm returns <strong>FALSE</strong> in $O(N)$ time.
              </p>
            </div>

            <div className="p-3 bg-gb-surface border-2 border-gb-ink">
              <strong className="font-pixel text-[9px] text-hare block mb-1">SCENARIO B: LOOP PRESENT</strong>
              <p>
                Once Tortoise enters the cycle, Hare is already inside. Since the gap closes by 1 tile per turn, collision is guaranteed before Tortoise completes a single lap!
              </p>
            </div>
          </div>
        </div>
      ),
    },

    {
      num: 'No. 004',
      title: 'CYCLE ENTRY PROOF',
      subtitle: 'SPECIES: THE &mu; = m&middot;&lambda; - k THEOREM',
      sprite: <PixelBadge type="entry" size={32} />,
      type: 'PROOF / GEOMETRY',
      stats: { height: '&mu; TILES', weight: 'm&middot;&lambda; - k', habitat: 'CYCLE ENTRY' },
      content: (
        <div className="space-y-3 font-vt323 text-xl text-gb-ink leading-tight">
          <div className="p-3.5 bg-gb-surface border-2 border-gb-ink">
            <div className="font-pixel text-[9px] text-hare font-bold mb-1.5">MATHEMATICAL PROOF DERIVATION:</div>
            <div>&bull; Let <strong>&mu;</strong> = distance from Head to Cycle Entry.</div>
            <div>&bull; Let <strong>&lambda;</strong> = length of Cycle.</div>
            <div>&bull; Let <strong>k</strong> = distance from Entry to Meeting Point M.</div>

            <div className="p-2.5 bg-gb-forest text-gb-cream my-2 space-y-1 font-vt323 text-xl">
              <div>Slow distance: <code>d_slow = &mu; + k</code></div>
              <div>Fast distance: <code>d_fast = &mu; + k + m&lambda;</code> (m &ge; 1)</div>
              <div>Speed ratio 2:1 &implies; &mu; + k + m&lambda; = 2(&mu; + k) = 2&mu; + 2k</div>
              <div className="font-bold text-retro-warning pt-1">&mu; = m&middot;&lambda; - k = (m - 1)&lambda; + (&lambda; - k)</div>
            </div>

            <p className="text-lg">
              <strong>The Grand Insight:</strong> Distance from Head to Entry is &mu;. Distance from Meeting Point forward to Entry is (&lambda; - k). 
              Both are identical modulo &lambda;! Moving two pointers at 1x from Head and Meeting point guarantees they collide at the Entry!
            </p>
          </div>

          {/* Interactive Calculator Slider */}
          <div className="p-3 bg-gb-cream border-2 border-gb-ink">
            <div className="font-pixel text-[9px] text-gb-forest mb-2">INTERACTIVE PROOF CALCULATOR:</div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-pixel text-[8px] block mb-1">PREFIX (&mu;): {demoMu}</label>
                <input
                  type="range"
                  min={1}
                  max={8}
                  value={demoMu}
                  onChange={(e) => setDemoMu(Number(e.target.value))}
                  className="w-full accent-hare cursor-pointer"
                />
              </div>
              <div>
                <label className="font-pixel text-[8px] block mb-1">CYCLE (&lambda;): {demoLambda}</label>
                <input
                  type="range"
                  min={2}
                  max={10}
                  value={demoLambda}
                  onChange={(e) => setDemoLambda(Number(e.target.value))}
                  className="w-full accent-tortoise cursor-pointer"
                />
              </div>
            </div>
            <div className="mt-2 text-lg text-gb-ink">
              Remaining distance from Meeting Point to Entry: <strong>{demoLambda - ((demoLambda - (demoMu % demoLambda)) % demoLambda)}</strong> tiles.
              Both pointers sync at Entry in exactly <strong>{demoMu}</strong> turns!
            </div>
          </div>
        </div>
      ),
    },

    {
      num: 'No. 005',
      title: 'FIND MIDDLE NODE',
      subtitle: 'SPECIES: SINGLE-PASS SPLITTER',
      sprite: <PixelBadge type="middle" size={32} />,
      type: 'DIVIDE / PARITY',
      stats: { height: '&lfloor;N/2&rfloor;', weight: '1 PASS', habitat: 'ODD / EVEN LISTS' },
      content: (
        <div className="space-y-3 font-vt323 text-xl text-gb-ink leading-tight">
          <p>
            Finds the middle node in a single traversal without counting the total length beforehand.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3 bg-gb-surface border-2 border-gb-ink">
              <strong className="font-pixel text-[9px] text-gb-forest block mb-1">ODD LENGTH (5 NODES)</strong>
              <p>
                Fast stops at tail node 4 (<code className="bg-gb-forest/10 px-1">fast.next == null</code>). Slow rests at exact middle node 2.
              </p>
            </div>
            <div className="p-3 bg-gb-surface border-2 border-gb-ink">
              <strong className="font-pixel text-[9px] text-tortoise block mb-1">EVEN LENGTH (6 NODES)</strong>
              <p>
                Fast steps past tail into <code className="bg-gb-forest/10 px-1">null</code>. Slow rests at second middle node 3 (&lfloor;N/2&rfloor;).
              </p>
            </div>
          </div>
        </div>
      ),
    },

    {
      num: 'No. 006',
      title: 'FUNCTIONAL GRAPHS',
      subtitle: 'SPECIES: ARRAY DUPLICATE HUNTER',
      sprite: <PixelBadge type="duplicate" size={32} />,
      type: 'PIGEONHOLE / GRAPH',
      stats: { height: 'LEETCODE 287', weight: 'O(1) SPACE', habitat: 'READ-ONLY ARRAY' },
      content: (
        <div className="space-y-3 font-vt323 text-xl text-gb-ink leading-tight">
          <p>
            LeetCode 287: <em>Array of $n+1$ integers in range $[1, n]$. Find the duplicate without modifying array and using O(1) extra space.</em>
          </p>

          <div className="p-3.5 bg-gb-surface border-2 border-gb-ink">
            <strong className="font-pixel text-[9px] text-hare block mb-1">THE GRAPH MAPPING:</strong>
            <p>
              Treat array indices $i$ as graph vertices. The value $nums[i]$ acts as the directed edge:
              <br />
              <code className="p-1 bg-gb-forest text-gb-cream font-bold block my-1">
                i &rarr; nums[i]
              </code>
            </p>
            <p>
              <strong>Pigeonhole Principle:</strong> $n+1$ values in $[1, n]$ forces at least one number to appear twice. 
              Multiple indices point to the duplicate number (in-degree &ge; 2). In a functional graph with out-degree 1, an in-degree &ge; 2 is the entrance to a cycle! 
              Floyd's algorithm locates it in $O(1)$ space.
            </p>
          </div>
        </div>
      ),
    },

    {
      num: 'No. 007',
      title: 'BIG-O COMPLEXITY',
      subtitle: 'SPECIES: PERFORMANCE INVARIANTS',
      sprite: <PixelBadge type="detection" size={32} />,
      type: 'BENCHMARK / MATRIX',
      stats: { height: 'O(N) TIME', weight: 'O(1) SPACE', habitat: 'ALGORITHM ENGINE' },
      content: (
        <div className="space-y-3 font-vt323 text-xl text-gb-ink leading-tight">
          <div className="overflow-x-auto">
            <table className="w-full border-2 border-gb-ink text-left font-pixel text-[8px] bg-gb-surface">
              <thead className="bg-gb-olive text-gb-cream border-b-2 border-gb-ink">
                <tr>
                  <th className="p-2">APPLICATION</th>
                  <th className="p-2">TIME</th>
                  <th className="p-2">SPACE</th>
                  <th className="p-2">HASH SET</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gb-ink text-gb-ink">
                <tr>
                  <td className="p-2 font-bold">CYCLE DETECT</td>
                  <td className="p-2 text-retro-success">O(N)</td>
                  <td className="p-2 text-retro-success">O(1)</td>
                  <td className="p-2 text-retro-error">O(N) SPACE</td>
                </tr>
                <tr>
                  <td className="p-2 font-bold">CYCLE ENTRY</td>
                  <td className="p-2 text-retro-success">O(N)</td>
                  <td className="p-2 text-retro-success">O(1)</td>
                  <td className="p-2 text-retro-error">O(N) SPACE</td>
                </tr>
                <tr>
                  <td className="p-2 font-bold">FIND MIDDLE</td>
                  <td className="p-2 text-retro-success">O(N)</td>
                  <td className="p-2 text-retro-success">O(1)</td>
                  <td className="p-2">O(1) (2-PASS)</td>
                </tr>
                <tr>
                  <td className="p-2 font-bold">FIND DUPLICATE</td>
                  <td className="p-2 text-retro-success">O(N)</td>
                  <td className="p-2 text-retro-success">O(1)</td>
                  <td className="p-2 text-retro-error">O(N) SPACE</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 select-none">
      {/* Pokédex Header Bar */}
      <div className="rpg-box-dark p-4 border-4 border-gb-ink shadow-pixel mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-full bg-cyan-400 border-2 border-gb-ink shadow-inner animate-pulse" />
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 border border-gb-ink" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 border border-gb-ink" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-500 border border-gb-ink" />
          </div>
          <span className="font-pixel text-xs text-gb-cream">
            POKÉDEX // ALGORITHM ENCYCLOPEDIA
          </span>
        </div>
        <div className="font-pixel text-[9px] text-gb-pale">
          ENTRIES RECORDED: 7 / 7
        </div>
      </div>

      {/* Pokédex Dual-Pane Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Pane (4 cols): Pokédex List */}
        <div className="lg:col-span-4 flex flex-col gap-2">
          {pokedexEntries.map((entry, idx) => {
            const isCurrent = activeTab === idx;
            return (
              <button
                key={entry.num}
                onClick={() => {
                  sound.playClick();
                  setActiveTab(idx);
                }}
                className={`flex items-center justify-between p-3 border-2 transition-all text-left ${
                  isCurrent
                    ? 'bg-gb-cream text-gb-ink border-gb-ink shadow-pixel font-bold'
                    : 'bg-gb-olive text-gb-cream border-gb-ink hover:bg-gb-leaf'
                }`}
              >
                <div>
                  <div className="font-pixel text-[8px] text-hare mb-0.5">
                    {entry.num}
                  </div>
                  <div className="font-pixel text-[9px]">
                    {entry.title}
                  </div>
                </div>
                <span className={isCurrent ? 'text-hare animate-bounce-pixel' : 'text-gb-pale'}>
                  ▶
                </span>
              </button>
            );
          })}
        </div>

        {/* Right Pane (8 cols): Pokédex CRT Data Display */}
        <div className="lg:col-span-8 rpg-box p-6 border-4 border-gb-ink shadow-pixel">
          {/* Top Data Bar */}
          <div className="flex items-center justify-between border-b-2 border-gb-ink pb-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="p-1 bg-gb-surface border-2 border-gb-ink">
                {pokedexEntries[activeTab].sprite}
              </div>
              <div>
                <span className="font-pixel text-[8px] text-hare">
                  {pokedexEntries[activeTab].num}
                </span>
                <h3 className="font-pixel text-sm text-gb-ink">
                  {pokedexEntries[activeTab].title}
                </h3>
              </div>
            </div>

            <div className="text-right">
              <span className="font-pixel text-[8px] px-2 py-0.5 bg-gb-forest text-gb-cream border border-gb-ink block">
                {pokedexEntries[activeTab].type}
              </span>
            </div>
          </div>

          {/* Stat Specs */}
          <div className="grid grid-cols-3 gap-2 p-2 bg-gb-surface border-2 border-gb-ink font-pixel text-[8px] text-gb-ink mb-4 text-center">
            <div>
              <span className="text-gb-forest opacity-70 block">HT / SPEED:</span>
              <span className="font-bold">{pokedexEntries[activeTab].stats.height}</span>
            </div>
            <div>
              <span className="text-gb-forest opacity-70 block">WT / SPACE:</span>
              <span className="font-bold text-retro-success">{pokedexEntries[activeTab].stats.weight}</span>
            </div>
            <div>
              <span className="text-gb-forest opacity-70 block">HABITAT:</span>
              <span className="font-bold text-hare truncate block">{pokedexEntries[activeTab].stats.habitat}</span>
            </div>
          </div>

          {/* Main Pokédex Content */}
          <div>{pokedexEntries[activeTab].content}</div>
        </div>
      </div>
    </div>
  );
};
