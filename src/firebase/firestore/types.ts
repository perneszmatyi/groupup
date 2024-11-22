export interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: Date;
  currentGroup?: string;  
  profilePicture?: string; 
  lastActive?: Date;        
}

export interface GroupData {
  id: string;
  name: string;
  description: string;
  createdBy: string;       
  createdAt: Date;
  members: Record<string, boolean>;  
  inviteCode: string;
  photo?: string;           
  isActive: boolean;     
  likes?: Record<string, boolean>;
  passes?: Record<string, boolean>;
  matches?: Record<string, boolean>;
}

export interface MessageData {
  id: string;
  content: string;
  timestamp: Date;
  senderId: string;
  senderName: string;
  groupId: string;
}

export interface ChatData {
  id: string;
  groupId1: string;
  groupId2: string;
  createdAt: Date;
  lastMessage?: {
    text: string;
    timestamp: Date;  
    senderId: string;
  }
}
