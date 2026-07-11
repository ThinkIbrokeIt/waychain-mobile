import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { waychainRPC } from '../services/rpc';

export default function DexScreen({ navigation }) {
  const [tokenA, setTokenA] = useState('');
  const [tokenB, setTokenB] = useState('');
  const [amountA, setAmountA] = useState('');
  const [amountB, setAmountB] = useState('');

  const createPair = async () => {
    if (!tokenA || !tokenB) {
      Alert.alert('Error', 'Enter both tokens');
      return;
    }
    // Would call SwapRoute precompile 0x25
    Alert.alert('Pair Created', `${tokenA}/${tokenB} pair ready`);
  };

  const addLiquidity = async () => {
    // Would call SwapRoute.addLiquidity (0x25)
    Alert.alert('Liquidity Added', `${amountA} + ${amountB}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SwapRoute DEX</Text>
      
      <View style={styles.section}>
        <Text style={styles.label}>Create Pair</Text>
        <TextInput placeholder="Token A" value={tokenA} onChangeText={setTokenA} style={styles.input} />
        <TextInput placeholder="Token B" value={tokenB} onChangeText={setTokenB} style={styles.input} />
        <TouchableOpacity style={styles.btn} onPress={createPair}>
          <Text>Create Pair</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Add Liquidity</Text>
        <TextInput placeholder="Amount A" value={amountA} onChangeText={setAmountA} style={styles.input} />
        <TextInput placeholder="Amount B" value={amountB} onChangeText={setAmountB} style={styles.input} />
        <TouchableOpacity style={styles.btn} onPress={addLiquidity}>
          <Text>Add Liquidity</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#1a1a1a' },
  title: { fontSize: 24, color: '#FFBF00', marginBottom: 20, textAlign: 'center' },
  section: { marginBottom: 30 },
  label: { color: '#fff', marginBottom: 10, fontSize: 16 },
  input: { backgroundColor: '#333', color: '#fff', padding: 10, marginBottom: 10, borderRadius: 4 },
  btn: { backgroundColor: '#B87333', padding: 12, borderRadius: 6, alignItems: 'center' }
});