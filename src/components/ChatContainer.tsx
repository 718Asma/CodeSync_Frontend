import { useState, useEffect, useRef } from "react";
import axios from "../utils/axios";
// import styled from "styled-components";
import ChatInput from "./ChatInput";
// import { getMessageRoute, sendMessageRoute } from "../utils/APIroute";
import { v4 as uuidv4 } from "uuid";
// import { IoPersonCircle } from "react-icons/io5";

// import "react-toastify/dist/ReactToastify.css";

type Contact = {
    _id: string;
    fullName: string;
    profileImage: string;
};

export default function ChatContainer(props: {
    currentChat: Contact;
    socket: any;
}) {
    const scrollRef = useRef<HTMLDivElement>();
    const [messages, setMessages] = useState<any>([]);
    const [incoming, setIncoming] = useState<any>(null);
    const OwnId = localStorage.getItem("user_id");

    const getAllMessages = async () => {
        const res = await axios.get(`/message/get/${props.currentChat._id}`);
        setMessages(res.data);
    };

    useEffect(
        () => {
            if (props.currentChat) {
                getAllMessages();
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [props.currentChat]
    );

    const handleSend = async (msg: any) => {
        const user = localStorage.getItem("user_id");
        try {
            await axios.post("message/send", {
                receiver: props.currentChat._id,
                content: msg,
            });

            props.socket.current.emit("send-msg", {
                receiver: props.currentChat._id,
                sender: user,
                content: msg,
            });

            props.socket.current.emit("send-notification", {
                receiver: props.currentChat._id,
                sender: user,
                content: msg,
            });

            const updatedMessages: any = [...messages];
            // TOFIX: user is just userId, add type checking and fix the name
            updatedMessages.push({
                sender: user,
                content: msg,
                reciver: props.currentChat._id,
            });
            setMessages(updatedMessages);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(
        () => {
            if (props.socket.current) {
                //TODO: Fix the user type ( why call it twice )
                const user = localStorage.getItem("user_id");
                props.socket.current.on("msg-receive", (msg: any) => {
                    setIncoming({
                        receiver: user,
                        content: msg,
                        sender: props.currentChat._id,
                    });
                });
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    useEffect(() => {
        incoming && setMessages((prev: any) => [...prev, incoming]);
    }, [incoming]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <>
            <div>
                <div className="flex items-center p-4 border-b border-gray-200">
                    <div className="w-12 h-12 rounded-full overflow-hidden">
                        {props.currentChat.profileImage ? (
                            <img
                                src={props.currentChat.profileImage}
                                alt="avatarImage"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-gray-300"></div>
                        )}
                    </div>
                    <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-800">
                            {props.currentChat.fullName}
                        </h3>
                    </div>
                </div>
                <div className="p-4 overflow-y-auto flex flex-col gap-4">
                    {messages.map((message: any) => (
                        <div key={uuidv4()} className="flex flex-col">
                            <p
                                className={`p-2 rounded-lg ${
                                    message.sender === OwnId
                                        ? "bg-green-100"
                                        : "bg-gray-100"
                                } self-end`}
                            >
                                {message.content}
                            </p>
                        </div>
                    ))}
                    <div ref={scrollRef as any}></div>
                </div>
                <ChatInput sendMessage={handleSend} />
            </div>
        </>
    );
}
