import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import GameButton from '../components/GameButton';
import GameHeader from '../components/GameHeader';
import ScreenBackground from '../components/ScreenBackground';
import { Colors } from '../constants/colors';
import { Layout } from '../constants/dimensions';
import {
  GameRecord,
  HistorySummary,
  clearHistory,
  loadHistory,
} from '../storage/gameHistory';
import { ScreenProps } from '../navigation/AppNavigator';

const formatDate = (timestamp: number): string =>
  new Date(timestamp).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

const HistoryScreen: React.FC<ScreenProps<'History'>> = ({ navigation }) => {
  const [summary, setSummary] = useState<HistorySummary | null>(null);

  // Reload whenever the screen comes back into view, so a finished game shows.
  useFocusEffect(
    useCallback(() => {
      let active = true;
      loadHistory().then((data) => {
        if (active) setSummary(data);
      });
      return () => {
        active = false;
      };
    }, [])
  );

  const renderRecord = ({ item }: { item: GameRecord }) => {
    const result =
      item.winner === 'draw'
        ? 'Draw'
        : item.winner === null
        ? 'Unfinished'
        : `${item.playerNames[item.winner]} won`;

    return (
      <View style={styles.record}>
        <View style={styles.recordMain}>
          <Text style={styles.recordResult}>{result}</Text>
          <Text style={styles.recordMeta}>
            {item.scores[0]} - {item.scores[1]} - {item.turns} turns
          </Text>
        </View>
        <Text style={styles.recordDate}>{formatDate(item.playedAt)}</Text>
      </View>
    );
  };

  return (
    <ScreenBackground variant="quiet">
      <SafeAreaView style={styles.container}>
      <GameHeader title="GAME HISTORY" tamilTitle="ஆட்ட வரலாறு" />

      {summary === null ? (
        <ActivityIndicator color={Colors.brass} style={styles.loader} />
      ) : (
        <>
          <View style={styles.stats}>
            <Stat label="Games" value={summary.totalGames} />
            <Stat label="Bottom row" value={summary.playerOneWins} />
            <Stat label="Top row" value={summary.playerTwoWins} />
            <Stat label="Draws" value={summary.draws} />
          </View>

          <FlatList
            data={summary.records}
            keyExtractor={(item) => String(item.playedAt)}
            renderItem={renderRecord}
            contentContainerStyle={styles.list}
            ListEmptyComponent={
              <Text style={styles.empty}>
                No games yet. Finish a game and the result appears here.
              </Text>
            }
          />

          {summary.totalGames > 0 && (
            <GameButton
              label="Clear history"
              variant="ghost"
              onPress={() => clearHistory().then(setSummary)}
              style={styles.spaced}
            />
          )}
        </>
      )}

      <GameButton
        label="Back"
        variant="secondary"
        onPress={() => navigation.goBack()}
        style={styles.spaced}
      />
    </SafeAreaView>
    </ScreenBackground>
  );
};

const Stat: React.FC<{ label: string; value: number }> = ({ label, value }) => (
  <View style={styles.stat}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Layout.spacing.md,
  },
  loader: { marginTop: Layout.spacing.xl },
  stats: {
    flexDirection: 'row',
    marginTop: Layout.spacing.md,
    backgroundColor: Colors.panel,
    borderRadius: Layout.radius.md,
    paddingVertical: Layout.spacing.md,
  },
  stat: { flex: 1, alignItems: 'center' },
  statValue: {
    fontSize: Layout.font.title,
    fontWeight: '800',
    color: Colors.brass,
  },
  statLabel: { fontSize: Layout.font.caption, color: Colors.textMuted },
  list: { paddingVertical: Layout.spacing.md },
  record: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Layout.spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.woodMid,
  },
  recordMain: { flex: 1 },
  recordResult: {
    fontSize: Layout.font.body,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  recordMeta: { fontSize: Layout.font.caption, color: Colors.textMuted },
  recordDate: { fontSize: Layout.font.caption, color: Colors.textMuted },
  empty: {
    textAlign: 'center',
    color: Colors.textMuted,
    marginTop: Layout.spacing.xl,
    fontSize: Layout.font.body,
  },
  spaced: { marginTop: Layout.spacing.sm },
});

export default HistoryScreen;
