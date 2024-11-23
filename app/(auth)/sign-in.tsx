import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { auth } from '../../firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const colors = Colors['dark'];

  const handleSignIn = async () => {
    try {
      setError('');
      await signInWithEmailAndPassword(auth, email, password);
      router.replace('/(tabs)/group');
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background }}>
      <TouchableOpacity 
        className="absolute top-12 left-6 z-10" 
        onPress={() => router.replace('/')}
      >
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>

      <View className="flex-1 justify-center px-6">
        <View className="mb-16">
          <Text className="text-4xl font-bold text-white text-center">
            Welcome Back
          </Text>
          <Text className="text-white/70 mt-3 text-center text-lg">
            Sign in to continue
          </Text>
        </View>

        <View className="space-y-6">
          <View>
            <Text className="text-sm text-white/70 mb-2 ml-1">
              Email
            </Text>
            <TextInput
              className="w-full bg-white/10 rounded-xl px-4 py-4 mb-4 text-white text-lg"
              placeholder="Enter your email"
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
          </View>

          <View>
            <Text className="text-sm text-white/70 mb-2 ml-1">
              Password
            </Text>
            <TextInput
              className="w-full bg-white/10 rounded-xl px-4 py-4 text-white"
              placeholder="Enter your password"
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          {error ? (
            <Text className="text-red-400 text-sm px-1 text-center">
              {error}
            </Text>
          ) : null}

          <TouchableOpacity
            className="bg-primary py-4 rounded-xl mt-4"
            onPress={handleSignIn}
          >
            <Text className="text-white text-center font-semibold text-lg">
              Sign In
            </Text>
          </TouchableOpacity>

          <View className="flex-row justify-center mt-8">
            <Text className="text-white/70 text-base">
              Don't have an account?{' '}
            </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/sign-up')}>
              <Text className="text-primary font-semibold text-base">
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SignIn;
