import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Redirect, router } from 'expo-router';


const SignIn = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = () => {
    console.log('Sign in attempted with:', username, password);
    router.push('/(tabs)/group');
  };

  return (
    <View className="flex-1 items-center justify-center p-4">
      <Text className="text-2xl mb-6">Sign In</Text>
      <TextInput
        className="w-full border border-gray-300 rounded-md p-2 mb-4"
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        className="w-full border border-gray-300 rounded-md p-2 mb-6"
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity
        className="bg-blue-500 rounded-md py-2 px-4"
        onPress={handleSignIn}
      >
        <Text className="text-white text-lg">Sign In</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignIn;
