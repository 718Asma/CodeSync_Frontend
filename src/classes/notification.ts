import { User } from "./user";

export enum NotificationType {
    FRIEND_REQUEST_SENT = "friend_request_sent",
    FRIEND_REQUEST_ACCEPTED = "friend_request_accepted",
    FRIEND_REQUEST_REJECTED = "friend_request_rejected",
    SYSTEM_NOTIFICATION = "system_notification",
    POST_TAG = "post_tag",
    POST_LIKE = "post_like",
    COMMENT = "comment",
    MESSAGE = "message"
}

export interface Notif {
    _id: string,
    recipient: User;
    notificationType: NotificationType;
    referenceObject: string;
    triggeredBy: User;
    createdAt: string;
    isRead: boolean;
}