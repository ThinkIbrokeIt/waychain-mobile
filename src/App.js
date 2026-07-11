import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import WalletScreen from './screens/WalletScreen';
import EnergyTideScreen from './screens/EnergyTideScreen';
import DexScreen from './screens/DexScreen';
import LocksScreen from './screens/LocksScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Wallet">
        <Stack.Screen name="Wallet" component={WalletScreen} options={{ title: 'WayChain Wallet' }} />
        <Stack.Screen name="EnergyTide" component={EnergyTideScreen} options={{ title: 'Energy Tide' }} />
        <Stack.Screen name="DEX" component={DexScreen} options={{ title: 'SwapRoute DEX' }} />
        <Stack.Screen name="Locks" component={LocksScreen} options={{ title: 'Trustless Locks' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}