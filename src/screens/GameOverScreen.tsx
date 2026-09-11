// Game over screen: shows winner, scores and closing dialogue
import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import GameButton from '../components/GameButton';
import KolamBackground from '../components/KolamBackground';
import ScreenBackground from '../components/ScreenBackground';
import Seed from '../components/Seed';
import { Colors } from '../constants/colors';
import { Layout, scale } from '../constants/dimensions';
import Avatar from '../components/Avatar';
import DialogueBox from '../components/DialogueBox';
import { ENDINGS, pickLine } from '../story/script';
import { ScreenProps } from '../navigation/AppNavigator';

const CELEBRATION_SEEDS = 12;

const GameOverScreen: React.FC<ScreenProps<'GameOver'>> = ({
  navigation,
  route,
}) => {
  const { players, scores, winner } = route.params;
  const playerNames: [string, string] = [players[0].name, players[1].name];

  /**
   * The closing line comes from the winner, or from the first seat on a draw.
   * Chosen once on mount so it does not change under the reader mid-sentence.
   */
  const closing = useMemo(() => {
    if (winner === 'draw' || winner === null) {
      return { speaker: 0 as const, text: pickLine(ENDINGS.draw) };
    }
    return { speaker: winner, text: pickLine(ENDINGS.win) };
  }, [winner]);

  const reveal = useRef(new Animated.Value(0)).current;
  const halo = useRef(new Animated.Value(0)).current;
  const burst = useRef(
    Array.from({ length: CELEBRATION_SEEDS }, () => new Animated.Value(0))
  ).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(reveal, {
        toValue: 1,
        duration: 620,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.stagger(
        45,
        burst.map((value) =>
          Animated.timing(value, {
            toValue: 1,
            duration: 900,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          })
        )
      ),
    ]).start();

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(halo, {
          toValue: 1,
          duration: 1800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(halo, {
          toValue: 0,
          duration: 1800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [reveal, halo, burst]);

  const isDraw = winner === 'draw';
  const headline = isDraw
    ? 'A draw'
    : winner === null
    ? 'Game over'
    : playerNames[winner];

  return (
    <ScreenBackground>
      <SafeAreaView style={styles.container}>
        <View style={styles.stage}>
          {/* Kolam breathing behind the result. */}
          <Animated.View
            style={[
              styles.halo,
              {
                opacity: halo.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.18, 0.42],
                }),
                transform: [
                  {
                    scale: halo.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.94, 1.06],
                    }),
                  },
                ],
              },
            ]}
            pointerEvents="none"
          >
            <KolamBackground
              size={Layout.screenWidth * 0.86}
              opacity={1}
              color={Colors.brassBright}
            />
          </Animated.View>

          {/* Shells thrown up when a winner is decided. */}
          {!isDraw &&
            burst.map((value, index) => {
              const angle = (index / CELEBRATION_SEEDS) * Math.PI * 2;
              const distance = scale(96) + (index % 3) * scale(18);
              return (
                <Animated.View
                  key={index}
                  pointerEvents="none"
                  style={[
                    styles.confetti,
                    {
                      opacity: value.interpolate({
                        inputRange: [0, 0.7, 1],
                        outputRange: [0, 1, 0],
                      }),
                      transform: [
                        {
                          translateX: value.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, Math.cos(angle) * distance],
                          }),
                        },
                        {
                          translateY: value.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, Math.sin(angle) * distance],
                          }),
                        },
                        {
                          rotate: value.interpolate({
                            inputRange: [0, 1],
                            outputRange: ['0deg', '300deg'],
                          }),
                        },
                      ],
                    },
                  ]}
                >
                  <Seed size={scale(10)} />
                </Animated.View>
              );
            })}

          <Animated.View
            style={{
              opacity: reveal,
              transform: [
                {
                  scale: reveal.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.88, 1],
                  }),
                },
              ],
            }}
          >
            {winner !== 'draw' && winner !== null && (
              <View style={styles.winnerPortrait}>
                <Avatar
                  config={players[winner].avatar}
                  size={scale(104)}
                />
              </View>
            )}

            <Text style={styles.eyebrow}>ஆட்டம் முடிந்தது</Text>
            <Text style={styles.headline}>{headline}</Text>
            {!isDraw && winner !== null && (
              <Text style={styles.subline}>wins</Text>
            )}
            {isDraw && (
              <Text style={styles.subline}>both piles are equal</Text>
            )}

            <View style={styles.scores}>
              <View style={styles.scoreBlock}>
                <Text style={styles.name}>{playerNames[0]}</Text>
                <Text style={styles.score}>{scores[0]}</Text>
              </View>
              <View style={styles.scoreDivider} />
              <View style={styles.scoreBlock}>
                <Text style={styles.name}>{playerNames[1]}</Text>
                <Text style={styles.score}>{scores[1]}</Text>
              </View>
            </View>
          </Animated.View>
        </View>

        <View style={styles.closing}>
          <DialogueBox
            avatar={players[closing.speaker].avatar}
            speakerName={playerNames[closing.speaker]}
            text={closing.text}
            side={closing.speaker === 0 ? 'left' : 'right'}
            onAdvance={() => navigation.replace('Home')}
          />
        </View>

        <View style={styles.actions}>
          <GameButton
            label="Play again"
            onPress={() => navigation.replace('Game', { players })}
          />
          <GameButton
            label="Main menu"
            variant="secondary"
            onPress={() => navigation.replace('Home')}
            style={styles.spaced}
          />
        </View>
      </SafeAreaView>
    </ScreenBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Layout.spacing.lg,
    justifyContent: 'space-between',
  },
  stage: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  halo: { position: 'absolute' },
  confetti: { position: 'absolute' },
  eyebrow: {
    fontSize: Layout.font.subtitle,
    color: Colors.brassBright,
    textAlign: 'center',
    marginBottom: Layout.spacing.sm,
  },
  headline: {
    fontSize: Layout.font.display,
    fontWeight: '800',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  subline: {
    fontSize: Layout.font.subtitle,
    color: Colors.brass,
    textAlign: 'center',
    marginTop: 2,
  },
  scores: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Layout.spacing.xl,
    backgroundColor: Colors.panel,
    borderRadius: Layout.radius.md,
    borderWidth: 1,
    borderColor: 'rgba(201, 162, 39, 0.4)',
    paddingVertical: Layout.spacing.md,
    paddingHorizontal: Layout.spacing.lg,
  },
  scoreBlock: { alignItems: 'center', minWidth: scale(88) },
  scoreDivider: {
    width: 1,
    height: scale(40),
    backgroundColor: Colors.woodLight,
    marginHorizontal: Layout.spacing.md,
  },
  name: { fontSize: Layout.font.caption, color: Colors.textMuted },
  score: {
    fontSize: Layout.font.title,
    fontWeight: '800',
    color: Colors.brassBright,
  },
  winnerPortrait: { alignItems: 'center', marginBottom: Layout.spacing.md },
  closing: { paddingBottom: Layout.spacing.sm },
  actions: { paddingBottom: Layout.spacing.sm },
  spaced: { marginTop: Layout.spacing.sm },
});

export default GameOverScreen;
