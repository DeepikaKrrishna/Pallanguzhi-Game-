import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../constants/colors';
import { Layout } from '../constants/dimensions';

interface GameHeaderProps {
  title: string;
  tamilTitle?: string;
  subtitle?: string;
}

/** Shared screen heading, with a kolam-style rule drawn underneath. */
const GameHeader: React.FC<GameHeaderProps> = ({
  title,
  tamilTitle,
  subtitle,
}) => (
  <View style={styles.container}>
    {tamilTitle ? <Text style={styles.tamil}>{tamilTitle}</Text> : null}
    <Text style={styles.title}>{title}</Text>

    <View style={styles.rule}>
      <View style={styles.dot} />
      <View style={styles.line} />
      <View style={styles.diamond} />
      <View style={styles.line} />
      <View style={styles.dot} />
    </View>

    {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
  </View>
);

const styles = StyleSheet.create({
  container: { alignItems: 'center', paddingVertical: Layout.spacing.sm },
  tamil: {
    fontSize: Layout.font.subtitle,
    color: Colors.brassBright,
    marginBottom: 2,
  },
  title: {
    fontSize: Layout.font.title,
    fontWeight: '800',
    letterSpacing: 2,
    color: Colors.textPrimary,
  },
  rule: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Layout.spacing.xs,
  },
  line: {
    width: Layout.spacing.xl,
    height: 1,
    backgroundColor: Colors.brass,
    marginHorizontal: Layout.spacing.xs,
    opacity: 0.8,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: Colors.brass,
  },
  diamond: {
    width: 7,
    height: 7,
    backgroundColor: Colors.brassBright,
    transform: [{ rotate: '45deg' }],
  },
  subtitle: {
    marginTop: Layout.spacing.xs,
    fontSize: Layout.font.caption,
    color: Colors.textMuted,
  },
});

export default React.memo(GameHeader);
