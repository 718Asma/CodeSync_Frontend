import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignIn, faSignOut } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from 'react-router-dom';

const Sidebar = ( ) => {
    const navigate = useNavigate();
    
    const user = localStorage.getItem("username");

    const handleLogout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user_id");
        localStorage.removeItem("username");
        navigate("/auth/login");
    };

    return (
        <aside className="w-1/6 side">
            <div>
                <div className="flex items-center mx-7 mt-7">
                    <img src="../assets/ooga.png" alt="Profile pic" className="mr-2" style={{ height: '50px', width: '50px' }} />
                    <div>
                        <p className='font-semibold'>{user}</p>
                        <button
                            className="info"
                            onClick={handleLogout}
                            style={{ color: '#ED080B' }}
                        >
                            <FontAwesomeIcon icon={faSignOut} />&nbsp;
                            Log Out
                        </button>
                    </div>
                </div>
                <p className="info mx-7">Hi, I am a graphic designer</p>
                <br/>
                <div className="flex items-center mb-4">
                    <p className="follow w-full"><span>427</span> Followers</p>
                    <p className="follow w-full"><span>845</span> Following</p>
                </div>
            </div>
                <div className='mx-7'>
                    <p style={{fontWeight : 'bold', fontSize:'20px'}}>Trending Topics</p>
                    <ol>
                        <li><a>#Programming</a></li>
                        <li>#Python</li>
                        <li>#C++</li>
                        <li>#PHP</li>
                        <li>#meme</li>
                        <li>#OOP</li>
                        <li>#SpringBoot</li>
                        <li>#Node_Js</li>
                    </ol>
                </div>
            <br/>
            <div className='mx-7'>
                <p style={{fontWeight : 'bold', fontSize:'20px'}}>Friends</p>
                
            </div>
        </aside>
    );
}

export default Sidebar;
