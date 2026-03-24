import { ImageModel } from "../imageModel";
import { MemberModel } from "../user/memberModel";

export interface PublicationModel{
    id: string;
    content?: string;
    postedAt: Date;
    updatedAt?: Date;
    remindAt?: Date;
    images?: string[];
    author: MemberModel;
    likesAmount: number;
    isLikedByCurrentUser: boolean;
    commentAmount: number;
    conditionType?: 'SubscriberCount';
    conditionTarget?: number;
    comparisonOperator?: 'GreaterThanOrEqual'
    viewCount: number;
}