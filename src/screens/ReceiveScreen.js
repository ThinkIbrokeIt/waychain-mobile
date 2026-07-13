import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import * as Clipboard from 'expo-clipboard';
import { COLORS, FONTS } from '../theme';
import BrandHeader from '../components/BrandHeader';
import Button from '../components/Button';

export default function ReceiveScreen({ route }) {
  const address = route.params?.address || '';
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await Clipboard.setStringAsync(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <BrandHeader subtitle="Receive" />
      <Text style={styles.label}>Your WayChain address</Text>
      <View style={styles.qrBox}>
        <QRCode value={address} size={240} color={COLORS.charcoal} backgroundColor={COLORS.parchment} />
      </View>
      <Text style={styles.addr} selectable>{address}</Text>
      <Button label={copied ? 'Copied!' : 'Copy address'} onPress={copy} style={styles.btn} />
      <Text style={styles.note}>Share this address to receive WAY or other WayChain assets. Funds arrive on the live chain.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.parchment },
  container: { flexGrow: 1, padding: 20, paddingBottom: 40, alignItems: 'center' },
  label: { fontFamily: FONTS.medium, fontSize: 15, color: COLORS.muted, marginTop: 12 },
  qrBox: { backgroundColor: COLORS.parchment, padding: 16, borderRadius: 16, marginTop: 12, borderWidth: 1, borderColor: COLORS.border },
  addr: { fontFamily: FONTS.body, fontSize: 13, color: COLORS.charcoal, marginTop: 16, textAlign: 'center', lineHeight: 20 },
  btn: { marginTop: 18, width: '80%' },
  note: { fontFamily: FONTS.body, fontSize: 12, color: COLORS.muted, marginTop: 16, textAlign: 'center', paddingHorizontal: 20 },
});
