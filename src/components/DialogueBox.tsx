import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';
import Avatar from './Avatar';
import { Colors } from '../constants/colors';
import { Layout, scale } from '../constants/dimensions';
import { AvatarConfig } from '../story/avatars';

interface DialogueBoxProps {
  avatar: AvatarConfig;
  speakerName: string;
  text: string;
  /** Which side of the screen the speaker sits on. */
  side?: 'left' | 'right';
  /** Called when the reader taps past a fully revealed line. */
  onAdvance: () => void;
  /** Shown in place of the arrow on the final line. */
  isLast?: boolean;
}

const CHARACTER_MS = 24;

/**
 * One line of conversation. Text types out at a readable pace; a first tap
 * reveals the whole line at once and a second moves on, so nobody is ever made
 * to wait for the animation.
 */
const DialogueBox: React.FC<DialogueBoxProps> = ({
  avatar,
  speakerName,
  text,
  side = 'left',
  onAdvance,
  isLast = false,
}) => {
  const [revealed, setRevealed] = useState(0);
  const enter = useRef(new Animated.Value(0)).current;
  const nudge = useRef(new Animated.Value(0)).current;

  const complete = revealed >= text.length;

  // Retype from the start whenever the line changes.
  useEffect(() => {
    setRevealed(0);
    enter.setValue(0);
    Animated.timing(enter, {
      toValue: 1,
      duration: 280,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [text, enter]);

  useEffect(() => {
    if (complete) return;
    const timer = setTimeout(() => setRevealed((n) => n + 1), CHARACTER_MS);
    return () => clearTimeout(timer);
  }, [revealed, complete]);

  // Once the line is finished, the prompt breathes to invite a tap.
  useEffect(() => {
    if (!complete) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(nudge, {
          toValue: 1,
          duration: 700,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(nudge, {
          toValue: 0,
          duration: 700,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [complete, nudge]);

  const handlePress = () => {
    if (complete) onAdvance();
    else setRevealed(text.length);
  };

  return (
    <Pressable onPress={handlePress} accessibilityRole="button">
      <Animated.View
        style={[
          styles.container,
          {
            opacity: enter,
            transform: [
              {
                translateY: enter.interpolate({
                  inputRange: [0, 1],
                  outputRange: [14, 0],
                }),
              },
            ],
          },
        ]}
      >
        <View
          style={[
            styles.row,
            side === 'right' && styles.rowReversed,
          ]}
        >
          <View style={styles.portrait}>
            <Avatar config={avatar} size={scale(58)} />
          </View>

          <View style={styles.bubble}>
            <Text style={styles.speaker}>{speakerName}</Text>
            <Text style={styles.text}>
              {text.slice(0, revealed)}
              {!complete && <Text style={styles.cursor}>▌</Text>}
            </Text>

            {complete && (
              <Animated.Text
                style={[
                  styles.prompt,
                  {
                    opacity: nudge.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.35, 1],
                    }),
                  },
                ]}
              >
                {isLast ? 'tap to begin' : 'tap to continue'}
              </Animated.Text>
            )}
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: { width: '100%' },
  row: { flexDirection: 'row', alignItems: 'flex-end' },
  rowReversed: { flexDirection: 'row-reverse' },
  portrait: { marginHorizontal: Layout.spacing.sm },
  bubble: {
    flex: 1,
    backgroundColor: 'rgba(26, 13, 6, 0.88)',
    borderRadius: Layout.radius.md,
    borderWidth: 1,
    borderColor: 'rgba(201, 162, 39, 0.45)',
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.sm,
    minHeight: scale(92),
  },
  speaker: {
    fontSize: Layout.font.caption,
    fontWeight: '800',
    letterSpacing: 1,
    color: Colors.brassBright,
    marginBottom: 2,
  },
  text: {
    fontSize: Layout.font.body,
    lineHeight: Layout.font.body * 1.5,
    color: Colors.textPrimary,
  },
  cursor: { color: Colors.brass },
  prompt: {
    marginTop: Layout.spacing.xs,
    alignSelf: 'flex-end',
    fontSize: Layout.font.micro,
    letterSpacing: 1,
    color: Colors.textMuted,
  },
});

export default React.memo(DialogueBox);
