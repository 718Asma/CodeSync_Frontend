import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Signup from "./components/Signup";
import Login from "./components/Login";

import Profile from "./components/Profile";

import { GoogleOAuthProvider } from "@react-oauth/google";

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
                    </Routes>
                </div>
            </Router>
        </GoogleOAuthProvider>
    );
}

export default App;
