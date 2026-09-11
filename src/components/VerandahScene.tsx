// Verandah scene: full SVG illustration — mango tree, paddy fields, brass vessels, kolam floor
import React from 'react';
import Svg, {
  Circle,
  Defs,
  Ellipse,
  G,
  LinearGradient,
  Path,
  RadialGradient,
  Rect,
  Stop,
} from 'react-native-svg';

interface VerandahSceneProps {
  width: number;
  height: number;
}

/**
 * The room the game is played in, drawn as flat vector art: paddy fields and a
 * mango tree beyond the verandah, an ochre wall with a doorway, brass vessels,
 * and a red-oxide floor with kolam laid out on it.
 *
 * Everything is a path or a gradient rather than an image, so it stays sharp on
 * any screen, adds nothing to the download, and works with no network. The
 * viewBox is fixed and sliced to fill, so composition holds across phone sizes.
 */
const VerandahScene: React.FC<VerandahSceneProps> = ({ width, height }) => (
  <Svg
    width={width}
    height={height}
    viewBox="0 0 400 800"
    preserveAspectRatio="xMidYMid slice"
  >
    <Defs>
      <LinearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0" stopColor="#F2C97D" />
        <Stop offset="0.55" stopColor="#E8B96A" />
        <Stop offset="1" stopColor="#D9A45A" />
      </LinearGradient>

      <RadialGradient id="sun" cx="0.32" cy="0.28" r="0.5">
        <Stop offset="0" stopColor="#FFF3C4" stopOpacity="0.95" />
        <Stop offset="1" stopColor="#FFF3C4" stopOpacity="0" />
      </RadialGradient>

      <LinearGradient id="paddy" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0" stopColor="#8FB25A" />
        <Stop offset="1" stopColor="#5D8637" />
      </LinearGradient>

      <LinearGradient id="wall" x1="0" y1="0" x2="1" y2="0">
        <Stop offset="0" stopColor="#C98A4B" />
        <Stop offset="1" stopColor="#A86733" />
      </LinearGradient>

      <LinearGradient id="floor" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0" stopColor="#9C4A28" />
        <Stop offset="0.45" stopColor="#7E3A1E" />
        <Stop offset="1" stopColor="#4A1F10" />
      </LinearGradient>

      <LinearGradient id="canopy" x1="0" y1="0" x2="0.6" y2="1">
        <Stop offset="0" stopColor="#4E7A2E" />
        <Stop offset="1" stopColor="#2C4A1B" />
      </LinearGradient>

      <LinearGradient id="brass" x1="0" y1="0" x2="1" y2="1">
        <Stop offset="0" stopColor="#E6C069" />
        <Stop offset="0.5" stopColor="#B98C20" />
        <Stop offset="1" stopColor="#7C5A12" />
      </LinearGradient>

      <LinearGradient id="silk" x1="0" y1="0" x2="1" y2="0">
        <Stop offset="0" stopColor="#7A1B33" />
        <Stop offset="0.6" stopColor="#68162B" />
        <Stop offset="0.62" stopColor="#2E6B3A" />
        <Stop offset="1" stopColor="#22532C" />
      </LinearGradient>
    </Defs>

    {/* ---- Beyond the verandah ---- */}
    <Rect x="0" y="0" width="400" height="360" fill="url(#sky)" />
    <Circle cx="128" cy="118" r="190" fill="url(#sun)" />

    {/* Paddy fields receding to the horizon */}
    <Rect x="0" y="250" width="400" height="110" fill="url(#paddy)" />
    <Path d="M0 250 H400 V268 H0 Z" fill="#A6C46B" opacity="0.55" />
    {/* Footpath cutting through the field */}
    <Path
      d="M120 360 C150 320, 165 290, 172 250 L196 250 C190 292, 178 322, 158 360 Z"
      fill="#C9A063"
      opacity="0.85"
    />

    {/* Mango tree: trunk, then overlapping canopy lobes */}
    <Path
      d="M62 250 C58 210, 56 180, 60 150 L78 150 C76 184, 78 216, 82 250 Z"
      fill="#5A3A1E"
    />
    <G fill="url(#canopy)">
      <Ellipse cx="70" cy="118" rx="86" ry="62" />
      <Ellipse cx="24" cy="150" rx="62" ry="46" />
      <Ellipse cx="132" cy="146" rx="58" ry="40" />
      <Ellipse cx="86" cy="70" rx="54" ry="38" />
    </G>
    {/* A few lit leaves catching the low sun */}
    <G fill="#7FA84A" opacity="0.75">
      <Ellipse cx="118" cy="104" rx="15" ry="6" transform="rotate(-24 118 104)" />
      <Ellipse cx="38" cy="96" rx="14" ry="5.5" transform="rotate(18 38 96)" />
      <Ellipse cx="146" cy="132" rx="13" ry="5" transform="rotate(-12 146 132)" />
      <Ellipse cx="16" cy="132" rx="12" ry="5" transform="rotate(30 16 132)" />
    </G>

    {/* Ripening mangoes hanging in the canopy */}
    <G>
      {[
        [46, 152],
        [96, 164],
        [128, 120],
        [22, 118],
        [74, 96],
      ].map(([cx, cy], index) => (
        <Ellipse
          key={index}
          cx={cx}
          cy={cy}
          rx="8"
          ry="10"
          fill={index % 2 === 0 ? '#D9A32E' : '#C08128'}
        />
      ))}
    </G>

    {/* ---- The house ---- */}
    <Rect x="236" y="0" width="164" height="366" fill="url(#wall)" />
    {/* Eave shadow down the wall */}
    <Rect x="236" y="0" width="164" height="34" fill="#8A5228" opacity="0.55" />

    {/* Doorway with a carved frame */}
    <Rect x="292" y="72" width="86" height="290" rx="4" fill="#6E3F1C" />
    <Rect x="300" y="80" width="70" height="282" fill="#4A2611" />
    <Rect x="332" y="80" width="3" height="282" fill="#2E1709" opacity="0.7" />
    {/* Brass studs on the door */}
    <G fill="#D9B15C">
      <Circle cx="316" cy="150" r="3" />
      <Circle cx="316" cy="196" r="3" />
      <Circle cx="352" cy="150" r="3" />
      <Circle cx="352" cy="196" r="3" />
    </G>

    {/* Turned wooden pillar holding up the verandah roof */}
    <G>
      <Rect x="204" y="0" width="30" height="366" fill="#7A4A22" />
      <Rect x="204" y="0" width="9" height="366" fill="#9C6231" opacity="0.85" />
      <Rect x="198" y="26" width="42" height="13" rx="3" fill="#8E5628" />
      <Rect x="198" y="300" width="42" height="13" rx="3" fill="#8E5628" />
      <Rect x="196" y="340" width="46" height="26" rx="3" fill="#6B3E1B" />
    </G>
    {/* Second pillar at the near edge, framing the scene */}
    <G>
      <Rect x="0" y="0" width="24" height="366" fill="#7A4A22" />
      <Rect x="0" y="0" width="8" height="366" fill="#9C6231" opacity="0.8" />
      <Rect x="0" y="26" width="32" height="13" rx="3" fill="#8E5628" />
      <Rect x="0" y="340" width="34" height="26" rx="3" fill="#6B3E1B" />
    </G>

    {/* Barred window */}
    <Rect x="246" y="96" width="38" height="52" rx="3" fill="#3B2411" />
    <G stroke="#C9A063" strokeWidth="2">
      <Path d="M255 96 V148" />
      <Path d="M265 96 V148" />
      <Path d="M275 96 V148" />
    </G>

    {/* Framed picture above the door, garlanded */}
    <Rect x="316" y="24" width="40" height="34" rx="2" fill="#E8C877" />
    <Rect x="320" y="28" width="32" height="26" fill="#B4552F" />
    <Path
      d="M312 60 Q336 76, 360 60"
      stroke="#E8B23A"
      strokeWidth="4"
      fill="none"
    />

    {/* ---- The floor ---- */}
    <Path d="M0 352 H400 V800 H0 Z" fill="url(#floor)" />
    {/* Raised lip of the verandah, catching the light along its edge */}
    <Rect x="0" y="352" width="400" height="9" fill="#C4703C" opacity="0.9" />
    <Rect x="0" y="361" width="400" height="5" fill="#4A1F10" opacity="0.5" />
    {/* Polished sheen where the low sun lands on the red oxide */}
    <Path
      d="M0 366 H400 V438 C280 466, 120 466, 0 438 Z"
      fill="#C06A38"
      opacity="0.3"
    />
    {/* Pool of warm light under where the board rests */}
    <Ellipse cx="200" cy="520" rx="220" ry="120" fill="#D98046" opacity="0.16" />

    {/* Brass and clay vessels standing on the floor against the wall */}
    <G>
      <Ellipse cx="268" cy="392" rx="27" ry="25" fill="url(#brass)" />
      <Rect x="258" y="360" width="20" height="16" rx="4" fill="url(#brass)" />
      <Ellipse cx="268" cy="360" rx="10" ry="4" fill="#F0D479" opacity="0.85" />
      <Ellipse cx="257" cy="386" rx="6" ry="11" fill="#F5E3A8" opacity="0.35" />
      <Ellipse cx="268" cy="416" rx="24" ry="5" fill="#2E1006" opacity="0.35" />
    </G>
    <G>
      <Ellipse cx="186" cy="404" rx="19" ry="18" fill="#9C5A2A" />
      <Rect x="178" y="382" width="16" height="11" rx="3" fill="#9C5A2A" />
      <Ellipse cx="179" cy="400" rx="4" ry="8" fill="#D69B5E" opacity="0.4" />
      <Ellipse cx="186" cy="422" rx="17" ry="4" fill="#2E1006" opacity="0.3" />
    </G>

    {/* Kolam drawn on the floor in rice flour: a dot grid with a looping
        line threaded around it, the way it is laid at dawn. */}
    <G opacity="0.5">
      {[
        { x: 22, y: 452, s: 0.72 },
        { x: 300, y: 452, s: 0.72 },
        { x: 136, y: 640, s: 1.12 },
      ].map((k, index) => (
        <G key={index} transform={`translate(${k.x} ${k.y}) scale(${k.s})`}>
          <Path
            d="M50 10 C72 22, 80 30, 90 50 C80 70, 72 78, 50 90 C28 78, 20 70, 10 50 C20 30, 28 22, 50 10 Z"
            stroke="#F7EEDC"
            strokeWidth="2"
            fill="none"
          />
          <Path
            d="M50 30 C62 36, 66 40, 72 50 C66 60, 62 64, 50 70 C38 64, 34 60, 28 50 C34 40, 38 36, 50 30 Z"
            stroke="#F7EEDC"
            strokeWidth="1.6"
            fill="none"
          />
          <G fill="#F7EEDC">
            {[
              [50, 24],
              [30, 50],
              [50, 50],
              [70, 50],
              [50, 76],
            ].map(([cx, cy], dot) => (
              <Circle key={dot} cx={cx} cy={cy} r="2.4" />
            ))}
          </G>
        </G>
      ))}
    </G>

    {/* Silk draped along the near edge, as in the reference */}
    <Path d="M0 748 C90 726, 310 726, 400 748 V800 H0 Z" fill="url(#silk)" />
    <Path
      d="M0 748 C90 726, 310 726, 400 748"
      stroke="#E8C877"
      strokeWidth="6"
      fill="none"
    />
    <G fill="#E8C877" opacity="0.75">
      {[40, 100, 160, 220, 280, 340].map((cx) => (
        <Circle key={cx} cx={cx} cy="772" r="3" />
      ))}
    </G>
  </Svg>
);

export default React.memo(VerandahScene);
