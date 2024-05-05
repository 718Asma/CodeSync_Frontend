import { useState, useEffect } from "react";
// import Lottie from "lottie-react";
// import conversation from "../assets/animation_lnhbqvxp.json";
// import styled from "styled-components";

function NoSelectedContact() {
    const [user, setUser] = useState("");
    const getUser = () => {
        const existing = localStorage.getItem("user_id");
        if (existing) {
            setUser(existing);
        }
    };

    useEffect(
        () => {
            getUser();
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    return (
        <div className="flex flex-col items-center justify-center text-center">
            {/* <Lottie animationData={conversation} loop={true} /> */}
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
                Welcome, {user}!
            </h1>
            <h3 className="text-lg text-gray-600">
                Please select a chat to start messaging.
            </h3>
        </div>
    );
}

// const Container = styled.div`
//     display: flex;
//     justify-content: center;
//     align-items: center;
//     color: #128c7e;
//     flex-direction: column;
//     img {
//         height: 20rem;
//     }
//     span {
//         color: #4e0eff;
//     }
// `;

export default NoSelectedContact;
