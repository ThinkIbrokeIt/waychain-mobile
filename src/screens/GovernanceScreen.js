import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { COLORS, FONTS } from '../theme';
import BrandHeader from '../components/BrandHeader';
import FeaturePending from '../components/FeaturePending';
import { waychainRPC } from '../services/rpc';

export default function GovernanceScreen() {
  const [block, setBlock] = useState(null);
  useEffect(() => {
    waychainRPC.call('way_getBlockCount', []).then(r => setBlock(typeof r === 'string' ? parseInt(r, 16) : r)).catch(() => {});
  }, []);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <BrandHeader subtitle="Governance" />
      <View style={styles.statRow}>
        <View style={styles.stat}><Text style={styles.statLabel}>Block</Text><Text style={styles.statVal}>#{block ?? '—'}</Text></View>
        <View style={styles.stat}><Text style={styles.statLabel}>Vote Type</Text><Text style={styles.statVal}>Direct</Text></View>
      </View>
      <FeaturePending
        title="On-chain governance is live"
        detail="The Governance precompile (0x1D) supports Direct / Quadratic / Futarchy voting weighted by Dox_Dev identity. Proposal browsing and voting will activate here once the public RPC exposes way_govProposals. Your identity-weighted voice is ready."
        precompile="0x1D · Governance"
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
