import { faComments, faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type ProfilePostProps = {
    data: any;
};
const ProfilePost = ({ data }: ProfilePostProps) => {
    return (
        <div>
            {data && (
                <div style={{boxShadow: '5px 0px 10px rgba(0, 0, 0, 0.1)', width: "800px", position: "relative"}} className="pb-4 rounded-xl bg-white ">
                <div style={{display: "flex", flexDirection: "column"}}>
                    <div style={{height: "100px",marginLeft:"50px",marginRight:"50px"}} className="flex items-center pr-5">
                        <img src={`http://localhost:3000/${data.data.profileImage}`} style={{height: "80px", width: "80px", objectFit: "cover", borderRadius: "50%"}} className="bg-white rounded-full"/>
                        
                        <div style={{marginLeft: "20px"}}>
                            <p className="font-bold text-md text-gray-700">{data.data.username}</p>
                            <p className="text-sm text-gray-500">15 mins ago</p>
                            <a className="cursor-pointer text-xs text-secondary-300 hover:text-secondary"><FontAwesomeIcon icon={faComments}/>&nbsp;Is PHP Dead?</a>
                        </div>
                        <button className="text-xl ml-auto"><FontAwesomeIcon icon={faEllipsis}/></button>
                    </div>
                    <div style={{boxShadow: '5px 0px 10px rgba(0, 0, 0, 0.1)', width: "700px", height: "400px", margin: "auto"}} className="rounded-xl overflow-hidden">
                        <img src="../../assets/maxresdefault.png" style={{width: "100%", height: "100%", objectFit: "cover"}} alt="Post"/>
                    </div>
                </div>
            </div>
            
            )}
        </div>
    );
};

export default ProfilePost;
