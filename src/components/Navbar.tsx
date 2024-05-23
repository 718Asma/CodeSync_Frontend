import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark, faCog, faComments, faEnvelope, faHouse, faUser } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faCopyright as faCopyrightRegular } from '@fortawesome/free-regular-svg-icons';

library.add(faBookmark, faCog, faComments, faEnvelope, faHouse, faUser, faCopyrightRegular);

const Navbar = () => {
    const userId = localStorage.getItem("user_id");

    return (
        <nav className="p-7 w-1/6 nav flex flex-col justify-between h-full">
            <div className="flex flex-col items-start">
                <div className="flex items-center mb-2">
<<<<<<< HEAD
                    <img src="../assets/logo.png" alt="logo" className=" mr-2" />
                    {/* <p className="logo">Iris</p> */}
=======
                    <img src="../assets/Untitled-2-02.png" alt="CodeSync" className="mr-2" />
>>>>>>> 49ebd5bf54069dac826cf0e46b0c277b927b23ed
                </div>
                <a
                    href="/"
                    className="button mb-1 my-2 home-button"
                >
                    <FontAwesomeIcon icon={faHouse} />&nbsp;
                    Home
                </a>
                <a
                    href={`/user/profile/${userId}`}
                    className="button mb-1 my-2"
                >
                    <FontAwesomeIcon icon={faUser} />&nbsp;
                    Profile
                </a>
                <a
                    href="/"
                    className="button mb-1 my-2"
                >
                    <FontAwesomeIcon icon={faBookmark} />&nbsp;
                    Saved
                </a>
                <a
                    href="/discover"
                    className="button mb-1 my-2"
                >
                    <FontAwesomeIcon icon={faComments} />&nbsp;
                    Explore
                </a>
                <a
                    href="/chat"
                    className="button mb-1 my-2"
                >
                    <FontAwesomeIcon icon={faEnvelope} />&nbsp;
                    Message
                </a>
                <a
                    href="/"
                    className="button mb-1 my-2"
                >
                    <FontAwesomeIcon icon={faCog} />&nbsp;
                    Setting
                </a>
            </div>
            <div className="mt-auto" style={{fontSize:'12px'}}>
                CodeSync <FontAwesomeIcon icon={faCopyrightRegular} /> Copyright 2024
            </div>
        </nav>
    );
};

export default Navbar;
