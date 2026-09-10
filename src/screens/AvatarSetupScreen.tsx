import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Avatar from '../components/Avatar';
import GameButton from '../components/GameButton';
import GameHeader from '../components/GameHeader';
import ScreenBackground from '../components/ScreenBackground';
import { Colors } from '../constants/colors';
import { Layout, scale } from '../constants/dimensions';
import {
  AvatarConfig,
  DEFAULT_AVATARS,
  Gender,
  OUTFITS,
  PlayerConfig,
  SKIN_TONES,
  hairstylesFor,
} from '../story/avatars';
import { ScreenProps } from '../navigation/AppNavigator';

const MAX_NAME_LENGTH = 14;

/**
 * Both players type their own name and build their own face. Nothing chosen
 * here affects play — it decides who is looking back at you from the board.
 */
const AvatarSetupScreen: React.FC<ScreenProps<'GameSetup'>> = ({
  navigation,
}) => {
  const [seat, setSeat] = useState<0 | 1>(0);
  const [names, setNames] = useState<[string, string]>(['', '']);
  const [avatars, setAvatars] = useState<[AvatarConfig, AvatarConfig]>([
    { ...DEFAULT_AVATARS[0] },
    { ...DEFAULT_AVATARS[1] },
  ]);

  const current = avatars[seat];

  /** Applies a change to whichever seat is being edited. */
  const update = (patch: Partial<AvatarConfig>) => {
    setAvatars((all) => {
      const next: [AvatarConfig, AvatarConfig] = [
        { ...all[0] },
        { ...all[1] },
      ];
      next[seat] = { ...next[seat], ...patch };
      return next;
    });
  };

  const setName = (value: string) => {
    setNames((all) => {
      const next: [string, string] = [all[0], all[1]];
      next[seat] = value;
      return next;
    });
  };

  const start = () => {
    const players: [PlayerConfig, PlayerConfig] = [
      { name: names[0].trim() || 'Player 1', avatar: avatars[0] },
      { name: names[1].trim() || 'Player 2', avatar: avatars[1] },
    ];
    navigation.replace('StoryIntro', { players });
  };

  const hairstyles = hairstylesFor(current.gender);

  return (
    <ScreenBackground variant="quiet">
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.flex}
        >
          <GameHeader title="WHO IS PLAYING" tamilTitle="யார் விளையாடுகிறார்கள்" />

          {/* Seat switcher. Bottom row plays first. */}
          <View style={styles.seatTabs}>
            {([0, 1] as const).map((index) => (
              <Pressable
                key={index}
                onPress={() => setSeat(index)}
                style={[styles.seatTab, seat === index && styles.seatTabOn]}
              >
                <Avatar
                  config={avatars[index]}
                  size={scale(30)}
                  dimmed={seat !== index}
                  idSuffix={`tab${index}`}
                />
                <View style={styles.seatText}>
                  <Text style={styles.seatLabel}>
                    {index === 0 ? 'Bottom row' : 'Top row'}
                  </Text>
                  <Text numberOfLines={1} style={styles.seatName}>
                    {names[index].trim() || `Player ${index + 1}`}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>

          <ScrollView
            contentContainerStyle={styles.scroll}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.preview}>
              <Avatar
                config={current}
                size={scale(132)}
                idSuffix={`preview${seat}`}
              />
            </View>

            <Text style={styles.label}>Your name</Text>
            <TextInput
              value={names[seat]}
              onChangeText={setName}
              placeholder={`Player ${seat + 1}`}
              placeholderTextColor={Colors.textMuted}
              maxLength={MAX_NAME_LENGTH}
              style={styles.input}
              returnKeyType="done"
            />

            <Text style={styles.label}>Playing as</Text>
            <View style={styles.row}>
              {(['girl', 'boy'] as Gender[]).map((gender) => (
                <Pressable
                  key={gender}
                  onPress={() => update({ gender, hair: 0 })}
                  style={[
                    styles.choice,
                    current.gender === gender && styles.choiceOn,
                  ]}
                >
                  <Text
                    style={[
                      styles.choiceText,
                      current.gender === gender && styles.choiceTextOn,
                    ]}
                  >
                    {gender === 'girl' ? 'Girl' : 'Boy'}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text style={styles.label}>Skin tone</Text>
            <View style={styles.row}>
              {SKIN_TONES.map((tone, index) => (
                <Pressable
                  key={tone.label}
                  onPress={() => update({ skin: index })}
                  accessibilityLabel={tone.label}
                  style={[
                    styles.swatch,
                    { backgroundColor: tone.base },
                    current.skin === index && styles.swatchOn,
                  ]}
                />
              ))}
            </View>

            <Text style={styles.label}>Clothes</Text>
            <View style={styles.row}>
              {OUTFITS.map((outfit, index) => (
                <Pressable
                  key={outfit.label}
                  onPress={() => update({ outfit: index })}
                  accessibilityLabel={outfit.label}
                  style={[
                    styles.swatch,
                    { backgroundColor: outfit.main },
                    current.outfit === index && styles.swatchOn,
                  ]}
                />
              ))}
            </View>

            <Text style={styles.label}>Hair</Text>
            <View style={styles.row}>
              {hairstyles.map((style, index) => (
                <Pressable
                  key={style}
                  onPress={() => update({ hair: index })}
                  style={[
                    styles.choice,
                    current.hair === index && styles.choiceOn,
                  ]}
                >
                  <Text
                    style={[
                      styles.choiceText,
                      current.hair === index && styles.choiceTextOn,
                    ]}
                  >
                    {style}
                  </Text>
                </Pressable>
              ))}
            </View>
          </ScrollView>

          <View style={styles.actions}>
            <GameButton label="Continue" onPress={start} />
            <GameButton
              label="Back"
              variant="ghost"
              onPress={() => navigation.goBack()}
              style={styles.spaced}
            />
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ScreenBackground>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: Layout.spacing.md },
  flex: { flex: 1 },
  seatTabs: { flexDirection: 'row', marginTop: Layout.spacing.sm },
  seatTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: Layout.spacing.sm,
    marginHorizontal: Layout.spacing.xs / 2,
    borderRadius: Layout.radius.md,
    backgroundColor: Colors.panel,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  seatTabOn: {
    borderColor: Colors.brass,
    backgroundColor: 'rgba(74, 44, 23, 0.9)',
  },
  seatText: { marginLeft: Layout.spacing.sm, flex: 1 },
  seatLabel: { fontSize: Layout.font.micro, color: Colors.textMuted },
  seatName: {
    fontSize: Layout.font.body,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  scroll: { paddingVertical: Layout.spacing.md },
  preview: { alignItems: 'center', marginBottom: Layout.spacing.md },
  label: {
    fontSize: Layout.font.caption,
    color: Colors.textMuted,
    marginTop: Layout.spacing.md,
    marginBottom: Layout.spacing.xs,
    letterSpacing: 1,
  },
  input: {
    backgroundColor: 'rgba(26, 13, 6, 0.7)',
    borderRadius: Layout.radius.md,
    borderWidth: 1,
    borderColor: Colors.woodLight,
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.sm,
    fontSize: Layout.font.subtitle,
    color: Colors.textPrimary,
  },
  row: { flexDirection: 'row', flexWrap: 'wrap' },
  choice: {
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.sm,
    marginRight: Layout.spacing.sm,
    marginBottom: Layout.spacing.xs,
    borderRadius: Layout.radius.pill,
    backgroundColor: Colors.panel,
    borderWidth: 1,
    borderColor: 'rgba(139, 90, 43, 0.6)',
  },
  choiceOn: {
    backgroundColor: 'rgba(201, 162, 39, 0.25)',
    borderColor: Colors.brassBright,
  },
  choiceText: { fontSize: Layout.font.caption, color: Colors.textSoft },
  choiceTextOn: { color: Colors.brassBright, fontWeight: '700' },
  swatch: {
    width: scale(38),
    height: scale(38),
    borderRadius: scale(19),
    marginRight: Layout.spacing.sm,
    marginBottom: Layout.spacing.xs,
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.35)',
  },
  swatchOn: { borderColor: Colors.brassBright, borderWidth: 3 },
  actions: { paddingTop: Layout.spacing.sm },
  spaced: { marginTop: Layout.spacing.sm },
});

export default AvatarSetupScreen;
