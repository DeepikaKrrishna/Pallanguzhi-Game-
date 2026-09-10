import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet } from 'react-native';
import Seed from './Seed';
import { BoardMetrics, Point } from '../constants/dimensions';

interface FlyingSeedProps {
  from: Point;
  to: Point;
  duration: number;
  onArrive?: () => void;
}

/**
 * A single shell travelling between two pits. The horizontal path is linear
 * while the vertical one lifts and falls, so the seed follows a thrown arc
 * rather than sliding flat across the board.
 */
const FlyingSeed: React.FC<FlyingSeedProps> = ({
  from,
  to,
  duration,
  onArrive,
}) => {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) onArrive?.();
    });
  }, [progress, duration, onArrive]);

  const distance = Math.hypot(to.x - from.x, to.y - from.y);
  const lift = Math.min(BoardMetrics.pitSize * 0.75, distance * 0.42 + 8);
  const midY = (from.y + to.y) / 2 - lift;

  const translateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [from.x, to.x],
  });

  const translateY = progress.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [from.y, midY, to.y],
  });

  // Slightly larger at the top of the arc: the shell reads as nearer the eye.
  const scale = progress.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.85, 1.25, 0.95],
  });

  const rotate = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '220deg'],
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.seed,
        {
          transform: [
            { translateX },
            { translateY },
            { scale },
            { rotate },
          ],
        },
      ]}
    >
      <Seed size={BoardMetrics.seedSize * 1.15} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  seed: {
    position: 'absolute',
    // translateX/Y address the seed's centre, so pull it back by half its size.
    left: -BoardMetrics.seedSize * 0.575,
    top: -BoardMetrics.seedSize * 0.575,
    zIndex: 20,
    elevation: 20,
  },
});

export default React.memo(FlyingSeed);
