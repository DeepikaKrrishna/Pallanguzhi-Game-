import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Pit from './Pit';
import FlyingSeed from './FlyingSeed';
import SowingHand from './SowingHand';
import KolamBackground from './KolamBackground';
import { Colors, Gradients } from '../constants/colors';
import { BoardMetrics, pitCenter, pitOrigin } from '../constants/dimensions';
import { TOTAL_PITS } from '../constants/gameConstants';
import { PlayerId } from '../game/gameState';
import { AvatarConfig } from '../story/avatars';

export interface SeedFlight {
  from: number;
  to: number;
  /** Changes on every hop, so the animation remounts and replays. */
  id: number;
  duration: number;
}

interface BoardProps {
  pits: number[];
  currentPlayer: PlayerId;
  /** Pit currently receiving a seed. */
  activePit: number | null;
  /** Pit whose contents were just captured. */
  capturedPit: number | null;
  flight: SeedFlight | null;
  /** Pit the sowing hand is currently over, or null when no one is sowing. */
  handPit: number | null;
  /** Bumped on each shell released, so the hand tips open. */
  handDrop: number;
  /** Whose hand is on the board right now. */
  handAvatar: AvatarConfig;
  handSpeed: number;
  onPitPress: (index: number) => void;
  locked: boolean;
}

/**
 * The carved board. Pits are placed at absolute coordinates from
 * `pitCenter`, which lets a seed in flight land exactly in the hollow it is
 * aimed at rather than approximately near it.
 */
const PallanguzhiBoard: React.FC<BoardProps> = ({
  pits,
  currentPlayer,
  activePit,
  capturedPit,
  flight,
  handPit,
  handDrop,
  handAvatar,
  handSpeed,
  onPitPress,
  locked,
}) => (
  <View style={styles.shadowFrame}>
    <LinearGradient
      colors={[...Gradients.wood]}
      start={{ x: 0.15, y: 0 }}
      end={{ x: 0.85, y: 1 }}
      style={styles.board}
    >
      {/* Grain: long soft bands running the length of the board. */}
      <LinearGradient
        colors={['rgba(255,255,255,0.09)', 'transparent', 'rgba(0,0,0,0.22)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />

      {/* Kolam inlaid into the channel between the two rows. */}
      <View style={styles.centreKolam} pointerEvents="none">
        <KolamBackground
          size={BoardMetrics.midGap * 2.6}
          opacity={0.22}
          color={Colors.brassBright}
        />
      </View>

      {Array.from({ length: TOTAL_PITS }).map((_, index) => {
        const origin = pitOrigin(index);
        const owner: PlayerId = index < 7 ? 0 : 1;
        return (
          <View
            key={index}
            style={[styles.pitSlot, { left: origin.x, top: origin.y }]}
          >
            <Pit
              index={index}
              seeds={pits[index]}
              playable={owner === currentPlayer && !locked}
              active={activePit === index}
              captured={capturedPit === index}
              onPress={onPitPress}
              disabled={locked}
            />
          </View>
        );
      })}

      {flight && (
        <FlyingSeed
          key={flight.id}
          from={pitCenter(flight.from)}
          to={pitCenter(flight.to)}
          duration={flight.duration}
        />
      )}

      <SowingHand
        target={handPit === null ? null : pitCenter(handPit)}
        avatar={handAvatar}
        duration={handSpeed}
        dropKey={handDrop}
      />
    </LinearGradient>
  </View>
);

const styles = StyleSheet.create({
  shadowFrame: {
    borderRadius: BoardMetrics.pitSize * 0.95,
    backgroundColor: Colors.woodEdge,
    padding: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.55,
    shadowRadius: 16,
    elevation: 14,
  },
  board: {
    width: BoardMetrics.boardWidth,
    height: BoardMetrics.boardHeight,
    borderRadius: BoardMetrics.pitSize * 0.9,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 226, 168, 0.28)',
  },
  centreKolam: {
    position: 'absolute',
    alignSelf: 'center',
    top:
      BoardMetrics.innerPadding +
      BoardMetrics.pitSize +
      BoardMetrics.midGap / 2 -
      BoardMetrics.midGap * 1.3,
  },
  pitSlot: { position: 'absolute' },
});

export default React.memo(PallanguzhiBoard);
