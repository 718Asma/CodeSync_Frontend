import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { changeBanner, createDiscussion } from "../services/discussionService";
import { toast } from "react-toastify";

const DiscussionForm = () => {
    const navigate = useNavigate();

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

        try {
            const response = await createDiscussion(formData.title, formData.description);
            console.log("Discussion created:", response);

            const discussionId = response.discussion._id;

            if (banner) {
                const res = await changeBanner(banner, discussionId);
                console.log(res);
                navigate(`/discussion/${discussionId}`);
                toast.success("Discussion created successfully!");
            }
        } catch (error) {
            console.error("Error creating discussion:", error);
        }
    };

    return (
        <form onSubmit={onSubmit} className="container mt-5" style={{ marginLeft: '18%', padding: '3% 5% 5% 0%' }}>
            <div className="form-group" style={{marginBottom: '30px'}}>
                <label htmlFor="title" style={{fontWeight: 'bold', fontSize: '24px'}}>
                    <i className="fas fa-font"></i>&nbsp; Title
                </label>

                <input
                    id="title"
                    className="form-control"
                    style={{ width: '75%' }}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                {errors.title && <p>{errors.title}</p>}
            </div>

            <div className="form-group" style={{marginBottom: '30px'}}>
                <label htmlFor="description" style={{fontWeight: 'bold', fontSize: '24px'}}>
                    <i className="fas fa-align-left"></i>&nbsp; Description
                </label>

                <textarea
                    id="description"
                    className="form-control"
                    rows={5}
                    style={{ width: '75%' }}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                {errors.description && <p>{errors.description}</p>}
            </div>

            <div className="form-group" style={{marginBottom: '30px'}}>
                <p style={{fontWeight: 'bold', fontSize: '24px'}}><i className="fas fa-image"></i>&nbsp; Banner</p>
                <label
                    htmlFor="banner"
                    className="cursor-pointer font-semibold py-2"
                    style={{
                        backgroundColor: '#7808ED',
                        borderColor: '#7808ED',
                        height: '45px',
                        borderRadius: '10px',
                        color:'white',
                        textAlign: 'center',
                        padding: '5px',
                        marginTop: '10px',
                    }}
                >
                    Upload Banner
                <input
                    id="banner"
                    type="file"
                    className="form-control-file hidden"
                    accept="image/*"
                    onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                            setBanner(e.target.files[0]);
                        } else {
                            setBanner(null); // or handle the null case as needed
                        }
                    }}
                />
                </label>
            </div>

            <button
                type="submit"
                className="btn"
                style={{marginTop: '10px',
                        backgroundColor: '#ED080B',
                        borderColor: '#ED080B',
                        fontWeight: 'bold',
                        height: '45px',
                        borderRadius: '10px',
                        color:'white',
                        float: 'right',
                        marginRight: '17%',
                        marginBottom: '10px'
                    }}>
                <i className="fas fa-plus"></i>&nbsp; Create Discussion
            </button>
        </form>
    );
};

export default DiscussionForm;