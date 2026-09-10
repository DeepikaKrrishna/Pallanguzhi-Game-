import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEY_HISTORY } from '../constants/gameConstants';
import { Winner } from '../game/gameState';

export interface GameRecord {
  playedAt: number;
  playerNames: [string, string];
  scores: [number, number];
  winner: Winner;
  turns: number;
}

export interface HistorySummary {
  totalGames: number;
  playerOneWins: number;
  playerTwoWins: number;
  draws: number;
  records: GameRecord[];
}

const EMPTY: HistorySummary = {
  totalGames: 0,
  playerOneWins: 0,
  playerTwoWins: 0,
  draws: 0,
  records: [],
};

/** Keeps the file small; older games beyond this are dropped. */
const MAX_RECORDS = 25;

const isRecord = (value: unknown): value is GameRecord => {
  if (typeof value !== 'object' || value === null) return false;
  const record = value as Partial<GameRecord>;
  return (
    typeof record.playedAt === 'number' &&
    Array.isArray(record.scores) &&
    record.scores.length === 2
  );
};

export const loadHistory = async (): Promise<HistorySummary> => {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY_HISTORY);
    if (!raw) return EMPTY;

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return EMPTY;

    const records = parsed.filter(isRecord);
    return summarise(records);
  } catch {
    // A corrupt or unreadable store should never block the game.
    return EMPTY;
  }
};

export const saveGameResult = async (
  record: GameRecord
): Promise<HistorySummary> => {
  try {
    const current = await loadHistory();
    const records = [record, ...current.records].slice(0, MAX_RECORDS);
    await AsyncStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(records));
    return summarise(records);
  } catch {
    return loadHistory();
  }
};

export const clearHistory = async (): Promise<HistorySummary> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY_HISTORY);
  } catch {
    // Ignore: the screen will simply show the old numbers until next launch.
  }
  return EMPTY;
};

const summarise = (records: GameRecord[]): HistorySummary => ({
  totalGames: records.length,
  playerOneWins: records.filter((r) => r.winner === 0).length,
  playerTwoWins: records.filter((r) => r.winner === 1).length,
  draws: records.filter((r) => r.winner === 'draw').length,
  records,
});
