import ProfileImageUpload from "./ProfileImageUpload";

type ProfileEditProps = {
    data: any;
};
const ProfileEdit=({data} :ProfileEditProps)=>{

    return(
        <div>
            {data && (
            <div  className="container mx-auto px-4 py-8 bg-gray-100">
            <div className="flex items-center space-x-5">
                <img style={{width:"140px",height:"140px", objectFit:"cover"}} className="rounded-xl" src={`http://localhost:3000/${data.data.profileImage}`} alt="" />
                <div>
                <p className="text-xl font-semibold">{data.data.username}</p>
                <br />
                    <ProfileImageUpload/>
                </div>
            </div>
            <br />
            <hr />
            <br />
            <div style={{width:"100%"}} className="flex justify-around flex-wrap">
                <div style={{width:"40%"}}>
                    <label
                        className="block text-gray-700 text-sm font-bold mb-2 pt-5"
                        htmlFor="fullName">
                        Full name:
                    </label>
                    <input
                        style={{width:"100%"}}
                        className="shadow appearance-none border rounded  py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        type="text"
                        id="fullName"
                        name="fullName"
                        placeholder="Enter your full name"
                    />
                </div>
                <div style={{width:"40%"}}>
                    <label
                        className="block text-gray-700 text-sm font-bold mb-2 pt-5"
                        htmlFor="occupation">
                        Occupation:
                    </label>
                    <input
                        style={{width:"100%"}}
                        className="shadow appearance-none border rounded  py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        type="text"
                        id="occupation"
                        name="occupation"
                        placeholder="Choose an occupation"
                    />
                </div>
                <div style={{width:"40%"}}>
                    <label
                        className="block text-gray-700 text-sm font-bold mb-2 pt-5"
                        htmlFor="email">
                        Email:
                    </label>
                    <input
                        style={{width:"100%"}}
                        className="shadow appearance-none border rounded  py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        type="text"
                        id="email"
                        name="email"
                        placeholder="Choose an email"
                    />
                </div>
                <div style={{width:"40%"}}>
                    <label
                        className="block text-gray-700 text-sm font-bold mb-2 pt-5"
                        htmlFor="address">
                        Address:
                    </label>
                    <input
                        style={{width:"100%"}}
                        className="shadow appearance-none border rounded  py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        type="text"
                        id="address"
                        name="address"
                        placeholder="Choose an address"
                    />
                </div>
            </div>

        </div>)}
        </div>

    )






}

export default ProfileEdit;