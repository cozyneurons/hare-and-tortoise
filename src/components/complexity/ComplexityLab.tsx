import React, { useState } from 'react';
import { 
  Database, 
  BarChart3, 
  CheckCircle, 
  AlertTriangle, 
  Zap, 
  HardDrive,
  Layers
} from 'lucide-react';

export const ComplexityLab: React.FC = () => {
  const [listSize, setListSize] = useState<number>(1000); // N items

  // Calculated metrics
  const floydMemoryBytes = 16; // Two 64-bit pointers (slow, fast)
  const hashSetMemoryBytes = listSize * 32; // ~32 bytes per Hash entry (node pointer, hash, bucket pointer)

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-arcade-900 border border-arcade-750 text-xs font-mono text-lime-accent mb-2">
          <BarChart3 className="w-3.5 h-3.5" />
          <span>EFFICIENCY & MEMORY LAB</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Floyd's Algorithm vs Hash Set Traversal
        </h2>
        <p className="text-sm text-slate-400 mt-1 max-w-2xl">
          An interactive laboratory comparing memory allocation, cache locality, and auxiliary space complexity.
        </p>
      </div>

      {/* Interactive Size Slider */}
      <div className="p-6 bg-arcade-900 border border-arcade-800 rounded-2xl shadow-xl mb-8">
        <div className="flex flex-wrap justify-between items-center gap-2 mb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono font-bold text-slate-300 uppercase">
              VIRTUAL LINKED LIST SCALE:
            </span>
          </div>
          <span className="text-base font-extrabold font-mono text-lime-accent">
            N = {listSize.toLocaleString()} Nodes
          </span>
        </div>

        <input
          type="range"
          min={50}
          max={50000}
          step={50}
          value={listSize}
          onChange={(e) => setListSize(Number(e.target.value))}
          className="w-full h-2 bg-arcade-800 rounded-lg appearance-none cursor-pointer accent-lime-accent mb-2"
        />

        <div className="flex justify-between text-[11px] font-mono text-slate-500">
          <span>50 nodes (Micro)</span>
          <span>10,000 nodes (Mid-scale)</span>
          <span>50,000 nodes (High throughput)</span>
        </div>
      </div>

      {/* Side-by-Side Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Floyd's Algorithm Card */}
        <div className="p-6 rounded-2xl bg-arcade-900 border border-lime-accent/40 shadow-glow-lime flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-lime-accent font-mono font-bold text-sm">
                <Zap className="w-5 h-5" />
                <span>FLOYD'S TWO POINTERS</span>
              </div>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-lime-accent/20 text-lime-accent">
                OPTIMAL
              </span>
            </div>

            {/* Metrics */}
            <div className="space-y-3 font-mono text-xs mb-6">
              <div className="flex justify-between items-center p-2.5 rounded bg-arcade-950 border border-arcade-800">
                <span className="text-slate-400">Auxiliary Space:</span>
                <span className="text-lime-accent font-extrabold text-sm">O(1) CONSTANT</span>
              </div>
              <div className="flex justify-between items-center p-2.5 rounded bg-arcade-950 border border-arcade-800">
                <span className="text-slate-400">Time Complexity:</span>
                <span className="text-white font-bold">O(N) Linear</span>
              </div>
              <div className="flex justify-between items-center p-2.5 rounded bg-arcade-950 border border-arcade-800">
                <span className="text-slate-400">Memory Allocated:</span>
                <span className="text-cyan-400 font-bold">{floydMemoryBytes} bytes (Fixed)</span>
              </div>
              <div className="flex justify-between items-center p-2.5 rounded bg-arcade-950 border border-arcade-800">
                <span className="text-slate-400">Storage Location:</span>
                <span className="text-slate-200">2 CPU Registers</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Floyd's algorithm holds only two pointers (<code className="text-cyan-300">slow</code> and <code className="text-amber-300">fast</code>) in registers. 
              Regardless of whether $N = 10$ or $N = 10,000,000$, memory usage never exceeds 16 bytes.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-arcade-800 text-[11px] font-mono text-lime-accent flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>Zero Heap Allocation &bull; Safe for Kernel Space</span>
          </div>
        </div>

        {/* Hash Set Card */}
        <div className="p-6 rounded-2xl bg-arcade-900 border border-arcade-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-slate-300 font-mono font-bold text-sm">
                <Database className="w-5 h-5 text-cyan-400" />
                <span>HASH SET LOOKUP</span>
              </div>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-arcade-800 text-slate-400">
                CONVENTIONAL
              </span>
            </div>

            {/* Metrics */}
            <div className="space-y-3 font-mono text-xs mb-6">
              <div className="flex justify-between items-center p-2.5 rounded bg-arcade-950 border border-arcade-800">
                <span className="text-slate-400">Auxiliary Space:</span>
                <span className="text-rose-400 font-extrabold text-sm">O(N) LINEAR</span>
              </div>
              <div className="flex justify-between items-center p-2.5 rounded bg-arcade-950 border border-arcade-800">
                <span className="text-slate-400">Time Complexity:</span>
                <span className="text-white font-bold">O(N) Average</span>
              </div>
              <div className="flex justify-between items-center p-2.5 rounded bg-arcade-950 border border-arcade-800">
                <span className="text-slate-400">Memory Allocated:</span>
                <span className="text-rose-400 font-bold">
                  {(hashSetMemoryBytes / 1024).toFixed(1)} KB (Dynamic)
                </span>
              </div>
              <div className="flex justify-between items-center p-2.5 rounded bg-arcade-950 border border-arcade-800">
                <span className="text-slate-400">Storage Location:</span>
                <span className="text-slate-200">Heap Memory (Bucket table)</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              A Hash Set requires allocating a dynamic hash table with bucket arrays, hash codes, and linked collision lists. 
              For $N = {listSize.toLocaleString()}$, this consumes approximately {(hashSetMemoryBytes / 1024).toFixed(1)} KB of RAM and triggers Garbage Collection pauses.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-arcade-800 text-[11px] font-mono text-amber-400 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Out-Of-Memory Risk on Large Streams</span>
          </div>
        </div>
      </div>

      {/* Visual Memory Meter Breakdown */}
      <div className="p-6 bg-arcade-900 border border-arcade-800 rounded-2xl shadow-xl font-mono text-xs">
        <div className="flex items-center gap-2 text-slate-300 font-bold mb-4">
          <HardDrive className="w-4 h-4 text-lime-accent" />
          <span>MEMORY FOOTPRINT COMPARISON (SCALE: 16B vs {(hashSetMemoryBytes / 1024).toFixed(1)}KB)</span>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-slate-400 mb-1">
              <span>Floyd's Algorithm:</span>
              <span className="text-lime-accent font-bold">16 Bytes</span>
            </div>
            <div className="w-full h-3 bg-arcade-950 rounded-full overflow-hidden border border-arcade-800">
              <div className="h-full bg-lime-accent w-[2px] shadow-glow-lime" />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-slate-400 mb-1">
              <span>Hash Set Table:</span>
              <span className="text-rose-400 font-bold">
                {(hashSetMemoryBytes / 1024).toFixed(1)} KB ({Math.round(hashSetMemoryBytes / 16).toLocaleString()}x more memory!)
              </span>
            </div>
            <div className="w-full h-3 bg-arcade-950 rounded-full overflow-hidden border border-arcade-800">
              <div className="h-full bg-gradient-to-r from-amber-500 to-rose-500 w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
