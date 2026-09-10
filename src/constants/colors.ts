/**
 * Palette lifted from a verandah at golden hour: red-oxide floor, rosewood
 * board, brass vessels, cowrie shells and rice-flour kolam.
 */
export const Colors = {
  // Carved board
  woodHighlight: '#B07A42',
  woodLight: '#8B5A2B',
  woodMid: '#6B4423',
  woodDark: '#4A2C17',
  woodEdge: '#33200F',
  pitDeep: '#2A1709',
  pitRim: '#5C3819',

  // Room behind the board
  duskTop: '#2A1509',
  duskMid: '#40200F',
  duskLow: '#5A2D14',
  floorGlow: '#8A4726',

  // Surfaces
  panel: 'rgba(74, 44, 23, 0.55)',
  panelSolid: '#3D2417',
  panelRaised: 'rgba(139, 90, 43, 0.28)',

  // Metal and lamplight
  brass: '#C9A227',
  brassBright: '#F0D479',
  brassDeep: '#8A6B14',
  glow: 'rgba(240, 212, 121, 0.35)',

  // Shell
  shell: '#F7EFDD',
  shellShade: '#DCC9A4',
  shellEdge: '#B49B6E',

  // Accents
  terracotta: '#B4552F',
  maroon: '#7A2222',
  leaf: '#5C7A3F',

  // Kolam and text
  kolam: '#F7EEDC',
  textPrimary: '#F9F1E1',
  textSoft: '#E4D2B0',
  textMuted: '#B79C74',
  textOnBrass: '#3A2011',

  overlay: 'rgba(26, 13, 6, 0.86)',
} as const;

/** Gradient ramps, kept here so screens stay free of colour literals. */
export const Gradients = {
  dusk: [Colors.duskTop, Colors.duskMid, Colors.duskLow] as const,
  wood: [Colors.woodHighlight, Colors.woodMid, Colors.woodDark] as const,
  woodRail: [Colors.woodLight, Colors.woodEdge] as const,
  pit: [Colors.pitDeep, '#3B2210'] as const,
  brass: [Colors.brassBright, Colors.brass, Colors.brassDeep] as const,
  shell: [Colors.shell, Colors.shellShade] as const,
} as const;

export type ColorKey = keyof typeof Colors;
