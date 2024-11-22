import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView } from 'react-native';
import { UserData } from '@/src/firebase/firestore/types';
import { useAuthContext } from '@/context/AuthContext';
import { getUserData } from '@/src/firebase/firestore/users';
import { useGroupContext } from '@/context/GroupContext';


type MembersListProps = {
  members: Record<string, boolean>;
  adminId: string;
};

export const MembersList = ({ members, adminId }: MembersListProps) => {
  const { userAuth } = useAuthContext();
  const { currentGroup } = useGroupContext();
  const [memberUsers, setMemberUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
      const fetchMembers = async () => {
      try {
        // Get array of user IDs from members object
        const memberIds = Object.keys(members);
        
        // Fetch user data for each member
        const membersData = await Promise.all(
          memberIds.map(id => getUserData(id))
        );

        setMemberUsers(membersData.filter((user): user is UserData => user !== null));
      } catch (error) {
        console.error('Error fetching members:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMembers();
  }, [members]);
  return (
    <View className="p-4">
      <Text className="text-lg font-semibold mb-4">
        Members ({memberUsers.length})
      </Text>

      {memberUsers.map((member, index) => (
        <View 
          key={index} 
          className={`flex-row items-center p-2 rounded-lg border-b border-gray-100 ${
            member.id === userAuth?.uid ? 'p-2 rounded-lg bg-blue-50 border-b-2 border-gray-100' : ''
          }`}
        >
          <Image
            source={
              member.profilePicture 
                ? { uri: member.profilePicture }
                : require('@/assets/default.png')
            }
            className="w-10 h-10 rounded-full bg-gray-200"
          />
          
          <View className="flex-1 ml-3">
            <Text className={`font-medium ${
              member.id === userAuth?.uid ? 'text-blue-600' : ''
            }`}>
              {member.firstName} {member.lastName}
              {member.id === userAuth?.uid && " (te)"}
            </Text>
            <Text className="text-sm text-gray-500">
              {member.id === adminId ? "Admin" : "Member"}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
};