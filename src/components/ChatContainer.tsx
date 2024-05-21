import { useState, useEffect, useRef } from "react";
import axios from "../utils/axios";
import ChatInput from "./ChatInput";
import { v4 as uuidv4 } from "uuid";

type Contact = {
    _id: string;
    fullName: string;
    profileImage: string;
};

export default function ChatContainer(props: {
    currentChat: Contact;
    socket: any;
}) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [incoming, setIncoming] = useState<any>(null);
    const OwnId = localStorage.getItem("user_id");

    const getAllMessages = async () => {
        const res = await axios.get(`/message/get/${props.currentChat._id}`);
        setMessages(res.data);
    };

    useEffect(() => {
        if (props.currentChat) {
            getAllMessages();
        }
    }, [props.currentChat]);

    const handleSend = async (msg: string) => {
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

            const updatedMessages = [...messages];
            updatedMessages.push({
                sender: user,
                content: msg,
                receiver: props.currentChat._id,
            });
            setMessages(updatedMessages);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        if (props.socket.current) {
            props.socket.current.off("msg-receive"); // Clear previous listeners to avoid duplicates
            props.socket.current.on("msg-receive", (msg: any) => {
                console.log("Received message:", msg); // Log the incoming message
                setIncoming(msg);
            });
        }
    }, [props.socket.current]);

    useEffect(() => {
        if (incoming) {
            setMessages((prev) => [...prev, incoming]);
        }
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
                    <div ref={scrollRef}></div>
                </div>
                <ChatInput sendMessage={handleSend} />
            </div>
        </>
    );
}
