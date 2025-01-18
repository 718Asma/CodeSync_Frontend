import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Popup from "reactjs-popup";

import {
    deleteAllNotifications,
    deleteNotification,
    getAllNotifications,
    markAllNotificationsAsRead,
    markNotificationAsRead,
} from "../services/notificationService";
import { Notif, NotificationType } from "../classes/notification";

import { BellFilled, EyeOutlined } from "@ant-design/icons";
import { Avatar } from "@mantine/core";

const Notification = () => {
    const navigate = useNavigate();

    const [notifications, setNotifications] = useState<Notif[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const [popupVisible, setPopupVisible] = useState(false);
    const [deleteAllPopup, setDeleteAllPopup] = useState(false);

    const handlePopupVisibleChange = (visible: boolean) => {
        setPopupVisible(visible);
    };

    useEffect(() => {
        const getNotifications = async () => {
            try {
                const data = await getAllNotifications();

                setNotifications(data);
                setUnreadCount(
                    data.filter((notification: Notif) => !notification.isRead)
                        .length
                );
            } catch (error) {
                console.error("Error fetching notifications:", error);
            }
        };

        getNotifications();
    }, []);

    const handleClick = async (notification: Notif) => {
        try {
            const response = await markNotificationAsRead(notification._id);
            console.log(response);
            setUnreadCount((prevUnreadCount) => prevUnreadCount - 1);

            if (
                notification.notificationType === NotificationType.POST_LIKE ||
                notification.notificationType === NotificationType.COMMENT ||
                notification.notificationType === NotificationType.POST_TAG
            ) {
                navigate(`/post/${notification.referenceObject}`);
            } else if (
                notification.notificationType ===
                NotificationType.FRIEND_REQUEST_SENT
            ) {
                navigate(`/user/profile/${notification.triggeredBy._id}`);
            } else if (
                notification.notificationType ===
                    NotificationType.FRIEND_REQUEST_ACCEPTED ||
                notification.notificationType ===
                    NotificationType.FRIEND_REQUEST_REJECTED
            ) {
                navigate(`/user/profile/${notification.triggeredBy._id}`);
            } else if (
                notification.notificationType === NotificationType.MESSAGE
            ) {
                navigate(`/chat`);
            }
        } catch (error) {
            console.error("Error marking notification as read:", error);
        }
    };

    const handleReadAllNotifications = async () => {
        try {
            const response = await markAllNotificationsAsRead();
            console.log(response);
            setNotifications((prevNotifications) =>
                prevNotifications.map((notification) => ({
                    ...notification,
                    isRead: true,
                }))
            );
            setUnreadCount(0);
        } catch (error) {
            console.error("Error marking all notifications as read:", error);
        }
    };

    const handleDeleteNotification = async (notificationId: string) => {
        try {
            const response = await deleteNotification(notificationId);
            console.log(response);
            setNotifications((prevNotifications) =>
                prevNotifications.filter(
                    (notification) => notification._id !== notificationId
                )
            );
            setUnreadCount((prevUnreadCount) => prevUnreadCount - 1);
        } catch (error) {
            console.error("Error deleting notification:", error);
        }
    };

    const handleDeleteAllNotifications = async () => {
        try {
            const response = await deleteAllNotifications();
            console.log(response);
            setNotifications([]);
            setUnreadCount(0);
        } catch (error) {
            console.error("Error deleting all notifications:", error);
        }
    };

    return (
        <Popup
            trigger={
                <button
                    className="bg-gray-200 ml-1 w-10 h-10 rounded-full relative"
                    onClick={() => handlePopupVisibleChange(!popupVisible)}
                    title="Your notifications"
                >
                    <BellFilled style={{ fontSize: "20px" }} />
                    {unreadCount > 0 && (
                        <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-[#ED080B] text-white text-xs flex items-center justify-center">
                            {unreadCount}
                        </span>
                    )}
                </button>
            }
            position="bottom right"
            contentStyle={{ width: "40%", backgroundColor: "#e1e1e1" }}
        >
            {notifications.length > 0 ? (
                <div className="overflow-y-auto overflow-x-hidden max-h-64 space-y-2">
                    {notifications.map((notification: Notif) => (
                        <div
                            key={notification._id}
                            className={`group p-2 mx-2 my-2 cursor-pointer ${
                                notification.isRead
                                    ? "text-black"
                                    : "bg-gray-300 border border-gray-300 rounded-lg font-bold hover:bg-gray-400 hover:text-white hover:border-transparent"
                            }`}
                            title="Check Out the origin of this notification"
                            onClick={() => {
                                handleClick(notification);
                            }}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <Avatar
                                        src={
                                            notification.triggeredBy
                                                ?.profileImage
                                        }
                                        alt={notification.triggeredBy?.fullName}
                                        radius="xl"
                                        size="md"
                                    />
                                    <span className="font-medium">
                                        {notification.notificationType === NotificationType.POST_LIKE
                                            ? `${notification.triggeredBy.fullName} just gave your post a thumbs-up! 👍`
                                            : notification.notificationType === NotificationType.COMMENT
                                            ? `${notification.triggeredBy.fullName} commented on your post! Get ready, they might be praising your brilliance or questioning your sanity. 🤔💬`
                                            : notification.notificationType === NotificationType.FRIEND_REQUEST_SENT
                                            ? `${notification.triggeredBy.fullName} sent you a friend request! They must have been REALLY bored. 🤷‍♂️`
                                            : notification.notificationType === NotificationType.FRIEND_REQUEST_ACCEPTED
                                            ? `${notification.triggeredBy.fullName} accepted your friend request! They’ve just pulled you into their trusted dev repo. 🔥💻`
                                            : notification.notificationType === NotificationType.FRIEND_REQUEST_REJECTED
                                            ? `${notification.triggeredBy.fullName} rejected your friend request... Ouch, that stings! 😅`
                                            : notification.notificationType === NotificationType.POST_TAG
                                            ? `${notification.triggeredBy.fullName} tagged you in a post! Guess you're the star of the show now. 🌟 Don’t mess it up.`
                                            : notification.notificationType === NotificationType.MESSAGE
                                            ? `${notification.triggeredBy.fullName} sent you a message! It's either a critical bug or a meme that broke the code. 🐞💭`
                                            : notification.notificationType === NotificationType.SYSTEM_NOTIFICATION
                                            ? "You have a new system notification! Don’t worry, it’s not an error... or is it? 🤔"
                                            : "You’ve got a brand new notification! Go on, take a peek. Your curiosity deserves it. 👀"}
                                    </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className="text-xs text-gray-400 group-hover:text-white">
                                        {notification.createdAt}
                                    </span>
                                    <button
                                        className="text-red-500 hover:text-red-800"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteNotification(
                                                notification._id
                                            );
                                        }}
                                        title="Delete this notification"
                                        aria-label="Delete notification"
                                    >
                                        <i className="fa fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    <hr className="border-gray-400" />
                    <div className="p-2 flex justify-between">
                        <button
                            className="
                                bg-gray-300
                                text-secondary-500
                                font-semibold
                                p-2
                                mx-2
                                border border-gray-300
                                rounded-lg 
                                hover:bg-gray-400 
                                hover:text-white 
                                hover:border-transparent
                            "
                            onClick={handleReadAllNotifications}
                            title="Mark all notifications as read"
                        >
                            <EyeOutlined />
                            &nbsp; Mark all as read{" "}
                        </button>
                        <button
                            className="
                                bg-gray-300
                                text-secondary-500
                                font-semibold
                                p-2
                                mx-2
                                border border-gray-300
                                rounded-lg 
                                hover:bg-gray-400 
                                hover:text-white 
                                hover:border-transparent
                            "
                            onClick={() => setDeleteAllPopup(true)}
                            title="Delete all notifications"
                        >
                            <i className="fa fa-trash"></i>&nbsp; Delete all{" "}
                        </button>
                    </div>
                    <Popup
                        trigger={<div></div>}
                        open={deleteAllPopup}
                        modal
                        nested
                        closeOnDocumentClick={false}
                        closeOnEscape={false}
                        onClose={() => setDeleteAllPopup(false)}
                        contentStyle={{
                            width: "auto",
                            height: "auto",
                        }}
                    >
                        <div className="p-4 bg-white rounded-md shadow-md">
                            <p className="lead" style={{ fontWeight: "bold" }}>
                                Are you sure you want to delete ALL of your
                                notifications?
                            </p>
                            <div className="mt-4 flex justify-end gap-2">
                                <button
                                    className="btn btn-secondary"
                                    style={{ marginRight: "10px" }}
                                    onClick={() => setDeleteAllPopup(false)}
                                >
                                    <i
                                        className="fa fa-times"
                                        aria-hidden="true"
                                    ></i>
                                    &nbsp; Cancel
                                </button>
                                <button
                                    className="btn btn-danger"
                                    style={{ marginRight: "10px" }}
                                    onClick={handleDeleteAllNotifications}
                                >
                                    <i className="fas fa-trash"></i>
                                    &nbsp; Delete
                                </button>
                            </div>
                        </div>
                    </Popup>
                </div>
            ) : (
                <div className="p-2 text-[#7808ED] text-center">
                    <p>
                        No notifications. Are we too quiet, or are you just that
                        efficient? 👀
                    </p>
                </div>
            )}
        </Popup>
    );
};

export default Notification;
