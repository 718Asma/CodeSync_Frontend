import { useState } from "react";
import axios from "../../utils/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";

type ProfileEditProps = {
    data: any;
};

const ProfileEdit = ({ data }: ProfileEditProps) => {
    const [file, setFile] = useState<File | null>(null);
    const [imagePath, setImagePath] = useState("");

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);

            const reader = new FileReader();
            reader.onload = () =>{
                setImagePath(reader.result as string);

            };
            reader.readAsDataURL(selectedFile);

        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (file) {
            const formData = new FormData();
            formData.append("profileImage", file);

            try {
                console.log(formData.get("profileImage"));
                const response = await axios.post(
                    "/user/upload-profile-image",
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
        }

        const form = e.currentTarget;
        const profileDetails = {
            fullName: form.fullName.value,
            occupation: form.occupation.value,
            email: form.email.value,
            address: form.address.value,
            dateOfBirth: form.dateOfBirth.value,
            gender: form.gender.value,
            bio: form.bio.value,
            profileImage: imagePath,  // or the URL from response if needed
        };
        
        const TrimmedProfileDetails = Object.entries(profileDetails).reduce((acc: any, [key, value]) => {
            if (value !== '') {
                acc[key] = value;
            }
            return acc;
        }, {});
        
        console.log(TrimmedProfileDetails);
        console.log(profileDetails);
        
        try {
            const response = await axios.post("user/update-profile-details", TrimmedProfileDetails);
            console.log(response.data);
        } catch (error) {
            console.error("Error updating profile details:", error);
        }
    };

    return (
        <div>
            {data && (
                <form onSubmit={handleSubmit}>
                    <div className="container mx-auto px-4 py-8 bg-gray-100">
                        <div className="mx-auto flex justify-around items-center space-x-5">
                            <div>
                                <img 
                                    style={{ width: "140px", height: "140px", objectFit: "cover" }} 
                                    className="rounded-xl mb-3" 
                                    src={imagePath || `http://localhost:3000/${data.data.profileImage}`} 
                                    alt="" 
                                />
                                <label
                                    style={{ width: "140px" }}
                                    htmlFor="photo"
                                    className="cursor-pointer bg-white hover:bg-primary hover:text-white hover:border-transparent text-primary border border-primary font-semibold py-2 px-2 rounded-lg"
                                >
                                    <FontAwesomeIcon icon={faImage} />&nbsp;Change Photo
                                    <input type="file" id="photo" className="hidden" onChange={handleFileChange} />
                                </label>
                            </div>
                            <div style={{ width: "80%" }} className="m-auto">
                                <label className="block text-gray-700 text-sm font-bold mb-2 pt-5" htmlFor="bio">
                                    Bio:
                                </label>
                                <textarea
                                    style={{ width: "100%", height: "140px", resize: "none" }}
                                    className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="bio"
                                    name="bio"
                                    placeholder="Write something about yourself" 
                                />
                            </div>
                        </div>
                        <br />
                        <hr />
                        <br />
                        <div style={{ width: "100%" }} className="flex justify-around flex-wrap">
                            <div style={{ width: "40%" }}>
                                <label className="block text-gray-700 text-sm font-bold mb-2 pt-5" htmlFor="fullName">
                                    Full name:
                                </label>
                                <input
                                    style={{ width: "100%" }}
                                    className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    type="text"
                                    id="fullName"
                                    name="fullName"
                                    placeholder="Enter your full name"
                                />
                            </div>
                            <div style={{ width: "40%" }}>
                                <label className="block text-gray-700 text-sm font-bold mb-2 pt-5" htmlFor="occupation">
                                    Occupation:
                                </label>
                                <input
                                    style={{ width: "100%" }}
                                    className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    type="text"
                                    id="occupation"
                                    name="occupation"
                                    placeholder="Choose an occupation"
                                />
                            </div>
                            <div style={{ width: "40%" }}>
                                <label className="block text-gray-700 text-sm font-bold mb-2 pt-5" htmlFor="email">
                                    Email:
                                </label>
                                <input
                                    style={{ width: "100%" }}
                                    className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    type="text"
                                    id="email"
                                    name="email"
                                    placeholder="Choose an email"
                                />
                            </div>
                            <div style={{ width: "40%" }}>
                                <label className="block text-gray-700 text-sm font-bold mb-2 pt-5" htmlFor="address">
                                    Address:
                                </label>
                                <input
                                    style={{ width: "100%" }}
                                    className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    type="text"
                                    id="address"
                                    name="address"
                                    placeholder="Choose an address"
                                />
                            </div>
                            <div style={{ width: "40%" }}>
                                <label className="block text-gray-700 text-sm font-bold mb-2 pt-5" htmlFor="dateOfBirth">
                                    Date of Birth:
                                </label>
                                <input
                                    style={{ width: "100%" }}
                                    className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    type="date"
                                    id="dateOfBirth"
                                    name="dateOfBirth"
                                />
                            </div>
                            <div style={{ width: "40%" }}>
                                <label className="block text-gray-700 text-sm font-bold mb-2 pt-5" htmlFor="gender">
                                    Gender:
                                </label>
                                <select
                                    style={{ width: "100%" }}
                                    className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="gender"
                                    name="gender"
                                >
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div style={{ float: "right" }}>
                        <button
                            type="button"
                            className="cursor-pointer bg-white hover:bg-secondary hover:text-white hover:border-transparent text-secondary border border-secondary font-semibold py-2 px-2 rounded-lg mx-1"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit"
                            className="cursor-pointer bg-secondary border border-secondary text-white font-semibold py-2 px-2 rounded-lg"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            )}
            <br />
        </div>
    );
};

export default ProfileEdit;
