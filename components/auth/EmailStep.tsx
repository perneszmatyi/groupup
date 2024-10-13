import React from 'react';
import { View, TextInput } from 'react-native';

type EmailStepProps = {
  email: string;
  updateFormData: (data: { email: string }) => void;
};

const EmailStep: React.FC<EmailStepProps> = ({ email, updateFormData }) => {
  return (
    <View className="w-full">
      <TextInput
        className="w-full bg-gray-100 rounded-md p-2 mb-4"
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={(text) => updateFormData({ email: text })}
      />
    </View>
  );
};

export default EmailStep;