import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView, TouchableOpacity } from 'react-native';
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

  useEffect(() => { load(); }, []);
  useEffect(() => { if (active) refreshBalance(active.address); }, [active]);

  const load = async () => {
    const accs = await wallet.loadAccounts();
    setAccounts(accs);
    if (accs.length) setActive(accs[0]);
  };

  const refreshBalance = async (addr) => {
    try { const bal = await waychainRPC.getBalance(addr); setBalance(bal || '0'); }
    catch { setBalance('0'); }
  };

  const createWallet = async () => {
    try {
      setBusy(true);
      const acc = await wallet.createAccount(12);
      const accs = await wallet.loadAccounts();
      setAccounts(accs);
      setActive(acc);
      setRevealMnemonic(acc.mnemonic); // show once
    } catch (e) {
      Alert.alert('Error', 'Wallet creation failed: ' + (e?.message || e));
    } finally { setBusy(false); }
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

  // expose send logging for SendScreen via navigation param callback
  const goSend = () => navigation.navigate('Send', { account: active, onSent });

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <BrandHeader subtitle="Self-Sovereign Wallet" />

      {revealMnemonic && (
        <View style={styles.reveal}>
          <Text style={styles.revealTitle}>⚠️ Write this down now</Text>
          <Text style={styles.revealText}>{revealMnemonic}</Text>
          <Text style={styles.revealNote}>This is the only time it will be shown. Anyone with these words controls your funds.</Text>
          <Button label="I've saved it" onPress={() => setRevealMnemonic(null)} style={styles.revealBtn} />
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
          <Text style={styles.label}>Active Account</Text>
          <Text style={styles.mono}>{active?.address}</Text>
          <Text style={styles.label}>Balance</Text>
          <Text style={styles.balance}>{balance} WAY</Text>

          <Text style={styles.label}>Accounts ({accounts.length})</Text>
          {accounts.map((a, i) => (
            <TouchableOpacity key={a.address} style={[styles.acct, a.address === active?.address && styles.acctActive]} onPress={() => setActive(a)}>
              <Text style={styles.acctLabel}>{a.label || ('Account ' + (i + 1))}</Text>
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
});
