import { ImageModel } from "./imageModel"

export interface MemberModel {
    id: number
    username: string,
    uniqueNameIdentifier: string,
    joinedAt: string
    profileImage: ImageModel
    blocked: boolean
}