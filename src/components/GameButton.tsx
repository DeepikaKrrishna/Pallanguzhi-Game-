import React, { useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Gradients } from '../constants/colors';
import { Layout } from '../constants/dimensions';

type Variant = 'primary' | 'secondary' | 'ghost';

interface GameButtonProps {
  label: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
  style?: ViewStyle;
}

/** Brass for the primary action, carved wood for the rest. */
const GameButton: React.FC<GameButtonProps> = ({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  style,
}) => {
  const press = useRef(new Animated.Value(0)).current;

  const animateTo = (toValue: number, speed: number) =>
    Animated.spring(press, { toValue, speed, useNativeDriver: true }).start();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      onPressIn={() => animateTo(1, 40)}
      onPressOut={() => animateTo(0, 20)}
      disabled={disabled}
      style={style}
    >
      <Animated.View
        style={[
          styles.base,
          disabled && styles.disabled,
          {
            transform: [
              {
                scale: press.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 0.96],
                }),
              },
            ],
          },
        ]}
      >
        {variant === 'primary' ? (
          <LinearGradient
            colors={[...Gradients.brass]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        ) : variant === 'secondary' ? (
          <LinearGradient
            colors={[...Gradients.woodRail]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        ) : null}

        <Animated.View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFill,
            styles.sheen,
            {
              opacity: press.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.18],
              }),
            },
          ]}
        />

        <Text
          style={[
            styles.label,
            variant === 'primary' && styles.labelPrimary,
            variant === 'ghost' && styles.labelGhost,
          ]}
        >
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    paddingVertical: Layout.spacing.md,
    paddingHorizontal: Layout.spacing.lg,
    borderRadius: Layout.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(240, 212, 121, 0.35)',
  },
  sheen: { backgroundColor: '#000' },
  disabled: { opacity: 0.45 },
  label: {
    fontSize: Layout.font.body,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: Colors.textPrimary,
  },
  labelPrimary: { color: Colors.textOnBrass, fontWeight: '800' },
  labelGhost: { color: Colors.textSoft, fontWeight: '600' },
});

export default React.memo(GameButton);
