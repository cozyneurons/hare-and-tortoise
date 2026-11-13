import React, { useState, useEffect } from 'react';
import { 
  PixelHareSprite, 
  PixelTortoiseSprite 
} from '../pixel/PixelSprites';
import { sound } from '../../utils/audio';
import { simulateFloydCycleDetection } from '../../algorithms/floydCycleDetection';
import { simulateCycleEntry } from '../../algorithms/cycleEntry';
import { simulateFindMiddle } from '../../algorithms/findMiddle';
import { simulateFindDuplicate } from '../../algorithms/findDuplicate';

type Difficulty = 'beginner' | 'intermediate' | 'advanced';

interface ChallengeQuestion {
  id: string;
  type: 'cycle-exist' | 'predict-collision' | 'cycle-entry' | 'predict-middle' | 'find-duplicate';
  difficulty: Difficulty;
  prompt: string;
  details: string;
  options: (string | number)[];
  correctAnswer: string | number;
  explanation: string;
  mathExplanation: string;
}

export const ChallengeMode: React.FC = () => {
  const [difficulty, setDifficulty] = useState<Difficulty>('intermediate');
  const [currentQuestion, setCurrentQuestion] = useState<ChallengeQuestion | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);

  // Score & Streak State
  const [score, setScore] = useState<number>(() => {
    const saved = localStorage.getItem('chase_loop_score');
    return saved ? Number(saved) : 0;
  });
  const [streak, setStreak] = useState<number>(() => {
    const saved = localStorage.getItem('chase_loop_streak');
    return saved ? Number(saved) : 0;
  });
  const [highestStreak, setHighestStreak] = useState<number>(() => {
    const saved = localStorage.getItem('chase_loop_high_streak');
    return saved ? Number(saved) : 0;
  });
  const [questionsAnswered, setQuestionsAnswered] = useState<number>(0);

  const generateQuestion = (diff: Difficulty): ChallengeQuestion => {
    const types: ChallengeQuestion['type'][] = [
      'cycle-exist',
      'predict-collision',
      'cycle-entry',
      'predict-middle',
      'find-duplicate',
    ];
    const type = types[Math.floor(Math.random() * types.length)];
    const qId = `q-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

    if (type === 'cycle-exist') {
      const hasCycle = Math.random() > 0.45;
      const nodeCount = diff === 'beginner' ? 4 : diff === 'intermediate' ? 7 : 10;
      const cyclePos = hasCycle ? Math.floor(Math.random() * (nodeCount - 1)) : -1;
      simulateFloydCycleDetection({ nodeCount, cyclePos });

      return {
        id: qId,
        type: 'cycle-exist',
        difficulty: diff,
        prompt: 'A wild linked list appeared! Does this sequence contain a closed cycle?',
        details: hasCycle
          ? `List has ${nodeCount} nodes. Node #${nodeCount - 1} links back to Node #${cyclePos}.`
          : `List has ${nodeCount} nodes. Node #${nodeCount - 1} points to null.`,
        options: ['YES (Cycle Present)', 'NO (Strictly Linear)'],
        correctAnswer: hasCycle ? 'YES (Cycle Present)' : 'NO (Strictly Linear)',
        explanation: hasCycle
          ? `Super effective! Node #${nodeCount - 1} links to Node #${cyclePos}, trapping pointers in a loop of length ${nodeCount - cyclePos}.`
          : `Got away safely! Fast encounters null in at most ceil(${nodeCount}/2) turns.`,
        mathExplanation: `Relative speed of 1 guarantees collision in closed loop or immediate termination at null.`,
      };
    }

    if (type === 'predict-middle') {
      const nodeCount = diff === 'beginner' ? 5 : diff === 'intermediate' ? 6 : 9;
      const res = simulateFindMiddle({ nodeCount, convention: 'second' });
      const midVal = res.middleIndex!;

      const options = [
        midVal,
        Math.max(0, midVal - 1),
        Math.min(nodeCount - 1, midVal + 1),
        Math.max(0, midVal - 2),
      ].filter((v, idx, arr) => arr.indexOf(v) === idx).sort((a, b) => a - b);

      return {
        id: qId,
        type: 'predict-middle',
        difficulty: diff,
        prompt: `For a linear list with ${nodeCount} nodes (#0 to #${nodeCount - 1}), which node is the middle?`,
        details: `Convention: Standard second middle for even lengths (floor(N/2)).`,
        options,
        correctAnswer: midVal,
        explanation: `Critical hit! When Fast reaches the end, Slow has traversed floor(${nodeCount}/2) = ${midVal} nodes.`,
        mathExplanation: `Speed ratio is 2:1. When fast travels ${nodeCount} steps, slow travels exactly ${nodeCount}/2 steps.`,
      };
    }

    if (type === 'find-duplicate') {
      const n = diff === 'beginner' ? 3 : diff === 'intermediate' ? 5 : 8;
      const dup = Math.floor(Math.random() * n) + 1;
      const arr = [dup, dup];
      while (arr.length < n + 1) {
        arr.push(Math.floor(Math.random() * n) + 1);
      }
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }

      simulateFindDuplicate(arr);
      const options = Array.from(new Set(arr)).slice(0, 4);
      if (!options.includes(dup)) options[0] = dup;
      options.sort((a, b) => a - b);

      return {
        id: qId,
        type: 'find-duplicate',
        difficulty: diff,
        prompt: 'Identify the duplicate number hidden in this array!',
        details: `Array of length ${arr.length}: [${arr.join(', ')}]. Elements are in [1, ${n}].`,
        options,
        correctAnswer: dup,
        explanation: `Super effective! Value ${dup} appears at multiple indices, creating an in-degree >= 2 collision!`,
        mathExplanation: `Pigeonhole principle guarantees in-degree >= 2 for the duplicate in the functional graph.`,
      };
    }

    // Default: Cycle Entry Identification
    const nodeCount = diff === 'beginner' ? 6 : diff === 'intermediate' ? 8 : 11;
    const cyclePos = Math.floor(Math.random() * (nodeCount - 2)) + 1;
    const res = simulateCycleEntry({ nodeCount, cyclePos });

    const options = [
      cyclePos,
      Math.max(0, cyclePos - 1),
      Math.min(nodeCount - 1, cyclePos + 1),
      0,
    ].filter((v, idx, arr) => arr.indexOf(v) === idx).sort((a, b) => a - b);

    return {
      id: qId,
      type: 'cycle-entry',
      difficulty: diff,
      prompt: `Where does the cycle begin?`,
      details: `List of ${nodeCount} nodes. Phase 1 collision happened at Node #${res.meetingPointIndex}.`,
      options,
      correctAnswer: cyclePos,
      explanation: `Super effective! Moving two pointers at 1x from Head and Node #${res.meetingPointIndex} meets at Node #${cyclePos}!`,
      mathExplanation: `Floyd proof: distance from head mu equals distance from meeting point (m*lambda - k).`,
    };
  };

  useEffect(() => {
    setCurrentQuestion(generateQuestion(difficulty));
  }, [difficulty]);

  const handleSelectOption = (opt: string | number) => {
    if (isAnswered || !currentQuestion) return;

    setSelectedAnswer(opt);
    setIsAnswered(true);

    const correct = opt === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    setQuestionsAnswered(prev => prev + 1);

    if (correct) {
      sound.playVictory();
      const streakMultiplier = Math.min(3, 1 + streak * 0.2);
      const points = Math.round((difficulty === 'beginner' ? 100 : difficulty === 'intermediate' ? 200 : 350) * streakMultiplier);

      const newScore = score + points;
      const newStreak = streak + 1;
      setScore(newScore);
      setStreak(newStreak);
      localStorage.setItem('chase_loop_score', String(newScore));
      localStorage.setItem('chase_loop_streak', String(newStreak));

      if (newStreak > highestStreak) {
        setHighestStreak(newStreak);
        localStorage.setItem('chase_loop_high_streak', String(newStreak));
      }
    } else {
      sound.playReset();
      setStreak(0);
      localStorage.setItem('chase_loop_streak', '0');
    }
  };

  const handleNextQuestion = () => {
    sound.playClick();
    setSelectedAnswer(null);
    setIsAnswered(false);
    setIsCorrect(false);
    setCurrentQuestion(generateQuestion(difficulty));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 select-none">
      {/* Top Trainer Battle HUD */}
      <div className="rpg-box-dark p-4 border-4 border-gb-ink shadow-pixel mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-1 bg-gb-cream border-2 border-gb-ink">
            <PixelTortoiseSprite size={28} />
          </div>
          <div>
            <div className="font-pixel text-[9px] text-gb-pale">
              TRAINER BATTLE ARENA
            </div>
            <div className="font-pixel text-sm text-gb-cream">
              XP: <span className="text-hare">{score.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Streak & Difficulty Badges */}
        <div className="flex items-center gap-3">
          <div className="px-2 py-1 bg-gb-forest border-2 border-gb-ink font-pixel text-[9px] text-gb-cream">
            BATTLES: {questionsAnswered}
          </div>
          <div className="px-2 py-1 bg-gb-forest border-2 border-gb-ink font-pixel text-[9px] text-retro-warning">
            🔥 STREAK: {streak}x
          </div>
          <div className="px-2 py-1 bg-gb-forest border-2 border-gb-ink font-pixel text-[9px] text-gb-pale">
            RECORD: {highestStreak}
          </div>
        </div>
      </div>

      {/* Difficulty Switcher (Gym Tiers) */}
      <div className="flex items-center gap-2 mb-6 font-pixel text-[9px]">
        <span className="text-gb-pale mr-1">GYM TIER:</span>
        {(['beginner', 'intermediate', 'advanced'] as Difficulty[]).map((diff) => (
          <button
            key={diff}
            onClick={() => {
              sound.playClick();
              setDifficulty(diff);
              setSelectedAnswer(null);
              setIsAnswered(false);
            }}
            className={`px-2.5 py-1.5 border-2 border-gb-ink transition-all uppercase ${
              difficulty === diff
                ? 'bg-gb-cream text-gb-ink font-bold shadow-pixel-sm'
                : 'bg-gb-olive text-gb-cream hover:bg-gb-leaf'
            }`}
          >
            {diff === 'beginner' ? 'ROOKIE' : diff === 'intermediate' ? 'LEADER' : 'CHAMPION'}
          </button>
        ))}
      </div>

      {/* Classic Pokémon Battle Arena Viewport */}
      {currentQuestion && (
        <div className="rpg-box-dark p-4 sm:p-6 border-4 border-gb-ink shadow-pixel mb-6">
          {/* Opponent Card (Top Right) */}
          <div className="flex justify-end mb-6">
            <div className="rpg-box p-3 border-2 border-gb-ink shadow-pixel-sm min-w-[240px]">
              <div className="flex justify-between items-center font-pixel text-[9px] border-b border-gb-ink pb-1 mb-1">
                <span className="font-bold">WILD ALGORITHM</span>
                <span className="text-hare">:L{difficulty === 'beginner' ? '25' : difficulty === 'intermediate' ? '50' : '85'}</span>
              </div>
              <div className="flex items-center gap-2 font-pixel text-[8px] text-gb-ink">
                <span>HP:</span>
                <div className="flex-1 h-2.5 bg-gb-forest border border-gb-ink p-0.5">
                  <div className="h-full bg-retro-success w-full" />
                </div>
              </div>
            </div>
          </div>

          {/* Player Card & Sprites (Bottom Left) */}
          <div className="flex items-end justify-between mb-4">
            <div className="flex items-center gap-3">
              <PixelTortoiseSprite size={44} className="animate-bounce-pixel" />
              <PixelHareSprite size={44} className="animate-bounce-pixel" />
            </div>

            <div className="rpg-box p-3 border-2 border-gb-ink shadow-pixel-sm min-w-[240px]">
              <div className="flex justify-between items-center font-pixel text-[9px] border-b border-gb-ink pb-1 mb-1">
                <span className="font-bold">CHASE &amp; LOOP</span>
                <span className="text-tortoise">:L{Math.min(99, 20 + streak * 5)}</span>
              </div>
              <div className="flex items-center gap-2 font-pixel text-[8px] text-gb-ink">
                <span>EXP:</span>
                <div className="flex-1 h-2.5 bg-gb-forest border border-gb-ink p-0.5">
                  <div className="h-full bg-hare" style={{ width: `${Math.min(100, streak * 20)}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Question Prompt Dialogue Box */}
          <div className="rpg-box p-4 border-2 border-gb-ink mb-4">
            <h3 className="font-pixel text-xs text-gb-ink mb-1.5 leading-snug">
              {currentQuestion.prompt}
            </h3>
            <p className="font-vt323 text-xl text-gb-forest leading-tight">
              &ldquo;{currentQuestion.details}&rdquo;
            </p>
          </div>

          {/* 4-Quadrant Battle Action Menu */}
          <div className="rpg-panel-cream p-4 border-2 border-gb-ink">
            <div className="font-pixel text-[9px] text-gb-ink border-b-2 border-gb-ink pb-2 mb-3">
              WHAT WILL TRAINER DO?
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {currentQuestion.options.map((option, idx) => {
                const isSelected = selectedAnswer === option;
                const isOptionCorrect = option === currentQuestion.correctAnswer;

                let btnClass = 'bg-gb-surface text-gb-ink border-gb-ink hover:bg-gb-cream';
                if (isAnswered) {
                  if (isOptionCorrect) {
                    btnClass = 'bg-retro-success text-white font-bold border-gb-ink shadow-pixel-sm';
                  } else if (isSelected) {
                    btnClass = 'bg-retro-error text-white font-bold border-gb-ink';
                  } else {
                    btnClass = 'bg-gb-forest/20 text-gb-ink/40 border-gb-ink';
                  }
                }

                return (
                  <button
                    key={`opt-${idx}`}
                    disabled={isAnswered}
                    onClick={() => handleSelectOption(option)}
                    className={`p-3 border-2 font-pixel text-[10px] text-left transition-all flex items-center justify-between ${btnClass}`}
                  >
                    <span>
                      <span className="text-hare mr-1.5">▶</span>
                      {String(option)}
                    </span>
                    {isAnswered && isOptionCorrect && <span>★</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Post-Battle Dialogue Box */}
          {isAnswered && (
            <div className="rpg-box p-4 border-2 border-gb-ink mt-4">
              <div className="font-pixel text-[10px] mb-1 font-bold">
                {isCorrect ? (
                  <span className="text-retro-success">★ IT'S SUPER EFFECTIVE! ★</span>
                ) : (
                  <span className="text-retro-error">TRAINER'S GUESS MISSED...</span>
                )}
              </div>
              <p className="font-vt323 text-xl text-gb-ink leading-tight mb-2">
                {currentQuestion.explanation}
              </p>
              <div className="p-2 bg-gb-surface border border-gb-ink font-vt323 text-lg text-gb-forest">
                LOGIC: {currentQuestion.mathExplanation}
              </div>

              <div className="mt-3 flex justify-end">
                <button
                  onClick={handleNextQuestion}
                  className="pixel-btn bg-hare text-white hover:bg-hare-light"
                >
                  NEXT BATTLE ▶
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
