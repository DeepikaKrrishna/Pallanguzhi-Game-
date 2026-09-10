import React from 'react';
import Svg, { Circle, G, Path } from 'react-native-svg';
import { Colors } from '../constants/colors';

interface KolamProps {
  size: number;
  /** How strongly the rice-flour pattern reads against the floor. */
  opacity?: number;
  color?: string;
}

/**
 * A pulli kolam: a dot grid with a looping line threaded around it, the
 * pattern drawn on doorsteps across Tamil Nadu each morning. Rendered as
 * vector art so it stays crisp at any size and adds nothing to app weight.
 */
const KolamBackground: React.FC<KolamProps> = ({
  size,
  opacity = 0.12,
  color = Colors.kolam,
}) => {
  const dots: React.ReactNode[] = [];
  const grid = 5;
  const step = 100 / (grid + 1);

  for (let row = 1; row <= grid; row += 1) {
    for (let col = 1; col <= grid; col += 1) {
      // Diamond-shaped grid: the classic layout, widest through the middle.
      const distance = Math.abs(row - 3) + Math.abs(col - 3);
      if (distance > 2) continue;
      dots.push(
        <Circle
          key={`${row}-${col}`}
          cx={col * step}
          cy={row * step}
          r={1.6}
          fill={color}
        />
      );
    }
  }

  return (
    <Svg width={size} height={size} viewBox="0 0 100 100" opacity={opacity}>
      <G>
        {dots}
        {/* Looping line threaded between the dots. */}
        <Path
          d="M50 12 C70 22, 78 30, 88 50 C78 70, 70 78, 50 88 C30 78, 22 70, 12 50 C22 30, 30 22, 50 12 Z"
          stroke={color}
          strokeWidth={1.4}
          fill="none"
        />
        <Path
          d="M50 28 C62 34, 66 38, 72 50 C66 62, 62 66, 50 72 C38 66, 34 62, 28 50 C34 38, 38 34, 50 28 Z"
          stroke={color}
          strokeWidth={1.1}
          fill="none"
        />
      </G>
    </Svg>
  );
};

export default React.memo(KolamBackground);
