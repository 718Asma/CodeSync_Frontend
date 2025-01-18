import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import SettingsNavBar from "./settingsNavBar";
import { changePassword } from "../../services/userService";


const SecuritySettings = () => {
    const navigate = useNavigate();

    const [oldPassword, setoldPassword] = useState('');
    const [newPassword, setnewPassword] = useState('');
    const [confirmNewPassword, setconfirmNewPassword] = useState('');
    const [errors, setErrors] = useState({ oldPassword: "", newPassword: "", confirmNewPassword: "" });

    const token = localStorage.getItem('access_token');

    useEffect(() => {
        if (!token) {
            navigate('auth/login');
        }
    }, [token, navigate]);

    const validateForm = () => {
        let valid = true;
        let errors = { oldPassword: "", newPassword: "", confirmNewPassword: "" };

        if (oldPassword.length < 8 || oldPassword.length > 100) {
            errors.oldPassword = "Your current password must be between 8 and 100 characters.";
            valid = false;
        }
        if (oldPassword.length < 8 || oldPassword.length > 100) {
            errors.newPassword =
                "Your new password must be between 8 and 100 characters.";
            valid = false;
        }
        if(newPassword !== confirmNewPassword) {
            errors.confirmNewPassword = "Passwords do not match.";
            valid = false;
        }
        if(oldPassword === newPassword) {
            errors.newPassword = "Your new password must be different from your current one.";
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
            oldPassword: oldPassword,
            newPassword: newPassword,
            confirmNewPassword: confirmNewPassword,
        };
        console.log("Form data:", formData);

        try {
            const response = await changePassword(formData);
            console.log("Password updated:", response.data);
        } catch (error) {
            console.error("Error updating password:", error);
        }
    }

    return (
        <>
            <SettingsNavBar />
            <div className="container px-4 py-8 bg-gray-100" style={{ width: '67%', marginTop: '2%', marginLeft: '18%' }}>
                <h1 className="h1" style={{ color: '#7808ED', marginBottom: '5%' }}>Change your Password</h1>
                <form onSubmit={onSubmit} className="container mt-5">
                    <div className="form-group">
                        <label htmlFor="oldPassword" style={{ fontWeight: 'bold', fontSize: '20px', marginBottom: '2%' }}>
                            <i className="fas fa-lock"></i>&nbsp; Current Password
                        </label>
                        <input
                            id="oldPassword"
                            type="password"
                            className="form-control"
                            style={{ width: '75%', marginBottom: '3%' }}
                            value={oldPassword}
                            onChange={(e) => setoldPassword(e.target.value)}
                        />
                        {errors.oldPassword && <p style={{ color: '#ED080B', fontWeight: 'bold' }}>{errors.oldPassword}</p>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="newPassword" style={{ fontWeight: 'bold', fontSize: '20px' }}>
                            <i className="fas fa-lock"></i>&nbsp; New Password
                        </label>
                        <input
                            id="newPassword"
                            type="password"
                            className="form-control"
                            style={{ width: '75%', marginBottom: '3%' }}
                            value={newPassword}
                            onChange={(e) => setnewPassword(e.target.value)}
                        />
                        {errors.newPassword && <p style={{ color: '#ED080B', fontWeight: 'bold' }}>{errors.newPassword}</p>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirmNewPassword" style={{ fontWeight: 'bold', fontSize: '20px' }}>
                            <i className="fas fa-lock"></i>&nbsp; Confirm Password
                        </label>
                        <input
                            id="confirmNewPassword"
                            type="password"
                            className="form-control"
                            style={{ width: '75%', marginBottom: '3%' }}
                            value={confirmNewPassword}
                            onChange={(e) => setconfirmNewPassword(e.target.value)}
                        />
                        {errors.confirmNewPassword && <p style={{ color: '#ED080B', fontWeight: 'bold' }}>{errors.confirmNewPassword}</p>}
                    </div>
                    <button type="submit" className="button" style={{ backgroundColor: '#ED080B', color: 'white', width: '25%' }}>
                        Update Password
                    </button>
                </form>
            </div>
        </>
    );
};
  
  export default SecuritySettings;