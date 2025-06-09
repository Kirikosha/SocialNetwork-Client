export interface UpdateMemberModel {
    id: number;
    username: string;
    uniqueNameIdentifier: string;
    joinedAt: string;
    profileImage?: File;
}