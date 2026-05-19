import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" options={{ tabBarLabel: '🏠 Home' }} />
      <Tabs.Screen name="explore" options={{ tabBarLabel: '🔍 Explore' }} />
      <Tabs.Screen name="my-auctions" options={{ tabBarLabel: '🔨 My Auctions' }} />
      <Tabs.Screen name="profile" options={{ tabBarLabel: '👤 Profile' }} />
    </Tabs>
  );
}
