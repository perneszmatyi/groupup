import React from 'react';
import { View, TextInput } from 'react-native';

type PasswordStepProps = {
  password: string;
  confirmPassword: string;
  updateFormData: (data: { password: string; confirmPassword: string }) => void;
};

const PasswordStep: React.FC<PasswordStepProps> = ({ password, confirmPassword, updateFormData }) => {
  return (
    <View className="w-full">
      <TextInput
        className="w-full bg-white/10 rounded-xl px-4 py-4 mb-4 text-white text-lg"
        placeholder="Password"
        placeholderTextColor="rgba(255, 255, 255, 0.5)"
        secureTextEntry
        value={password}
        onChangeText={(text) => updateFormData({ password: text, confirmPassword })}
      />
      <TextInput
        className="w-full bg-white/10 rounded-xl px-4 py-4 mb-4 text-white text-lg"
        placeholder="Confirm Password"
        placeholderTextColor="rgba(255, 255, 255, 0.5)"
        secureTextEntry
        value={confirmPassword}
        onChangeText={(text) => updateFormData({ password, confirmPassword: text })}
      />
    </View>
  );
};

export default PasswordStep;