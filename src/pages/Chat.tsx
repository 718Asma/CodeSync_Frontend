import { useEffect, useState, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import { io, Socket } from "socket.io-client";

import Contacts from "../components/chatComponents/Contacts";
import NoSelectedContact from "../components/chatComponents/NoSelectedContact";
import ChatContainer from "../components/chatComponents/ChatContainer";
import SearchBar from "../components/SearchBar";
import { getUserProfile, getUserContacts } from "../services/userService";

import { Loader } from "@mantine/core";
import { faArrowLeft, faRobot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
    

    const handleGoBack = () => {
        navigate(-1);
    };

    const getUser = async () => {
        const userId = localStorage.getItem("user_id");
        if (userId) {
            const data = await getUserProfile(userId);
            let { _id, fullName, profileImage } = data;
            setCurrentUser({ _id, fullName, profileImage, online: true });
        }
    };

    const getContacts = async () => {
        const data = await getUserContacts();
        // const contactsWithOnlineStatus = data.contacts.map((contact: any) => ({
        //     ...contact,
        //     profileImage: contact.profileImage
        //         ? `http://localhost:3000/${contact.profileImage}`
        //         : "http://localhost:3000/assets/images/avatar.png",
        //     online: false, // Initialize all contacts as offline
        // }));
        setContacts(data);
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
        // look if user already exists in contacts
        if (contacts.find((contact) => contact._id === user._id)) {
            // select the user
            // setCurrentChat(user);
            return;
        }
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
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 p-4">
            <div className="w-full max-w-6xl flex justify-center items-center mb-4">
                <NavLink
                    to="/chatgpt"
                    className="text-white bg-gray-300 rounded-full w-10 h-10 flex justify-center items-center"
                >
                    <FontAwesomeIcon icon={faRobot} />
                </NavLink>
                <SearchBar onUserSelect={changeUserContacts} />
            </div>
            <div className="w-full max-w-6xl bg-white p-6 rounded-lg shadow-md grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* <div className="w-full max-w-6xl bg-white p-6 rounded-lg shadow-md flex"> */}
                {isLoading ? (
                    <div className="col-span-2 flex justify-center items-center">
                        <Loader color="#7808ED" />
                    </div>
                ) : (
                    <>
                        <Contacts
                            contacts={contacts}
                            currentUser={currentUser!}
                            changeChat={handleChatChange}
                            loading={isLoading}
                        />
                        {currentChat ? (
                            <ChatContainer
                                currentChat={currentChat}
                                socket={socket}
                            />
                        ) : (
                            <NoSelectedContact currentUser={currentUser} />
                        )}
                        <button onClick={handleGoBack} className="w-12 fixed top-6 left-6 text-[#7808ED] bg-white border p-2 rounded-lg">
                            <FontAwesomeIcon icon={faArrowLeft} />
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default Chat;