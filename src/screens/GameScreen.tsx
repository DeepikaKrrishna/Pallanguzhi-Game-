// Game screen: wires the engine to the board, handles turns and animations
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Animated, Easing, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import GameButton from '../components/GameButton';
import PallanguzhiBoard, { SeedFlight } from '../components/PallanguzhiBoard';
import PlayerCard from '../components/PlayerCard';
import ScreenBackground from '../components/ScreenBackground';
import { Colors } from '../constants/colors';
import { Layout } from '../constants/dimensions';
import {
  MIN_FLIGHT_STEP_MS,
  MIN_SOW_STEP_MS,
  SOW_STEP_MS,
  TURN_ANIMATION_BUDGET_MS,
} from '../constants/gameConstants';
import { createInitialState, playTurn } from '../game/gameEngine';
import { GameState, PlayerId, SowEvent } from '../game/gameState';
import { saveGameResult } from '../storage/gameHistory';
import { BANTER, BIG_CAPTURE, pickLine } from '../story/script';
import { ScreenProps } from '../navigation/AppNavigator';

const GameScreen: React.FC<ScreenProps<'Game'>> = ({ navigation, route }) => {
  const { players } = route.params;
  const playerNames: [string, string] = [players[0].name, players[1].name];

  /** A short remark from whoever just captured, shown briefly above the board. */
  const [banter, setBanter] = useState<{ text: string; speaker: PlayerId } | null>(
    null
  );
  const banterFade = useRef(new Animated.Value(0)).current;
  const lastBanter = useRef<string | undefined>(undefined);
  const banterTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /** Authoritative state; only replaced once a turn has finished animating. */
  const [state, setState] = useState<GameState>(() => createInitialState(0));

  /** What the board shows right now, which lags behind during animation. */
  const [viewPits, setViewPits] = useState<number[]>(state.pits);
  const [viewScores, setViewScores] = useState<[number, number]>([0, 0]);
  const [activePit, setActivePit] = useState<number | null>(null);
  const [capturedPit, setCapturedPit] = useState<number | null>(null);
  const [flight, setFlight] = useState<SeedFlight | null>(null);
  /** Pit the sowing hand hovers over, and a counter bumped on each release. */
  const [handPit, setHandPit] = useState<number | null>(null);
  const [handDrop, setHandDrop] = useState(0);
  const [handSpeed, setHandSpeed] = useState(SOW_STEP_MS);
  /** Whose hand is sowing; held so it stays correct as the turn plays out. */
  const [handPlayer, setHandPlayer] = useState<PlayerId>(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const flightId = useRef(0);

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    if (banterTimer.current) clearTimeout(banterTimer.current);
  }, []);

  // Never leave a timer running after the screen goes away.
  useEffect(() => clearTimers, [clearTimers]);

  const finishGame = useCallback(
    async (finalState: GameState) => {
      await saveGameResult({
        playedAt: Date.now(),
        playerNames,
        scores: finalState.scores,
        winner: finalState.winner,
        turns: finalState.turnCount,
      });
      navigation.replace('GameOver', {
        players,
        scores: finalState.scores,
        winner: finalState.winner,
      });
    },
    [navigation, players, playerNames]
  );

  /**
   * Replays the engine's events one at a time. Each sown seed is thrown from
   * the pit it left to the pit it lands in, so a player can follow the whole
   * move by eye instead of watching numbers change.
   */
  const animate = useCallback(
    (events: SowEvent[], finalState: GameState) => {
      // Long relay chains speed up so no single turn drags on.
      const stepMs = Math.max(
        MIN_SOW_STEP_MS,
        Math.min(SOW_STEP_MS, TURN_ANIMATION_BUDGET_MS / events.length)
      );
      // Below this pace the arc is a blur, so the throw is skipped.
      const showFlight = stepMs >= MIN_FLIGHT_STEP_MS;
      setHandSpeed(stepMs);
      setHandPlayer(state.currentPlayer);

      const pits = [...state.pits];
      const scores: [number, number] = [...state.scores] as [number, number];
      let origin: number | null = null;

      events.forEach((event, step) => {
        const timer = setTimeout(() => {
          switch (event.type) {
            case 'pickup':
              pits[event.pit] = 0;
              origin = event.pit;
              setActivePit(event.pit);
              setHandPit(event.pit);
              setCapturedPit(null);
              break;

            case 'sow':
              if (showFlight && origin !== null) {
                flightId.current += 1;
                setFlight({
                  from: origin,
                  to: event.pit,
                  id: flightId.current,
                  duration: stepMs * 0.92,
                });
              }
              pits[event.pit] = event.seedsInPit;
              origin = event.pit;
              setActivePit(event.pit);
              setHandPit(event.pit);
              setHandDrop((n) => n + 1);
              setCapturedPit(null);
              break;

            case 'capture':
              pits[event.pit] = 0;
              scores[event.player] += event.seeds;
              setViewScores([scores[0], scores[1]]);
              setCapturedPit(event.pit);
              // Only a substantial capture is worth a remark; a line on every
              // four-seed pit would be constant chatter.
              if (event.seeds >= 6) speak(event.player, true);
              else if (event.seeds >= 4 && Math.random() < 0.22) {
                speak(event.player, false);
              }
              break;

            default:
              setActivePit(null);
              setFlight(null);
              setHandPit(null);
              break;
          }
          setViewPits([...pits]);
        }, step * stepMs);

        timers.current.push(timer);
      });

      const done = setTimeout(() => {
        clearTimers();
        setActivePit(null);
        setCapturedPit(null);
        setFlight(null);
        setHandPit(null);
        setViewPits(finalState.pits);
        setViewScores(finalState.scores);
        setState(finalState);
        setIsAnimating(false);

        if (finalState.status === 'finished') {
          void finishGame(finalState);
        }
      }, events.length * stepMs + 120);

      timers.current.push(done);
    },
    [state, clearTimers, finishGame]
  );

  /** Puts a line of banter on screen for a moment, then clears it. */
  const speak = useCallback(
    (speaker: PlayerId, big: boolean) => {
      const pool = big ? BIG_CAPTURE : BANTER;
      const text = pickLine(pool, lastBanter.current);
      lastBanter.current = text;

      setBanter({ text, speaker });
      banterFade.setValue(0);
      Animated.timing(banterFade, {
        toValue: 1,
        duration: 220,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start();

      if (banterTimer.current) clearTimeout(banterTimer.current);
      banterTimer.current = setTimeout(() => {
        Animated.timing(banterFade, {
          toValue: 0,
          duration: 320,
          useNativeDriver: true,
        }).start(() => setBanter(null));
      }, 2200);
    },
    [banterFade]
  );

  const handlePitPress = useCallback(
    (pitIndex: number) => {
      if (isAnimating) return;

      const result = playTurn(state, pitIndex);
      if (!result) return; // Illegal tap: empty pit or opponent's row.

      setIsAnimating(true);
      animate(result.events, result.state);
    },
    [state, isAnimating, animate]
  );

  const resetBoard = useCallback(() => {
    clearTimers();
    const fresh = createInitialState(0);
    setState(fresh);
    setViewPits(fresh.pits);
    setViewScores([0, 0]);
    setActivePit(null);
    setCapturedPit(null);
    setFlight(null);
    setHandPit(null);
    setIsAnimating(false);
  }, [clearTimers]);

  const restart = useCallback(() => {
    Alert.alert('Restart game?', 'The current board will be cleared.', [
      { text: 'Keep playing', style: 'cancel' },
      { text: 'Restart', style: 'destructive', onPress: resetBoard },
    ]);
  }, [resetBoard]);

  const quit = useCallback(() => {
    Alert.alert('Leave the game?', 'This game will not be saved.', [
      { text: 'Stay', style: 'cancel' },
      {
        text: 'Leave',
        style: 'destructive',
        onPress: () => {
          clearTimers();
          navigation.replace('Home');
        },
      },
    ]);
  }, [clearTimers, navigation]);

  const current: PlayerId = state.currentPlayer;

  return (
    <ScreenBackground>
      <SafeAreaView style={styles.container}>
        <View style={styles.top}>
          <Text style={styles.title}>பல்லாங்குழி</Text>
          <Text style={styles.turn}>
            {isAnimating ? 'Sowing…' : `${playerNames[current]} to play`}
          </Text>
        </View>

        <View style={styles.players}>
          <PlayerCard
            name={playerNames[0]}
            score={viewScores[0]}
            active={current === 0 && !isAnimating}
            config={players[0].avatar}
          />
          <View style={styles.playerGap} />
          <PlayerCard
            name={playerNames[1]}
            score={viewScores[1]}
            active={current === 1 && !isAnimating}
            config={players[1].avatar}
            align="right"
          />
        </View>

        {banter && (
          <Animated.View
            pointerEvents="none"
            style={[
              styles.banter,
              banter.speaker === 1 ? styles.banterTop : styles.banterBottom,
              {
                opacity: banterFade,
                transform: [
                  {
                    translateY: banterFade.interpolate({
                      inputRange: [0, 1],
                      outputRange: [8, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <Text style={styles.banterName}>
              {playerNames[banter.speaker]}
            </Text>
            <Text style={styles.banterText}>{banter.text}</Text>
          </Animated.View>
        )}

        <View style={styles.boardArea}>
          <Text style={[styles.rowLabel, current === 1 && styles.rowLabelOn]}>
            {playerNames[1]}
          </Text>
          <PallanguzhiBoard
            pits={viewPits}
            currentPlayer={current}
            activePit={activePit}
            capturedPit={capturedPit}
            flight={flight}
            handPit={handPit}
            handDrop={handDrop}
            handAvatar={players[handPlayer].avatar}
            handSpeed={handSpeed}
            onPitPress={handlePitPress}
            locked={isAnimating}
          />
          <Text style={[styles.rowLabel, current === 0 && styles.rowLabelOn]}>
            {playerNames[0]}
          </Text>
        </View>

        <View style={styles.controls}>
          <GameButton
            label="Restart"
            variant="secondary"
            onPress={restart}
            style={styles.control}
          />
          <View style={styles.playerGap} />
          <GameButton
            label="Menu"
            variant="ghost"
            onPress={quit}
            style={styles.control}
          />
        </View>
      </SafeAreaView>
    </ScreenBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.md,
    justifyContent: 'space-between',
  },
  top: { alignItems: 'center' },
  title: {
    fontSize: Layout.font.subtitle,
    color: Colors.brassBright,
    letterSpacing: 1,
  },
  turn: {
    marginTop: 2,
    fontSize: Layout.font.body,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  players: { flexDirection: 'row', marginTop: Layout.spacing.sm },
  playerGap: { width: Layout.spacing.sm },
  boardArea: { alignItems: 'center' },
  rowLabel: {
    fontSize: Layout.font.caption,
    color: Colors.textMuted,
    marginVertical: Layout.spacing.xs,
    letterSpacing: 1,
  },
  rowLabelOn: { color: Colors.brassBright, fontWeight: '700' },
  banter: {
    marginTop: Layout.spacing.sm,
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.sm,
    borderRadius: Layout.radius.md,
    backgroundColor: 'rgba(26, 13, 6, 0.9)',
    borderWidth: 1,
    borderColor: 'rgba(201, 162, 39, 0.45)',
    maxWidth: '86%',
  },
  banterTop: { alignSelf: 'flex-end' },
  banterBottom: { alignSelf: 'flex-start' },
  banterName: {
    fontSize: Layout.font.micro,
    fontWeight: '800',
    letterSpacing: 1,
    color: Colors.brassBright,
  },
  banterText: {
    fontSize: Layout.font.caption,
    color: Colors.textPrimary,
  },
  controls: { flexDirection: 'row' },
  control: { flex: 1 },
});

export default GameScreen;
