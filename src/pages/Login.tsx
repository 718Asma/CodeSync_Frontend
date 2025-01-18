import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

import { jwtDecode } from "jwt-decode";
import { useFormik } from "formik";
import * as yup from "yup";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardFooter,
} from "../ui/card";
import { Alert, AlertDescription } from "../ui/alert";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Logo } from "../ui/logo";
import redirector from "../utils/redirector";
import { googleLogin, login } from "../services/authService";


const GoogleLoginButton: React.FC = () => {
    const navigate = useNavigate();

    const onSuccess = async (res: any) => {
        if (!res) console.error("'onSuccess' response is null.");
        const decodedRes = jwtDecode(res.credential);
        const loginBody = {
            googleId: decodedRes.sub,
            fullName: (decodedRes as any).name,
        };
        try {
            await googleLogin(loginBody);
            navigate("/");
        } catch (err) {
            console.error("an error occurred with the login request: ", err);
        }
    };

    const onFail = () => {
        console.error("google login failed.");
    };

    return (
      <GoogleLogin
        onSuccess={onSuccess}
        onError={onFail}
        theme="filled_blue"
        size="large"
        shape="pill"
      />
    );
};

interface LoginFormValues {
  username: string;
  password: string;
}

const validationSchema = yup.object({
  username: yup
    .string()
    .min(3, "Username should consist of a minimum of 3 characters.")
    .max(100, "Username should not exceed 100 characters.")
    .required("Username is required"),
  password: yup
    .string()
    .min(8, "Password should consist of a minimum of 8 characters.")
    .max(100, "Password should not exceed 100 characters.")
    .required("Password is required"),
});


const Login = () => {
    const navigate = useNavigate();
    const [generalError, setGeneralError] = useState<string | null>(null);

    const formik = useFormik<LoginFormValues>({
      initialValues: {
        username: "",
        password: "",
      },
      validationSchema: validationSchema,
      onSubmit: async (values, { setSubmitting }) => {
        try {
          await login(values.username, values.password);
          navigate("/");
        } catch (error: any) {
          console.error("Error: ", error);
          setGeneralError(error.response?.data?.message || "An error occurred during login.");
        } finally {
          setSubmitting(false);
        }
      },
    });

    useEffect(() => {
        redirector(navigate);
        return () => {
            setGeneralError(null);
        };
    }, []);

    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-[#4a0594] to-[#940507]">
        <Card className="w-full max-w-md shadow-lg bg-white/95 backdrop-blur-sm">
          <CardHeader className="space-y-1">
            <Logo className="mx-auto mb-4 w-1/2" />
            <CardTitle className="text-3xl font-bold text-center text-black">Welcome Back</CardTitle>
            <p className="text-center text-gray-600">Sign in to your account</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={formik.handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-black">Username</Label>
                <Input
                  id="username"
                //   name="username"
                  placeholder="Enter your username"
                  {...formik.getFieldProps('username')}
                  className={`w-full px-3 py-2 border-[#7808ED] focus:ring-[#7808ED] rounded-md ${
                    formik.touched.username && formik.errors.username ? 'border-[#ED080B]' : ''
                  }`}
                />
                {formik.touched.username && formik.errors.username && (
                  <p className="text-sm text-[#ED080B]">{formik.errors.username}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-black">Password</Label>
                <Input
                  type="password"
                  id="password"
                //   name="password"
                  placeholder="Enter your password"
                  {...formik.getFieldProps('password')}
                  className={`w-full px-3 py-2 border-[#7808ED] focus:ring-[#7808ED] rounded-md ${
                    formik.touched.password && formik.errors.password ? 'border-[#ED080B]' : ''
                  }`}
                />
                {formik.touched.password && formik.errors.password && (
                  <p className="text-sm text-[#ED080B]">{formik.errors.password}</p>
                )}
              </div>
              <Button 
                type="submit" 
                className="w-full bg-[#7808ED] hover:bg-[#4a0594] text-white" 
                disabled={formik.isSubmitting}
              >
                {formik.isSubmitting ? "Logging in..." : "Login"}
              </Button>
            </form>
  
            {generalError && (
              <Alert variant="destructive" className="mt-4">
                <AlertDescription>
                  <p className="text-[#ED080B]">{generalError}</p>
                </AlertDescription>
              </Alert>
            )}
  
            <div className="mt-6">
              <Separator className="my-4" />
              <p className="text-center text-sm text-gray-600 mt-2">Or continue with</p>
              <div className="mt-4 flex justify-center">
                <GoogleLoginButton />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-center w-full text-gray-600">
              Don't have an account?{" "}
              <a href="/auth/signup" className="text-[#ED080B] hover:text-[#940507] hover:underline font-medium">
                Sign Up
              </a>
            </p>
          </CardFooter>
        </Card>
      </div>
    );
};

export default Login;
