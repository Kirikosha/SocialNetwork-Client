import { ImageModel } from "./imageModel";

export interface AdminUserModel {
    id: number;
    username: string;
    uniqueNameIdentifier: string;
    email: string;
    profileImage?: ImageModel;
    violationScore: number;
    amountOfViolations: number;
    blocked: boolean;
    blockedAt?: Date;
}