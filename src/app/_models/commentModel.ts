import { MemberModel } from "./memberModel";

export interface CommentModel {
    id: number;
    content: string;
    author: MemberModel;
    publicationId: number;
    creationDate: Date;
}