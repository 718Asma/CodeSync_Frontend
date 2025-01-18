import { User } from "./user";

export interface Discussion {
    _id: string;
    creator: User;
    participants: string[];
    title: string;
    description?: string;
    timestamp: Date;
    banner: string;
}