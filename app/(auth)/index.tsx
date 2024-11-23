import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { Link } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

const WelcomeScreen = () => {
  const colors = Colors['dark'];
  
  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <LinearGradient
        colors={['#4F46E5', '#06B6D4']}
        style={{ flex: 1 }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        locations={[0.3, 0.9]}
      >
        <SafeAreaView className="flex-1">
          <View className="h-1/6" />

          <View className="items-center px-8">
            <View className="bg-white/10 w-20 h-20 rounded-3xl items-center justify-center mb-4 backdrop-blur-lg">
              <Ionicons name="people" size={48} color={colors.text} />
            </View>
            <Text className="text-6xl font-bold text-white mb-3">GroupUp</Text>
            <Text className="text-white/70 text-xl">Meet new people</Text>
          </View>

          <View className="flex-1 justify-end mb-16 mx-8">
            <Link href="/(auth)/sign-in" asChild>
              <TouchableOpacity 
                className="w-full bg-white/10 py-5 rounded-xl mb-3 active:bg-white/20 backdrop-blur-lg"
              >
                <Text className="text-white text-center font-semibold text-lg">
                  Sign In
                </Text>
              </TouchableOpacity>
            </Link>
            
            <Link href="/(auth)/sign-up" asChild>
              <TouchableOpacity 
                className="w-full py-5 rounded-xl bg-primary/90 active:bg-primary/80 backdrop-blur-lg"
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
