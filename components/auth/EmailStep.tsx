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
        className="w-full bg-white/10 rounded-xl px-4 py-4 mb-4 text-white text-lg"
        placeholder="Email"
        placeholderTextColor="rgba(255, 255, 255, 0.5)"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={(text) => updateFormData({ email: text })}
      />
    </View>
  );
};

export default EmailStep;