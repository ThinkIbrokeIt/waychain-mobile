import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Rect, Polygon, LinearGradient, Stop, Defs } from 'react-native-svg';
import { COLORS, FONTS } from '../theme';

// Wardenclyffe Lighthouse mark — matches waychain.org (dex-hero.svg):
// slate tower (#333) + copper beacon (#B87333) + amber prism (#FFBF00) + beam.
function LighthouseMark({ size = 64 }) {
  const s = size / 100; // viewBox 0 0 100 100
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Defs>
        <LinearGradient id="beam" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0%" stopColor={COLORS.copper} stopOpacity="0.85" />
          <Stop offset="70%" stopColor={COLORS.amber} stopOpacity="0.4" />
          <Stop offset="100%" stopColor={COLORS.copper} stopOpacity="0" />
        </LinearGradient>
      </Defs>
      {/* light beam */}
      <Polygon points="50,30 96,14 96,46" fill="url(#beam)" />
      {/* tower base */}
      <Rect x="38" y="42" width="24" height="52" rx="3" fill="#333" />
      {/* beacon housing */}
      <Rect x="34" y="30" width="32" height="14" rx="3" fill={COLORS.copper} />
      {/* glass prism (amber) */}
      <Polygon points="34,30 50,16 66,30" fill={COLORS.amber} opacity="0.85" />
      {/* base platform */}
      <Rect x="32" y="92" width="36" height="6" rx="2" fill="#333" />
    </Svg>
  );
}

export default function BrandHeader({ subtitle, tagline }) {
  return (
    <View style={styles.wrap}>
      <View style={styles.mark}>
        <LighthouseMark size={68} />
      </View>
      <Text style={styles.brand} numberOfLines={1}>WAYCHAIN</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      <View style={styles.rule} />
      <Text style={styles.tagline}>{tagline || 'Self-custodial · Ed25519 · Your keys, your chain'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', paddingTop: 28, paddingBottom: 16 },
  mark: { width: 84, height: 84, alignItems: 'center', justifyContent: 'center' },
  brand: { fontFamily: FONTS.display, fontSize: 28, color: COLORS.warm, letterSpacing: 2, marginTop: 8 },
  subtitle: { fontFamily: FONTS.medium, fontSize: 14, color: COLORS.copper, textTransform: 'uppercase', letterSpacing: 3, marginTop: 4 },
  rule: { width: 44, height: 2, backgroundColor: COLORS.copper, marginTop: 10, marginBottom: 8 },
  tagline: { fontFamily: FONTS.body, fontSize: 12, color: COLORS.muted, letterSpacing: 0.5, textAlign: 'center', paddingHorizontal: 20 },
});
