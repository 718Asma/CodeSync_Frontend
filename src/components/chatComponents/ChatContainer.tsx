import { useState, useEffect, useRef } from "react";
import Popup from "reactjs-popup";
import { toast } from "react-toastify";

import ChatInput from "./ChatInput";
import {
    deleteMessage,
    getMessages,
    sendMessages,
    updateMessage,
} from "../../services/messageService";

import { Avatar } from "@mantine/core";
import { createNotification } from "../../services/notificationService";

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
    const [messageToDelete, setMessageToDelete] = useState<string | null>(null);
    const [editingMessageId, setEditingMessageId] = useState<string | null>(
        null
    );
    const [editedContent, setEditedContent] = useState<string>("");

    const getAllMessages = async () => {
        const res = await getMessages(props.currentChat._id);
        setMessages(res);
    };

    useEffect(() => {
        if (props.currentChat) {
            getAllMessages();
        }
    }, [props.currentChat]);

    const handleSend = async (msg: string) => {
        const user = localStorage.getItem("user_id");
        const currentTime = new Date();
        const formattedDate = currentTime.toLocaleDateString("en-GB");
        const formattedTime = currentTime
            .toLocaleTimeString("en-GB")
            .split(":")
            .slice(0, 2)
            .join(":");

        try {
            const { message } = await sendMessages(props.currentChat._id, msg);

            props.socket.current.emit("send-msg", {
                _id: message._id,
                sender: user,
                content: msg,
                receiver: props.currentChat._id,
                date: formattedDate,
                time: formattedTime,
                timestamp: message.timestamp,
                lastModified: message.lastModified,
            });

            const newMessage = {
                _id: message._id,
                sender: user,
                content: msg,
                receiver: props.currentChat._id,
                date: formattedDate,
                time: formattedTime,
                timestamp: message.timestamp,
                lastModified: message.lastModified,
            };

            setIncoming(newMessage);

            user ? await createNotification(props.currentChat._id, 'message', message._id) : null;
        } catch (err) {
            console.error(err);
            toast.error("Failed to send message. Please try again.");
        }
    };

    const handleDeleteConfirmation = (messageId: string) => {
        setMessageToDelete(messageId);
    };

    const handleDelete = async () => {
        if (messageToDelete) {
            try {
                await deleteMessage(messageToDelete);

                // Emit the delete event to the server
                props.socket.current.emit("delete-msg", {
                    receiver: props.currentChat._id,
                    messageId: messageToDelete,
                });

                setMessages((prevMessages) =>
                    prevMessages.filter(
                        (message) => message._id !== messageToDelete
                    )
                );

                setMessageToDelete(null);

                toast.success("Message deleted successfully!");
            } catch (err) {
                console.error("Error deleting message:", err);
            }
        }
    };

    const handleUpdate = async (messageId: string, currentContent: string) => {
        setEditingMessageId(messageId);
        setEditedContent(currentContent);
    };

    useEffect(() => {
        if (editingMessageId) {
            const textarea = document.getElementById(
                `edit-textarea-${editingMessageId}`
            );
            if (textarea) {
                textarea.focus();
            }
        }
    }, [editingMessageId]);

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === "Enter") {
            event.preventDefault();
            handleSaveEdit();
        } else if (event.key === "Escape") {
            handleCancelEdit();
        }
    };

    const handleSaveEdit = async () => {
        if (editingMessageId && editedContent.trim() !== "") {
            try {
                await updateMessage(editingMessageId, editedContent);

                // Emit the update event to the server
                props.socket.current.emit("update-msg", {
                    messageId: editingMessageId,
                    receiver: props.currentChat._id,
                    updatedContent: editedContent,
                });

                setMessages((prevMessages) =>
                    prevMessages.map((message) =>
                        message._id === editingMessageId
                            ? { ...message, content: editedContent }
                            : message
                    )
                );

                toast.success("Message updated successfully!");

                setEditingMessageId(null);
                setEditedContent("");
            } catch (err) {
                console.error("Error updating message:", err);
            }
        }
    };

    const handleCancelEdit = () => {
        setEditingMessageId(null);
        setEditedContent("");
    };

    useEffect(() => {
        if (props.socket.current) {
            // Clear previous listeners to avoid duplicates
            props.socket.current.off("msg-receive");
            props.socket.current.off("update-msg");
            props.socket.current.off("delete-msg");

            // Listener for updating messages
            props.socket.current.on("update-msg", (updatedMessage: any) => {
                setMessages((prevMessages) =>
                    prevMessages.map((message) =>
                        message._id === updatedMessage.messageId
                            ? {
                                  ...message,
                                  content: updatedMessage.updatedContent,
                              }
                            : message
                    )
                );
            });

            // Listener for receiving messages
            props.socket.current.on("msg-receive", (msg: any) => {
                setMessages((prevMessages) => [...prevMessages, msg]); // Always add new messages
            });

            // Listener for deleting messages
            props.socket.current.on("delete-msg", (messageId: string) => {
                setMessages((prevMessages) =>
                    prevMessages.filter((message) => message._id !== messageId)
                );
            });
        } else {
            console.error("Socket not connected.");
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
        <div className="flex flex-col max-h-[600px] p-2">
            <div className="flex items-center py-2 px-4 border-b border-gray-200">
                <Avatar
                    src={props.currentChat.profileImage}
                    alt="avatarImage"
                    radius="xl"
                    size="lg"
                />
                <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-800">
                        {props.currentChat.fullName}
                    </h3>
                </div>
            </div>
            <div className="flex-1 p-4 flex flex-col overflow-y-auto gap-4">
                {messages.map((message: any, index: number) => {
                    const showDate =
                        index === 0 ||
                        message.date !== messages[index - 1].date;

                    return (
                        <div key={message._id} className="flex flex-col">
                            {showDate && (
                                <div className="text-center text-gray-500 text-sm font-medium my-2">
                                    {message.date}
                                </div>
                            )}
                            <div
                                className={`flex flex-col ${
                                    message.sender === OwnId
                                        ? "items-end"
                                        : "items-start"
                                }`}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection:
                                            message.sender === OwnId
                                                ? "row-reverse"
                                                : "row",
                                    }}
                                >
                                    <Avatar
                                        src={
                                            message.sender === OwnId
                                                ? localStorage.getItem(
                                                      "profileImage"
                                                  )
                                                : props.currentChat.profileImage
                                        }
                                        alt="avatarImage"
                                        radius="xl"
                                        size="sm"
                                        className={`mt-2 ${
                                            message.sender === OwnId
                                                ? "ml-1"
                                                : "mr-1"
                                        }`}
                                    />
                                    {editingMessageId === message._id ? (
                                        <input
                                            id={`edit-input-${message._id}`}
                                            className="bg-green-200 p-2 rounded-lg max-w-xs break-words border-none"
                                            value={editedContent}
                                            onChange={(e) =>
                                                setEditedContent(e.target.value)
                                            }
                                            onKeyDown={(e) => handleKeyDown(e)}
                                            autoFocus
                                        />
                                    ) : (
                                        <p
                                            className={`p-2 rounded-lg max-w-xs break-words ${
                                                message.sender ===
                                                localStorage.getItem("user_id")
                                                    ? "bg-green-200 text-right"
                                                    : "bg-gray-200 text-left"
                                            }`}
                                        >
                                            {/^(https?:\/\/[^\s]+)$/.test(
                                                message.content
                                            ) ? (
                                                <a
                                                    href={message.content}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    style={{ color: "#7808ED" }}
                                                >
                                                    {message.content}
                                                </a>
                                            ) : (
                                                message.content
                                            )}
                                        </p>
                                    )}
                                    {message.sender === OwnId && (
                                        <Popup
                                            trigger={
                                                <button
                                                    style={{
                                                        color: "#818181",
                                                        margin: "5px",
                                                    }}
                                                >
                                                    <i className="fa fa-ellipsis-v"></i>
                                                </button>
                                            }
                                            position="bottom center"
                                            contentStyle={{ width: "auto" }}
                                        >
                                            <button
                                                style={{ color: "#818181" }}
                                                onClick={() =>
                                                    handleDeleteConfirmation(
                                                        message._id
                                                    )
                                                }
                                            >
                                                <i className="fa fa-trash"></i>
                                                &nbsp;&nbsp; Delete Message
                                            </button>
                                            <br />
                                            <button
                                                style={{ color: "#818181" }}
                                                onClick={() =>
                                                    handleUpdate(
                                                        message._id,
                                                        message.content
                                                    )
                                                }
                                            >
                                                <i className="fa fa-pen"></i>
                                                &nbsp;&nbsp; Edit Message
                                            </button>
                                        </Popup>
                                    )}
                                </div>
                                <span
                                    className={`desc text-xs text-gray-400 font-light ${
                                        message.sender === OwnId
                                            ? "mr-8"
                                            : "ml-8"
                                    }`}
                                >
                                    {editingMessageId === message._id ? (
                                        <span className="flex items-center">
                                            escape to
                                            <button
                                                onClick={handleCancelEdit}
                                                className="hover:text-green-500 hover:underline mx-2"
                                            >
                                                cancel
                                            </button>
                                            • enter to
                                            <button
                                                onClick={handleSaveEdit}
                                                className="hover:text-green-500 hover:underline mx-2"
                                            >
                                                save
                                            </button>
                                        </span>
                                    ) : message.timestamp !==
                                      message.lastModified ? (
                                        `Edited on ${new Date(
                                            message.lastModified
                                        ).toLocaleDateString("en-GB")}`
                                    ) : (
                                        message.time
                                    )}
                                </span>
                            </div>
                        </div>
                    );
                })}
                <div ref={scrollRef}></div>
                <Popup
                    open={messageToDelete !== null}
                    closeOnDocumentClick
                    onClose={() => setMessageToDelete(null)}
                >
                    <div className="p-4 bg-white rounded-md shadow-md">
                        <p className="lead" style={{ fontWeight: "bold" }}>
                            Are you sure you want to delete this message?
                        </p>
                        <div className="mt-4 flex justify-end gap-2">
                            <button
                                className="btn btn-secondary"
                                style={{ marginRight: "10px" }}
                                onClick={() => setMessageToDelete(null)}
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
                                onClick={handleDelete}
                            >
                                <i className="fas fa-trash"></i>
                                &nbsp; Delete
                            </button>
                        </div>
                    </div>
                </Popup>
            </div>
            <ChatInput sendMessage={handleSend} />
        </div>
    );
}
