import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useFormik, FormikErrors } from "formik";
import * as yup from "yup";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardFooter,
} from "../ui/card";
import { Alert, AlertDescription } from "../ui/alert";
import { Logo } from "../ui/logo";
import redirector from "../utils/redirector";
import { register } from "../services/authService";

interface SignupFormValues {
    fullName: string;
    username: string;
    password: string;
    confirmPassword: string;
}

interface ExtendedFormikErrors extends FormikErrors<SignupFormValues> {
    general?: string;
}

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

const Signup = () => {
    const navigate = useNavigate();
    const [generalError, setGeneralError] = useState<string | null>(null);

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
                await register(
                    values.fullName,
                    values.username,
                    values.password,
                    values.confirmPassword
                );
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
                    setGeneralError(
                        "An error occurred while signing up. Please try again."
                    );
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
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-[#4a0594] to-[#940507]">
            <Card className="w-full max-w-md shadow-lg bg-white/90 backdrop-blur-sm">
                <CardHeader className="space-y-1">
                    <Logo className="mx-auto mb-4 w-1/2" />
                    <CardTitle className="text-3xl font-bold text-center text-black">
                        Don’t just stand there <br/> Let the adventure begin! 🔥
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={formik.handleSubmit} className="space-y-4">
                        {generalError && (
                            <Alert variant="destructive">
                                <AlertDescription>
                                    {generalError}
                                </AlertDescription>
                            </Alert>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="fullName" className="text-black">
                                Full Name
                            </Label>
                            <Input
                                id="fullName"
                                type="text"
                                placeholder="Enter your full name"
                                {...formik.getFieldProps("fullName")}
                                className="border-[#7808ED] focus:ring-[#7808ED]"
                            />
                            {formik.touched.fullName &&
                                formik.errors.fullName && (
                                    <p className="text-sm text-[#ED080B]">
                                        {formik.errors.fullName}
                                    </p>
                                )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="username" className="text-black">
                                Username
                            </Label>
                            <Input
                                id="username"
                                type="text"
                                placeholder="Choose a username"
                                {...formik.getFieldProps("username")}
                                className="border-[#7808ED] focus:ring-[#7808ED]"
                            />
                            {formik.touched.username &&
                                formik.errors.username && (
                                    <p className="text-sm text-[#ED080B]">
                                        {formik.errors.username}
                                    </p>
                                )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-black">
                                Password
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Enter your password"
                                {...formik.getFieldProps("password")}
                                className="border-[#7808ED] focus:ring-[#7808ED]"
                            />
                            {formik.touched.password &&
                                formik.errors.password && (
                                    <p className="text-sm text-[#ED080B]">
                                        {formik.errors.password}
                                    </p>
                                )}
                        </div>
                        <div className="space-y-2">
                            <Label
                                htmlFor="confirmPassword"
                                className="text-black"
                            >
                                Confirm Password
                            </Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                placeholder="Confirm your password"
                                {...formik.getFieldProps("confirmPassword")}
                                className="border-[#7808ED] focus:ring-[#7808ED]"
                            />
                            {formik.touched.confirmPassword &&
                                formik.errors.confirmPassword && (
                                    <p className="text-sm text-[#ED080B]">
                                        {formik.errors.confirmPassword}
                                    </p>
                                )}
                        </div>
                        <Button
                            type="submit"
                            className="w-full bg-[#7808ED] hover:bg-[#6007BA] text-white"
                            disabled={formik.isSubmitting}
                        >
                            {formik.isSubmitting ? "Signing up..." : "Sign Up"}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter>
                    <p className="text-sm text-center w-full text-gray-600">
                        Already have an account?{" "}
                        <a
                            href="/auth/login"
                            className="text-[#ED080B] hover:text-[#940507] hover:underline font-medium"
                        >
                            Log In
                        </a>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
};

export default Signup;
