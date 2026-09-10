import React, { useCallback, useState } from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import Avatar from '../components/Avatar';
import DialogueBox from '../components/DialogueBox';
import ScreenBackground from '../components/ScreenBackground';
import { Colors } from '../constants/colors';
import { Layout, scale } from '../constants/dimensions';
import { INTRO, renderLine } from '../story/script';
import { ScreenProps } from '../navigation/AppNavigator';

/**
 * The opening conversation. The two players settle on the verandah and the one
 * who knows the game explains it while they set up, so the rules arrive as
 * talk rather than as a manual. Skippable at any line.
 */
const StoryIntroScreen: React.FC<ScreenProps<'StoryIntro'>> = ({
  navigation,
  route,
}) => {
  const { players } = route.params;
  const [index, setIndex] = useState(0);

  const begin = useCallback(() => {
    navigation.replace('Game', { players });
  }, [navigation, players]);

  const advance = useCallback(() => {
    if (index >= INTRO.length - 1) begin();
    else setIndex((n) => n + 1);
  }, [index, begin]);

  const line = INTRO[index];
  const speaker = players[line.speaker];
  const listener = players[line.speaker === 0 ? 1 : 0];

  return (
    <ScreenBackground>
      <SafeAreaView style={styles.container}>
        <View style={styles.topBar}>
          <Text style={styles.progress}>
            {index + 1} / {INTRO.length}
          </Text>
          <Pressable onPress={begin} accessibilityRole="button">
            <Text style={styles.skip}>Skip</Text>
          </Pressable>
        </View>

        {/* Both girls stay on screen; whoever is talking comes forward. */}
        <View style={styles.stage}>
          <View style={styles.figure}>
            <Avatar
              config={players[0].avatar}
              size={scale(96)}
              dimmed={line.speaker !== 0}
            />
            <Text
              style={[
                styles.figureName,
                line.speaker === 0 && styles.figureNameOn,
              ]}
            >
              {players[0].name}
            </Text>
          </View>

          <View style={styles.figure}>
            <Avatar
              config={players[1].avatar}
              size={scale(96)}
              dimmed={line.speaker !== 1}
            />
            <Text
              style={[
                styles.figureName,
                line.speaker === 1 && styles.figureNameOn,
              ]}
            >
              {players[1].name}
            </Text>
          </View>
        </View>

        <View style={styles.dialogue}>
          <DialogueBox
            avatar={speaker.avatar}
            speakerName={speaker.name}
            text={renderLine(line.text, speaker.name, listener.name)}
            side={line.speaker === 0 ? 'left' : 'right'}
            onAdvance={advance}
            isLast={index === INTRO.length - 1}
          />
        </View>
      </SafeAreaView>
    </ScreenBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Layout.spacing.md,
    justifyContent: 'space-between',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progress: {
    fontSize: Layout.font.caption,
    color: Colors.textMuted,
    letterSpacing: 1,
  },
  skip: {
    fontSize: Layout.font.caption,
    fontWeight: '700',
    letterSpacing: 1,
    color: Colors.brassBright,
    paddingHorizontal: Layout.spacing.sm,
    paddingVertical: Layout.spacing.xs,
  },
  stage: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    flex: 1,
    paddingBottom: Layout.spacing.lg,
  },
  figure: { alignItems: 'center' },
  figureName: {
    marginTop: Layout.spacing.xs,
    fontSize: Layout.font.caption,
    color: Colors.textMuted,
  },
  figureNameOn: { color: Colors.brassBright, fontWeight: '700' },
  dialogue: { paddingBottom: Layout.spacing.sm },
});

export default StoryIntroScreen;
