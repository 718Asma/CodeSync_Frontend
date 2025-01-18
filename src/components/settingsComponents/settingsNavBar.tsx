import { NavLink, useNavigate } from "react-router-dom";

import { faArrowLeft, faLock, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopyright as faCopyrightRegular } from '@fortawesome/free-regular-svg-icons';

const settingsNavBar = () => {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1);
    };

    return (
        <nav className="p-7 w-1/6 nav flex flex-col justify-between h-full">
            <div className="flex flex-col items-start">
                <FontAwesomeIcon 
                    style={{ marginRight: '2%', color: '#ED080B', cursor: 'pointer'}} 
                    onClick={handleGoBack}
                    size="lg"
                    icon={faArrowLeft}
                />
                <div className="flex items-center mb-2">
                    <img src="../assets/Untitled-2-02.png" alt="CodeSync" className="mr-2" />
                </div>
                <br/>
                <NavLink
                    to="/settings/account"
                    className="button mb-4"
                    style={{backgroundColor: window.location.pathname === '/settings/account' ? '#7808ED' : '', color: window.location.pathname === '/settings/account' ? 'white' : ''}}
                >
                    <FontAwesomeIcon icon={faUser} />&nbsp;
                    Account
                </NavLink>
                <NavLink
                    to="/settings/security"
                    className="button mb-4"
                    style={{backgroundColor: window.location.pathname === '/settings/security' ? '#7808ED' : '', color: window.location.pathname === '/settings/security' ? 'white' : ''}}
                >
                    <FontAwesomeIcon icon={faLock} />&nbsp;
                    Security
                </NavLink>
            </div>
            <div className="mt-auto" style={{fontSize:'12px'}}>
                CodeSync <FontAwesomeIcon icon={faCopyrightRegular} /> Copyright 2024
            </div>
        </nav>
    );
};

export default settingsNavBar;