import { useState } from "react";
import Popup from "reactjs-popup";
import { toast } from "react-toastify";

import ReportForm from "../../forms/ReportForm";
import { deletePost } from "../../services/postService";

interface OptionsProps {
	postId: string;
	ownerId: string;
}

const Options: React.FC<OptionsProps> = ({ postId, ownerId }) => {
    const [reportPopupOpen, setReportPopupOpen] = useState(false);
    const [deletePopupOpen, setDeletePopupOpen] = useState(false);

    const togglePopup = (popupType: string) => {
        switch (popupType) {
            case "report":
                setReportPopupOpen((prev) => !prev);
                break;
            case "delete":
                setDeletePopupOpen((prev) => !prev);
                break;
            default:
                break;
        }
    };

    const handleClose = (popupType: string) => {
        switch (popupType) {
            case "report":
                setReportPopupOpen(false);
                break;
            case "delete":
                setDeletePopupOpen(false);
                break;
            default:
                break;
        }
    };

    const handleDelete = async () => {
        try {
            const response = await deletePost(postId);
            console.log("Deleted", response);

            toast.error("Post deleted successfully!");
            handleClose("delete");
            window.location.reload();
        } catch (error) {
            console.error(error);
        }
    };
    
	return (
        <>
            <Popup
                trigger={<button style={{ color: "#818181" }}>
                    {" "}
                    <i className="fa fa-ellipsis-v"></i>{" "}
                </button>}
                position="bottom center"
                contentStyle={{ width: "9%" }}
            >
                {ownerId === localStorage.getItem("user_id") &&
                    <button
                        style={{ color: "#818181", marginBottom: "10px" }}
                        onClick={() => togglePopup("delete")}
                    >
                        {" "}
                        <i className="fa fa-trash"></i>{" "}
                        Delete Post{" "}
                    </button>
                }
                <button
                    style={{ color: "#818181" }}
                    onClick={() => togglePopup("report")}
                >
                    {" "}
                    <i className="fa fa-flag"></i>
                    {" "} Report Post{" "}
                </button>
            </Popup>
            <Popup
                trigger={<div></div>}
                open={reportPopupOpen}
                modal
                nested
                closeOnDocumentClick={false}
                closeOnEscape={false}
                onClose={() => handleClose("report")}
                contentStyle={{
                    width: "50%",
                    borderRadius: "10px",
                    padding: "20px",
                }}
            >
                <ReportForm
                    reported={postId}
                    reportedType="post"
                    closePopup={() => handleClose("report")} />
            </Popup>
            <Popup
                trigger={<div></div>}
                open={deletePopupOpen}
                modal
                nested
                closeOnDocumentClick={false}
                closeOnEscape={false}
                onClose={() => handleClose("delete")}
                contentStyle={{
                    width: "auto",
                    height: "auto",
                }}
            >
                <div className="p-4 bg-white rounded-md shadow-md">
                    <p className="lead" style={{ fontWeight: "bold" }}>
                        Are you sure you want to delete this post?
                    </p>
                    <div className="mt-4 flex justify-end gap-2">
                        <button
                            className="btn btn-secondary"
                            style={{ marginRight: "10px" }}
                            onClick={() => handleClose("delete")}
                        >
                            <i
                                className="fa fa-times"
                                aria-hidden="true"
                            ></i>
                            &nbsp; Cancel
                        </button>
                        <button
                            className="btn btn-danger"
                            style={{ marginRight: "10px" }}
                            onClick={handleDelete}
                        >
                            <i className="fas fa-trash"></i>
                            &nbsp; Delete
                        </button>
                    </div>
                </div>
            </Popup>
        </>
	);
};

export default Options;