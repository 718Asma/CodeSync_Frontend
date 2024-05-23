import { faCake, faEnvelope, faLocationDot, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type ProfileDataProps = {
    data: any;
};
function formatDate(dateString: string): string {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}
const ProfileData = ({ data }: ProfileDataProps) => {
    return (
        <div>
            {/* <h1 className="text-3xl font-bold mb-4">Profile</h1> */}
            {data && (
                <div style={{ boxShadow: '5px 0px 10px rgba(0, 0, 0, 0.1)',width:"300px" }} className=" bg-white rounded-lg p-4 mb-4">
                    {/* <p className="text-lg">Profile data:</p> */}
                    <div className=" p-4 mt-2">
                        <h3 className="text-lg font-semibold text-primary">About</h3>
                        <p className="text-gray-700">
                            <FontAwesomeIcon className="text-secondary mr-5 mt-5" icon={faUser} />
                            {data.data.gender}
                        </p>
                        <p className="text-gray-700">
                            <FontAwesomeIcon className="text-secondary mr-5 mt-5" icon={faCake} />
                            Born {formatDate(data.data.dateOfBirth)}
                        </p>
                        <p className="text-gray-700">
                            <FontAwesomeIcon className="text-secondary mr-5 mt-5" icon={faLocationDot} />
                            {data.data.address}
                        </p>
                        <p className="text-gray-700">
                            <FontAwesomeIcon className="text-secondary mr-5 mt-5" icon={faEnvelope} />
                            {data.data.email}
                        </p>
                        <h3 className="text-lg font-semibold text-primary mt-5">Bio</h3>
                        <p className="text-gray-700 mt-2">{data.data.bio}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileData;
