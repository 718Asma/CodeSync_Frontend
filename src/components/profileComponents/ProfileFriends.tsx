import { Link } from "react-router-dom";

type ProfileFriendsProps = {
    data: any;
};
const ProfileFriends = ({ data }: ProfileFriendsProps) => {
    
    return (
        <div>
            {data && (
                <div style={{ boxShadow: '5px 0px 10px rgba(0, 0, 0, 0.1)', width: "350px" }} className=" bg-white rounded-lg p-4 mb-4">
                    <h3 className="text-lg font-semibold text-primary mb-2">Friends</h3>
                    <div className="flex justify-between flex-wrap justify-start">
                        {data.friends.map((friend: any, index: number) => (
                            <Link to={`/user/profile/${friend._id}`} style={{width:"100px"}} key={index} className=" cursor-pointer mx-4 hover:text-secondary ">
                                <img src={friend.profileImage} style={{height:"100px",width:"100px",objectFit: "cover" }}  className="bg-white rounded-lg"/>
                                <p className="text-sm flex justify-center mt-1" style={{width:"100px"}}>{friend.fullName}</p>  
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileFriends;
