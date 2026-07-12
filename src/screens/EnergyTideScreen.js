import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Alert, ScrollView } from 'react-native';
import { COLORS, FONTS } from '../theme';
import BrandHeader from '../components/BrandHeader';
import Button from '../components/Button';

export default function EnergyTideScreen() {
  const [entry, setEntry] = useState('');
  const [entries, setEntries] = useState([]);

  const anchorTruth = async () => {
    if (!entry) { Alert.alert('Error', 'Enter truth to anchor'); return; }
    setEntries([...entries, { id: Date.now(), text: entry }]);
    setEntry('');
    Alert.alert('Truth Anchored', 'Journal entry secured to your vault.');
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <BrandHeader subtitle="Immutable Knowledge Vault" />
      <Text style={styles.lead}>Anchor your truth. Eternal.</Text>
      <TextInput
        placeholder="Truth to anchor…"
        value={entry}
        onChangeText={setEntry}
        style={styles.input}
        multiline
        placeholderTextColor={COLORS.muted}
      />
      <Button label="Anchor Truth" onPress={anchorTruth} style={styles.cta} />
      <View style={styles.list}>
        {entries.map(e => (
          <View key={e.id} style={styles.entryCard}>
            <Text style={styles.entryText}>{e.text}</Text>
          </View>
        ))}
        {entries.length === 0 && <Text style={styles.empty}>No entries anchored yet.</Text>}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.parchment },
  container: { flexGrow: 1, paddingBottom: 32 },
  lead: { fontFamily: FONTS.display, fontSize: 22, color: COLORS.charcoal, textAlign: 'center', marginVertical: 18 },
  input: { backgroundColor: COLORS.card, color: COLORS.charcoal, padding: 16, borderRadius: 12, minHeight: 120, marginHorizontal: 20, borderWidth: 1, borderColor: COLORS.border, textAlignVertical: 'top' },
  cta: { marginHorizontal: 20, marginTop: 16 },
  list: { paddingHorizontal: 20, marginTop: 20 },
  entryCard: { backgroundColor: COLORS.card, borderLeftWidth: 4, borderLeftColor: COLORS.copper, borderRadius: 10, padding: 14, marginBottom: 10 },
  entryText: { fontFamily: FONTS.body, fontSize: 15, color: COLORS.charcoal },
  empty: { fontFamily: FONTS.body, fontSize: 14, color: COLORS.muted, textAlign: 'center', marginTop: 20 },
});
