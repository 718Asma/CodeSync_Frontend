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
import { createTheme, MantineProvider } from "@mantine/core";

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
                        </Routes>
                    </div>
                </Router>
            </GoogleOAuthProvider>
        </MantineProvider>
    );
}

export default App;
