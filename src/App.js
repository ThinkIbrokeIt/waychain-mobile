import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { COLORS, FONTS } from './theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import WalletScreen from './screens/WalletScreen';
import EnergyTideScreen from './screens/EnergyTideScreen';
import DexScreen from './screens/DexScreen';
import LocksScreen from './screens/LocksScreen';

const Tab = createBottomTabNavigator();

const TABS = [
  { name: 'Wallet', component: WalletScreen, icon: 'wallet', label: 'Wallet' },
  { name: 'EnergyTide', component: EnergyTideScreen, icon: 'lightbulb-on', label: 'Energy Tide' },
  { name: 'DEX', component: DexScreen, icon: 'swap-horizontal', label: 'DEX' },
  { name: 'Locks', component: LocksScreen, icon: 'lock', label: 'Locks' },
];

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerStyle: { backgroundColor: COLORS.charcoal },
          headerTitleStyle: { fontFamily: FONTS.display, color: COLORS.parchment, fontSize: 20 },
          headerTintColor: COLORS.amber,
          tabBarStyle: { backgroundColor: COLORS.charcoal, borderTopColor: COLORS.copper },
          tabBarActiveTintColor: COLORS.amber,
          tabBarInactiveTintColor: COLORS.muted,
          tabBarLabelStyle: { fontFamily: FONTS.medium, fontSize: 11 },
          tabBarIcon: ({ focused, color, size }) => {
            const t = TABS.find(x => x.name === route.name);
            return <MaterialCommunityIcons name={t.icon} size={size} color={color} />;
          },
        })}
      >
        {TABS.map(t => (
          <Tab.Screen key={t.name} name={t.name} component={t.component} options={{ title: t.label }} />
        ))}
      </Tab.Navigator>
    </NavigationContainer>
  );
}
