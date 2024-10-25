import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';

const WelcomeScreen = () => {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-3xl font-bold mb-8">Welcome to GroupUp</Text>
      <View className="w-64">
        <Link href="/(auth)/sign-in" asChild>
          <TouchableOpacity className="bg-blue-500 py-3 px-6 rounded-full mb-4">
            <Text className="text-white text-center font-semibold">Sign In</Text>
          </TouchableOpacity>
        </Link>
        <Link href="/(auth)/sign-up" asChild>
          <TouchableOpacity className="bg-green-500 py-3 px-6 rounded-full">
            <Text className="text-white text-center font-semibold">Sign Up</Text>
          </TouchableOpacity>
        </Link>
        <Link href="/(tabs)/group" asChild>
          <TouchableOpacity className="bg-green-500 py-3 px-6 rounded-full">
            <Text className="text-white text-center font-semibold">go to groups</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
};

export default WelcomeScreen;
