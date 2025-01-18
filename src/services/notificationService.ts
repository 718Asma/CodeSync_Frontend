import axios from "../utils/axios";

// Create a new notification
export const createNotification = async (
    userId: string,
    notificationType: string,
    referenceObject: string
) => {
    const validTypes = [
        "friend_request_sent",
        "friend_request_accepted",
        "friend_request_rejected",
        "system_notification",
        "post_tag",
        "post_like",
        "comment",
        "message",
    ];

    if (validTypes.includes(notificationType)) {
        try {
            const response = await axios.post(`/notifications/create`, {
                recipient: userId,
                notificationType: notificationType,
                referenceObject: referenceObject,
            });
            
            return response.data;
        } catch (error) {
            console.error("Error creating notification:", error);
            throw error;
        }
    } else {
        console.error("Invalid notification type");
    }
};

// Get all notifications
export const getAllNotifications = async () => {
    try {
        const { data } = await axios.get(`/notifications/`);
        
        if(data){
            if(Array.isArray(data) && data.length > 0){
                const newNotifs = data.map((notif: any) => {
                    if (notif.triggeredBy) {
                        if (!notif.triggeredBy.profileImage) {
                            notif.triggeredBy.profileImage = "http://localhost:3000/assets/images/avatar.png";
                        } else {
                            notif.triggeredBy.profileImage = `http://localhost:3000/${notif.triggeredBy.profileImage}`;
                        }
                    }

                    notif.createdAt = new Date(notif.createdAt).toLocaleString().split(',')[0];
                    return {...notif }
                });
                return newNotifs;
            }
            else {
                return [];
            }
        } else {
            return [];
        }
    } catch (error) {
        console.error("Error getting all notifications:", error);
        throw error;
    }
};

// Mark a notification as read by ID
export const markNotificationAsRead = async (notificationId: string) => {
    try {
        const response = await axios.post(
            `/notifications/read/id/${notificationId}`
        );
        return response.data;
    } catch (error) {
        console.error("Error getting notification as read:", error);
        throw error;
    }
};

// Mark all notifications as read
export const markAllNotificationsAsRead = async () => {
    try {
        const response = await axios.post(`/notifications/read/all`);
        return response.data;
    } catch (error) {
        console.error("Error getting all notifications as read:", error);
        throw error;
    }
};

// Delete a notification by ID
export const deleteNotification = async (notificationId: string) => {
    try {
        const response = await axios.delete(
            `/notifications/delete/${notificationId}`
        );
        return response.data;
    } catch (error) {
        console.error("Error deleting notification:", error);
        throw error;
    }
};

// Delete all notifications
export const deleteAllNotifications = async () => {
    try {
        const response = await axios.delete(`/notifications/delete/all`);
        return response.data;
    } catch (error) {
        console.error("Error deleting all notifications:", error);
        throw error;
    }
};
