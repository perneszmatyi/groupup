import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { Link } from 'expo-router';

const WelcomeScreen = () => {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 justify-between px-6">
        <View className="h-1/6" />

        <View className="items-center">
          <Text className="text-5xl font-bold text-primary mb-3">GroupUp</Text>
        </View>

        <View className="w-full space-y-4 mb-12">
          <Link href="/(auth)/sign-in" asChild>
            <TouchableOpacity 
              className="w-full bg-primary py-4 rounded-xl active:bg-primary-dark mb-4"
            >
              <Text className="text-white text-center font-semibold text-lg">
                Sign In
              </Text>
            </TouchableOpacity>
          </Link>
          
          <Link href="/(auth)/sign-up" asChild>
            <TouchableOpacity 
              className="w-full bg-white py-4 rounded-xl border-2 border-primary active:bg-neutral-light"
            >
              <Text className="text-primary text-center font-semibold text-lg">
                Create Account
              </Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default WelcomeScreen;
