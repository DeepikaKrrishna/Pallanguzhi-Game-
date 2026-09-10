import { TOTAL_PITS } from '../constants/gameConstants';
import { GameState, PlayerId, Winner, ownerOfPit } from './gameState';

/** Adds captured seeds to a player's pile. */
export const addToScore = (
  scores: [number, number],
  player: PlayerId,
  seeds: number
): [number, number] => {
  const next: [number, number] = [scores[0], scores[1]];
  next[player] += seeds;
  return next;
};

/**
 * At the end of a game, seeds left on the board are collected by the owner of
 * the row they sit in. Mutates the passed state, which is always a clone.
 */
export const sweepRemainingSeeds = (state: GameState): GameState => {
  for (let i = 0; i < TOTAL_PITS; i += 1) {
    const seeds = state.pits[i];
    if (seeds > 0) {
      state.scores[ownerOfPit(i)] += seeds;
      state.pits[i] = 0;
    }
  }
  return state;
};

export const decideWinner = (scores: [number, number]): Winner => {
  if (scores[0] > scores[1]) return 0;
  if (scores[1] > scores[0]) return 1;
  return 'draw';
};

/** Percentage of all seeds a player holds, used for the score bar. */
export const scoreShare = (scores: [number, number], player: PlayerId): number => {
  const total = scores[0] + scores[1];
  if (total === 0) return 0.5;
  return scores[player] / total;
};
