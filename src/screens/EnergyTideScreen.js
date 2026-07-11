import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { waychainRPC } from '../services/rpc';

export default function EnergyTideScreen({ navigation }) {
  const [entry, setEntry] = useState('');
  const [entries, setEntries] = useState([]);

  const anchorTruth = async () => {
    if (!entry) { Alert.alert('Error', 'Enter truth to anchor'); return; }
    setEntries([...entries, { id: Date.now(), text: entry }]);
    setEntry('');
    Alert.alert('Truth Anchored', 'Journal entry secured');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Energy Tide</Text>
      <TextInput placeholder="Truth to anchor..." value={entry} onChangeText={setEntry}
        style={styles.input} multiline placeholderTextColor="#666" />
      <TouchableOpacity style={styles.btn} onPress={anchorTruth}>
        <Text style={styles.btnText}>Anchor Truth</Text>
      </TouchableOpacity>
      {entries.map(e => (
        <Text key={e.id} style={styles.entry}>{e.text.slice(0, 60)}...</Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#1a1a1a' },
  title: { fontSize: 24, color: '#FFBF00', marginBottom: 20, textAlign: 'center' },
  input: { backgroundColor: '#333', color: '#fff', padding: 15, borderRadius: 8, minHeight: 100, marginBottom: 15 },
  btn: { backgroundColor: '#B87333', padding: 15, borderRadius: 8, alignItems: 'center', marginBottom: 20 },
  btnText: { color: '#fff', fontWeight: 'bold' },
  entry: { color: '#999', fontSize: 12, marginBottom: 5, paddingLeft: 10 }
});
