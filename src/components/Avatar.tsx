import React from 'react';
import Svg, {
  Circle,
  ClipPath,
  Defs,
  Ellipse,
  G,
  LinearGradient,
  Path,
  Rect,
  Stop,
} from 'react-native-svg';
import {
  AvatarConfig,
  outfitOf,
  skinOf,
} from '../story/avatars';

interface AvatarProps {
  config: AvatarConfig;
  size: number;
  /** Dims the portrait when it is not this player's turn. */
  dimmed?: boolean;
  /** Unique suffix, so gradient ids never collide between two portraits. */
  idSuffix?: string;
}

const HAIR = '#1E1210';
const HAIR_SHINE = '#3D2620';

/** The hair framing the face, which is where the styles actually differ. */
const hairline = (isGirl: boolean, style: number) => {
  if (isGirl) {
    return (
      <G>
        <Path
          d="M29 40 C31 24, 40 17, 50 17 C60 17, 69 24, 71 40 C64 30, 36 30, 29 40 Z"
          fill={HAIR}
        />
        <Path d="M50 17 V27" stroke={HAIR_SHINE} strokeWidth="1.4" />
      </G>
    );
  }

  if (style === 1) {
    // Curly: tight coils sitting along the hairline.
    return (
      <G>
        <Path
          d="M30 40 C31 25, 40 18, 50 18 C60 18, 69 25, 70 40 C62 32, 38 32, 30 40 Z"
          fill={HAIR}
        />
        <G fill={HAIR}>
          <Circle cx="34" cy="28" r="6" />
          <Circle cx="44" cy="23" r="6.5" />
          <Circle cx="56" cy="23" r="6.5" />
          <Circle cx="66" cy="28" r="6" />
        </G>
      </G>
    );
  }

  if (style === 2) {
    // Side part: swept hard across to one side.
    return (
      <G>
        <Path
          d="M29 41 C30 24, 40 18, 51 18 C62 18, 70 25, 71 39 C66 30, 52 26, 42 30 C36 32, 32 36, 29 41 Z"
          fill={HAIR}
        />
      </G>
    );
  }

  // Short: an even, close crop.
  return (
    <G>
      <Path
        d="M30 41 C31 25, 40 19, 50 19 C60 19, 69 25, 70 41 C63 33, 37 33, 30 41 Z"
        fill={HAIR}
      />
    </G>
  );
};


/**
 * A portrait built from the player's own choices: girl or boy, skin tone,
 * outfit colour and hairstyle. Everything is drawn from those four values, so
 * adding a new tone or colour is a data change rather than new artwork.
 */
const Avatar: React.FC<AvatarProps> = ({
  config,
  size,
  dimmed,
  idSuffix = '',
}) => {
  const skin = skinOf(config);
  const outfit = outfitOf(config);
  const uid = `${config.gender}-${config.skin}-${config.outfit}-${config.hair}${idSuffix}`;
  const clipId = `c-${uid}`;
  const clothId = `o-${uid}`;
  const isGirl = config.gender === 'girl';

  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      opacity={dimmed ? 0.5 : 1}
    >
      <Defs>
        <ClipPath id={clipId}>
          <Circle cx="50" cy="50" r="49" />
        </ClipPath>
        <LinearGradient id={clothId} x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor={outfit.main} />
          <Stop offset="1" stopColor={outfit.deep} />
        </LinearGradient>
      </Defs>

      <G clipPath={`url(#${clipId})`}>
        <Rect x="0" y="0" width="100" height="100" fill={outfit.deep} />
        <Circle cx="50" cy="42" r="46" fill={outfit.main} opacity="0.35" />

        {/* Shoulders */}
        <Path
          d="M14 100 C18 78, 32 68, 50 68 C68 68, 82 78, 86 100 Z"
          fill={outfit.second}
        />

        {isGirl ? (
          <>
            {/* Sari drape with a zari border */}
            <Path
              d="M50 68 C68 68, 82 78, 86 100 L58 100 C58 86, 54 76, 50 68 Z"
              fill={`url(#${clothId})`}
            />
            <Path
              d="M50 68 C56 78, 59 88, 59 100"
              stroke={outfit.accent}
              strokeWidth="3"
              fill="none"
            />
          </>
        ) : (
          <>
            {/* Shirt placket and collar */}
            <Path
              d="M14 100 C18 78, 32 68, 50 68 C68 68, 82 78, 86 100 Z"
              fill={`url(#${clothId})`}
            />
            <Path d="M48 68 H52 V100 H48 Z" fill={outfit.deep} />
            <Path
              d="M40 69 L50 79 L60 69 L56 66 L50 72 L44 66 Z"
              fill={outfit.second}
            />
            <G fill={outfit.accent}>
              <Circle cx="50" cy="84" r="1.6" />
              <Circle cx="50" cy="93" r="1.6" />
            </G>
          </>
        )}

        {/* Neck */}
        <Path d="M42 58 H58 V70 C54 74, 46 74, 42 70 Z" fill={skin.shade} />

        {/* Hair behind the face */}
        {isGirl ? (
          <>
            <Ellipse cx="50" cy="42" rx="30" ry="31" fill={HAIR} />
            {config.hair === 1 && (
              <>
                <Circle cx="72" cy="22" r="10" fill={HAIR} />
                <Circle cx="72" cy="22" r="6" fill={HAIR_SHINE} opacity="0.6" />
              </>
            )}
            {config.hair === 2 && (
              <>
                <Path
                  d="M22 46 C14 62, 14 80, 18 98 L28 98 C26 80, 26 62, 32 48 Z"
                  fill={HAIR}
                />
                <Path
                  d="M78 46 C86 62, 86 80, 82 98 L72 98 C74 80, 74 62, 68 48 Z"
                  fill={HAIR}
                />
              </>
            )}
            {config.hair === 0 && (
              <>
                <Path
                  d="M74 44 C86 60, 88 80, 84 98 L70 98 C74 80, 72 62, 66 50 Z"
                  fill={HAIR}
                />
                <Path
                  d="M76 62 H82 M75 74 H83 M74 86 H82"
                  stroke={HAIR_SHINE}
                  strokeWidth="1.6"
                />
              </>
            )}
          </>
        ) : (
          <Ellipse cx="50" cy="42" rx="27" ry="28" fill={HAIR} />
        )}

        {/* Face */}
        <Ellipse cx="50" cy="44" rx="21" ry="24" fill={skin.base} />

        {hairline(isGirl, config.hair)}

        {/* Eyes, brows, mouth */}
        <G fill={HAIR}>
          <Ellipse cx="42" cy="45" rx="2.6" ry="3.1" />
          <Ellipse cx="58" cy="45" rx="2.6" ry="3.1" />
        </G>
        <G stroke={HAIR} strokeWidth="1.5" fill="none" strokeLinecap="round">
          <Path d="M37 39 C40 37, 45 37, 47 39" />
          <Path d="M53 39 C55 37, 60 37, 63 39" />
          <Path d="M45 55 C48 58, 52 58, 55 55" />
        </G>

        {isGirl && (
          <>
            <Circle cx="50" cy="33" r="2.2" fill="#B4142B" />
            <Circle cx="28" cy="49" r="3" fill={outfit.accent} />
            <Circle cx="72" cy="49" r="3" fill={outfit.accent} />
            <Path
              d="M42 70 C46 76, 54 76, 58 70"
              stroke={outfit.accent}
              strokeWidth="2.4"
              fill="none"
            />
            {config.hair !== 2 && (
              <G fill="#F7EFDD">
                <Circle cx="30" cy="30" r="3.2" />
                <Circle cx="36" cy="24" r="3" />
                <Circle cx="64" cy="24" r="3" />
                <Circle cx="70" cy="30" r="3.2" />
              </G>
            )}
          </>
        )}
      </G>

      <Circle
        cx="50"
        cy="50"
        r="48"
        stroke={outfit.accent}
        strokeWidth="2"
        fill="none"
        opacity="0.75"
      />
    </Svg>
  );
};

export default React.memo(Avatar);
