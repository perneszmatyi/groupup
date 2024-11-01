import { Slot, useSegments, useRouter } from 'expo-router';
import { useEffect } from 'react';
import 'react-native-reanimated';
import '../global.css';
import { AuthProvider } from '@/context/AuthContext';
import { UserProvider } from '@/context/UserContext';
import { GroupProvider } from '@/context/GroupContext';
import { useAuthContext } from '@/context/AuthContext';

function RootLayoutNav() {
  const { userAuth } = useAuthContext();
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
    <AuthProvider>
      <UserProvider>
        <GroupProvider>
          <RootLayoutNav />
        </GroupProvider>
      </UserProvider>
    </AuthProvider>
  );
}
