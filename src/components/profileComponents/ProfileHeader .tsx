import axios from "axios";
import { useState } from "react";

type ProfileHeaderProps = {
    data: any;
};
const ProfileHeader = ({ data }: ProfileHeaderProps) => {
    const [file, setFile] = useState(null);
    const [imagePath, setImagePath] = useState("");
    const userId = localStorage.getItem("user_id");
    

    const handleFileChange = (e: any) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("coverImage", file!);

        try {
            console.log(formData.get("coverImage"));
            const response = await axios.post(
                "/user/upload-cover-image",
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );
            console.log(response.data);
            setImagePath(response.data.filePath);
        } catch (error) {
            console.error("Error uploading file:", error);
        }
    };    
    return (
        <div>
            {/* <h1 className="text-3xl font-bold mb-4">Profile</h1> */}
            {data && (
                <div style={{boxShadow: '5px 0px 10px rgba(0, 0, 0, 0.1)',width:"1200px",position: "relative"}} className="rounded-xl bg-white ">
                    <div style={{height:"300px",width:"1200px",  }} className=" bg-white-100 rounded-xl ">
                    <img src={`http://localhost:3000/${data.data.coverImage}`} alt=""style={{ width: "100%", height: "100%", objectFit: "cover" }} className="rounded-t-xl" />
                    <img src={`http://localhost:3000/${data.data.profileImage}`} style={{height:"150px",width:"150px",position: "absolute", top: "225px", left: "10%" ,objectFit: "cover" }}  className="bg-white rounded-full"/>
                    {/* <button
                     style={{width:"155px",position: "absolute", top: "225px", left: "81%" }}
                    className="bg-white hover:bg-secondary-500 text-primary-500 font-semibold hover:text-white py-2 px-4  rounded-lg">Edit Cover Photo</button> */}
                    {data.data._id==userId && ( <div>
                        <form onSubmit={handleSubmit}>
                        <label
                            style={{width:"155px",position: "absolute", top: "225px", left: "81%" }}
                            htmlFor="cover"
                            className="cursor-pointer bg-white hover:bg-secondary-500 text-primary-500 font-semibold hover:text-white py-2 px-4  rounded-lg"
                        >
                            Edit Cover Photo
                            <input type="file" id="cover" className="hidden" onChange={handleFileChange}  />
                        </label>
                        <button style={{float:"right"}} type="submit">Upload</button>
                    </form>
                    <button 
                    style={{float:"right",width:"155px",position: "absolute", top: "330px", left: "81%"}}
                    className="
                        bg-white 
                        text-secondary-500 
                        font-semibold  
                        py-2 px-4 
                        border border-secondary-500
                         rounded-lg 
                         hover:bg-secondary hover:text-white hover:border-transparent
                    ">
                        Edit Profile
                    </button>
                
                    </div> )
                    
                    }  
                    {data.data._id!=userId &&(
                        <div>
                            <button 
                                style={{
                                    float:"right",
                                    width:"155px",
                                    position: "absolute",
                                    top: "330px", 
                                    left: "81%"
                                }}
                                className="
                                    bg-white
                                    text-secondary-500
                                    font-semibold
                                    py-2 
                                    px-4 
                                    border border-secondary-500
                                     rounded-lg 
                                     hover:bg-secondary 
                                     hover:text-white 
                                     hover:border-transparent
                                ">
                                    Add Friend
                                </button>
                
                        </div>
                    )}
                    {imagePath && (
                <img src={`http://localhost:3000/${imagePath}`} alt="Profile" />
            )}
                    </div>
                <div style={{marginLeft:"25%",height:"100px"}} className="p-4 mt-2">
                    <p className="font-bold text-xl text-gray-700">{data.data.fullName}</p>
                    <p className="font-semibold text-md text-gray-700">{data.data.occupation}</p>
                </div>
                </div>
            )}
        </div>
    );
};

export default ProfileHeader;
