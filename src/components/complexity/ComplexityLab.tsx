import React, { useState } from 'react';
import { PixelBadge, PixelTortoiseSprite, PixelHareSprite } from '../pixel/PixelSprites';

export const ComplexityLab: React.FC = () => {
  const [listSize, setListSize] = useState<number>(1000);

  const floydMemoryBytes = 16;
  const hashSetMemoryBytes = listSize * 32;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 select-none">
      {/* Top Trainer Card */}
      <div className="rpg-box-dark p-6 border-4 border-gb-ink shadow-pixel mb-8">
        {/* Trainer Card Header */}
        <div className="flex items-center justify-between border-b-2 border-gb-ink pb-3 mb-4">
          <div className="flex items-center gap-2 font-pixel text-xs text-gb-cream">
            <span className="w-2.5 h-2.5 bg-hare border border-gb-ink" />
            <span>TRAINER CARD // ALGORITHM PASSPORT</span>
          </div>
          <div className="font-pixel text-[9px] text-gb-pale">
            IDNo. 1967-FLOYD
          </div>
        </div>

        {/* Card Body */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Trainer Avatar Photo */}
          <div className="md:col-span-4 flex flex-col items-center p-4 bg-gb-cream border-2 border-gb-ink text-gb-ink shadow-pixel-sm">
            <div className="flex items-center justify-center gap-2 mb-2 p-3 bg-gb-surface border-2 border-gb-ink w-full">
              <PixelTortoiseSprite size={36} />
              <PixelHareSprite size={36} />
            </div>
            <span className="font-pixel text-xs text-gb-ink font-bold">
              TRAINER CHASE
            </span>
            <span className="font-vt323 text-lg text-gb-forest">
              POINTER MASTERY RANK: S
            </span>
          </div>

          {/* Trainer Stats */}
          <div className="md:col-span-8 font-pixel text-[9px] text-gb-cream space-y-2.5">
            <div className="flex justify-between border-b border-gb-olive pb-1">
              <span className="text-gb-pale">PRIMARY ALGORITHM:</span>
              <span className="text-hare">FLOYD TWO-POINTERS</span>
            </div>
            <div className="flex justify-between border-b border-gb-olive pb-1">
              <span className="text-gb-pale">TIME COMPLEXITY:</span>
              <span className="text-retro-warning font-bold">O(N) LINEAR</span>
            </div>
            <div className="flex justify-between border-b border-gb-olive pb-1">
              <span className="text-gb-pale">AUXILIARY SPACE:</span>
              <span className="text-retro-success font-bold">O(1) CONSTANT (16 BYTES)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gb-pale">MEMORY ALLOCATION:</span>
              <span className="text-gb-cream">2 CPU REGISTERS</span>
            </div>

            {/* Gym Badges Display */}
            <div className="pt-2 border-t-2 border-gb-ink">
              <span className="text-[8px] text-gb-pale block mb-1.5">GYM BADGES EARNED:</span>
              <div className="flex items-center gap-3 p-2 bg-gb-forest border-2 border-gb-ink">
                <div className="text-center" title="Cycle Detection Badge">
                  <PixelBadge type="detection" size={28} />
                  <span className="text-[7px] text-gb-pale block mt-0.5">DETECT</span>
                </div>
                <div className="text-center" title="Cycle Entry Badge">
                  <PixelBadge type="entry" size={28} />
                  <span className="text-[7px] text-gb-pale block mt-0.5">ENTRY</span>
                </div>
                <div className="text-center" title="Middle Node Badge">
                  <PixelBadge type="middle" size={28} />
                  <span className="text-[7px] text-gb-pale block mt-0.5">MIDDLE</span>
                </div>
                <div className="text-center" title="Duplicate Finder Badge">
                  <PixelBadge type="duplicate" size={28} />
                  <span className="text-[7px] text-gb-pale block mt-0.5">DUPE</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scale Dial (Nodes Slider) */}
      <div className="rpg-box p-5 border-4 border-gb-ink shadow-pixel mb-8">
        <div className="flex justify-between items-center font-pixel text-[10px] text-gb-ink mb-2">
          <span>EXPERIMENT SCALE:</span>
          <span className="text-hare font-bold">N = {listSize.toLocaleString()} NODES</span>
        </div>

        <input
          type="range"
          min={50}
          max={50000}
          step={50}
          value={listSize}
          onChange={(e) => setListSize(Number(e.target.value))}
          className="w-full accent-hare cursor-pointer mb-2"
        />

        <div className="flex justify-between font-pixel text-[8px] text-gb-forest">
          <span>50 NODES (TEST)</span>
          <span>10,000 (STREAM)</span>
          <span>50,000 (HIGH THROUGHPUT)</span>
        </div>
      </div>

      {/* Inventory Bag Comparison (Floyd's Pocket vs Hash Set Heavy Backpack) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Floyd's Pocket Card */}
        <div className="rpg-box-dark p-5 border-4 border-gb-ink shadow-pixel flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center border-b-2 border-gb-ink pb-2 mb-3">
              <span className="font-pixel text-[10px] text-hare">
                🎒 FLOYD'S LIGHT POCKET
              </span>
              <span className="px-1.5 py-0.5 font-pixel text-[7px] bg-retro-success text-white border border-gb-ink">
                OPTIMAL
              </span>
            </div>

            <div className="font-vt323 text-xl text-gb-cream space-y-2 mb-4">
              <div className="flex justify-between p-2 bg-gb-forest border border-gb-ink">
                <span className="text-gb-pale">SPACE:</span>
                <span className="text-retro-success font-bold font-pixel text-[9px]">O(1) CONSTANT</span>
              </div>
              <div className="flex justify-between p-2 bg-gb-forest border border-gb-ink">
                <span className="text-gb-pale">BAG WEIGHT (RAM):</span>
                <span className="text-gb-cream font-bold">{floydMemoryBytes} BYTES FIXED</span>
              </div>
              <div className="flex justify-between p-2 bg-gb-forest border border-gb-ink">
                <span className="text-gb-pale">ITEM SLOTS:</span>
                <span className="text-gb-cream">2 POINTERS (SLOW, FAST)</span>
              </div>
            </div>

            <p className="font-vt323 text-lg text-gb-pale leading-tight">
              Regardless of whether N = 10 or 10,000,000, memory never exceeds 16 bytes. Zero garbage collection pauses. Safe for embedded microcontrollers and kernel memory!
            </p>
          </div>
        </div>

        {/* Hash Set Heavy Backpack Card */}
        <div className="rpg-box-dark p-5 border-4 border-gb-ink shadow-pixel flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center border-b-2 border-gb-ink pb-2 mb-3">
              <span className="font-pixel text-[10px] text-retro-error">
                🎒 HASH SET OVERPACKED BAG
              </span>
              <span className="px-1.5 py-0.5 font-pixel text-[7px] bg-retro-error text-white border border-gb-ink">
                HEAVY
              </span>
            </div>

            <div className="font-vt323 text-xl text-gb-cream space-y-2 mb-4">
              <div className="flex justify-between p-2 bg-gb-forest border border-gb-ink">
                <span className="text-gb-pale">SPACE:</span>
                <span className="text-retro-error font-bold font-pixel text-[9px]">O(N) LINEAR</span>
              </div>
              <div className="flex justify-between p-2 bg-gb-forest border border-gb-ink">
                <span className="text-gb-pale">BAG WEIGHT (RAM):</span>
                <span className="text-retro-error font-bold">{(hashSetMemoryBytes / 1024).toFixed(1)} KB DYNAMIC</span>
              </div>
              <div className="flex justify-between p-2 bg-gb-forest border border-gb-ink">
                <span className="text-gb-pale">ITEM SLOTS:</span>
                <span className="text-gb-cream">{listSize.toLocaleString()} HASH ENTRIES</span>
              </div>
            </div>

            <p className="font-vt323 text-lg text-gb-pale leading-tight">
              Requires allocating dynamic bucket arrays, hash codes, and pointer nodes. For N = {listSize.toLocaleString()}, consumes {(hashSetMemoryBytes / 1024).toFixed(1)} KB of heap memory and risks Out-Of-Memory exceptions!
            </p>
          </div>
        </div>
      </div>

      {/* Retro Memory Visual Meter */}
      <div className="rpg-box p-5 border-4 border-gb-ink shadow-pixel">
        <div className="font-pixel text-[9px] text-gb-ink mb-3 border-b-2 border-gb-ink pb-1 flex justify-between">
          <span>MEMORY FOOTPRINT COMPARISON GAUGE</span>
          <span className="text-hare">16 BYTES vs {(hashSetMemoryBytes / 1024).toFixed(1)} KB</span>
        </div>

        <div className="space-y-3 font-vt323 text-lg text-gb-ink">
          <div>
            <div className="flex justify-between mb-1 font-pixel text-[8px]">
              <span>FLOYD'S TWO POINTERS:</span>
              <span className="text-retro-success">16 BYTES</span>
            </div>
            <div className="w-full h-4 bg-gb-forest border-2 border-gb-ink p-0.5">
              <div className="h-full bg-retro-success w-[3px]" />
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-1 font-pixel text-[8px]">
              <span>HASH SET BUCKETS:</span>
              <span className="text-retro-error">{(hashSetMemoryBytes / 1024).toFixed(1)} KB ({Math.round(hashSetMemoryBytes / 16).toLocaleString()}x LARGER!)</span>
            </div>
            <div className="w-full h-4 bg-gb-forest border-2 border-gb-ink p-0.5">
              <div className="h-full bg-retro-error w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
