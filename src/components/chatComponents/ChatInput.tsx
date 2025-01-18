type ChatInputProps = {
    sendMessage: (message: string) => void;
};
import { useState } from "react";
// import { MdOutlineEmojiEmotions } from "react-icons/md";
// import { IoMdSend } from "react-icons/io";

// import Picker from "emoji-picker-react";

// import styled from "styled-components";

export default function ChatInput(props: ChatInputProps) {
    const [msg, setMsg] = useState("");

    // const [showPicker, setShowPicker] = useState(false);

    const sendChat = (e: any) => {
        e.preventDefault();
        if (msg.length > 0) {
            props.sendMessage(msg);
            setMsg("");
        }
    };

    return (
        <div className="input-container">
            <form
                onSubmit={(e) => sendChat(e)}
                className="flex items-center gap-2"
            >
                {/* Emoji button - Uncomment if needed */}
                {/* <div>
                    <button type="button" onClick={() => setShowPicker(!showPicker)} className="text-gray-500 focus:outline-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19c-4.634 0-8.396-3.126-8.396-7S7.366 5 12 5s8.396 3.126 8.396 7-3.762 7-8.396 7zM12 9a2 2 0 100-4 2 2 0 000 4z" />
                        </svg>
                    </button>
                </div> */}
                <input
                    type="text"
                    value={msg}
                    onChange={(e) => setMsg(e.target.value)}
                    placeholder="Message"
                    className="flex-grow px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-gray-300"
                />
                <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-[#7808ED] text-white hover:bg-[#4a0594] focus:outline-none focus:bg-[#4a0594]"
                >
                    Send
                </button>
            </form>
        </div>
    );
}
// const EmojiContainer = styled.div`

//   position : absolute;
//   margin-top : 7.1rem;
//   margin-left : 30px;
//   z-index:1;

// `
// const Container = styled.div`
//   display : flex;
//   align-items: center;
//   justify-content : center;
//   background-color: #ededea;
//   padding: 0 2rem;
//   @media screen and (min-width: 720px) and (max-width: 1080px) {
//     padding: 0 2rem;
//     gap: 1rem;
//   }

//   .input-container {
//     width: 100%;
//     border-radius: 0.5rem;
//     border-top-right-radius : 3rem;
//     border-bottom-right-radius : 3rem;
//     display: flex;
//     align-items: center;
//     gap: 2rem;
//     background-color : white;
//     .emoji {
//       position: relative;
//       margin-top : 0.4rem;
//       margin-left : 1rem;
//       svg {
//         color : #A8A8A8;
//         font-size: 1.5rem;
//         cursor: pointer;
//       }

//     }
//     input {
//       width: 100%;
//       height: 60%;
//       background-color: white;
//       color: grey;
//       border: none;
//       border-radius : 0.2rem;
//       font-size: 1.2rem;
//       &::placeholder{
//         font-size : 1rem;
//       }
//       &::selection {
//         background-color: #9a86f3;
//       }
//       &:focus {
//         outline: none;
//       }
//     }
//     button {
//       border-radius: 0.5rem;
//       width : 4rem;
//       height : 2.5rem;
//       display: flex;
//       justify-content: center;
//       align-items: center;
//       background-color: #128c7e;
//       border: none;
//       @media screen and (min-width: 720px) and (max-width: 1080px) {
//         svg {
//           font-size: 1.5rem;
//         }
//       }
//       svg {
//         font-size: 1.5rem;
//         color: white;
//       }
//     }
//   }
// `;
