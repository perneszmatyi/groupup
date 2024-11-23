import { Slot, useSegments, useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { View, StatusBar } from 'react-native';
import 'react-native-reanimated';
import '../global.css';
import { AuthProvider } from '@/context/AuthContext';
import { UserProvider } from '@/context/UserContext';
import { GroupProvider } from '@/context/GroupContext';
import { useAuthContext } from '@/context/AuthContext';
import { Colors } from '@/constants/Colors';
import { SplashScreen } from '@/components/screens/SplashScreen';

function RootLayoutNav() {
  const { userAuth } = useAuthContext();
  const segments = useSegments();
  const router = useRouter();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Add any additional initialization logic here
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate loading
      } finally {
        setIsInitializing(false);
      }
    };

    initializeApp();
  }, []);

  useEffect(() => {
    if (isInitializing) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!userAuth && !inAuthGroup) {
      router.replace('/sign-in');
    } else if (userAuth && inAuthGroup) {
      router.replace('/(tabs)/group');
    }
  }, [userAuth, segments, isInitializing]);

  if (isInitializing) {
    return <SplashScreen />;
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <View className="flex-1" style={{ backgroundColor: Colors.dark.background }}>
        <Slot />
      </View>
    </>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <UserProvider>
        <GroupProvider>
          <RootLayoutNav />
        </GroupProvider>
      </UserProvider>
    </AuthProvider>
  );
}
