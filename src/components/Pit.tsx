import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Seed from './Seed';
import { Colors, Gradients } from '../constants/colors';
import { BoardMetrics, Layout, seedOffset } from '../constants/dimensions';

interface PitProps {
  index: number;
  seeds: number;
  /** True when this pit belongs to the player whose turn it is. */
  playable: boolean;
  /** True on the frame a seed lands here, driving the ripple. */
  active: boolean;
  /** True when the pit's contents were just captured. */
  captured: boolean;
  onPress: (index: number) => void;
  disabled: boolean;
}

/** Beyond this the shells would overlap, so only the count is shown. */
const MAX_DRAWN_SEEDS = 14;

/**
 * A pit hollowed into the board. Depth comes from a dark gradient with a lit
 * rim; a playable pit breathes slowly so a player can see where they may move.
 */
const Pit: React.FC<PitProps> = ({
  index,
  seeds,
  playable,
  active,
  captured,
  onPress,
  disabled,
}) => {
  const land = useRef(new Animated.Value(0)).current;
  const breathe = useRef(new Animated.Value(0)).current;
  const capture = useRef(new Animated.Value(0)).current;
  const press = useRef(new Animated.Value(0)).current;

  // A seed just landed: the pit swells and settles.
  useEffect(() => {
    if (!active) return;
    land.setValue(1);
    Animated.timing(land, {
      toValue: 0,
      duration: 320,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [active, land]);

  // Captured: a bright flash washes over the pit as it empties.
  useEffect(() => {
    if (!captured) return;
    capture.setValue(1);
    Animated.timing(capture, {
      toValue: 0,
      duration: 520,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [captured, capture]);

  // Playable pits pulse gently, the way a lamp flickers.
  useEffect(() => {
    if (!playable) {
      breathe.stopAnimation();
      breathe.setValue(0);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(breathe, {
          toValue: 1,
          duration: 1100,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(breathe, {
          toValue: 0,
          duration: 1100,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [playable, breathe]);

  const scale = Animated.add(
    Animated.multiply(land, 0.09),
    Animated.multiply(press, -0.06)
  ).interpolate({
    inputRange: [-0.06, 0, 0.09],
    outputRange: [0.94, 1, 1.09],
  });

  const drawn = Math.min(seeds, MAX_DRAWN_SEEDS);
  const isInteractive = playable && seeds > 0 && !disabled;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Pit ${index + 1}, ${seeds} seeds`}
      accessibilityState={{ disabled: !isInteractive }}
      onPress={() => onPress(index)}
      onPressIn={() =>
        Animated.spring(press, {
          toValue: 1,
          useNativeDriver: true,
          speed: 40,
        }).start()
      }
      onPressOut={() =>
        Animated.spring(press, {
          toValue: 0,
          useNativeDriver: true,
          speed: 24,
        }).start()
      }
      disabled={!isInteractive}
      style={styles.touchable}
    >
      {/* Halo behind a playable pit. */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.halo,
          {
            opacity: breathe.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0.55],
            }),
            transform: [
              {
                scale: breathe.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.96, 1.16],
                }),
              },
            ],
          },
        ]}
      />

      <Animated.View style={[styles.pit, { transform: [{ scale }] }]}>
        <LinearGradient
          colors={[...Gradients.pit]}
          start={{ x: 0.3, y: 0 }}
          end={{ x: 0.7, y: 1 }}
          style={styles.hollow}
        />

        {/* Lit rim along the top edge of the hollow. */}
        <View style={styles.rimLight} pointerEvents="none" />

        {Array.from({ length: drawn }).map((_, i) => {
          const offset = seedOffset(i, drawn, index);
          return (
            <View
              key={i}
              style={[
                styles.seedSlot,
                {
                  transform: [
                    { translateX: offset.x },
                    { translateY: offset.y },
                  ],
                },
              ]}
            >
              <Seed rotation={(i * 47 + index * 13) % 180} />
            </View>
          );
        })}

        {seeds > MAX_DRAWN_SEEDS && (
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{seeds}</Text>
          </View>
        )}

        {/* Capture flash. */}
        <Animated.View
          pointerEvents="none"
          style={[
            styles.flash,
            {
              opacity: capture,
              transform: [
                {
                  scale: capture.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1.5, 0.9],
                  }),
                },
              ],
            },
          ]}
        />
      </Animated.View>

      {seeds > 0 && seeds <= MAX_DRAWN_SEEDS && (
        <Text style={styles.count}>{seeds}</Text>
      )}
    </Pressable>
  );
};

const SIZE = BoardMetrics.pitSize;

const styles = StyleSheet.create({
  touchable: {
    width: SIZE,
    height: SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  halo: {
    position: 'absolute',
    width: SIZE * 1.12,
    height: SIZE * 1.12,
    borderRadius: SIZE,
    borderWidth: 1.5,
    borderColor: Colors.brassBright,
    backgroundColor: Colors.glow,
  },
  pit: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.pitRim,
  },
  hollow: { ...StyleSheet.absoluteFillObject },
  rimLight: {
    position: 'absolute',
    top: 0,
    left: SIZE * 0.12,
    right: SIZE * 0.12,
    height: SIZE * 0.34,
    borderTopLeftRadius: SIZE,
    borderTopRightRadius: SIZE,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  seedSlot: { position: 'absolute' },
  flash: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: SIZE / 2,
    backgroundColor: Colors.brassBright,
  },
  count: {
    position: 'absolute',
    bottom: -1,
    fontSize: Layout.font.micro,
    fontWeight: '700',
    color: Colors.brassBright,
    textShadowColor: 'rgba(0,0,0,0.9)',
    textShadowRadius: 3,
  },
  countBadge: {
    position: 'absolute',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 8,
    backgroundColor: 'rgba(26, 13, 6, 0.75)',
  },
  countText: {
    fontSize: Layout.font.caption,
    fontWeight: '800',
    color: Colors.brassBright,
  },
});

export default React.memo(Pit);
