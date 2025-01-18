import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { GoogleOAuthProvider } from "@react-oauth/google";

import "@mantine/core/styles.css";
import { createTheme, MantineProvider } from "@mantine/core";

import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Chat from "./pages/Chat";
import Discover from "./pages/Discover";
import ChatGPT from "./pages/ChatGPT";
import DiscussionPage from "./pages/DiscussionPage";
import PostPage from "./pages/PostPage";
import ErrorPage from "./pages/ErrorPage";
import AccountSettings from "./components/settingsComponents/AccountSettings";
import SecuritySettings from "./components/settingsComponents/SecuritySettings";
import Saved from "./pages/Saved";

// const theme = createTheme({
//     /** Put your mantine theme override here */
// });

function App() {
    return (
        <MantineProvider>
            <GoogleOAuthProvider clientId={import.meta.env.VITE_CLIENT_ID}>
                <Router>
                    <div>
                        <Routes>
                            <Route path="/auth">
                                <Route path="login" element={<Login />} />
                                <Route path="signup" element={<Signup />} />
                            </Route>
                            <Route
                                path="/" 
                                element={<Home />}
                            ></Route>
                            <Route
                                path="/post/:postId"
                                element={<PostPage />}
                            ></Route>
                            <Route
                                path="/discover"
                                element={<Discover />}
                            ></Route>
                            <Route
                                path="/discussion/:discussionId"
                                element={<DiscussionPage />}
                            ></Route>
                            <Route
                                path="/user/profile/:userId"
                                element={<Profile />}
                            ></Route>
                            <Route 
                                path="/chat" 
                                element={<Chat />}
                            ></Route>
                            <Route
                                path="/chatgpt"
                                element={<ChatGPT />}
                            />
                            <Route
                                path="/saved/:userId"
                                element={<Saved />}
                            />
                            <Route path="/settings">
                                <Route path="account" element={<AccountSettings />} />
                                <Route path="security" element={<SecuritySettings />} />
                            </Route>
                            <Route
                                path="*"
                                element={<ErrorPage />}
                            />
                        </Routes>
                    </div>
                </Router>
            </GoogleOAuthProvider>
        </MantineProvider>
    );
}

export default App;