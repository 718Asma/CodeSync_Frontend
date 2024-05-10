import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faBookmark, faCog, faComments, faEnvelope, faHouse, faSignIn, faUsers } from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user_id");
        navigate("/auth/login");
    };

    return (
        <nav className="p-7 w-1/4" style={{ boxShadow: '5px 0px 10px rgba(0, 0, 0, 0.1)' }}>
            <div className="flex flex-col items-start">
                <div className="flex items-center mb-2">
                    <img src="../assets/iris.jpg" alt="Iris" className="w-20 h-20 mr-2" />
                    <p className="logo">Iris</p>
                </div>
                <br/>
                <a
                    href="/"
                    style={{ backgroundColor: '#7808ED', color: '#fff'}}
                    className="button mb-1 home-button"
                    >
                    <FontAwesomeIcon icon={faHouse} />&nbsp;
                    Home
                </a>
                <a
                    href="/"
                    className="button mb-1"
                >
                    <FontAwesomeIcon icon={faBookmark}  />&nbsp;
                    Saved
                </a>
                <a
                    href="/"
                    className="button mb-1"
                >
                    <FontAwesomeIcon icon={faComments} />&nbsp;
                    Discussions
                </a>
                <a
                    href="/"
                    className="button mb-1"
                >
                    <FontAwesomeIcon icon={faUsers} />&nbsp;
                    Groups
                </a>
                <a
                    href="/chat"
                    className="button mb-1"
                >
                    <FontAwesomeIcon icon={faEnvelope} />&nbsp;
                    Message
                </a>
                <a
                    href="/"
                    className="button mb-1"
                >
                    <FontAwesomeIcon icon={faCog} />&nbsp;
                    Setting
                </a>
            </div>
            <button
                onClick={handleLogout}
                className="text-white px-4 py-2 rounded"
                style={{ backgroundColor : '#ED080B', marginTop: '80%'}}
            >
                <FontAwesomeIcon icon={faSignIn} />&nbsp;
                <i className="fa fa-sign-in login-button-icon"></i> &nbsp;
                Log Out
            </button>
        </nav>
    );
};

export default Navbar;
