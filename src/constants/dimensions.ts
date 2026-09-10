import { Dimensions, PixelRatio } from 'react-native';

const { width: RAW_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

/**
 * Browsers report the full window width, which would blow the board up to
 * desktop size. No phone is wider than this in portrait, so clamping here
 * keeps the layout honest everywhere.
 */
const SCREEN_WIDTH = Math.min(RAW_WIDTH, 430);

/** Width the layout was designed against (a mid-size Android phone). */
const BASE_WIDTH = 390;

/** Scales a value proportionally so the UI fits small and large phones alike. */
export const scale = (size: number): number =>
  PixelRatio.roundToNearestPixel((SCREEN_WIDTH / BASE_WIDTH) * size);

export const Layout = {
  screenWidth: SCREEN_WIDTH,
  windowWidth: RAW_WIDTH,
  screenHeight: SCREEN_HEIGHT,
  isSmallDevice: SCREEN_WIDTH < 360,
  isShortDevice: SCREEN_HEIGHT < 700,

  spacing: {
    xs: scale(4),
    sm: scale(8),
    md: scale(16),
    lg: scale(24),
    xl: scale(32),
  },

  radius: {
    sm: scale(8),
    md: scale(14),
    lg: scale(22),
    pill: scale(999),
  },

  font: {
    micro: scale(10),
    caption: scale(12),
    body: scale(15),
    subtitle: scale(18),
    title: scale(24),
    display: scale(32),
    tamilDisplay: scale(36),
  },
} as const;

/**
 * Board geometry. Pits are positioned absolutely rather than by flexbox, so a
 * seed in flight can be sent to an exact pixel coordinate.
 */
export const BoardMetrics = (() => {
  const boardWidth = SCREEN_WIDTH - Layout.spacing.md * 2;
  const innerPadding = scale(14);
  const gap = scale(6);
  const columns = 7;
  const pitSize = Math.floor(
    (boardWidth - innerPadding * 2 - gap * (columns - 1)) / columns
  );
  /** Wider channel between the rows, where the centre kolam sits. */
  const midGap = Math.round(pitSize * 0.46);

  return {
    boardWidth,
    innerPadding,
    gap,
    midGap,
    columns,
    pitSize,
    pitRadius: pitSize / 2,
    boardHeight: innerPadding * 2 + pitSize * 2 + midGap,
    seedSize: Math.max(scale(6), Math.round(pitSize * 0.19)),
  };
})();

export interface Point {
  x: number;
  y: number;
}

/**
 * Centre of a pit in board-local coordinates.
 *
 * The bottom row is player 1, pits 0-6 running left to right. The top row is
 * player 2, pits 13-7 running left to right, so sowing reads as one continuous
 * anticlockwise loop around the board.
 */
export const pitCenter = (index: number): Point => {
  const { innerPadding, gap, pitSize, midGap } = BoardMetrics;
  const isBottomRow = index < 7;
  const column = isBottomRow ? index : 13 - index;

  return {
    x: innerPadding + column * (pitSize + gap) + pitSize / 2,
    y: isBottomRow
      ? innerPadding + pitSize + midGap + pitSize / 2
      : innerPadding + pitSize / 2,
  };
};

/** Top-left corner of a pit, for absolute placement. */
export const pitOrigin = (index: number): Point => {
  const center = pitCenter(index);
  return {
    x: center.x - BoardMetrics.pitRadius,
    y: center.y - BoardMetrics.pitRadius,
  };
};

/**
 * Seed positions inside a pit, laid out on a golden-angle spiral so a handful
 * of shells looks scattered by hand rather than stacked in a grid. Pure
 * function of the indices, so seeds never jitter between renders.
 */
export const seedOffset = (
  seedIndex: number,
  totalSeeds: number,
  pitIndex: number
): Point => {
  const usable = BoardMetrics.pitRadius - BoardMetrics.seedSize * 0.85;
  const ratio = totalSeeds <= 1 ? 0 : seedIndex / (totalSeeds - 1);
  const radius = usable * Math.sqrt(ratio) * 0.82;
  // Offsetting by the pit index stops every pit wearing the same pattern.
  const angle = seedIndex * 2.39996 + pitIndex * 0.7;

  return {
    x: Math.cos(angle) * radius,
    y: Math.sin(angle) * radius,
  };
};
