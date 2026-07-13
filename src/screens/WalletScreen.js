import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { wallet } from '../services/wallet';
import { waychainRPC } from '../services/rpc';
import { addTx } from '../services/secure';
import { COLORS, FONTS } from '../theme';
import BrandHeader from '../components/BrandHeader';
import Button from '../components/Button';

export default function WalletScreen({ navigation }) {
  const [accounts, setAccounts] = useState([]);
  const [active, setActive] = useState(null);
  const [balance, setBalance] = useState('0');
  const [busy, setBusy] = useState(false);
  const [revealMnemonic, setRevealMnemonic] = useState(null);
  const [revealAddr, setRevealAddr] = useState(null);
  const [needsBackup, setNeedsBackup] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    const accs = await wallet.loadAccounts();
    setAccounts(accs);
    if (accs.length) {
      setActive(prev => accs.find(a => prev && a.address === prev.address) || accs[0]);
      setNeedsBackup(!(await wallet.allBackedUp()));
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const refreshBalance = useCallback(async (addr) => {
    try { const bal = await waychainRPC.getBalance(addr); setBalance(bal || '0'); }
    catch { setBalance('0'); }
  }, []);

  useEffect(() => { if (active) refreshBalance(active.address); }, [active, refreshBalance]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    if (active) await refreshBalance(active.address);
    setRefreshing(false);
  }, [active, refreshBalance]);

  const createWallet = async () => {
    try {
      setBusy(true);
      const acc = await wallet.createAccount(12);
      const accs = await wallet.loadAccounts();
      setAccounts(accs);
      setActive(acc);
      setRevealMnemonic(acc.mnemonic);
      setRevealAddr(acc.address);
      setNeedsBackup(true);
    } catch (e) {
      Alert.alert('Error', 'Wallet creation failed: ' + (e?.message || e));
    } finally { setBusy(false); }
  };

  const confirmSaved = async () => {
    const addr = revealAddr || active?.address;
    if (addr) {
      const next = await wallet.markBackedUp(addr);
      setAccounts(next);
      setActive(next.find(a => a.address === addr));
    }
    setRevealMnemonic(null);
    setRevealAddr(null);
    setNeedsBackup(!(await wallet.allBackedUp()));
  };

  const doImport = async (text) => {
    try {
      setBusy(true);
      const acc = text.split(/\s+/).length >= 12
        ? await wallet.importMnemonic(text)
        : await wallet.importPrivateKey(text);
      const accs = await wallet.loadAccounts();
      setAccounts(accs);
      setActive(acc);
      Alert.alert('Imported', 'Account added: ' + acc.address.slice(0, 12) + '…');
    } catch (e) {
      Alert.alert('Import failed', e?.message || 'Invalid seed or key');
    } finally { setBusy(false); }
  };

  const onSent = async (tx) => { await addTx(tx); };
  const goSend = () => navigation.navigate('Send', { account: active, onSent });

  // Forced backup gate: if any account needs backup, block until user confirms.
  if (needsBackup && accounts.length > 0 && !revealMnemonic) {
    const pending = accounts.find(a => !a.backedUp) || active;
    return (
      <View style={styles.gate}>
        <BrandHeader subtitle="Secure your wallet" />
        <View style={styles.gateCard}>
          <Text style={styles.gateTitle}>Back up required</Text>
          <Text style={styles.gateText}>
            One account still needs its recovery phrase backed up. This is the only way to recover your funds if this device is lost.
          </Text>
          <Button label="Show recovery phrase" onPress={() => { setRevealAddr(pending.address); setRevealMnemonic(pending.mnemonic); }} style={styles.gateBtn} />
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.copper} />}>
      <BrandHeader subtitle="Self-Sovereign Wallet" />

      {revealMnemonic && (
        <View style={styles.reveal}>
          <Text style={styles.revealTitle}>⚠️ Write this down now</Text>
          <Text style={styles.revealText} selectable>{revealMnemonic}</Text>
          <Text style={styles.revealNote}>This is the only time it will be shown. Anyone with these words controls your funds.</Text>
          <Button label="I've saved it" onPress={confirmSaved} style={styles.revealBtn} />
        </View>
      )}

      {accounts.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.lead}>Your keys. Your chain.</Text>
          <Text style={styles.sub}>Create a WayChain wallet secured on this device.</Text>
          <Button label={busy ? 'Creating…' : 'Create New Wallet'} onPress={createWallet} disabled={busy} style={styles.cta} />
          <TouchableOpacity onPress={() => promptImport(doImport)}>
            <Text style={styles.link}>Import existing wallet</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.card}>
          {active && !active.backedUp && (
            <TouchableOpacity style={styles.warn} onPress={() => { setRevealAddr(active.address); setRevealMnemonic(active.mnemonic); }}>
              <Text style={styles.warnText}>⚠️ Not backed up — tap to view recovery phrase</Text>
            </TouchableOpacity>
          )}
          <Text style={styles.label}>Active Account</Text>
          <Text style={styles.mono} selectable>{active?.address}</Text>
          <Text style={styles.label}>Balance</Text>
          <Text style={styles.balance}>{balance} WAY</Text>

          <Text style={styles.label}>Accounts ({accounts.length})</Text>
          {accounts.map((a, i) => (
            <TouchableOpacity key={a.address} style={[styles.acct, a.address === active?.address && styles.acctActive]} onPress={() => setActive(a)}>
              <Text style={styles.acctLabel}>{a.label || ('Account ' + (i + 1))}{a.backedUp ? '  ✓' : '  ⚠'}</Text>
              <Text style={styles.acctAddr}>{a.address.slice(0, 14)}…{a.address.slice(-8)}</Text>
            </TouchableOpacity>
          ))}

          <View style={styles.grid}>
            <Button label="Receive" onPress={() => navigation.navigate('Receive', { address: active?.address })} variant="secondary" style={styles.gridBtn} />
            <Button label="Send" onPress={goSend} variant="secondary" style={styles.gridBtn} />
            <Button label="History" onPress={() => navigation.navigate('History')} variant="secondary" style={styles.gridBtn} />
            <Button label="Address Book" onPress={() => navigation.navigate('AddressBook')} variant="secondary" style={styles.gridBtn} />
          </View>
          <View style={styles.row}>
            <Button label="New Account" onPress={createWallet} variant="secondary" style={styles.half} disabled={busy} />
            <Button label="Settings" onPress={() => navigation.navigate('Settings')} variant="secondary" style={styles.half} />
          </View>
        </View>
      )}
    </ScrollView>
  );
}

function promptImport(doImport) {
  Alert.prompt('Import', 'Seed phrase (12+ words) or private key', async (text) => {
    if (text && text.trim()) doImport(text.trim());
  });
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.parchment },
  container: { flexGrow: 1, paddingBottom: 32 },
  center: { flex: 1, justifyContent: 'center', padding: 32 },
  lead: { fontFamily: FONTS.display, fontSize: 26, color: COLORS.charcoal, textAlign: 'center', marginBottom: 8 },
  sub: { fontFamily: FONTS.body, fontSize: 15, color: COLORS.muted, textAlign: 'center', marginBottom: 28 },
  cta: { marginTop: 8 },
  link: { fontFamily: FONTS.medium, fontSize: 15, color: COLORS.copper, textAlign: 'center', marginTop: 20 },
  card: { margin: 20, backgroundColor: COLORS.card, borderRadius: 16, padding: 24, borderWidth: 1, borderColor: COLORS.border },
  label: { fontFamily: FONTS.medium, fontSize: 13, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 1, marginTop: 14 },
  mono: { fontFamily: FONTS.body, fontSize: 12, color: COLORS.charcoal },
  balance: { fontFamily: FONTS.display, fontSize: 34, color: COLORS.copper, marginTop: 2 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 16 },
  gridBtn: { flex: 1, minWidth: '45%' },
  row: { flexDirection: 'row', gap: 12, marginTop: 12 },
  half: { flex: 1 },
  acct: { backgroundColor: COLORS.parchment, borderRadius: 10, padding: 12, marginTop: 8, borderWidth: 1, borderColor: COLORS.border },
  acctActive: { borderColor: COLORS.copper, borderWidth: 2 },
  acctLabel: { fontFamily: FONTS.medium, fontSize: 15, color: COLORS.charcoal },
  acctAddr: { fontFamily: FONTS.body, fontSize: 12, color: COLORS.muted },
  reveal: { margin: 20, marginTop: 0, backgroundColor: '#FFF3E0', borderRadius: 12, padding: 18, borderWidth: 1, borderColor: COLORS.amber },
  revealTitle: { fontFamily: FONTS.display, fontSize: 18, color: '#9C5A24', textAlign: 'center' },
  revealText: { fontFamily: FONTS.body, fontSize: 15, color: COLORS.charcoal, marginTop: 10, lineHeight: 24 },
  revealNote: { fontFamily: FONTS.body, fontSize: 12, color: COLORS.muted, marginTop: 10 },
  revealBtn: { marginTop: 12 },
  warn: { backgroundColor: '#FDECEA', borderRadius: 10, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: '#E0A39C' },
  warnText: { fontFamily: FONTS.medium, fontSize: 13, color: '#B23A2E', textAlign: 'center' },
  gate: { flex: 1, backgroundColor: COLORS.parchment, padding: 24 },
  gateCard: { backgroundColor: COLORS.card, borderRadius: 16, padding: 28, borderWidth: 1, borderColor: COLORS.amber, marginTop: 24 },
  gateTitle: { fontFamily: FONTS.display, fontSize: 24, color: COLORS.charcoal, textAlign: 'center', marginBottom: 12 },
  gateText: { fontFamily: FONTS.body, fontSize: 15, color: COLORS.muted, textAlign: 'center', lineHeight: 22, marginBottom: 20 },
  gateBtn: { marginTop: 8 },
});
