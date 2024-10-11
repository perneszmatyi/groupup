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
        className="w-full bg-gray-100 rounded-md p-2 mb-4"
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={(text) => updateFormData({ password: text, confirmPassword })}
      />
      <TextInput
        className="w-full bg-gray-100 rounded-md p-2 mb-4"
        placeholder="Confirm Password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={(text) => updateFormData({ password, confirmPassword: text })}
      />
    </View>
  );
};

export default PasswordStep;