const redirector = (navigate: any, page?: string) => {
    localStorage.getItem("access_token")
        ? navigate("/")
        : page == "signup"
        ? navigate("/auth/signup")
        : navigate("/auth/login");
};

export default redirector;
