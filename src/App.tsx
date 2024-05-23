import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";

import Profile from "./pages/Profile";

import { GoogleOAuthProvider } from "@react-oauth/google";
import Chat from "./pages/Chat";
import Discover from "./pages/Discover";
import ChatGPT from "./pages/ChatGPT";

import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import { createTheme, MantineProvider } from "@mantine/core";
import DiscussionForm from "./forms/DiscussionForm";

import { Notifications } from "@mantine/notifications";
import PostForm from "./forms/PostForm";

// const theme = createTheme({
//     /** Put your mantine theme override here */
// });

function App() {
    return (
        <MantineProvider>
            <Notifications />
            <GoogleOAuthProvider clientId={import.meta.env.VITE_CLIENT_ID}>
                <Router>
                    <div>
                        <Routes>
                            <Route
                                path="/auth/login"
                                element={<Login />}
                            ></Route>
                            <Route
                                path="/auth/signup"
                                element={<Signup />}
                            ></Route>
                            <Route path="/" element={<Home />}></Route>
                            <Route
                                path="/discover"
                                element={<Discover />}
                            ></Route>
                            <Route
                                path="/user/profile/:userId"
                                element={<Profile />}
                            ></Route>
                            <Route path="/chat" element={<Chat />}></Route>
                            <Route path="/chatgpt" element={<ChatGPT />} />{" "}
                            {/* Add this line */}
                            <Route
                                path="discussion/create"
                                element={<DiscussionForm />}
                            />{" "}
                            <Route path="post/create" element={<PostForm />} />{" "}
                        </Routes>
                    </div>
                </Router>
            </GoogleOAuthProvider>
        </MantineProvider>
    );
}

export default App;
