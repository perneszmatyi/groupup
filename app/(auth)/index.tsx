import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { Link } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const WelcomeScreen = () => {
  return (
    <View className="flex-1">
      <LinearGradient
        colors={['#4F46E5', '#06B6D4']}
        style={{ flex: 1 }}
      >
        <SafeAreaView className="flex-1">
          <View className="h-1/6" />

          <View className="items-center px-8">
            <View className="bg-white/20 w-20 h-20 rounded-3xl items-center justify-center mb-4">
              <Ionicons name="people" size={48} color="white" />
            </View>
            <Text className="text-6xl font-bold text-white mb-3">GroupUp</Text>
            <Text className="text-white text-xl opacity-90">Meet new people</Text>
          </View>

          <View className="flex-1 justify-end mb-16 mx-8">
            <Link href="/(auth)/sign-in" asChild>
              <TouchableOpacity 
                className="w-full bg-white py-5 rounded-xl mb-3 active:bg-white/90"
              >
                <Text className="text-primary text-center font-semibold text-lg">
                  Sign In
                </Text>
              </TouchableOpacity>
            </Link>
            
            <Link href="/(auth)/sign-up" asChild>
              <TouchableOpacity 
                className="w-full py-5 rounded-xl bg-white/10 active:bg-white/20"
              >
                <Text className="text-white text-center font-semibold text-lg">
                  Create Account
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
};

export default WelcomeScreen;
