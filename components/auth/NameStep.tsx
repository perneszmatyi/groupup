import React from 'react';
import { View, TextInput } from 'react-native';

type NameStepProps = {
  firstName: string;
  lastName: string;
  updateFormData: (data: { firstName: string; lastName: string }) => void;
};

const NameStep: React.FC<NameStepProps> = ({ firstName, lastName, updateFormData }) => {
  return (
    <View className="w-full">
      <TextInput
        className="w-full bg-white/10 rounded-xl px-4 py-4 mb-4 text-white text-lg"
        placeholder="First Name"
        placeholderTextColor="rgba(255, 255, 255, 0.5)"
        value={firstName}
        autoCapitalize="none"
        onChangeText={(text) => updateFormData({ firstName: text, lastName })}
      />
      <TextInput
        className="w-full bg-white/10 rounded-xl px-4 py-4 mb-4 text-white text-lg"
        placeholder="Last Name"
        placeholderTextColor="rgba(255, 255, 255, 0.5)"
        autoCapitalize="none"
        value={lastName}
        onChangeText={(text) => updateFormData({ firstName, lastName: text })}
      />
    </View>
  );
};

export default NameStep;