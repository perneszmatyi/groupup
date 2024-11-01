import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { auth } from '../../firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useAuthContext } from '@/context/AuthContext';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { userAuth, handleLogout } = useAuthContext();

  const handleSignIn = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      router.replace('/(tabs)/group');
    } catch (error) {
      console.error('Sign in error:', error);
    }
  };

  const handleBack = () => {
    router.replace('/');
  };

  return (
    <View className="flex-1 items-center justify-center p-4">
      <Text className="text-2xl mb-6">Sign In</Text>
      <TextInput
        className="w-full border border-gray-300 rounded-md p-2 mb-4"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        className="w-full border border-gray-300 rounded-md p-2 mb-6"
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <View className="flex-row justify-between w-full">
      <TouchableOpacity
        className="bg-gray-300 rounded-md py-2 px-4 mb-4"
        onPress={handleBack}
      >
        <Text className="font-bold text-black text-lg">Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="bg-blue-500 rounded-md py-2 px-4 mb-4"
        onPress={handleSignIn}
      >
          <Text className="font-bold text-white text-lg">Sign In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SignIn;
