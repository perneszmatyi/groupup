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
        className="w-full bg-gray-100 rounded-md p-2 mb-4"
        placeholder="First Name"
        value={firstName}
        autoCapitalize="none"
        onChangeText={(text) => updateFormData({ firstName: text, lastName })}
      />
      <TextInput
        className="w-full bg-gray-100 rounded-md p-2 mb-4"
        placeholder="Last Name"
        autoCapitalize="none"
        value={lastName}
        onChangeText={(text) => updateFormData({ firstName, lastName: text })}
      />
    </View>
  );
};

export default NameStep;