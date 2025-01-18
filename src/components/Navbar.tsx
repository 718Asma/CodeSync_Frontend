import { NavLink } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark, faCog, faComments, faEnvelope, faHouse, faUser } from "@fortawesome/free-solid-svg-icons";
import { faCopyright as faCopyrightRegular } from '@fortawesome/free-regular-svg-icons';


const Navbar = () => {
    const userId = localStorage.getItem("user_id");

    return (
        <nav className="p-7 w-1/6 nav flex flex-col justify-between h-full">
            <div className="flex flex-col items-start">
                <div className="flex items-center mb-2">
                    <img src="../assets/Untitled-2-02.png" alt="CodeSync" className="mr-2" />
                </div>
                <NavLink
                    to="/"
                    className="button mb-1 my-2 home-button"
                    style={{backgroundColor: window.location.pathname === '/' ? '#7808ED' : '', color: window.location.pathname === '/' ? 'white' : ''}}
                >
                    <FontAwesomeIcon icon={faHouse} />&nbsp;
                    Home
                </NavLink>
                <NavLink
                    to={`/user/profile/${userId}`}
                    className="button mb-1 my-2"
                    style={{backgroundColor: window.location.pathname === `/user/profile/${userId}` ? '#7808ED' : '', color: window.location.pathname === `/user/profile/${userId}` ? 'white' : ''}}
                >
                    <FontAwesomeIcon icon={faUser} />&nbsp;
                    Profile
                </NavLink>
                <NavLink
                    to={`/saved/${userId}`}
                    className="button mb-1 my-2"
                    style={{backgroundColor: window.location.pathname === `/saved/${userId}` ? '#7808ED' : '', color: window.location.pathname === `/saved/${userId}` ? 'white' : ''}}
                >
                    <FontAwesomeIcon icon={faBookmark} />&nbsp;
                    Saved
                </NavLink>
                <NavLink
                    to="/discover"
                    className="button mb-1 my-2"
                    style={{backgroundColor: window.location.pathname === '/discover' ? '#7808ED' : '', color: window.location.pathname === '/discover' ? 'white' : ''}}
                >
                    <FontAwesomeIcon icon={faComments} />&nbsp;
                    Explore
                </NavLink>
                <NavLink
                    to="/chat"
                    className="button mb-1 my-2"
                    style={{backgroundColor: window.location.pathname === '/chat' ? '#7808ED' : '', color: window.location.pathname === '/chat' ? 'white' : ''}}
                >
                    <FontAwesomeIcon icon={faEnvelope} />&nbsp;
                    Message
                </NavLink>
                <NavLink
                    to={`/settings/account`}
                    className="button mb-1 my-2"
                    style={{backgroundColor: window.location.pathname === '/settings/account' ? '#7808ED' : '', color: window.location.pathname === '/settings/account' ? 'white' : ''}}
                >
                    <FontAwesomeIcon icon={faCog} />&nbsp;
                    Settings
                </NavLink>
            </div>
            <div className="mt-auto" style={{fontSize:'12px'}}>
                CodeSync <FontAwesomeIcon icon={faCopyrightRegular} /> Copyright 2024
            </div>
        </nav>
    );
};

export default Navbar;
