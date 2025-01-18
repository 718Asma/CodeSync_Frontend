import { Discussion } from "./discussion";
import { Reply } from "./reply";
import { User } from "./user";

export interface Post {
    _id: string;
    owner: User;
    discussionId: Discussion;
    content: string;
    likes: string[];
    dislikes: string[];
    images: string[];
    timestamp: string;
    replies: Reply[];
}