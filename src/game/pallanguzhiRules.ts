import { CAPTURE_COUNT, TOTAL_PITS } from '../constants/gameConstants';
import { GameState, PlayerId, pitRange, ownerOfPit } from './gameState';

/**
 * Rules implemented in this version
 * --------------------------------
 * 1. Sowing runs anticlockwise through all 14 pits, one seed per pit.
 * 2. A player may only lift seeds from a non-empty pit in their own row.
 * 3. When the hand empties, look at the next pit:
 *      - it has seeds  -> lift them and keep sowing (a "relay"),
 *      - it is empty    -> the pit after it is captured by the sower and the
 *                          turn ends. If that pit is also empty, the turn ends
 *                          with no capture.
 * 4. Whenever a pit reaches exactly four seeds, those four are captured
 *    immediately by the player who dropped the fourth seed. This is the
 *    traditional "pasu" (cow) capture.
 * 5. The game ends when the player to move has no seeds left in their row.
 *    Seeds still on the board go to the owner of the row they sit in.
 * 6. Highest captured total wins; equal totals are a draw.
 */

export const isPitOwnedBy = (pitIndex: number, player: PlayerId): boolean =>
  ownerOfPit(pitIndex) === player;

/** A move is legal when the pit is in the player's row and is not empty. */
export const isValidMove = (state: GameState, pitIndex: number): boolean => {
  if (state.status !== 'playing') return false;
  if (!Number.isInteger(pitIndex)) return false;
  if (pitIndex < 0 || pitIndex >= TOTAL_PITS) return false;
  if (!isPitOwnedBy(pitIndex, state.currentPlayer)) return false;
  return state.pits[pitIndex] > 0;
};

export const getValidMoves = (state: GameState): number[] => {
  const [start, end] = pitRange(state.currentPlayer);
  const moves: number[] = [];
  for (let i = start; i <= end; i += 1) {
    if (state.pits[i] > 0) moves.push(i);
  }
  return moves;
};

/** Total seeds still sitting in a player's row. */
export const seedsInRow = (state: GameState, player: PlayerId): number => {
  const [start, end] = pitRange(player);
  let total = 0;
  for (let i = start; i <= end; i += 1) total += state.pits[i];
  return total;
};

/** Four seeds in one pit is a capture, checked after every single sow. */
export const isCapturePit = (seedsInPit: number): boolean =>
  seedsInPit === CAPTURE_COUNT;

/** The game is over once the player about to move cannot move at all. */
export const isGameOver = (state: GameState): boolean =>
  seedsInRow(state, state.currentPlayer) === 0;

export const nextPitIndex = (pitIndex: number): number =>
  (pitIndex + 1) % TOTAL_PITS;
