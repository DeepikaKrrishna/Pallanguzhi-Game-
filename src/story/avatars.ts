// Avatars: player-built faces — gender, skin tone, outfit and hairstyle
/**
 * A player builds their own face rather than choosing from a cast. Nothing
 * here touches the rules — appearance is appearance, and the game is decided
 * entirely by how you sow.
 */

export type Gender = 'girl' | 'boy';

export interface AvatarConfig {
  gender: Gender;
  /** Index into SKIN_TONES. */
  skin: number;
  /** Index into OUTFITS. */
  outfit: number;
  /** Index into the hairstyle list for the chosen gender. */
  hair: number;
}

export interface SkinTone {
  label: string;
  base: string;
  shade: string;
}

export interface Outfit {
  label: string;
  main: string;
  deep: string;
  second: string;
  accent: string;
}

export const SKIN_TONES: SkinTone[] = [
  { label: 'Fair', base: '#E0B48C', shade: '#C4936B' },
  { label: 'Wheat', base: '#D19A6C', shade: '#B27B4E' },
  { label: 'Warm', base: '#C0865A', shade: '#9F6A41' },
  { label: 'Deep', base: '#9A6238', shade: '#7C4C29' },
  { label: 'Dark', base: '#7A4A28', shade: '#5E381D' },
];

export const OUTFITS: Outfit[] = [
  {
    label: 'Green',
    main: '#2E7D4F',
    deep: '#1C5233',
    second: '#B4552F',
    accent: '#E8C877',
  },
  {
    label: 'Mustard',
    main: '#D9A32E',
    deep: '#A87718',
    second: '#7A1B33',
    accent: '#F0D479',
  },
  {
    label: 'Magenta',
    main: '#A8286B',
    deep: '#761948',
    second: '#2E6B3A',
    accent: '#E8C877',
  },
  {
    label: 'Teal',
    main: '#1F6E78',
    deep: '#134A52',
    second: '#D9A32E',
    accent: '#F0D479',
  },
  {
    label: 'Maroon',
    main: '#7A1B33',
    deep: '#54101F',
    second: '#D9A32E',
    accent: '#E8C877',
  },
  {
    label: 'Indigo',
    main: '#37406E',
    deep: '#242B4C',
    second: '#C9A227',
    accent: '#E8C877',
  },
];

export const GIRL_HAIRSTYLES = ['Long braid', 'Bun', 'Twin braids'] as const;
export const BOY_HAIRSTYLES = ['Short', 'Curly', 'Side part'] as const;

export const hairstylesFor = (gender: Gender): readonly string[] =>
  gender === 'girl' ? GIRL_HAIRSTYLES : BOY_HAIRSTYLES;

/** A seat at the board: a name the player typed and a face they built. */
export interface PlayerConfig {
  name: string;
  avatar: AvatarConfig;
}

export const DEFAULT_AVATARS: [AvatarConfig, AvatarConfig] = [
  { gender: 'girl', skin: 1, outfit: 0, hair: 0 },
  { gender: 'boy', skin: 2, outfit: 1, hair: 0 },
];

export const skinOf = (config: AvatarConfig): SkinTone =>
  SKIN_TONES[config.skin] ?? SKIN_TONES[0];

export const outfitOf = (config: AvatarConfig): Outfit =>
  OUTFITS[config.outfit] ?? OUTFITS[0];

/** Total combinations available, quoted on the setup screen. */
export const COMBINATION_COUNT =
  2 * SKIN_TONES.length * OUTFITS.length * GIRL_HAIRSTYLES.length;
