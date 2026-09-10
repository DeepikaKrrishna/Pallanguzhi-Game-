import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import KolamBackground from '../components/KolamBackground';
import Seed from '../components/Seed';
import ScreenBackground from '../components/ScreenBackground';
import { Colors, Gradients } from '../constants/colors';
import { Layout, scale } from '../constants/dimensions';
import { ScreenProps } from '../navigation/AppNavigator';

const HOLD_MS = 2900;
const FALLING_SEEDS = 7;

/**
 * Opening sequence: kolam blooms, the board settles in, seeds drop into it one
 * after another, then the name rises. One orchestrated moment rather than a
 * scatter of separate effects.
 */
const SplashScreen: React.FC<ScreenProps<'Splash'>> = ({ navigation }) => {
  const kolam = useRef(new Animated.Value(0)).current;
  const board = useRef(new Animated.Value(0)).current;
  const title = useRef(new Animated.Value(0)).current;
  const seeds = useRef(
    Array.from({ length: FALLING_SEEDS }, () => new Animated.Value(0))
  ).current;

  useEffect(() => {
    const drops = seeds.map((value, index) =>
      Animated.timing(value, {
        toValue: 1,
        duration: 520,
        delay: index * 85,
        easing: Easing.bezier(0.33, 0, 0.2, 1),
        useNativeDriver: true,
      })
    );

    Animated.sequence([
      Animated.timing(kolam, {
        toValue: 1,
        duration: 720,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(board, {
        toValue: 1,
        speed: 6,
        bounciness: 8,
        useNativeDriver: true,
      }),
      Animated.stagger(85, drops),
      Animated.timing(title, {
        toValue: 1,
        duration: 620,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => navigation.replace('Home'), HOLD_MS);
    return () => clearTimeout(timer);
  }, [navigation, kolam, board, title, seeds]);

  return (
    <ScreenBackground>
      <View style={styles.container}>
        <Animated.View
          style={[
            styles.kolam,
            {
              opacity: kolam.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.32],
              }),
              transform: [
                {
                  scale: kolam.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.7, 1],
                  }),
                },
                {
                  rotate: kolam.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['-18deg', '0deg'],
                  }),
                },
              ],
            },
          ]}
          pointerEvents="none"
        >
          <KolamBackground size={Layout.screenWidth * 0.92} opacity={1} />
        </Animated.View>

        <Animated.View
          style={{
            opacity: board,
            transform: [
              {
                scale: board.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.82, 1],
                }),
              },
            ],
          }}
        >
          <LinearGradient
            colors={[...Gradients.wood]}
            start={{ x: 0.2, y: 0 }}
            end={{ x: 0.8, y: 1 }}
            style={styles.markBoard}
          >
            {[0, 1].map((row) => (
              <View key={row} style={styles.markRow}>
                {Array.from({ length: FALLING_SEEDS }).map((_, pit) => (
                  <View key={pit} style={styles.markPit}>
                    {row === 1 && (
                      <Animated.View
                        style={{
                          opacity: seeds[pit],
                          transform: [
                            {
                              translateY: seeds[pit].interpolate({
                                inputRange: [0, 1],
                                outputRange: [-scale(46), 0],
                              }),
                            },
                          ],
                        }}
                      >
                        <Seed size={scale(9)} />
                      </Animated.View>
                    )}
                  </View>
                ))}
              </View>
            ))}
          </LinearGradient>
        </Animated.View>

        <Animated.View
          style={[
            styles.titleBlock,
            {
              opacity: title,
              transform: [
                {
                  translateY: title.interpolate({
                    inputRange: [0, 1],
                    outputRange: [22, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <Text style={styles.tamil}>பல்லாங்குழி</Text>
          <Text style={styles.title}>PALLANGUZHI</Text>
          <View style={styles.rule} />
          <Text style={styles.tagline}>
            A traditional Tamil game, reimagined
          </Text>
        </Animated.View>
      </View>
    </ScreenBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Layout.spacing.lg,
  },
  kolam: { position: 'absolute' },
  markBoard: {
    padding: scale(10),
    borderRadius: scale(26),
    borderWidth: 1,
    borderColor: 'rgba(255, 226, 168, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 14,
    elevation: 10,
  },
  markRow: { flexDirection: 'row' },
  markPit: {
    width: scale(22),
    height: scale(22),
    borderRadius: scale(11),
    margin: scale(3),
    backgroundColor: Colors.pitDeep,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleBlock: { alignItems: 'center', marginTop: Layout.spacing.xl },
  tamil: {
    fontSize: Layout.font.tamilDisplay,
    color: Colors.brassBright,
    textAlign: 'center',
  },
  title: {
    fontSize: Layout.font.display,
    fontWeight: '800',
    letterSpacing: 5,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  rule: {
    width: scale(60),
    height: 1,
    backgroundColor: Colors.brass,
    marginVertical: Layout.spacing.sm,
    opacity: 0.7,
  },
  tagline: {
    fontSize: Layout.font.body,
    color: Colors.textSoft,
    textAlign: 'center',
  },
});

export default SplashScreen;
