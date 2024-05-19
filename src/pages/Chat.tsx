import { useEffect, useState, useRef } from "react";
import axios from "../utils/axios";
import { useNavigate } from "react-router-dom";
import Contacts from "../components/Contacts";
import NoSelectedContact from "../components/NoSelectedContact";
import ChatContainer from "../components/ChatContainer";
// TODO: Add the following imports
// import Skeleton from "react-loading-skeleton";
// import "react-loading-skeleton/dist/skeleton.css";
// import { ToastContainer } from "react-toastify";
import { io, Socket } from "socket.io-client";

type CurrentUserInfo = {
    _id: string;
    fullName: string;
    profileImage: string;
};

type Contact = {
    _id: string;
    fullName: string;
    profileImage: string;
};

const Chat = () => {
    const socket = useRef<Socket | undefined>(undefined); // Initialize as undefined

    const navigate = useNavigate();
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [currentUser, setCurrentUser] = useState<CurrentUserInfo>();
    const [currentChat, setCurrentChat] = useState(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const getUser = async () => {
        const userId = localStorage.getItem("user_id");

        const { data } = await axios.get(`user/profile/${userId}`);
        let { _id, fullName, profileImage } = data.data;
        if (!profileImage)
            profileImage = "http://localhost:3000/assets/images/avatar.png";
        else profileImage = `http://localhost:3000/${profileImage}`;
        setCurrentUser({ _id, fullName, profileImage });
    };

    const getContacts = async () => {
        const { data } = await axios.get("message/contacts");
        console.log(data.contacts);
        for (let i = 0; i < data.contacts.length; i++) {
            if (!data.contacts[i].profileImage)
                data.contacts[i].profileImage =
                    "http://localhost:3000/assets/images/avatar.png";
            else {
                data.contacts[
                    i
                ].profileImage = `http://localhost:3000/${data.contacts[i].profileImage}`;
            }
        }
        console.log(data.contacts);
        setContacts(data.contacts);
        setIsLoading(false);
    };

    const handleChatChange = (chat: any) => {
        setCurrentChat(chat);
    };

    useEffect(
        () => {
            if (!localStorage.getItem("user_id")) {
                navigate("auth/login");
            } else {
                console.log("Getting user");
                getUser();
            }
        },
        // eslint-disable-next-line
        []
    );

    useEffect(() => {
        if (currentUser) {
            socket.current = io(import.meta.env.VITE_SOCKET_URL);
            socket.current?.emit("add-user", currentUser._id);
        }
    }, [currentUser]);

    useEffect(() => {
        if (currentUser) {
            setIsLoading(true);
            getContacts();
        }
    }, [currentUser]);

    return (
        <div className="min-h-screen flex justify-center items-center bg-gray-100">
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
