import { useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";
import { uploadProfileImage } from "../../services/userService";

function ProfileImageUpload() {
    const [file, setFile] = useState(null);
    const [imagePath, setImagePath] = useState("");

    const handleFileChange = (e: any) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        try {
            const response = await uploadProfileImage(file!);
            console.log(response.data);
            
            setImagePath(response.data.filePath);
        } catch (error) {
            console.error("Error uploading file:", error);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label
                    htmlFor="photo"
                    className="cursor-pointer bg-primary-400 hover:bg-primary-300 text-lg text-white font-semibold py-2 px-4  rounded-lg"
                >
                    <FontAwesomeIcon icon={faImage} />&nbsp;Change Photo
                    <input type="file" id="photo" className="hidden" onChange={handleFileChange} />
                </label>
                <button type="submit">Upload</button>
            </form>
            {/* here is the image:
            {imagePath && (
                <img src={`http://localhost:3000/${imagePath}`} alt="Profile" />
            )} */}
        </div>
    );
}

export default ProfileImageUpload;
