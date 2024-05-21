import { useEffect, useState, useRef } from "react";
import axios from "../utils/axios";
import { useNavigate } from "react-router-dom";
import Contacts from "../components/Contacts";
import NoSelectedContact from "../components/NoSelectedContact";
import ChatContainer from "../components/ChatContainer";
import { io, Socket } from "socket.io-client";
import SearchBar from "../components/SearchBar";

type CurrentUserInfo = {
    _id: string;
    fullName: string;
    profileImage: string;
    online: boolean;
};

type Contact = {
    _id: string;
    fullName: string;
    profileImage: string;
    online: boolean;
};

const Chat = () => {
    const socket = useRef<Socket | undefined>(undefined);
    const navigate = useNavigate();
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [currentUser, setCurrentUser] = useState<CurrentUserInfo>();
    const [currentChat, setCurrentChat] = useState<Contact | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [rOnlineUsers, setROnlineUsers] = useState<string[]>([]);

    const getUser = async () => {
        const userId = localStorage.getItem("user_id");
        const { data } = await axios.get(`user/profile/${userId}`);
        let { _id, fullName, profileImage } = data.data;
        if (!profileImage)
            profileImage = "http://localhost:3000/assets/images/avatar.png";
        else profileImage = `http://localhost:3000/${profileImage}`;
        setCurrentUser({ _id, fullName, profileImage, online: true });
    };

    const getContacts = async () => {
        const { data } = await axios.get("message/contacts");
        const contactsWithOnlineStatus = data.contacts.map((contact: any) => ({
            ...contact,
            profileImage: contact.profileImage
                ? `http://localhost:3000/${contact.profileImage}`
                : "http://localhost:3000/assets/images/avatar.png",
            online: false, // Initialize all contacts as offline
        }));
        setContacts(contactsWithOnlineStatus);
        setIsLoading(false);
    };

    const handleChatChange = (chat: Contact) => {
        setCurrentChat(chat);
    };

    useEffect(() => {
        if (!localStorage.getItem("user_id")) {
            navigate("auth/login");
        } else {
            getUser();
        }
    }, []);

    useEffect(() => {
        if (currentUser) {
            socket.current = io(import.meta.env.VITE_SOCKET_URL);
            socket.current.emit("add-user", currentUser._id);

            socket.current.on("update-user-status", (data: any) => {
                console.log("User status updated:", data);
                setContacts((prevContacts) =>
                    prevContacts.map((contact) =>
                        contact._id === data.userId
                            ? { ...contact, online: data.status === "online" }
                            : contact
                    )
                );
            });

            socket.current.on(
                "current-online-users",
                (onlineUsers: string[]) => {
                    console.log("Current online users:", onlineUsers);
                    setROnlineUsers(onlineUsers);
                    setContacts((prevContacts) =>
                        prevContacts.map((contact) =>
                            onlineUsers.includes(contact._id)
                                ? { ...contact, online: true }
                                : { ...contact, online: false }
                        )
                    );
                }
            );
        }
    }, [currentUser]);

    useEffect(() => {
        if (currentUser) {
            setIsLoading(true);
            getContacts();
        }
    }, [currentUser]);

    function changeUserContacts(user: any): void {
        setContacts((prevContacts) => [...prevContacts, user]);
        setContacts((prevContacts) =>
            prevContacts.map((contact) =>
                rOnlineUsers.includes(contact._id)
                    ? { ...contact, online: true }
                    : { ...contact, online: false }
            )
        );
    }

    return (
        <div className="min-h-screen flex justify-center items-center bg-gray-100">
            <SearchBar onUserSelect={changeUserContacts} />
            <div className="container bg-white p-4 rounded-lg grid grid-cols-1 md:grid-cols-2 gap-4">
                {isLoading ? (
                    <div className="h-full flex justify-center items-center">
                        Loading...
                    </div>
                ) : (
                    <Contacts
                        contacts={contacts}
                        currentUser={currentUser!}
                        changeChat={handleChatChange}
                        loading={isLoading}
                    />
                )}
                {currentChat ? (
                    <ChatContainer currentChat={currentChat} socket={socket} />
                ) : (
                    <NoSelectedContact currentUser={currentUser} />
                )}
            </div>
        </div>
    );
};

export default Chat;
