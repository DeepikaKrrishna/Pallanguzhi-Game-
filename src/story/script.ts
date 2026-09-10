/** Which of the two seats is speaking. */
export type Speaker = 0 | 1;

export interface Line {
  speaker: Speaker;
  /**
   * `{me}` becomes the speaker's name, `{you}` the other player's.
   * Substitution happens in `renderLine`, so the script stays readable.
   */
  text: string;
}

/**
 * The opening conversation. Two girls sit down on the verandah in the late
 * afternoon; one has played since she was small, the other is being taught.
 * It doubles as a soft tutorial — the rules come up in conversation rather
 * than as a wall of instructions.
 */
export const INTRO: Line[] = [
  { speaker: 0, text: 'Sit. The light is good and nobody needs the verandah for an hour.' },
  { speaker: 1, text: 'That board looks older than both of us.' },
  { speaker: 0, text: 'It is. My grandmother played on it, and her mother before that. The wood remembers more games than I do.' },
  { speaker: 1, text: 'Alright. Teach me before you beat me.' },
  { speaker: 0, text: 'Seven pits are yours, seven are mine. Five shells in each. You lift a handful from your side and drop them one by one, going around.' },
  { speaker: 1, text: 'And then?' },
  { speaker: 0, text: 'When your hand runs out, look at the next pit. Shells in it? Pick them up, keep going. Empty? Then whatever sits past it is yours, and your turn ends.' },
  { speaker: 1, text: 'What about four? I have seen you shout about four.' },
  { speaker: 0, text: 'Any pit that reaches exactly four, the shells go to whoever dropped the fourth. We call it the cow. Watch for it — it decides most games.' },
  { speaker: 1, text: 'And it ends when?' },
  { speaker: 0, text: 'When one of us has nothing left to lift. Whatever is still on the board goes to whoever owns that row. Most shells wins.' },
  { speaker: 1, text: 'Then stop talking, {you}. Your move first.' },
];

/**
 * Short remarks during play. Kept rare on purpose — a line every few turns is
 * company, a line every turn is noise.
 */
export const BANTER: string[] = [
  'Ha! Did you see that?',
  'I counted that three turns ago.',
  'Careful, your row is getting thin.',
  'Take your time. The shells are not going anywhere.',
  'That was the move I would have made.',
  'Go on then, take it back if you can.',
  'Good. Now it gets interesting.',
  'You left that pit sitting on three. I was waiting.',
];

/** A big capture is worth saying something about. */
export const BIG_CAPTURE: string[] = [
  'That is a fistful gone.',
  'Whole pit, just like that.',
  'You are going to feel that one.',
];

export const ENDINGS = {
  win: [
    'Grandmother would have called that a decent game.',
    'Same time tomorrow? Bring better luck.',
    'You played well. Not well enough, but well.',
  ],
  loss: [
    'Fine. Fine. Set it up again.',
    'I saw it too late. Next one is mine.',
    'You have been practising without me.',
  ],
  draw: [
    'Dead level. Neither of us gets to boast.',
    'A draw. The old board is laughing at us.',
  ],
};

/** Fills `{me}` and `{you}` in a line of dialogue. */
export const renderLine = (
  text: string,
  speakerName: string,
  otherName: string
): string => text.replace(/\{me\}/g, speakerName).replace(/\{you\}/g, otherName);

/** Picks an entry without repeating the previous one where possible. */
export const pickLine = (options: string[], avoid?: string): string => {
  const pool = options.length > 1 ? options.filter((o) => o !== avoid) : options;
  return pool[Math.floor(Math.random() * pool.length)];
};
