import { PublicUserBriefModel } from "../user/publicUserBriefModel";

export interface PublicationCardModel {
    id: string;
    content?: string;
    postedAt: Date;
    updatedAt?: Date;
    remindAt?: Date;
    images?: string[];
    author: PublicUserBriefModel;
    likesAmount: number;
    isLikedByCurrentUser: boolean;
    commentAmount: number;
    publicationType: string;
    viewCount: number;
    isDeleted?: boolean;
}