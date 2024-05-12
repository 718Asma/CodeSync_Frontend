import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from "@fortawesome/free-solid-svg-icons";

interface SidebarProps
{
    user: string | null;
    userId: string | null;
}

const Sidebar: React.FC<SidebarProps> = ({ user, userId }) => {
    return (
        <aside className="p-7 w-1/4 side">
            <div>
                <div className="flex items-center">
                    <img src="../assets/ooga.png" alt="Profile pic" className="mr-2" style={{ height: '50px', width: '50px' }} />
                    <div>
                        <p style={{ fontWeight: 'bold', marginBottom: '0' }}>{user}</p>
                        <a
                            className="info"
                            href={`/user/profile/${userId}`}
                            style={{ color: '#7808ED' }}
                        >
                            Edit Profile&nbsp;
                            <FontAwesomeIcon icon={faPen} />
                        </a>
                    </div>
                </div>
                <p className="info">Hi, I am a graphic designer</p>
                <br/>
                <div className="flex items-center mb-4">
                    <p className="follow"><span>427</span> Followers</p>
                    <p className="follow"><span>845</span> Following</p>
                </div>
            </div>
            <div>
                <p style={{fontWeight : 'bold', fontSize:'20px'}}>Trending Topics</p>
                <ol>
                    <li>#Programming</li>
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
            <div>
                <p style={{fontWeight : 'bold', fontSize:'20px'}}>Friends</p>
                
            </div>
        </aside>
    );
}

export default Sidebar;
