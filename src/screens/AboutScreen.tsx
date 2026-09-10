import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import GameButton from '../components/GameButton';
import GameHeader from '../components/GameHeader';
import ScreenBackground from '../components/ScreenBackground';
import { Colors } from '../constants/colors';
import { Layout } from '../constants/dimensions';
import { ScreenProps } from '../navigation/AppNavigator';

const paragraphs: string[] = [
  'Pallanguzhi is a traditional South Indian sowing game, part of the same family as mancala games found across Asia and Africa. It is played on a long board with two rows of pits carved into the wood.',
  'In Tamil households the game has long been part of everyday life and festival gatherings, often played by women and children on verandahs and temple floors. Boards were carved from rosewood or teak and handed down through families.',
  'Seeds are usually tamarind seeds, cowrie shells or small pebbles. Beyond the counting, the game teaches planning several moves ahead, quick arithmetic and patience.',
  'Fewer households keep a wooden board today. Putting the game on a phone keeps the rules, the vocabulary and the rhythm of play within reach of people who may never have seen one.',
];

const AboutScreen: React.FC<ScreenProps<'About'>> = ({ navigation }) => (
  <ScreenBackground variant="quiet">
      <SafeAreaView style={styles.container}>
    <GameHeader title="ABOUT PALLANGUZHI" tamilTitle="பல்லாங்குழி பற்றி" />

    <ScrollView
      contentContainerStyle={styles.scroll}
      showsVerticalScrollIndicator={false}
    >
      {paragraphs.map((text) => (
        <Text key={text.slice(0, 24)} style={styles.body}>
          {text}
        </Text>
      ))}

      <View style={styles.quoteBox}>
        <Text style={styles.quote}>
          This application aims to preserve Tamil traditional gaming culture by
          transforming Pallanguzhi into an accessible digital experience for
          modern users.
        </Text>
      </View>
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
  body: {
    fontSize: Layout.font.body,
    lineHeight: Layout.font.body * 1.6,
    color: Colors.textPrimary,
    marginTop: Layout.spacing.md,
  },
  quoteBox: {
    marginTop: Layout.spacing.lg,
    padding: Layout.spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: Colors.brass,
    backgroundColor: Colors.panel,
    borderRadius: Layout.radius.sm,
  },
  quote: {
    fontSize: Layout.font.body,
    lineHeight: Layout.font.body * 1.6,
    fontStyle: 'italic',
    color: Colors.textSoft,
  },
});

export default AboutScreen;
