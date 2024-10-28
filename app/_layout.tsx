import { Slot, useSegments, useRouter } from 'expo-router';
import { useEffect } from 'react';
import 'react-native-reanimated';
import '../global.css';
import { AppProvider, useAppContext } from '@/context/AppContext';

function RootLayoutNav() {
  const { userAuth } = useAppContext();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const inAuthGroup = segments[0] === '(auth)';

    if (!userAuth && !inAuthGroup) {
      router.replace('/sign-in');
    } else if (userAuth && inAuthGroup) {
      router.replace('/(tabs)/group');
    }
  }, [userAuth, segments]);

  return <Slot />;
}

export default function RootLayout() {
  return (
    <AppProvider>
      <RootLayoutNav />
    </AppProvider>
  );
}
