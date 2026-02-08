import { MemberModel } from "./user/memberModel";

export interface CommentModel {
    id: number;
    content: string;
    author: MemberModel;
    publicationId: number;
    creationDate: Date;
    isDeleted: boolean;
    repliesAmount: number;
}

export interface CreateCommentModel {
    content: string;
    publicationId: number;
    parentId?: number;
}