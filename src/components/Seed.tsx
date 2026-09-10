import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Gradients } from '../constants/colors';
import { BoardMetrics } from '../constants/dimensions';

interface SeedProps {
  /** Slight per-seed rotation, so a pit of shells is never uniform. */
  rotation?: number;
  size?: number;
}

/**
 * One cowrie shell. Lit from the upper left with a bright rim and a shaded
 * underside, which reads as a rounded object rather than a flat dot.
 */
const Seed: React.FC<SeedProps> = ({ rotation = 0, size }) => {
  const dimension = size ?? BoardMetrics.seedSize;

  return (
    <View
      style={[
        styles.wrapper,
        {
          width: dimension,
          height: dimension,
          borderRadius: dimension / 2,
          transform: [{ rotate: `${rotation}deg` }],
        },
      ]}
    >
      <LinearGradient
        colors={[...Gradients.shell]}
        start={{ x: 0.25, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        style={[styles.body, { borderRadius: dimension / 2 }]}
      />
      {/* The slit down the middle of a cowrie. */}
      <View
        style={[
          styles.slit,
          { height: dimension * 0.5, top: dimension * 0.25 },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.shellEdge,
  },
  body: { ...StyleSheet.absoluteFillObject },
  slit: {
    position: 'absolute',
    alignSelf: 'center',
    width: StyleSheet.hairlineWidth * 2,
    backgroundColor: Colors.shellEdge,
    opacity: 0.7,
  },
});

export default React.memo(Seed);
