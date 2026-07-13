import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../theme';

// Maritime hero header: Wardenclyffe lighthouse mark + brand + copper rule + tagline.
export default function BrandHeader({ subtitle, tagline }) {
  return (
    <View style={styles.wrap}>
      <View style={styles.mark}>
        <Image source={require('../../assets/icon.png')} style={styles.logo} resizeMode="contain" />
      </View>
      <Text style={styles.brand}>WAYCHAIN</Text>
      <View style={styles.rule} />
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      <Text style={styles.tagline}>{tagline || 'Self-custodial · Ed25519 · Your keys, your chain'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    paddingVertical: 26,
    paddingHorizontal: 20,
    backgroundColor: COLORS.parchment,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  mark: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: COLORS.card,
    borderWidth: 1.5, borderColor: COLORS.copper,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: COLORS.copper, shadowOpacity: 0.15, shadowRadius: 8, shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  logo: { width: 60, height: 60 },
  brand: {
    fontFamily: FONTS.display,
    fontSize: 32,
    color: COLORS.charcoal,
    letterSpacing: 4,
    marginTop: 10,
  },
  rule: {
    width: 56, height: 3, borderRadius: 2,
    backgroundColor: COLORS.amber,
    marginTop: 8,
  },
  subtitle: {
    fontFamily: FONTS.medium,
    fontSize: 15,
    color: COLORS.copper,
    marginTop: 8,
    letterSpacing: 0.5,
  },
  tagline: {
    fontFamily: FONTS.body,
    fontSize: 12,
    color: COLORS.muted,
    marginTop: 4,
    letterSpacing: 0.3,
  },
});
