import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import NameStep from '@/components/auth/NameStep';
import EmailStep from '@/components/auth/EmailStep';
import PasswordStep from '@/components/auth/PasswordStep';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import { createFirestoreUser } from '@/src/firebase/firestore/users';

const SignUp = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

  const updateFormData = (data: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const handleNextStep = async () => {
    if (step === 3) {
      try {
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          return;
        }
        const userCredential = await createUserWithEmailAndPassword(
          auth, 
          formData.email, 
          formData.password
        );
        await createFirestoreUser(userCredential.user.uid, {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
        });
        router.replace('/(tabs)/group');
      } catch (error: any) {
        setError(error.message);
      }
    } else {
      setStep(prev => prev + 1);
    }
  };

  const handlePreviousStep = () => {
    if (step > 1) {
      setStep(prev => prev - 1);
      setError('');
    } else {
      router.back();
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <TouchableOpacity 
        className="absolute top-12 left-6 z-10" 
        onPress={handlePreviousStep}
      >
        <Ionicons name="arrow-back" size={24} color="#1F2937" />
      </TouchableOpacity>

      <View className="flex-1 justify-center px-6">
        <View className="mb-16">
          <Text className="text-4xl font-bold text-neutral-text text-center">
            Create Account
          </Text>
          <Text className="text-neutral-body mt-3 text-center text-lg">
            Step {step} of 3
          </Text>
        </View>

        <View className="space-y-6">
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

          {error ? (
            <Text className="text-danger text-sm px-1 text-center">
              {error}
            </Text>
          ) : null}

          <View className="flex-row justify-between space-x-6 mt-4">
            <TouchableOpacity
              className="flex-1 bg-neutral-light py-4 mr-4 rounded-xl"
              onPress={handlePreviousStep}
            >
              <Text className="text-neutral-text text-center font-semibold text-lg">
                Back
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              className="flex-1 bg-primary py-4 rounded-xl"
              onPress={handleNextStep}
            >
              <Text className="text-white text-center font-semibold text-lg">
                {step === 3 ? 'Create Account' : 'Next'}
              </Text>
            </TouchableOpacity>
          </View>


          <View className="flex-row justify-center mt-8">
            <Text className="text-neutral-body text-base">
              Already have an account?{' '}
            </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/sign-in')}>
              <Text className="text-primary font-semibold text-base">
                Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SignUp;
