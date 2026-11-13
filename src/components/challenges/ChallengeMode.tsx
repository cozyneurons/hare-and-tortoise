import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Flame, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  ArrowRight,
  ShieldAlert,
  Award
} from 'lucide-react';
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

  // Score & Streak State (persisted in localStorage)
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

  // Generator for challenge questions
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
        prompt: 'Does this linked list structure contain a cycle?',
        details: hasCycle
          ? `List has ${nodeCount} nodes. Node #${nodeCount - 1} points back to Node #${cyclePos}.`
          : `List has ${nodeCount} nodes. Node #${nodeCount - 1} points to null.`,
        options: ['Yes (Cycle Detected)', 'No (Strictly Linear)'],
        correctAnswer: hasCycle ? 'Yes (Cycle Detected)' : 'No (Strictly Linear)',
        explanation: hasCycle
          ? `Correct! Because node ${nodeCount - 1} points to node ${cyclePos}, there is a closed loop of length ${nodeCount - cyclePos}.`
          : `Correct! Fast reaches null in at most ceil(${nodeCount}/2) iterations.`,
        mathExplanation: `Relative speed of 1 guarantees collision inside any cycle or immediate termination at null.`,
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
        prompt: `For a linked list with ${nodeCount} nodes (indices 0 to ${nodeCount - 1}), which node index is returned as the middle?`,
        details: `Convention: Standard second middle for even lengths (floor(N/2)).`,
        options,
        correctAnswer: midVal,
        explanation: `Correct! When Fast reaches the end (null or tail), Slow has traversed floor(${nodeCount} / 2) = ${midVal} nodes.`,
        mathExplanation: `Speed ratio is 2:1. When fast travels ${nodeCount} steps, slow travels ${nodeCount}/2 steps.`,
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
        prompt: 'Which number is repeated in this array?',
        details: `Array of length ${arr.length}: [${arr.join(', ')}]. Each value is in [1, ${n}].`,
        options,
        correctAnswer: dup,
        explanation: `Correct! Value ${dup} appears at multiple indices, creating a collision in the functional graph traversal.`,
        mathExplanation: `By the Pigeonhole Principle, n+1 items in n buckets guarantees in-degree >= 2 for the duplicate.`,
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
      details: `Linked list of ${nodeCount} nodes. Node #${nodeCount - 1} links back to create a loop. Phase 1 collision occurred at node #${res.meetingPointIndex}.`,
      options,
      correctAnswer: cyclePos,
      explanation: `Correct! When one pointer starts at Head (node 0) and one at Meeting node ${res.meetingPointIndex}, moving both at 1x causes them to meet at node ${cyclePos}.`,
      mathExplanation: `Floyd proof: distance from head μ equals distance from meeting point (m·λ - k).`,
    };
  };

  // Load first question
  useEffect(() => {
    setCurrentQuestion(generateQuestion(difficulty));
  }, [difficulty]);

  // Handle Answer Selection
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

  // Next Question
  const handleNextQuestion = () => {
    sound.playClick();
    setSelectedAnswer(null);
    setIsAnswered(false);
    setIsCorrect(false);
    setCurrentQuestion(generateQuestion(difficulty));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header & Arcade Scoreboard */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 bg-arcade-900 border border-arcade-800 p-4 rounded-2xl shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
              ARCADE CHALLENGE ARENA
            </div>
            <div className="text-lg font-extrabold text-white font-mono">
              SCORE: <span className="text-lime-accent">{score.toLocaleString()} XP</span>
            </div>
          </div>
        </div>

        {/* Streak HUD */}
        <div className="flex items-center gap-4 font-mono text-xs">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-arcade-950 border border-amber-500/30 text-amber-400">
            <Flame className="w-4 h-4 fill-current animate-pulse text-amber-500" />
            <span className="font-bold">STREAK: {streak}x</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-arcade-950 border border-arcade-800 text-slate-400">
            <Award className="w-4 h-4 text-cyan-400" />
            <span>BEST: {highestStreak}</span>
          </div>
        </div>
      </div>

      {/* Difficulty Switcher */}
      <div className="flex items-center gap-2 mb-6">
        <span className="text-xs font-mono text-slate-500 mr-2">DIFFICULTY:</span>
        {(['beginner', 'intermediate', 'advanced'] as Difficulty[]).map((diff) => (
          <button
            key={diff}
            onClick={() => {
              sound.playClick();
              setDifficulty(diff);
              setSelectedAnswer(null);
              setIsAnswered(false);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase transition-all ${
              difficulty === diff
                ? 'bg-lime-accent text-arcade-950 shadow-glow-lime'
                : 'bg-arcade-900 border border-arcade-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {diff}
          </button>
        ))}
      </div>

      {/* Main Question Card */}
      {currentQuestion && (
        <div className="p-6 bg-arcade-900 border border-arcade-800 rounded-2xl shadow-2xl relative overflow-hidden">
          {/* Question Tag */}
          <div className="flex items-center justify-between mb-4 border-b border-arcade-800 pb-3">
            <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-arcade-850 text-cyan-400 border border-cyan-500/20 uppercase">
              {currentQuestion.type.replace('-', ' ')}
            </span>
            <span className="text-xs font-mono text-slate-500">
              Q#{questionsAnswered + 1}
            </span>
          </div>

          {/* Question Prompt */}
          <h3 className="text-xl font-bold text-white mb-2 leading-snug">
            {currentQuestion.prompt}
          </h3>
          <div className="p-3 rounded-lg bg-arcade-950 border border-arcade-800 font-mono text-xs text-slate-300 mb-6">
            {currentQuestion.details}
          </div>

          {/* Answer Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {currentQuestion.options.map((option, idx) => {
              const isSelected = selectedAnswer === option;
              const isOptionCorrect = option === currentQuestion.correctAnswer;

              let btnStyle = 'bg-arcade-950 border-arcade-800 text-slate-200 hover:border-slate-600';
              if (isAnswered) {
                if (isOptionCorrect) {
                  btnStyle = 'bg-emerald-950/80 border-lime-accent text-lime-accent font-bold shadow-glow-lime';
                } else if (isSelected) {
                  btnStyle = 'bg-rose-950/80 border-rose-500 text-rose-300 font-bold';
                } else {
                  btnStyle = 'bg-arcade-950/40 border-arcade-800 text-slate-600 opacity-50';
                }
              }

              return (
                <button
                  key={`opt-${idx}`}
                  disabled={isAnswered}
                  onClick={() => handleSelectOption(option)}
                  className={`flex items-center justify-between p-4 rounded-xl border font-mono text-sm transition-all duration-200 text-left ${btnStyle} ${
                    !isAnswered ? 'active:scale-98' : ''
                  }`}
                >
                  <span>{String(option)}</span>
                  {isAnswered && isOptionCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-lime-accent shrink-0" />
                  )}
                  {isAnswered && isSelected && !isOptionCorrect && (
                    <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Post-Answer Explanation Box */}
          {isAnswered && (
            <div className={`p-4 rounded-xl border mb-6 transition-all font-mono text-xs ${
              isCorrect
                ? 'bg-emerald-950/40 border-lime-accent/50 text-slate-200'
                : 'bg-rose-950/30 border-rose-800/50 text-slate-200'
            }`}>
              <div className="flex items-center gap-2 font-bold mb-1.5">
                {isCorrect ? (
                  <span className="text-lime-accent flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" /> EXCELLENT! +{(difficulty === 'beginner' ? 100 : difficulty === 'intermediate' ? 200 : 350) * Math.min(3, 1 + (streak - 1) * 0.2)} XP
                  </span>
                ) : (
                  <span className="text-rose-400 flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4" /> INCORRECT
                  </span>
                )}
              </div>
              <p className="font-sans text-sm text-slate-300 mb-2 leading-relaxed">
                {currentQuestion.explanation}
              </p>
              <div className="p-2.5 rounded bg-arcade-950/80 border border-arcade-800 text-slate-400">
                <span className="text-cyan-400 font-semibold">THEORY REASONING: </span>
                {currentQuestion.mathExplanation}
              </div>

              {/* Next Question CTA */}
              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleNextQuestion}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-lime-accent hover:bg-lime-400 text-arcade-950 font-bold text-xs font-mono transition-all duration-150 active:scale-95 shadow-glow-lime"
                >
                  <span>NEXT CHALLENGE</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
