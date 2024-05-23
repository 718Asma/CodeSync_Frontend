import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";

import Profile from "./pages/Profile";

import { GoogleOAuthProvider } from "@react-oauth/google";
import Chat from "./pages/Chat";
import DiscussionPage from "./pages/Discussion";

function App() {
    return (
        <GoogleOAuthProvider clientId={import.meta.env.VITE_CLIENT_ID}>
            <Router>
                <div>
                    <Routes>
                        <Route path="/auth/login" element={<Login />}></Route>
                        <Route path="/auth/signup" element={<Signup />}></Route>
                        <Route path="/" element={<Home />}></Route>
                        <Route
                            path="/user/profile/:userId"
                            element={<Profile />}
                        ></Route>
                        <Route path="/chat" element={<Chat />}></Route>
                        <Route path="/discussion" element={<DiscussionPage />}></Route>
                    </Routes>
                </div>
            </Router>
        </GoogleOAuthProvider>
    );
}

export default App;
