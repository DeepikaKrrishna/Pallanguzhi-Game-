import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import KolamBackground from './KolamBackground';
import VerandahScene from './VerandahScene';
import { Colors } from '../constants/colors';
import { Layout } from '../constants/dimensions';

interface ScreenBackgroundProps {
  children: React.ReactNode;
  /**
   * 'scene'  — the painted verandah, for the screens where the game lives.
   * 'quiet'  — the same room dimmed right down, so long text stays readable.
   */
  variant?: 'scene' | 'quiet';
  style?: ViewStyle;
}

/**
 * Every screen sits in the same room. The scene is drawn once and dimmed by a
 * scrim whose strength depends on how much text sits on top of it — the
 * painting is the point, but never at the cost of being able to read.
 */
const ScreenBackground: React.FC<ScreenBackgroundProps> = ({
  children,
  variant = 'scene',
  style,
}) => {
  const isQuiet = variant === 'quiet';

  return (
    <View style={styles.page}>
      <View style={styles.root}>
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <VerandahScene
          width={Layout.screenWidth}
          height={Layout.screenHeight}
        />
      </View>

      {/* Scrim: darkest at the top and bottom, where text and controls sit. */}
      <LinearGradient
        colors={
          isQuiet
            ? ['rgba(26,13,6,0.93)', 'rgba(26,13,6,0.88)', 'rgba(26,13,6,0.95)']
            : ['rgba(26,13,6,0.72)', 'rgba(42,21,9,0.42)', 'rgba(26,13,6,0.86)']
        }
        locations={[0, 0.45, 1]}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />

      {/* Lamplight from the doorway, warming the upper right. */}
      <LinearGradient
        colors={['rgba(240, 212, 121, 0.16)', 'transparent']}
        start={{ x: 0.95, y: 0 }}
        end={{ x: 0.25, y: 0.55 }}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />

      {isQuiet && (
        <View style={styles.kolamCorner} pointerEvents="none">
          <KolamBackground size={Layout.screenWidth * 0.6} opacity={0.08} />
        </View>
      )}

        <View style={[styles.content, style]}>{children}</View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#150A04',
    alignItems: 'center',
  },
  root: {
    flex: 1,
    width: Layout.screenWidth,
    overflow: 'hidden',
    backgroundColor: Colors.duskTop,
  },
  content: { flex: 1 },
  kolamCorner: {
    position: 'absolute',
    bottom: -Layout.screenWidth * 0.18,
    left: -Layout.screenWidth * 0.2,
  },
});

export default React.memo(ScreenBackground);
