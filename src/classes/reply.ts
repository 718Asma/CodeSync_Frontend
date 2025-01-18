import { User } from './user';

export interface Reply {
    _id: string;
    owner: User;
    content: string;
    upvotes: string[];
    downvotes: string[];
    timestamp: string;
}