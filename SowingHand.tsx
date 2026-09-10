import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet } from 'react-native';
import Svg, {
  Circle,
  Defs,
  Ellipse,
  G,
  LinearGradient,
  Path,
  Stop,
} from 'react-native-svg';
import { BoardMetrics, Point, scale } from '../constants/dimensions';
import { AvatarConfig, outfitOf, skinOf } from '../story/avatars';

interface SowingHandProps {
  /** Where the hand should be. Null hides it. */
  target: Point | null;
  /** Whose hand it is, for skin tone and bangles. */
  avatar: AvatarConfig;
  /** How long the move to the target should take. */
  duration: number;
  /** Bumped on each release, to trigger the drop motion. */
  dropKey: number;
}

const WIDTH = BoardMetrics.pitSize * 1.55;
const HEIGHT = BoardMetrics.pitSize * 2.05;

/**
 * The player's hand, moving pit to pit and tipping open to let a shell fall.
 *
 * It is drawn from the wrist up as it appears from the player's own side of
 * the board — the forearm running off the bottom edge, bangles at the wrist,
 * fingers pinched above the pit being sown. Position is animated continuously
 * rather than remounted per hop, so the hand travels rather than teleports.
 */
const SowingHand: React.FC<SowingHandProps> = ({
  target,
  avatar,
  duration,
  dropKey,
}) => {
  const position = useRef(
    new Animated.ValueXY({
      x: target?.x ?? 0,
      y: target?.y ?? 0,
    })
  ).current;
  const visibility = useRef(new Animated.Value(0)).current;
  const drop = useRef(new Animated.Value(0)).current;
  const hasPlaced = useRef(false);

  const skin = skinOf(avatar);
  const outfit = outfitOf(avatar);
  const wearsBangles = avatar.gender === 'girl';

  // Travel to each new pit.
  useEffect(() => {
    if (!target) return;

    if (!hasPlaced.current) {
      // First appearance: start at the pit rather than sliding in from 0,0.
      position.setValue({ x: target.x, y: target.y });
      hasPlaced.current = true;
    } else {
      Animated.timing(position, {
        toValue: { x: target.x, y: target.y },
        duration: Math.max(70, duration * 0.8),
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      }).start();
    }
  }, [target, duration, position]);

  // Fade in while sowing, out when the turn ends.
  useEffect(() => {
    Animated.timing(visibility, {
      toValue: target ? 1 : 0,
      duration: target ? 160 : 260,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished && !target) hasPlaced.current = false;
    });
  }, [target, visibility]);

  // A small dip and tilt each time a shell is released.
  useEffect(() => {
    if (dropKey === 0) return;
    drop.setValue(0);
    Animated.sequence([
      Animated.timing(drop, {
        toValue: 1,
        duration: Math.max(60, duration * 0.35),
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(drop, {
        toValue: 0,
        duration: Math.max(70, duration * 0.45),
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();
  }, [dropKey, duration, drop]);

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.container,
        {
          opacity: visibility,
          transform: [
            { translateX: position.x },
            { translateY: position.y },
            {
              translateY: drop.interpolate({
                inputRange: [0, 1],
                outputRange: [0, scale(7)],
              }),
            },
            {
              rotate: drop.interpolate({
                inputRange: [0, 1],
                outputRange: ['-8deg', '4deg'],
              }),
            },
            {
              scale: visibility.interpolate({
                inputRange: [0, 1],
                outputRange: [0.9, 1],
              }),
            },
          ],
        },
      ]}
    >
      <Svg width={WIDTH} height={HEIGHT} viewBox="0 0 100 140">
        <Defs>
          <LinearGradient id="handSkin" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={skin.base} />
            <Stop offset="1" stopColor={skin.shade} />
          </LinearGradient>
        </Defs>

        {/* Forearm running off the near edge of the board */}
        <Path
          d="M36 140 C34 122, 36 110, 40 100 L64 100 C68 110, 70 122, 70 140 Z"
          fill="url(#handSkin)"
        />

        {/* Sleeve or sari edge at the elbow */}
        <Path
          d="M33 140 C33 132, 34 126, 36 122 L70 122 C72 126, 73 132, 73 140 Z"
          fill={outfit.main}
          opacity="0.95"
        />

        {wearsBangles && (
          <G>
            <Ellipse cx="53" cy="112" rx="18" ry="4.4" fill={outfit.accent} />
            <Ellipse cx="53" cy="105" rx="17.5" ry="4.2" fill="#2E7D4F" />
            <Ellipse cx="53" cy="98" rx="17" ry="4" fill={outfit.accent} />
          </G>
        )}

        {/* Palm, turned down over the pit */}
        <Path
          d="M34 96 C30 80, 32 66, 40 56 C48 46, 62 44, 70 52 C78 60, 76 78, 70 92 C64 102, 42 104, 34 96 Z"
          fill="url(#handSkin)"
        />

        {/* Fingers, pinched together around the shell */}
        <G fill="url(#handSkin)" stroke={skin.shade} strokeWidth="1.1">
          <Path d="M38 58 C36 44, 38 32, 44 28 C48 26, 51 29, 50 36 C49 44, 48 52, 48 58 Z" />
          <Path d="M51 56 C50 40, 52 28, 58 25 C62 23, 65 27, 63 35 C61 44, 60 50, 59 57 Z" />
          <Path d="M62 59 C63 47, 66 37, 71 35 C75 34, 77 38, 75 45 C73 52, 71 56, 70 61 Z" />
        </G>
        {/* Creases where the fingers meet the palm */}
        <G stroke={skin.shade} strokeWidth="0.9" opacity="0.6" fill="none">
          <Path d="M49 57 C47 60, 44 61, 41 60" />
          <Path d="M60 57 C58 61, 55 62, 51 61" />
        </G>

        {/* Thumb closing against them */}
        <Path
          d="M36 76 C28 70, 26 60, 30 54 C33 50, 38 51, 39 57 C40 63, 40 70, 41 76 Z"
          fill="url(#handSkin)"
          stroke={skin.shade}
          strokeWidth="0.8"
        />

        {/* The shell about to fall from the fingertips */}
        <Ellipse cx="54" cy="27" rx="5.4" ry="4.4" fill="#F7EFDD" />
        <Path d="M54 23.5 V30.5" stroke="#B49B6E" strokeWidth="0.9" />

        {/* A ring, catching the lamplight */}
        <Circle cx="44" cy="46" r="2.4" fill={outfit.accent} opacity="0.9" />
      </Svg>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    // Anchored so the fingertips, not the corner, sit over the target pit.
    left: -WIDTH / 2,
    top: -HEIGHT * 0.62,
    zIndex: 30,
    elevation: 30,
  },
});

export default React.memo(SowingHand);
