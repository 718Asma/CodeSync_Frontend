import { useEffect } from "react";
import { useFormik, FormikErrors } from "formik";
import * as yup from "yup";
import axios from "../utils/axios";
import redirector from "../utils/redirector";
import { useNavigate } from "react-router-dom";

interface SignupFormValues {
    fullName: string;
    username: string;
    password: string;
    confirmPassword: string;
}

interface ExtendedFormikErrors extends FormikErrors<SignupFormValues> {
    general?: string;
}

const Signup = () => {
    const navigate = useNavigate();

    const validationSchema = yup.object({
        fullName: yup
            .string()
            .min(3, "Full name should consist of a minimum of 3 characters.")
            .max(100, "Full name should not exceed 100 characters.")
            .matches(
                /^[\w\s'-]+$/,
                "Full name can only contain letters, spaces, hyphens, or apostrophes."
            )
            .required("Full name is required"),
        username: yup
            .string()
            .min(3, "Username should consist of a minimum of 3 characters.")
            .max(100, "Username should not exceed 100 characters.")
            .matches(/^[a-zA-Z0-9]+$/, "Username must be alphanumeric.")
            .required("Username is required"),
        password: yup
            .string()
            .min(8, "Password should consist of a minimum of 8 characters.")
            .max(100, "Password should not exceed 100 characters.")
            .matches(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
                "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character."
            )
            .required("Password is required"),
        confirmPassword: yup
            .string()
            .oneOf([yup.ref("password"), undefined], "Passwords do not match")
            .required("Confirm password is required"),
    });

    const formik = useFormik<SignupFormValues>({
        initialValues: {
            fullName: "",
            username: "",
            password: "",
            confirmPassword: "",
        },
        validationSchema: validationSchema,
        onSubmit: async (values, { setSubmitting, setErrors }) => {
            try {
                const res = await axios.post("/auth/signup", values);

                const { refresh_token, access_token, user_id } = res.data;
                localStorage.setItem("access_token", access_token);
                localStorage.setItem("refresh_token", refresh_token);
                localStorage.setItem("user_id", user_id);
                navigate("/");
            } catch (error: any) {
                if (
                    error.response &&
                    error.response.data &&
                    error.response.data.errors
                ) {
                    const serverErrors: ExtendedFormikErrors =
                        error.response.data.errors.reduce(
                            (acc: any, curr: any) => {
                                acc[curr.param] = curr.msg;
                                return acc;
                            },
                            {}
                        );
                    setErrors(serverErrors);
                } else {
                    setErrors({
                        general:
                            "An error occurred while signing up. Please try again.",
                    } as ExtendedFormikErrors);
                }
            } finally {
                setSubmitting(false);
            }
        },
    });

    useEffect(() => {
        redirector(navigate, "signup");
    }, [navigate]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <form
                className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-xs"
                onSubmit={formik.handleSubmit}
            >
                <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
                {(formik.errors as ExtendedFormikErrors).general && (
                    <div className="text-red-500 mb-4">
                        {(formik.errors as ExtendedFormikErrors).general}
                    </div>
                )}
                <div className="mb-4">
                    <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="fullName"
                    >
                        Full name:
                    </label>
                    <input
                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                            formik.touched.fullName && formik.errors.fullName
                                ? "border-red-500"
                                : ""
                        }`}
                        type="text"
                        id="fullName"
                        name="fullName"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.fullName}
                        placeholder="Enter your full name"
                    />
                    {formik.touched.fullName && formik.errors.fullName ? (
                        <p className="text-red-500 text-xs italic">
                            {formik.errors.fullName}
                        </p>
                    ) : null}
                </div>
                <div className="mb-4">
                    <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="username"
                    >
                        Username:
                    </label>
                    <input
                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                            formik.touched.username && formik.errors.username
                                ? "border-red-500"
                                : ""
                        }`}
                        type="text"
                        id="username"
                        name="username"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.username}
                        placeholder="Choose a username"
                    />
                    {formik.touched.username && formik.errors.username ? (
                        <p className="text-red-500 text-xs italic">
                            {formik.errors.username}
                        </p>
                    ) : null}
                </div>
                <div className="mb-4">
                    <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="password"
                    >
                        Password:
                    </label>
                    <input
                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                            formik.touched.password && formik.errors.password
                                ? "border-red-500"
                                : ""
                        }`}
                        type="password"
                        id="password"
                        name="password"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.password}
                        placeholder="Enter your password"
                    />
                    {formik.touched.password && formik.errors.password ? (
                        <p className="text-red-500 text-xs italic">
                            {formik.errors.password}
                        </p>
                    ) : null}
                </div>
                <div className="mb-4">
                    <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="confirmPassword"
                    >
                        Confirm password:
                    </label>
                    <input
                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                            formik.touched.confirmPassword &&
                            formik.errors.confirmPassword
                                ? "border-red-500"
                                : ""
                        }`}
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.confirmPassword}
                        placeholder="Confirm your password"
                    />
                    {formik.touched.confirmPassword &&
                    formik.errors.confirmPassword ? (
                        <p className="text-red-500 text-xs italic">
                            {formik.errors.confirmPassword}
                        </p>
                    ) : null}
                </div>
                <div className="mb-6">
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="submit"
                        disabled={formik.isSubmitting}
                    >
                        {formik.isSubmitting ? "Signing up..." : "Sign Up"}
                    </button>
                </div>
            </form>
            <div className="text-center mt-4">
                <p>Already signed up?</p>
                <a className="text-blue-500" href="/auth/login">
                    Login
                </a>
            </div>
        </div>
    );
};

export default Signup;
