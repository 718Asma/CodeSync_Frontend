import { useEffect, useState, useRef } from "react";
import axios from "../utils/axios";
// import styled from "styled-components";
import { useNavigate } from "react-router-dom";
// import { allUsersRoute } from "../utils/APIroute";
import Contacts from "../components/Contacts";
import NoSelectedContact from "../components/NoSelectedContact";
import ChatContainer from "../components/ChatContainer";
// import Skeleton from "react-loading-skeleton";
// import "react-loading-skeleton/dist/skeleton.css";
// import { ToastContainer } from "react-toastify";
import { io, Socket } from "socket.io-client";
// import { DefaultEventsMap } from "socket.io-client";

const Chat = () => {
    // const socket = useRef();
    // const socket = useRef<Socket<DefaultEventsMap, DefaultEventsMap> | undefined>(undefined); // Initialize as undefined
    const socket = useRef<Socket | undefined>(undefined); // Initialize as undefined

    const navigate = useNavigate();
    const [contacts, setContacts] = useState([]);
    const [currentUser, setCurrentUser] = useState<any>();
    const [currentChat, setCurrentChat] = useState(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const getUser = async () => {
        const user = localStorage.getItem("user_id");
        setCurrentUser(user);
    };

    const getContacts = async () => {
        const res = await axios.get("message/contacts");
        setContacts(res.data.contacts);
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
                getUser();
            }
        },
        // eslint-disable-next-line
        []
    );

    useEffect(() => {
        if (currentUser) {
            socket.current = io(import.meta.env.VITE_SOCKET_URL);
            socket.current?.emit("add-user", currentUser);
        }
    }, [currentUser]);

    useEffect(() => {
        if (currentUser) {
            setIsLoading(true);
            getContacts();
        }
    }, [currentUser]); // Make sure currentUser is correctly added to the dependency array

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
                        currentUser={currentUser}
                        changeChat={handleChatChange}
                        loading={isLoading}
                    />
                )}
                {currentChat ? (
                    <ChatContainer currentChat={currentChat} socket={socket} />
                ) : (
                    <NoSelectedContact />
                )}
            </div>
        </div>
    );
};

export default Chat;
