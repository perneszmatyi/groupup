export interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  createdAt: Date;
  currentGroup?: string;  
  profilePicture?: string; 
  lastActive?: Date;        
}

export interface GroupData {
  name: string;
  description: string;
  createdBy: string;       
  createdAt: Date;
  members: Record<string, boolean>;  
  inviteCode: string;
  photo?: string;           
  isActive: boolean;           
}

