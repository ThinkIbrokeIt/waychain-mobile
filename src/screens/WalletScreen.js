import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { waychainRPC } from '../services/rpc';

export default function WalletScreen({ navigation }) {
  const [address, setAddress] = useState(null);
  const [balance, setBalance] = useState('0');
  const [hasWallet, setHasWallet] = useState(false);

  useEffect(() => {
    checkWallet();
  }, []);

  useEffect(() => {
    if (address) refreshBalance();
  }, [address]);

  const checkWallet = async () => {
    const stored = await SecureStore.getItemAsync('privateKey');
    if (stored) {
      setHasWallet(true);
      const addr = waychainRPC.getAddressFromKey(stored);
      setAddress(addr);
    }
  };

  const createWallet = async () => {
    const { mnemonic, privateKey } = await waychainRPC.generateKeyPair();
    await SecureStore.setItemAsync('privateKey', privateKey);
    await SecureStore.setItemAsync('mnemonic', mnemonic);
    setHasWallet(true);
    setAddress(waychainRPC.getAddressFromKey(privateKey));
    Alert.alert('Wallet Created', 'Saved securely. Backup your mnemonic.');
  };

  const refreshBalance = async () => {
    const bal = await waychainRPC.getBalance(address);
    setBalance(bal || '0');
  };

  if (!hasWallet) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>WayChain Wallet</Text>
        <TouchableOpacity style={styles.button} onPress={createWallet}>
          <Text style={styles.buttonText}>Create New Wallet</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>WayChain Wallet</Text>
      <Text style={styles.address}>{address?.slice(0, 6)}...{address?.slice(-4)}</Text>
      <Text style={styles.balance}>{balance} WAY</Text>
      
      <View style={styles.actions}>
        <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('DEX')}>
          <Text>DEX</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('Locks')}>
          <Text>Locks</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1a1a1a' },
  title: { fontSize: 24, color: '#FFBF00', marginBottom: 20 },
  address: { color: '#fff', marginBottom: 10 },
  balance: { fontSize: 18, color: '#B87333', marginBottom: 30 },
  button: { backgroundColor: '#B87333', padding: 15, borderRadius: 8 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  actions: { flexDirection: 'row', gap: 20 },
  btn: { backgroundColor: '#333', padding: 15, borderRadius: 8, minWidth: 100, alignItems: 'center' }
});