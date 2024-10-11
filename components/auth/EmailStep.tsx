import React from 'react';
import { View, TextInput } from 'react-native';

const EmailStep = ({ email, updateFormData }) => {
  return (
    <View className="w-full">
      <TextInput
        className="w-full bg-gray-100 rounded-md p-2 mb-4"
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={(text) => updateFormData({ email: text })}
      />
    </View>
  );
};

export default EmailStep;