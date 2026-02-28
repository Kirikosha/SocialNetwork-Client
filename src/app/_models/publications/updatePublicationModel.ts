export interface UpdatePublicationModel {
    id: number;
    content?: string;
    remindAt?: Date;
    conditionTarget?: number | undefined | null;
}