import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';

import SplashScreen from '../screens/SplashScreen';
import HomeScreen from '../screens/HomeScreen';
import AvatarSetupScreen from '../screens/AvatarSetupScreen';
import StoryIntroScreen from '../screens/StoryIntroScreen';
import GameScreen from '../screens/GameScreen';
import HowToPlayScreen from '../screens/HowToPlayScreen';
import AboutScreen from '../screens/AboutScreen';
import GameOverScreen from '../screens/GameOverScreen';
import HistoryScreen from '../screens/HistoryScreen';
import { Colors } from '../constants/colors';
import { Winner } from '../game/gameState';
import { PlayerConfig } from '../story/avatars';

export type RootStackParamList = {
  Splash: undefined;
  Home: undefined;
  GameSetup: undefined;
  StoryIntro: { players: [PlayerConfig, PlayerConfig] };
  Game: { players: [PlayerConfig, PlayerConfig] };
  GameOver: {
    players: [PlayerConfig, PlayerConfig];
    scores: [number, number];
    winner: Winner;
  };
  HowToPlay: undefined;
  About: undefined;
  History: undefined;
};

export type ScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * Matching the dusk background here stops a white flash between screens, which
 * is what breaks the illusion of one continuous space.
 */
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: Colors.duskTop,
    card: Colors.duskTop,
    text: Colors.textPrimary,
    primary: Colors.brass,
  },
};

const AppNavigator: React.FC = () => (
  <NavigationContainer theme={theme}>
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        animationDuration: 320,
        contentStyle: { backgroundColor: Colors.duskTop },
      }}
    >
      {/* The splash dissolves into the home screen rather than sliding. */}
      <Stack.Screen
        name="Splash"
        component={SplashScreen}
        options={{ animation: 'fade' }}
      />
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ animation: 'fade' }}
      />
      <Stack.Screen name="GameSetup" component={AvatarSetupScreen} />
      {/* The conversation runs straight into the game, so no going back. */}
      <Stack.Screen
        name="StoryIntro"
        component={StoryIntroScreen}
        options={{ animation: 'fade' }}
      />
      {/* Swiping back mid-game would drop the board, so gestures stay off. */}
      <Stack.Screen
        name="Game"
        component={GameScreen}
        options={{ gestureEnabled: false, animation: 'fade_from_bottom' }}
      />
      <Stack.Screen
        name="GameOver"
        component={GameOverScreen}
        options={{ gestureEnabled: false, animation: 'fade' }}
      />
      <Stack.Screen name="HowToPlay" component={HowToPlayScreen} />
      <Stack.Screen name="About" component={AboutScreen} />
      <Stack.Screen name="History" component={HistoryScreen} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default AppNavigator;
