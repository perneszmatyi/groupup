import { Stack } from 'expo-router';
import 'react-native-reanimated';
import '../global.css';
import { AppProvider, useAppContext } from '@/context/AppContext';

function StackScreens() {
  const { user } = useAppContext();

  return (
    <Stack>
      {user ? (
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      ) : (
        <>
          <Stack.Screen name="(auth)/sign-in" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)/sign-up" options={{ headerShown: false }} />
          <Stack.Screen name="index" options={{ headerShown: false }} />
        </>
      )}
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AppProvider>
      <StackScreens />
    </AppProvider>
  );
}