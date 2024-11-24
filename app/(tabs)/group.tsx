import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import NoGroup from '../../components/group/NoGroup';
import { useUserContext } from '@/context/UserContext';
import { useGroupContext } from '@/context/GroupContext';
import { GroupInfo } from '@/components/group/GroupInfo';
import { updateGroupPhoto, updateGroupInfo, leaveGroup, deleteGroup } from '@/src/firebase/firestore/groups';
import { MembersList } from '@/components/group/MembersList';
import { GroupActions } from '@/components/group/GroupActions';
import { useAuthContext } from '@/context/AuthContext';
import { LoadingScreen } from '@/components/screens/LoadingScreen';
import { router } from 'expo-router';

const GroupScreen = () => {
  const { user } = useUserContext();
  const { userAuth } = useAuthContext();
  const { currentGroup } = useGroupContext();
  const [isLoading, setIsLoading] = useState(false);


  const handleGroupUpdates = async (data: { name?: string; description?: string; photo?: string }) => {
    if (!currentGroup) return; 
    if (data.photo) {
      try {
        setIsLoading(true);
        await updateGroupPhoto(currentGroup.id, data.photo);
      } catch (error) {
        console.error('Error updating group photo:', error);
      } finally {
        setIsLoading(false);
      }
    }
    if (data.name || data.description) {
      try {
        setIsLoading(true);
        await updateGroupInfo(currentGroup.id, data);
      } catch (error) {
        console.error('Error updating group:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleLeaveGroup = async () => {
    if (!currentGroup || !userAuth?.uid) return;
    try {
      setIsLoading(true);
      await leaveGroup(currentGroup.id, userAuth.uid);
    } catch (error) {
      console.error('Error leaving group:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteGroup = async () => {
    if (!currentGroup || !userAuth?.uid) return;
    try {
      setIsLoading(true);
      await deleteGroup(currentGroup.id);
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Error deleting group:', error);
    } finally {
      setIsLoading(false);
    }
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
  
  if (isLoading) {
    return <LoadingScreen message="Loading group..." />;
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