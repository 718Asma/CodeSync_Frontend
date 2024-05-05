import { useState, useEffect, useRef } from "react";
import axios from "../utils/axios";
// import styled from "styled-components";
import ChatInput from "./ChatInput";
// import { getMessageRoute, sendMessageRoute } from "../utils/APIroute";
import { v4 as uuidv4 } from "uuid";
// import { IoPersonCircle } from "react-icons/io5";

// import "react-toastify/dist/ReactToastify.css";

export default function ChatContainer(props: any) {
    const scrollRef = useRef<HTMLDivElement>();
    const [messages, setMessages] = useState<any>([]);
    const [incoming, setIncoming] = useState<any>(null);
    const OwnId = localStorage.getItem("user_id");

    const getAllMessages = async () => {
        // const user = localStorage.getItem("user_id"); // not needed

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
                        {props.currentChat.avatarImage ? (
                            <img
                                src={props.currentChat.avatarImage}
                                alt="avatarImage"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-gray-300"></div>
                        )}
                    </div>
                    <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-800">
                            {props.currentChat._id}: NAME TITLE
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

// const Container = styled.div`
//   display: grid;
//   grid-template-rows: 10% 75% 15%;
//   gap: 0.1rem;
//   overflow: hidden;
//   @media screen and (min-width: 720px) and (max-width: 1080px) {
//     grid-template-rows: 10% 75% 15%;
//   }
//   .chat-header {
//     display: flex;
//     justify-content: space-between;
//     align-items: center;
//     padding: 0 2rem 0 1rem;
//     background-color :#075e54;
//     border-left-width: medium
//     border-color : white;
//     .user-details {
//       display: flex;
//       align-items: center;
//       height : 0.5rem;
//       .avatar {
//         img {
//           height: 3rem;
//           width : 3rem;
//           border-radius : 3rem;
//         }
//         svg {
//           color : #A0A0A0;
//           font-size: 3rem;
//           cursor: pointer;
//         }
//       }
//       .username {
//         h3 {
//           color: white;
//         }
//       }
//     }
//   }
//   .chat-messages {
//     padding: 1rem 2rem;
//     display: flex;
//     flex-direction: column;
//     gap: 1rem;
//     overflow: auto;
//     color : black;
//     background-color : #ece5dd;
//     &::-webkit-scrollbar {
//       margin-top: 10px;
//       margin-bottom: 10px;
//       width: 0.2rem;

//       &-thumb {
//         background-color: grey;
//         width: 0.1rem;
//         border-radius: 1rem;
//       }
//     }
//     .message {
//       display: inline-block;
//       align-items: center;
//       height : 100%;
//       border-bottom-left-radius : 0.5rem;
//       border-bottom-right-radius : 0.5rem;
//       padding : 0.5rem;
//       .content {
//         overflow-wrap: break-word;
//         padding: 1rem;
//         font-size: 1.1rem;
//         border-radius: 1rem;
//         color: #d1d1d1;
//         @media screen and (min-width: 720px) and (max-width: 1080px) {
//           max-width: 70%;
//         }
//       }
//     }
//     .sended {
//       float : right;
//       justify-content: flex-end;
//       background-color: #dcf8c6;
//       padding-right : 1rem;
//       max-width : 60%;
//       border-top-left-radius: 0.5rem;
//     }
//     .recieved {
//       padding-left : 1rem;
//       justify-content: flex-start;
//       max-width : 60%;
//       background-color: #ffff;
//       border-top-right-radius: 0.5rem;
//     }
//   }
// `;
