# Pallanguzhi (பல்லாங்குழி)

A traditional Tamil game, reimagined for mobile.

Pallanguzhi is a two-player sowing game played across South India for
centuries. This is an offline Android/iOS version built with React Native,
Expo and TypeScript, with the rules kept in a standalone game engine and the
board rendered as a wooden slab of fourteen pits.

---

## Features

- Full Pallanguzhi gameplay with relay sowing and two capture rules
- Two players on one device, no account and no network
- Players type their own name and build their own face: girl or boy, five skin
  tones, six outfit colours, three hairstyles each
- A hand that travels the board and tips open to drop each shell
- An opening conversation that teaches the rules as talk rather than a manual
- In-game banter on a worthwhile capture
- Seeds thrown pit to pit along an arc, so a whole move can be followed by eye
- Carved board with lit rims, breathing halos on playable pits and capture flashes
- Kolam patterns drawn as vector art, on the floor and inlaid in the board
- Traditional Tamil visual identity: rosewood, brass and cowrie tones
- Live score tracking with an active-player indicator
- Local game history stored on the device with AsyncStorage
- Works entirely offline; nothing is fetched at runtime

---

## Technology stack

| Layer | Choice |
| --- | --- |
| Framework | React Native (Expo SDK 51) |
| Language | TypeScript, strict mode |
| Navigation | React Navigation, native stack |
| Styling | React Native StyleSheet, expo-linear-gradient |
| Vector art | react-native-svg (kolam patterns) |
| Storage | AsyncStorage |
| Animation | React Native Animated API |
| Version control | Git and GitHub |

No backend, no cloud database, no authentication, no external APIs.

---

## Installation

Requires Node.js 18 or newer.

```bash
git clone https://github.com/<your-username>/pallanguzhi.git
cd pallanguzhi
npm install
```

## Running the app

```bash
npm start          # opens the Expo dev server
npm run android    # opens on a connected Android device or emulator
npm run ios        # opens on an iOS simulator (macOS only)
npm run typecheck  # runs the TypeScript compiler with no emit
```

Install **Expo Go** on your phone and scan the QR code printed by `npm start`
to play on a real device.

### Building an Android app

```bash
npm install -g eas-cli
eas login
eas build -p android --profile preview
```

This produces an installable `.apk`. A production build for the Play Store
uses `--profile production`.

---

## Project structure

```
Pallanguzhi/
├── App.tsx                  # Expo entry point, forwards to src/App.tsx
├── app.json                 # Expo configuration
├── src/
│   ├── components/          # Board, Pit, Seed, FlyingSeed, Kolam, ScreenBackground,
│   │                        # PlayerCard, GameHeader, GameButton
│   ├── screens/             # Splash, Home, Setup, Game, HowToPlay, About, GameOver, History
│   ├── game/                # Rules and engine, no React code
│   ├── story/               # Characters and dialogue script, data only
│   ├── navigation/          # Stack navigator and route types
│   ├── storage/             # AsyncStorage wrapper for game history
│   └── constants/           # colors, dimensions, gameConstants
└── assets/                  # images, fonts, sounds
```

The `src/game` folder holds the entire rule set and knows nothing about React.
Screens read state from it and render it; they never decide a rule. That split
is what makes the rules testable and the UI replaceable.

- `gameState.ts` — types, board setup, cloning helpers
- `pallanguzhiRules.ts` — move validity, capture check, end conditions
- `gameEngine.ts` — plays a whole turn, returns the new state plus the ordered
  events the screen replays as animation
- `scoring.ts` — score updates, end-of-game sweep, winner decision

---

## Game rules as implemented

**Board.** Fourteen pits, seven per player. The bottom row is player 1
(pits 0–6), the top row is player 2 (pits 7–13). Every pit starts with five
seeds, so seventy seeds are in play.

**Sowing.** Tap a non-empty pit in your own row. All its seeds are lifted and
dropped one per pit, moving anticlockwise through every pit on the board.

**Relay.** When your hand empties, look at the next pit. If it holds seeds,
lift them and keep sowing. The turn continues until the chain breaks.

**Capture, four seeds.** The instant a pit reaches exactly four seeds, the
player who dropped the fourth takes all four. This is the traditional *pasu*
(cow) capture.

**Capture, empty pit.** If the pit after your hand empties is itself empty,
the seeds in the pit beyond it are captured and the turn ends. If that pit is
also empty, the turn simply ends.

**Ending.** The game ends when the player about to move has no seeds in their
row. Seeds still on the board go to the owner of the row they sit in. The
larger pile wins; equal piles are a draw.

Pallanguzhi has many regional variants. This version implements one coherent
rule set rather than mixing them, which is why the rules live in one module —
a variant can be added by swapping `pallanguzhiRules.ts`.

---

## Version control workflow

Development follows small, meaningful commits, one per stage of work:

```
Initial Expo project setup
Created application navigation
Implemented splash and home screens
Created Pallanguzhi board UI
Added interactive pits and seeds
Implemented game state management
Implemented seed distribution logic
Implemented scoring and turn management
Added game over detection
Added How to Play screen
Added About Pallanguzhi screen
Added local game history
Improved traditional Tamil UI
Added animations and touch feedback
Optimized mobile responsiveness
Updated README documentation
```

Feature work happens on a branch (`feature/<name>`), is merged into `main`
through a pull request, and `main` stays in a running state at all times.
`node_modules`, build output, IDE settings and keystores are excluded by
`.gitignore` and never committed.

---

## Players and story

Each player types their own name and builds a face: girl or boy, one of five
skin tones, one of six outfit colours and one of three hairstyles, with a live
preview. That is 180 combinations, and no preset cast — the two people at the
board are whoever is holding the phone.

They then sit down on the verandah and talk. The one who knows the game
explains sowing, the relay, the four-seed capture and how it ends, while the
other asks what a new player would ask. Skippable at any line.

During play, a capture of six or more seeds always draws a remark and a
four-seed capture draws one about a fifth of the time. The winner gets the
closing word.

Appearance is cosmetic throughout. Nothing chosen on the setup screen changes
a rule, alters the odds or unlocks anything, and the screen says so. The story
sits around the game rather than inside it, which is why `src/story/` holds
only data and the engine never imports from it.

## The sowing hand

A hand enters from the near edge of the board, travels pit to pit as the seeds
are sown, and tips open to release each shell. It is animated as one continuous
object rather than remounted per hop, so it moves along the row instead of
jumping, and it carries the current player's skin tone and clothing — bangles
at the wrist when she is a girl.

The hand is anchored so its fingertips sit at the upper edge of the pit being
sown rather than over its centre, which keeps the shells countable while the
move plays out. On very long relay chains, where the per-seed pace drops below
90 ms, the thrown seed is skipped and only the hand moves.

---

## Visual layer

The app is set in one room: an illustrated verandah with a mango tree and
paddy fields beyond the pillars, an ochre wall with a doorway, brass vessels
on a red-oxide floor, kolam laid out in rice flour and a silk drape along the
near edge. It is drawn entirely in SVG (`VerandahScene.tsx`) rather than
shipped as an image, so it stays sharp on any screen, costs nothing to
download and needs no network.

A scrim sits between the scene and the interface. On the game and menu screens
it is light, so the room shows through; on the text-heavy screens it drops to
near-opaque, because a painting behind a paragraph is a readability problem
rather than a feature.

Animation is driven from the engine's event list rather than guessed at by the
UI. Each sown seed produces one `sow` event, and the screen turns that into a
shell thrown from the pit it left to the pit it lands in. Long relay chains
shorten the pace automatically, and below 90 ms per step the arc is dropped so
the board never turns into a blur.

Everything animated uses the native driver (transform and opacity only), which
keeps the sowing smooth while React re-renders the seed counts underneath.

---

## Testing checklist

Navigation: every screen reachable and the back path correct.
Gameplay: valid move, empty pit ignored, opponent's pit ignored, relay
sowing, both capture rules, turn switching, game end, winner and draw,
restart mid-game.
Touch: no input accepted while seeds are being sown; no double moves.
Performance: animation stays smooth on a mid-range Android device; the board
scales without overflow from a 320 dp screen upward.

---

## License

Released for educational and cultural-preservation purposes.
