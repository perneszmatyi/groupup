import { Stack } from 'expo-router';
import 'react-native-reanimated';
import '../global.css';
import { AppProvider } from '@/context/AppContext';




export default function RootLayout() {
  return (
    <AppProvider>
      <Stack>
        <Stack.Screen name="(auth)/sign-in" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)/sign-up" options={{ headerShown: false }} />
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </AppProvider>
  );
}
