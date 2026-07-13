import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { COLORS, FONTS } from '../theme';
import BrandHeader from '../components/BrandHeader';
import FeaturePending from '../components/FeaturePending';
import { waychainRPC } from '../services/rpc';

export default function BridgeScreen() {
  const [block, setBlock] = useState(null);
  useEffect(() => {
    waychainRPC.call('way_getBlockCount', []).then(r => setBlock(typeof r === 'string' ? parseInt(r, 16) : r)).catch(() => {});
  }, []);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <BrandHeader subtitle="Bridge" />
      <View style={styles.statRow}>
        <View style={styles.stat}><Text style={styles.statLabel}>Block</Text><Text style={styles.statVal}>#{block ?? '—'}</Text></View>
        <View style={styles.stat}><Text style={styles.statLabel}>Attestation</Text><Text style={styles.statVal}>SHA-256</Text></View>
      </View>
      <FeaturePending
        title="Cross-chain bridging is being wired"
        detail="The CrossChainAttestation precompile (0x1F) verifies Bitcoin ↔ WayChain proofs using SHA-256 (not keccak). BTC pegging via the BitcoinRegistry (0x16) will surface here once the public RPC exposes a read method."
        precompile="0x1F · CrossChainAttestation"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.parchment },
  container: { flexGrow: 1, padding: 20, paddingBottom: 40 },
  statRow: { flexDirection: 'row', gap: 10, marginTop: 8 },
  stat: { flex: 1, backgroundColor: COLORS.card, borderRadius: 12, padding: 14, borderWidth: 1, borderColor: COLORS.border, alignItems: 'center' },
  statLabel: { fontFamily: FONTS.medium, fontSize: 11, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 1 },
  statVal: { fontFamily: FONTS.bold, fontSize: 15, color: COLORS.copper, marginTop: 4 },
});
