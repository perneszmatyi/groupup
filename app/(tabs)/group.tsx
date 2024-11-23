import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import NoGroup from '../../components/group/NoGroup';
import { useUserContext } from '@/context/UserContext';
import { useGroupContext } from '@/context/GroupContext';
import { GroupInfo } from '@/components/group/GroupInfo';
import { updateGroupPhoto, updateGroupInfo, leaveGroup, deleteGroup } from '@/src/firebase/firestore/groups';
import { MembersList } from '@/components/group/MembersList';
import { GroupActions } from '@/components/group/GroupActions';
import { useAuthContext } from '@/context/AuthContext';

const GroupScreen = () => {
  const { user } = useUserContext();
  const { userAuth } = useAuthContext();
  const { currentGroup } = useGroupContext();

  const handleGroupUpdates = async (data: { name?: string; description?: string; photo?: string }) => {
    if (!currentGroup) return;
    if (data.photo) {
      try {
        await updateGroupPhoto(currentGroup.id, data.photo);
      } catch (error) {
        console.error('Error updating group photo:', error);
      }
    }
    if (data.name || data.description) {
      try {
        await updateGroupInfo(currentGroup.id, data);
      } catch (error) {
        console.error('Error updating group:', error);
      }
    }
  };

  const handleLeaveGroup = async () => {
    if (!currentGroup || !userAuth?.uid) return;
    await leaveGroup(currentGroup.id, userAuth.uid);
  };

  const handleDeleteGroup = async () => {
    if (!currentGroup || !userAuth?.uid) return;
    await deleteGroup(currentGroup.id, userAuth.uid);
  };

  if (!user?.currentGroup) {
    return (
      <View className="flex-1 bg-[#151718]">
        <View className="bg-gray-800/50 p-4 border-b border-gray-700">
          <Text className="text-2xl font-bold text-white">Group</Text>
        </View>
        <NoGroup />
      </View>
    );
  }
  
  return (
    <View className="flex-1 bg-[#151718]">
      <View className="bg-gray-800/50 p-4 border-b border-gray-700">
        <Text className="text-2xl font-bold text-white">Group</Text>
      </View>
      
      <ScrollView 
        className="flex-1" 
        showsVerticalScrollIndicator={false}
      >
        <GroupInfo
          name={currentGroup?.name || ''}
          photo={currentGroup?.photo || ''}
          description={currentGroup?.description || ''}
          inviteCode={currentGroup?.inviteCode || ''}
          onUpdate={handleGroupUpdates}
        />
        <MembersList 
          members={currentGroup?.members || {}}
          adminId={currentGroup?.createdBy || ''}
        />

          <GroupActions 
            adminId={currentGroup?.createdBy || ''}
            onLeaveGroup={handleLeaveGroup}
            onDeleteGroup={handleDeleteGroup}
        />
      </ScrollView>
    </View>
  );
};

export default GroupScreen;