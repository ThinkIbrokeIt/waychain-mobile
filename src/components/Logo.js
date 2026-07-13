import React from 'react';
import Svg, { Path, Rect, Circle, Polygon } from 'react-native-svg';
import { COLORS } from '../theme';

// Wardenclyffe Lighthouse mark — drawn in brand copper/amber so it is always
// visible on the parchment header (the old raster icon was white-on-transparent
// and invisible). viewBox 0 0 100 100.
export default function Logo({ size = 60, color = COLORS.copper }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      {/* light beam */}
      <Polygon points="50,28 96,8 96,48" fill={COLORS.amber} opacity={0.35} />
      <Polygon points="50,28 4,8 4,48" fill={COLORS.amber} opacity={0.25} />
      {/* base / rock */}
      <Path d="M30 90 L70 90 L66 78 L34 78 Z" fill={color} />
      {/* tower (tapered) */}
      <Path d="M39 78 L61 78 L56 36 L44 36 Z" fill={color} />
      {/* stripes */}
      <Rect x="42" y="58" width="16" height="7" fill={COLORS.parchment} opacity={0.85} />
      <Rect x="43.5" y="42" width="13" height="6" fill={COLORS.parchment} opacity={0.85} />
      {/* lantern room */}
      <Rect x="42" y="28" width="16" height="10" rx="1.5" fill={color} />
      {/* glowing light */}
      <Circle cx="50" cy="33" r="3.4" fill={COLORS.amber} />
      {/* roof */}
      <Path d="M40 28 L50 18 L60 28 Z" fill={color} />
    </Svg>
  );
}
