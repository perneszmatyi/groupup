import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { auth } from '../../firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Ionicons } from '@expo/vector-icons';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

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
    <SafeAreaView className="flex-1 bg-white">
      {/* Back Button - Fixed at top */}
      <TouchableOpacity 
        className="absolute top-12 left-6 z-10" 
        onPress={() => router.replace('/')}
      >
        <Ionicons name="arrow-back" size={24} color="#1F2937" />
      </TouchableOpacity>

      <View className="flex-1 justify-center px-6">
        <View className="mb-16">
          <Text className="text-4xl font-bold text-neutral-text text-center">
            Welcome Back
          </Text>
          <Text className="text-neutral-body mt-3 text-center text-lg">
            Sign in to continue
          </Text>
        </View>

        <View className="space-y-6">
          <View>
            <Text className="text-sm text-neutral-body mb-2 ml-1">
              Email
            </Text>
            <TextInput
              className="w-full bg-neutral-light rounded-xl px-4 py-4 mb-4 text-neutral-text text-lg"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
          </View>

          <View>
            <Text className="text-sm text-neutral-body mb-2 ml-1">
              Password
            </Text>
            <TextInput
              className="w-full bg-neutral-light rounded-xl px-4 py-4 text-neutral-text"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          {error ? (
            <Text className="text-danger text-sm px-1 text-center">
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

          {/* Sign Up Link */}
          <View className="flex-row justify-center mt-8">
            <Text className="text-neutral-body text-base">
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
