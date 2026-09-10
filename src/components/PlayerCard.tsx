import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Avatar from './Avatar';
import { Colors } from '../constants/colors';
import { Layout, scale } from '../constants/dimensions';
import { AvatarConfig } from '../story/avatars';

interface PlayerCardProps {
  name: string;
  score: number;
  active: boolean;
  config: AvatarConfig;
  align?: 'left' | 'right';
}

/**
 * A player's name and captured pile. The card lifts when it is their turn and
 * the number kicks each time seeds are added, so a capture is felt as well as
 * counted.
 */
const PlayerCard: React.FC<PlayerCardProps> = ({
  name,
  score,
  active,
  config,
  align = 'left',
}) => {
  const kick = useRef(new Animated.Value(0)).current;
  const lift = useRef(new Animated.Value(active ? 1 : 0)).current;
  const previousScore = useRef(score);

  useEffect(() => {
    if (score === previousScore.current) return;
    previousScore.current = score;
    kick.setValue(1);
    Animated.timing(kick, {
      toValue: 0,
      duration: 420,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [score, kick]);

  useEffect(() => {
    Animated.spring(lift, {
      toValue: active ? 1 : 0,
      useNativeDriver: true,
      speed: 14,
      bounciness: 6,
    }).start();
  }, [active, lift]);

  return (
    <Animated.View
      style={[
        styles.card,
        active && styles.activeCard,
        {
          transform: [
            {
              scale: lift.interpolate({
                inputRange: [0, 1],
                outputRange: [0.97, 1],
              }),
            },
          ],
        },
      ]}
    >
      {active && (
        <LinearGradient
          colors={['rgba(240, 212, 121, 0.22)', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />
      )}

      <View
        style={[styles.header, align === 'right' && styles.headerReversed]}
      >
        <Avatar config={config} size={scale(26)} dimmed={!active} />
        <Text numberOfLines={1} style={[styles.name, { textAlign: align }]}>
          {name}
        </Text>
      </View>

      <Animated.Text
        style={[
          styles.score,
          { textAlign: align },
          {
            transform: [
              {
                scale: kick.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 1.3],
                }),
              },
            ],
          },
        ]}
      >
        {score}
      </Animated.Text>

      <Text style={[styles.caption, { textAlign: align }]}>captured</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    paddingVertical: Layout.spacing.sm,
    paddingHorizontal: Layout.spacing.md,
    borderRadius: Layout.radius.md,
    backgroundColor: Colors.panel,
    borderWidth: 1,
    borderColor: 'rgba(139, 90, 43, 0.5)',
    overflow: 'hidden',
  },
  activeCard: {
    borderColor: Colors.brass,
    backgroundColor: 'rgba(74, 44, 23, 0.85)',
  },
  header: { flexDirection: 'row', alignItems: 'center' },
  headerReversed: { flexDirection: 'row-reverse' },
  name: {
    flex: 1,
    marginHorizontal: Layout.spacing.xs,
    fontSize: Layout.font.body,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  score: {
    fontSize: Layout.font.title,
    fontWeight: '800',
    color: Colors.brassBright,
  },
  caption: {
    fontSize: Layout.font.micro,
    letterSpacing: 1,
    color: Colors.textMuted,
  },
});

export default React.memo(PlayerCard);
