import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import NameStep from '../../components/auth/NameStep';
import EmailStep from '../../components/auth/EmailStep';
import PasswordStep from '../../components/auth/PasswordStep';

const SignUp = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handlePreviousStep = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      router.back();
    }
  };

  const handleNextStep = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Here you would typically send the data to your backend
      console.log('Sign up data:', formData);
      // Navigate to the main app
      router.replace('/(tabs)/group');
    }
  };

  const updateFormData = (newData: Partial<typeof formData>) => {
    setFormData({ ...formData, ...newData });
  };

  return (
    <View className="flex-1 items-center justify-center bg-white p-4">
      <Text className="text-2xl font-bold mb-6">Sign Up</Text>
      {step === 1 && (
        <NameStep
          firstName={formData.firstName}
          lastName={formData.lastName}
          updateFormData={updateFormData}
        />
      )}
      {step === 2 && (
        <EmailStep
          email={formData.email}
          updateFormData={updateFormData}
        />
      )}
      {step === 3 && (
        <PasswordStep
          password={formData.password}
          confirmPassword={formData.confirmPassword}
          updateFormData={updateFormData}
        />
      )}
      <View className="flex-row justify-between w-full">
        <TouchableOpacity
          className="bg-gray-300 py-3 px-6 rounded-full mt-6"
        onPress={handlePreviousStep}
      >
        <Text className="text-black text-center font-semibold">
          Previous
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="bg-blue-500 py-3 px-6 rounded-full mt-6"
        onPress={handleNextStep}
      >
        <Text className="text-white text-center font-semibold">
          {step === 3 ? 'Sign Up' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SignUp;
