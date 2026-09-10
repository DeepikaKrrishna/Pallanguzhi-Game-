/** Total pits on the board (two rows of seven). */
export const TOTAL_PITS = 14;

/** Pits owned by each player. */
export const PITS_PER_PLAYER = 7;

/** Seeds placed in every pit at the start of a game. */
export const SEEDS_PER_PIT = 5;

/** A pit holding exactly this many seeds is captured ("pasu" / cow). */
export const CAPTURE_COUNT = 4;

export const TOTAL_SEEDS = TOTAL_PITS * SEEDS_PER_PIT;

/** Comfortable pace for a short turn, in milliseconds per sown seed. */
export const SOW_STEP_MS = 200;

/** Floor on the step delay, so a long relay chain never crawls. */
export const MIN_SOW_STEP_MS = 45;

/**
 * Target length of one animated turn. A relay chain can run to ~90 sown seeds,
 * so the delay per step shrinks to keep the whole turn inside this budget.
 */
export const TURN_ANIMATION_BUDGET_MS = 3600;

/** Below this pace a thrown seed is a blur, so the arc is skipped. */
export const MIN_FLIGHT_STEP_MS = 90;

/** Safety valve: no legal turn should ever need this many sowing steps. */
export const MAX_STEPS_PER_TURN = 2000;

export const DEFAULT_PLAYER_NAMES: [string, string] = ['Player 1', 'Player 2'];

export const STORAGE_KEY_HISTORY = '@pallanguzhi/history/v1';
