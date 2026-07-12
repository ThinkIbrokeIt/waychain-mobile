import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { COLORS, FONTS } from '../theme';
import BrandHeader from '../components/BrandHeader';
import Button from '../components/Button';

export default function LocksScreen() {
  const [locks, setLocks] = useState([]);

  const fetchLocks = () => {
    setLocks([{ id: '1', token: 'WAY/BTC', amount: '100', lockTime: '30d' }]);
  };

  React.useEffect(() => { fetchLocks(); }, []);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <BrandHeader subtitle="Trustless LP Locks" />
      <FlatList
        data={locks}
        keyExtractor={item => item.id}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <View style={styles.lockItem}>
            <Text style={styles.lockText}>{item.token} LP</Text>
            <Text style={styles.lockAmount}>{item.amount} WAY</Text>
            <Text style={styles.lockTime}>Locked: {item.lockTime}</Text>
          </View>
        )}
      />
      <Button label="Create Lock" onPress={() => {}} style={styles.btn} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.parchment },
  container: { flexGrow: 1, paddingBottom: 32 },
  lockItem: { backgroundColor: COLORS.card, marginHorizontal: 20, marginTop: 14, borderRadius: 12, padding: 18, borderWidth: 1, borderColor: COLORS.border, borderLeftWidth: 4, borderLeftColor: COLORS.amber },
  lockText: { fontFamily: FONTS.bold, fontSize: 17, color: COLORS.charcoal },
  lockAmount: { fontFamily: FONTS.body, fontSize: 14, color: COLORS.copper, marginTop: 2 },
  lockTime: { fontFamily: FONTS.body, fontSize: 13, color: COLORS.muted, marginTop: 2 },
  btn: { marginHorizontal: 20, marginTop: 20 },
});
