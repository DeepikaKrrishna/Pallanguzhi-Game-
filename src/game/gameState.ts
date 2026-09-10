import {
  PITS_PER_PLAYER,
  SEEDS_PER_PIT,
  TOTAL_PITS,
} from '../constants/gameConstants';

/** Player 0 owns pits 0-6 (bottom row); player 1 owns pits 7-13 (top row). */
export type PlayerId = 0 | 1;

export type GameStatus = 'idle' | 'playing' | 'finished';

/** null means the game has not been decided yet; 'draw' means equal scores. */
export type Winner = PlayerId | 'draw' | null;

export interface GameState {
  /** Seed count of each of the 14 pits, indexed 0-13. */
  pits: number[];
  /** Captured seeds, indexed by PlayerId. */
  scores: [number, number];
  currentPlayer: PlayerId;
  status: GameStatus;
  winner: Winner;
  /** Completed turns, used for the history record. */
  turnCount: number;
}

/** A single observable moment of a turn, replayed by the UI as animation. */
export type SowEvent =
  | { type: 'pickup'; pit: number; seeds: number }
  | { type: 'sow'; pit: number; seedsInPit: number }
  | { type: 'capture'; pit: number; seeds: number; player: PlayerId }
  | { type: 'endTurn'; nextPlayer: PlayerId }
  | { type: 'gameOver'; winner: Winner };

export interface TurnResult {
  /** Board state after the whole turn has resolved. */
  state: GameState;
  /** Ordered events the UI animates one at a time. */
  events: SowEvent[];
}

export const otherPlayer = (player: PlayerId): PlayerId =>
  (player === 0 ? 1 : 0);

/** Inclusive pit range owned by a player. */
export const pitRange = (player: PlayerId): [number, number] =>
  player === 0 ? [0, PITS_PER_PLAYER - 1] : [PITS_PER_PLAYER, TOTAL_PITS - 1];

export const ownerOfPit = (pitIndex: number): PlayerId =>
  pitIndex < PITS_PER_PLAYER ? 0 : 1;

/** Fresh board: 14 pits, five seeds in each, player 1 to move. */
export const createInitialState = (
  startingPlayer: PlayerId = 0
): GameState => ({
  pits: new Array<number>(TOTAL_PITS).fill(SEEDS_PER_PIT),
  scores: [0, 0],
  currentPlayer: startingPlayer,
  status: 'playing',
  winner: null,
  turnCount: 0,
});

/** Deep copy, so the engine never mutates the state React is rendering. */
export const cloneState = (state: GameState): GameState => ({
  pits: [...state.pits],
  scores: [state.scores[0], state.scores[1]],
  currentPlayer: state.currentPlayer,
  status: state.status,
  winner: state.winner,
  turnCount: state.turnCount,
});
