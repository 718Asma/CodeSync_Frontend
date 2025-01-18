import { User } from "./user";

export enum Status {
    PENDING = 'pending',
    ACCEPTED = 'accepted',
    REJECTED = 'rejected'
}

export interface friendRequest {
    _id: string;
    sender: User;
    receiver: string;
    status: Status;
    created_at: Date;
    updated_at: Date;
}