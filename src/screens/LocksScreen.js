import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { waychainRPC } from '../services/rpc';

export default function LocksScreen() {
  const [locks, setLocks] = useState([]);

  const fetchLocks = async () => {
    // Would call TrustlessLock (0x1A) getLock for user's LP positions
    setLocks([{ id: '1', token: 'WAY/BTC', amount: '100', lockTime: '30d' }]);
  };

  const createLock = async () => {
    // Would call TrustlessLock (0x1A) createLock for LP protection
  };

  React.useEffect(() => { fetchLocks(); }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Trustless Locks</Text>
      <FlatList
        data={locks}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.lockItem}>
            <Text style={styles.lockText}>{item.token} LP: {item.amount}</Text>
            <Text style={styles.lockTime}>Locked: {item.lockTime}</Text>
          </View>
        )}
      />
      <TouchableOpacity style={styles.btn} onPress={createLock}>
        <Text>Create Lock</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#1a1a1a' },
  title: { fontSize: 24, color: '#FFBF00', marginBottom: 20, textAlign: 'center' },
  lockItem: { backgroundColor: '#333', padding: 15, marginBottom: 10, borderRadius: 6 },
  lockText: { color: '#fff', fontSize: 16 },
  lockTime: { color: '#B87333', fontSize: 14 },
  btn: { backgroundColor: '#B87333', padding: 12, borderRadius: 6, alignItems: 'center', marginTop: 20 }
});