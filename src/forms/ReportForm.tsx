import { useState } from "react";
import { toast } from "react-toastify";

import { createReport } from "../services/reportService";

type ReportFormProps = {
    reported: string;
    reportedType: string;
    closePopup: () => void;
}

const ReportForm: React.FC<ReportFormProps> = ({ reported, reportedType, closePopup }) => {
    const [desc, setDesc] = useState("");
    const [errors, setErrors] = useState({ desc: "" });

    const validateForm = () => {
        let valid = true;
        let errors = { desc: "" }; false;

        if (desc.length < 5 || desc.length > 100) {
            errors.desc =
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
    
            try {
                const createReportResponse = await createReport(reported, reportedType, desc);

                console.log("Report created successfully:", createReportResponse);
                toast.success(`${reportedType} reported successfully!`);
                closePopup();
            } catch (error) {
                console.error("Error creating report:", error);
            }
        };
    
    return (
        <form onSubmit={onSubmit} className="container mt-5" style={{ marginLeft: '18%', padding: '3% 5% 5% 0%' }}>
            <div className="form-group" style={{marginBottom: '30px'}}>
                <label htmlFor="desc" style={{fontWeight: 'bold', fontSize: '24px'}}>
                    <i className="fas fa-align-left"></i>&nbsp; Description
                </label>

                <textarea
                    id="desc"
                    className="form-control"
                    rows={5}
                    style={{ width: '75%' }}
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                />
                {errors.desc && <p>{errors.desc}</p>}
            </div>
            
            <div className="mt-4 flex justify-end gap-2">
                <button
                    className="btn"
                    style={{marginTop: '10px',
                            backgroundColor: '#818181',
                            borderColor: '#818181',
                            fontWeight: 'bold',
                            height: '45px',
                            borderRadius: '10px',
                            color:'white',
                            float: 'right',
                            marginBottom: '10px'
                        }}
                    onClick={closePopup}
                >
                    <i
                        className="fa fa-times"
                        aria-hidden="true"
                    ></i>
                    &nbsp; Cancel
                </button>

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
                    <i className="fas fa-flag"></i>&nbsp; Submit Report
                </button>
            </div>
        </form>
    );
};

export default ReportForm;