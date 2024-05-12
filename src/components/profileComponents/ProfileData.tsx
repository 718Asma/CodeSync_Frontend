type ProfileDataProps = {
    data: any;
};

const ProfileData = ({ data }: ProfileDataProps) => {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-4">Profile</h1>
            {data && (
                <div className="bg-gray-100 rounded-lg p-4 mb-4">
                    <p className="text-lg">Profile data:</p>
                    <div className="border border-gray-300 p-4 mt-2">
                        <p className="font-semibold">Full Name:</p>
                        <p className="text-gray-700">{data.data.fullName}</p>
                        <p className="font-semibold">Username:</p>
                        <p className="text-gray-700">{data.data.username}</p>
                        <p className="font-semibold">Password:</p>
                        <p className="text-gray-700">{data.data.password}</p>
                        <p className="font-semibold mt-4">Google ID:</p>
                        <p className="text-gray-700">{data.data.googleId}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileData;
