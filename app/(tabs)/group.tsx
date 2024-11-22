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
      <View className="flex-1 items-center bg-white">
        <Text className="text-2xl font-bold">Groups</Text>
        <NoGroup />
      </View>
    );
  }
  
  return (
    <ScrollView className="flex-1 bg-white">
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
  );
};

export default GroupScreen;