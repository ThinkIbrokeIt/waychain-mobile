import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { COLORS, FONTS } from '../theme';
import BrandHeader from '../components/BrandHeader';
import { getTxLog } from '../services/secure';
import { waychainRPC } from '../services/rpc';

export default function HistoryScreen() {
  const [log, setLog] = useState([]);
  const [hash, setHash] = useState('');
  const [lookup, setLookup] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => { getTxLog().then(setLog); }, []);

  const search = async () => {
    if (!hash.trim()) return;
    setBusy(true);
    try {
      const r = await waychainRPC.call('eth_getTransactionByHash', [hash.trim()]);
      setLookup(r);
      if (!r) Alert.alert('Not found', 'No transaction with that hash on this node.');
    } catch (e) { Alert.alert('Lookup failed', e?.message || 'Error'); }
    finally { setBusy(false); }
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <BrandHeader subtitle="History" />
      <Text style={styles.label}>Lookup by tx hash</Text>
      <TextInput value={hash} onChangeText={setHash} placeholder="0x…" placeholderTextColor={COLORS.muted}
        style={styles.input} autoCapitalize="none" />
      <TouchableOpacity style={styles.lookupBtn} onPress={search} disabled={busy}>
        <Text style={styles.lookupBtnText}>{busy ? 'Searching…' : 'Search chain'}</Text>
      </TouchableOpacity>

      {lookup && (
        <View style={styles.txCard}>
          <Text style={styles.txRow}>From: {lookup.from}</Text>
          <Text style={styles.txRow}>To: {lookup.to}</Text>
          <Text style={styles.txRow}>Value: {lookup.value}</Text>
          <Text style={styles.txRow}>Nonce: {lookup.nonce}</Text>
        </View>
      )}

      <Text style={styles.label}>Your activity</Text>
      {log.length === 0 && <Text style={styles.empty}>No transactions yet.</Text>}
      {log.map((t, i) => (
        <View key={i} style={styles.txCard}>
          <Text style={styles.txRow}>Sent {t.amount} WAY</Text>
          <Text style={styles.txRow}>To: {t.to.slice(0, 16)}…</Text>
          <Text style={styles.txRow}>Hash: {t.txHash.slice(0, 18)}…</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.parchment },
  container: { flexGrow: 1, padding: 20, paddingBottom: 40 },
  label: { fontFamily: FONTS.medium, fontSize: 13, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 1, marginTop: 16 },
  input: { backgroundColor: COLORS.card, color: COLORS.charcoal, padding: 14, borderRadius: 10, marginTop: 8, borderWidth: 1, borderColor: COLORS.border },
  lookupBtn: { backgroundColor: COLORS.copper, borderRadius: 10, padding: 14, marginTop: 10, alignItems: 'center' },
  lookupBtnText: { fontFamily: FONTS.medium, fontSize: 15, color: COLORS.parchment },
  txCard: { backgroundColor: COLORS.card, borderRadius: 12, padding: 14, marginTop: 10, borderWidth: 1, borderColor: COLORS.border },
  txRow: { fontFamily: FONTS.body, fontSize: 13, color: COLORS.charcoal, marginTop: 4 },
  empty: { fontFamily: FONTS.body, fontSize: 14, color: COLORS.muted, marginTop: 8 },
});
