import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AppState } from 'react-native';
import WalletScreen from './screens/WalletScreen';
import StakingScreen from './screens/StakingScreen';
import BridgeScreen from './screens/BridgeScreen';
import GovernanceScreen from './screens/GovernanceScreen';
import ReceiveScreen from './screens/ReceiveScreen';
import SendScreen from './screens/SendScreen';
import HistoryScreen from './screens/HistoryScreen';
import AddressBookScreen from './screens/AddressBookScreen';
import SettingsScreen from './screens/SettingsScreen';
import AppLock from './components/AppLock';
import { COLORS } from './theme';
import { markBackground } from './services/secure';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: { backgroundColor: COLORS.charcoal, borderTopColor: COLORS.copper },
        tabBarActiveTintColor: COLORS.amber,
        tabBarInactiveTintColor: '#888',
        tabBarLabelStyle: { fontFamily: 'Inter-Regular', fontSize: 11 },
        tabBarIcon: ({ color, size }) => {
          const icons = {
            Wallet: 'wallet',
            Stake: 'bank',
            Bridge: 'bridge',
            Governance: 'vote',
          };
          return <MaterialCommunityIcons name={icons[route.name] || 'circle'} color={color} size={size} />;
        },
      })}
    >
      <Tab.Screen name="Wallet" component={WalletScreen} />
      <Tab.Screen name="Stake" component={StakingScreen} />
      <Tab.Screen name="Bridge" component={BridgeScreen} />
      <Tab.Screen name="Governance" component={GovernanceScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  // Auto-lock: record background time so AppLock can gate on return.
  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'background') markBackground();
    });
    return () => sub.remove();
  }, []);

  return (
    <AppLock>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Tabs" component={Tabs} />
          <Stack.Screen name="Receive" component={ReceiveScreen} />
          <Stack.Screen name="Send" component={SendScreen} />
          <Stack.Screen name="History" component={HistoryScreen} />
          <Stack.Screen name="AddressBook" component={AddressBookScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AppLock>
  );
}
