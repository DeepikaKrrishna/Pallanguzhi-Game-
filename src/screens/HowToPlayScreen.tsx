import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import GameButton from '../components/GameButton';
import GameHeader from '../components/GameHeader';
import ScreenBackground from '../components/ScreenBackground';
import { Colors } from '../constants/colors';
import { Layout } from '../constants/dimensions';
import {
  CAPTURE_COUNT,
  SEEDS_PER_PIT,
  TOTAL_PITS,
  TOTAL_SEEDS,
} from '../constants/gameConstants';
import { ScreenProps } from '../navigation/AppNavigator';

interface Section {
  heading: string;
  body: string;
}

const sections: Section[] = [
  {
    heading: 'What is Pallanguzhi?',
    body:
      'A two-player sowing game played across South India for centuries. Players lift seeds from a pit and drop them one by one around the board, trying to collect more seeds than their opponent.',
  },
  {
    heading: 'The board',
    body: `Two rows of seven pits, ${TOTAL_PITS} in total. The bottom row belongs to player 1 and the top row to player 2. Seeds travel anticlockwise through every pit on the board, yours and your opponent's alike.`,
  },
  {
    heading: 'Starting position',
    body: `Every pit begins with ${SEEDS_PER_PIT} seeds, so ${TOTAL_SEEDS} seeds are in play. Player 1 moves first.`,
  },
  {
    heading: 'Making a move',
    body:
      'Tap any pit in your own row that still has seeds. All of them are lifted and dropped one per pit, moving anticlockwise. When your hand empties, look at the next pit: if it has seeds, lift those and keep going.',
  },
  {
    heading: 'Capturing seeds',
    body: `Two ways to capture. The moment a pit reaches exactly ${CAPTURE_COUNT} seeds, you take those ${CAPTURE_COUNT}. And when your hand empties in front of an empty pit, the seeds in the pit just beyond it are yours, and your turn ends.`,
  },
  {
    heading: 'Scoring',
    body:
      'Captured seeds go to your pile and stay there. The counter above the board shows both piles as they grow.',
  },
  {
    heading: 'Winning',
    body:
      'The game ends when the player to move has no seeds left in their row. Seeds still on the board go to whoever owns the row they sit in. The larger pile wins; equal piles are a draw.',
  },
];

const HowToPlayScreen: React.FC<ScreenProps<'HowToPlay'>> = ({
  navigation,
}) => (
  <ScreenBackground variant="quiet">
      <SafeAreaView style={styles.container}>
    <GameHeader title="HOW TO PLAY" tamilTitle="எப்படி விளையாடுவது" />

    <ScrollView
      contentContainerStyle={styles.scroll}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.diagram}>
        {[0, 1].map((row) => (
          <View key={row} style={styles.diagramRow}>
            {[0, 1, 2, 3, 4, 5, 6].map((pit) => (
              <View key={pit} style={styles.diagramPit}>
                <Text style={styles.diagramText}>{SEEDS_PER_PIT}</Text>
              </View>
            ))}
          </View>
        ))}
      </View>
      <Text style={styles.caption}>
        Starting board: seven pits each, five seeds per pit
      </Text>

      {sections.map((section) => (
        <View key={section.heading} style={styles.section}>
          <Text style={styles.heading}>{section.heading}</Text>
          <Text style={styles.body}>{section.body}</Text>
        </View>
      ))}
    </ScrollView>

    <GameButton
      label="Back"
      variant="secondary"
      onPress={() => navigation.goBack()}
    />
  </SafeAreaView>
    </ScreenBackground>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Layout.spacing.md,
  },
  scroll: { paddingBottom: Layout.spacing.lg },
  diagram: {
    alignSelf: 'center',
    padding: Layout.spacing.sm,
    borderRadius: Layout.radius.lg,
    backgroundColor: Colors.woodMid,
    marginTop: Layout.spacing.sm,
  },
  diagramRow: { flexDirection: 'row' },
  diagramPit: {
    width: 30,
    height: 30,
    borderRadius: 15,
    margin: 2,
    backgroundColor: Colors.pitDeep,
    alignItems: 'center',
    justifyContent: 'center',
  },
  diagramText: { color: Colors.brass, fontSize: Layout.font.caption },
  caption: {
    textAlign: 'center',
    color: Colors.textMuted,
    fontSize: Layout.font.caption,
    marginTop: Layout.spacing.xs,
  },
  section: { marginTop: Layout.spacing.lg },
  heading: {
    fontSize: Layout.font.subtitle,
    fontWeight: '700',
    color: Colors.brassBright,
    marginBottom: Layout.spacing.xs,
  },
  body: {
    fontSize: Layout.font.body,
    lineHeight: Layout.font.body * 1.55,
    color: Colors.textPrimary,
  },
});

export default HowToPlayScreen;
