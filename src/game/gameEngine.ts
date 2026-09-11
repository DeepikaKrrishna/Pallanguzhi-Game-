// Game engine: resolves turns, returns state and animation events
import {
  CAPTURE_COUNT,
  MAX_STEPS_PER_TURN,
} from '../constants/gameConstants';
import {
  GameState,
  PlayerId,
  SowEvent,
  TurnResult,
  cloneState,
  createInitialState,
  otherPlayer,
} from './gameState';
import {
  isCapturePit,
  isGameOver,
  isValidMove,
  nextPitIndex,
} from './pallanguzhiRules';
import { decideWinner, sweepRemainingSeeds } from './scoring';

export { createInitialState };

/**
 * Plays one complete turn and returns the resulting state together with the
 * ordered list of events the UI replays as animation. The input state is never
 * mutated.
 *
 * Returns null when the move is not legal, so the caller can ignore the tap.
 */
export const playTurn = (
  state: GameState,
  pitIndex: number
): TurnResult | null => {
  if (!isValidMove(state, pitIndex)) return null;

  const next = cloneState(state);
  const events: SowEvent[] = [];
  const player: PlayerId = next.currentPlayer;

  let hand = next.pits[pitIndex];
  next.pits[pitIndex] = 0;
  let cursor = pitIndex;
  events.push({ type: 'pickup', pit: pitIndex, seeds: hand });

  let steps = 0;

  // Sow, then relay from the following pit, until the relay chain breaks.
  while (steps < MAX_STEPS_PER_TURN) {
    while (hand > 0) {
      steps += 1;
      cursor = nextPitIndex(cursor);
      next.pits[cursor] += 1;
      hand -= 1;
      events.push({ type: 'sow', pit: cursor, seedsInPit: next.pits[cursor] });

      // "Pasu" capture: a pit that reaches exactly four is taken at once.
      if (isCapturePit(next.pits[cursor])) {
        next.pits[cursor] = 0;
        next.scores[player] += CAPTURE_COUNT;
        events.push({
          type: 'capture',
          pit: cursor,
          seeds: CAPTURE_COUNT,
          player,
        });
      }
    }

    const lookAhead = nextPitIndex(cursor);

    if (next.pits[lookAhead] > 0) {
      // Relay: lift the seeds ahead and continue sowing.
      hand = next.pits[lookAhead];
      next.pits[lookAhead] = 0;
      cursor = lookAhead;
      events.push({ type: 'pickup', pit: lookAhead, seeds: hand });
      continue;
    }

    // Empty pit ahead: the pit beyond it is captured and the turn ends.
    const beyond = nextPitIndex(lookAhead);
    if (next.pits[beyond] > 0) {
      const taken = next.pits[beyond];
      next.pits[beyond] = 0;
      next.scores[player] += taken;
      events.push({ type: 'capture', pit: beyond, seeds: taken, player });
    }
    break;
  }

  next.turnCount += 1;
  next.currentPlayer = otherPlayer(player);
  events.push({ type: 'endTurn', nextPlayer: next.currentPlayer });

  if (isGameOver(next)) {
    sweepRemainingSeeds(next);
    next.status = 'finished';
    next.winner = decideWinner(next.scores);
    events.push({ type: 'gameOver', winner: next.winner });
  }

  return { state: next, events };
};

/** Starts a fresh game, optionally letting the loser of the last game begin. */
export const restartGame = (startingPlayer: PlayerId = 0): GameState =>
  createInitialState(startingPlayer);
