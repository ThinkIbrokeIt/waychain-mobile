import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../theme';

export default function BrandHeader({ subtitle }) {
  return (
    <View style={styles.wrap}>
      <Image source={require('../../assets/icon.png')} style={styles.logo} resizeMode="contain" />
      <Text style={styles.brand}>WAYCHAIN</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    paddingVertical: 28,
    paddingHorizontal: 20,
    backgroundColor: COLORS.parchment,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  logo: { width: 72, height: 72, marginBottom: 8 },
  brand: {
    fontFamily: FONTS.display,
    fontSize: 30,
    color: COLORS.charcoal,
    letterSpacing: 3,
  },
  subtitle: {
    fontFamily: FONTS.body,
    fontSize: 14,
    color: COLORS.copper,
    marginTop: 2,
    letterSpacing: 1,
  },
});
