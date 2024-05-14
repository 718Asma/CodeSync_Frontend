import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faBookmark, faCog, faComments, faEnvelope, faHouse, faUser, faUsers } from "@fortawesome/free-solid-svg-icons";

const Navbar = ( userId:any ) => {

    return (
        <nav className="p-7 w-1/6 nav">
            <div className="flex flex-col items-start">
                <div className="flex items-center mb-2">
                    <img src="../assets/iris.png" alt="Iris" className=" mr-2" />
                    {/* <p className="logo">Iris</p> */}
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
                    href={`/user/profile/${userId}`}
                    className="button mb-1 home-button"
                    >
                    <FontAwesomeIcon icon={faUser} />&nbsp;
                    Profile
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
        </nav>
    );
};

export default Navbar;
