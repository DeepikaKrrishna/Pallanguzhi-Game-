import React, { useEffect, useRef } from 'react';
import { Animated, Easing, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import GameButton from '../components/GameButton';
import ScreenBackground from '../components/ScreenBackground';
import Seed from '../components/Seed';
import { Colors, Gradients } from '../constants/colors';
import { Layout, scale } from '../constants/dimensions';
import { ScreenProps } from '../navigation/AppNavigator';

/** The board drifts as though resting on an uneven verandah floor. */
const useFloat = () => {
  const float = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(float, {
          toValue: 1,
          duration: 2600,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(float, {
          toValue: 0,
          duration: 2600,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [float]);

  return float;
};

const HomeScreen: React.FC<ScreenProps<'Home'>> = ({ navigation }) => {
  const float = useFloat();
  const enter = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(enter, {
      toValue: 1,
      duration: 560,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [enter]);

  const rise = {
    opacity: enter,
    transform: [
      {
        translateY: enter.interpolate({
          inputRange: [0, 1],
          outputRange: [18, 0],
        }),
      },
    ],
  };

  return (
    <ScreenBackground>
      <SafeAreaView style={styles.container}>
        <Animated.View style={[styles.header, rise]}>
          <Text style={styles.tamil}>பல்லாங்குழி</Text>
          <Text style={styles.title}>PALLANGUZHI</Text>
          <View style={styles.rule} />
          <Text style={styles.tagline}>
            A traditional Tamil game, reimagined
          </Text>
        </Animated.View>

        <Animated.View
          style={{
            transform: [
              {
                translateY: float.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -8],
                }),
              },
              {
                rotate: float.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['-0.6deg', '0.6deg'],
                }),
              },
            ],
          }}
        >
          <LinearGradient
            colors={[...Gradients.wood]}
            start={{ x: 0.2, y: 0 }}
            end={{ x: 0.85, y: 1 }}
            style={styles.boardArt}
          >
            {[0, 1].map((row) => (
              <View key={row} style={styles.artRow}>
                {Array.from({ length: 7 }).map((_, pit) => (
                  <View key={pit} style={styles.artPit}>
                    <View style={styles.artSeedRow}>
                      <Seed size={scale(7)} rotation={pit * 20} />
                      <Seed size={scale(7)} rotation={pit * 40} />
                    </View>
                    <Seed size={scale(7)} rotation={pit * 60} />
                  </View>
                ))}
              </View>
            ))}
          </LinearGradient>
        </Animated.View>

        <Animated.View style={[styles.actions, rise]}>
          <GameButton
            label="Play now"
            onPress={() => navigation.navigate('GameSetup')}
          />
          <GameButton
            label="How to play"
            variant="secondary"
            onPress={() => navigation.navigate('HowToPlay')}
            style={styles.spaced}
          />
          <View style={styles.pairRow}>
            <GameButton
              label="About"
              variant="ghost"
              onPress={() => navigation.navigate('About')}
              style={styles.pairItem}
            />
            <View style={styles.pairGap} />
            <GameButton
              label="History"
              variant="ghost"
              onPress={() => navigation.navigate('History')}
              style={styles.pairItem}
            />
          </View>
        </Animated.View>
      </SafeAreaView>
    </ScreenBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.lg,
    justifyContent: 'space-between',
  },
  header: { alignItems: 'center' },
  tamil: { fontSize: Layout.font.tamilDisplay, color: Colors.brassBright },
  title: {
    fontSize: Layout.font.title,
    fontWeight: '800',
    letterSpacing: 5,
    color: Colors.textPrimary,
  },
  rule: {
    width: scale(56),
    height: 1,
    backgroundColor: Colors.brass,
    marginVertical: Layout.spacing.sm,
    opacity: 0.7,
  },
  tagline: { fontSize: Layout.font.caption, color: Colors.textSoft },
  boardArt: {
    alignSelf: 'center',
    padding: scale(10),
    borderRadius: scale(26),
    borderWidth: 1,
    borderColor: 'rgba(255, 226, 168, 0.28)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 12,
  },
  artRow: { flexDirection: 'row' },
  artPit: {
    width: scale(32),
    height: scale(32),
    borderRadius: scale(16),
    margin: scale(3),
    backgroundColor: Colors.pitDeep,
    alignItems: 'center',
    justifyContent: 'center',
  },
  artSeedRow: { flexDirection: 'row' },
  actions: { width: '100%' },
  spaced: { marginTop: Layout.spacing.sm },
  pairRow: { flexDirection: 'row', marginTop: Layout.spacing.sm },
  pairItem: { flex: 1 },
  pairGap: { width: Layout.spacing.sm },
});

export default HomeScreen;
