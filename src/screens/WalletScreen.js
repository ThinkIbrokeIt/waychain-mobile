import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { waychainRPC } from '../services/rpc';
import { COLORS, FONTS } from '../theme';
import BrandHeader from '../components/BrandHeader';
import Button from '../components/Button';

export default function WalletScreen({ navigation }) {
  const [address, setAddress] = useState(null);
  const [balance, setBalance] = useState('0');
  const [hasWallet, setHasWallet] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => { checkWallet(); }, []);
  useEffect(() => { if (address) refreshBalance(); }, [address]);

  const checkWallet = async () => {
    try {
      const stored = await SecureStore.getItemAsync('privateKey');
      if (stored) {
        setHasWallet(true);
        setAddress(waychainRPC.getAddressFromKey(stored));
      }
    } catch (e) {
      Alert.alert('Error', 'Failed to read wallet.');
    }
  };

  const createWallet = async () => {
    try {
      setBusy(true);
      const { mnemonic, privateKey } = await waychainRPC.generateKeyPair();
      await SecureStore.setItemAsync('privateKey', privateKey);
      await SecureStore.setItemAsync('mnemonic', mnemonic);
      setHasWallet(true);
      setAddress(waychainRPC.getAddressFromKey(privateKey));
      Alert.alert('Wallet Created', 'Saved securely. Backup your mnemonic: ' + mnemonic);
    } catch (e) {
      Alert.alert('Error', 'Wallet creation failed: ' + (e?.message || e));
    } finally {
      setBusy(false);
    }
  };

  const refreshBalance = async () => {
    try {
      const bal = await waychainRPC.getBalance(address);
      setBalance(bal || '0');
    } catch (e) {
      setBalance('0');
    }
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <BrandHeader subtitle="Self-Sovereign Wallet" />
      {!hasWallet ? (
        <View style={styles.center}>
          <Text style={styles.lead}>Your keys. Your chain.</Text>
          <Text style={styles.sub}>Create a WayChain wallet secured in this device.</Text>
          <Button label={busy ? 'Creating…' : 'Create New Wallet'} onPress={createWallet} disabled={busy} style={styles.cta} />
        </View>
      ) : (
        <View style={styles.card}>
          <Text style={styles.label}>Address</Text>
          <Text style={styles.mono}>{address?.slice(0, 10)}…{address?.slice(-8)}</Text>
          <Text style={styles.label}>Balance</Text>
          <Text style={styles.balance}>{balance} WAY</Text>
          <View style={styles.row}>
            <Button label="DEX" onPress={() => navigation.navigate('DEX')} variant="secondary" style={styles.half} />
            <Button label="Locks" onPress={() => navigation.navigate('Locks')} variant="secondary" style={styles.half} />
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.parchment },
  container: { flexGrow: 1 },
  center: { flex: 1, justifyContent: 'center', padding: 32 },
  lead: { fontFamily: FONTS.display, fontSize: 26, color: COLORS.charcoal, textAlign: 'center', marginBottom: 8 },
  sub: { fontFamily: FONTS.body, fontSize: 15, color: COLORS.muted, textAlign: 'center', marginBottom: 28 },
  cta: { marginTop: 8 },
  card: { margin: 20, backgroundColor: COLORS.card, borderRadius: 16, padding: 24, borderWidth: 1, borderColor: COLORS.border },
  label: { fontFamily: FONTS.medium, fontSize: 13, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 1, marginTop: 12 },
  mono: { fontFamily: FONTS.body, fontSize: 16, color: COLORS.charcoal },
  balance: { fontFamily: FONTS.display, fontSize: 34, color: COLORS.copper, marginTop: 2 },
  row: { flexDirection: 'row', gap: 12, marginTop: 24 },
  half: { flex: 1 },
});
