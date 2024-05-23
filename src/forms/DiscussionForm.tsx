import { useState } from "react";
import axios from "../utils/axios";

const DiscussionForm = () => {
    const [title, setTitle] = useState("");
    console.log("Title:", title);
    const [description, setDescription] = useState("");
    console.log("Description:", description);
    const [banner, setBanner] = useState<File | null>();
    console.log("Banner:", banner);
    const [errors, setErrors] = useState({ title: "", description: "" });
    console.log("Errors:", errors);

    const validateForm = () => {
        let valid = true;
        let errors = { title: "", description: "" };

        if (title.length < 5 || title.length > 50) {
            errors.title = "Title must be between 5 and 50 characters.";
            valid = false;
        }
        if (description.length < 5 || description.length > 100) {
            errors.description =
                "Description must be between 5 and 100 characters.";
            valid = false;
        }

        setErrors(errors);
        return valid;
    };

    const onSubmit = async (e: any) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const formData = {
            title: title,
            description: description,
        };

        console.log("Form data:", formData);

        try {
            const response = await axios.post("/discussion/create", formData);
            console.log("Discussion created:", response.data);
            const discussionId = response.data.discussion._id;

            if (banner) {
                const res = await axios.put(
                    `/discussion/change-banner`,
                    { banner: banner, discussionId: discussionId },
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );
                console.log(res);
            }
        } catch (error) {
            console.error("Error creating discussion:", error);
        }
    };

    return (
        <form onSubmit={onSubmit}>
            <div>
                <label htmlFor="title">Title</label>
                <input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                {errors.title && <p>{errors.title}</p>}
            </div>

            <div>
                <label htmlFor="description">Description</label>
                <input
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                {errors.description && <p>{errors.description}</p>}
            </div>

            <div>
                <label htmlFor="banner">Banner</label>
                <input
                    id="banner"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                            setBanner(e.target.files[0]);
                        } else {
                            setBanner(null); // or handle the null case as needed
                        }
                    }}
                />
            </div>

            <button type="submit">Create Discussion</button>
        </form>
    );
};

export default DiscussionForm;
