import { useEffect, useState } from "react";

type CurrentUserInfo = {
    _id: string;
    fullName: string;
    profileImage: string;
};

type Contact = {
    _id: string;
    fullName: string;
    profileImage: string;
};

type ContactsProps = {
    contacts: Contact[];
    currentUser: CurrentUserInfo;
    changeChat: any;
    loading: boolean;
};

export default function Contacts(props: ContactsProps) {
    const { contacts, currentUser, changeChat } = props;
    const [currentUserName, setCurrentUserName] = useState<CurrentUserInfo>();
    const [currentSelected, setCurrentSelected] = useState();

    useEffect(() => {
        if (currentUser) {
            setCurrentUserName(currentUser);
        }
    }, [currentUser]);

    const changeCurrentChat = (index: any, contact: Contact) => {
        setCurrentSelected(index);
        console.log(contact);
        changeChat(contact);
    };

    return (
        <div>
            <div className="flex justify-between items-center bg-gray-200 p-4">
                <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full overflow-hidden">
                        {currentUser && currentUser.profileImage ? (
                            <img
                                src={currentUser.profileImage}
                                alt="user profile image"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="flex items-center justify-center w-full h-full bg-gray-400 text-white">
                                <img
                                    src="http://localhost:3000/assets/images/avatar.png"
                                    alt="user profile image"
                                />
                            </div>
                        )}
                    </div>
                    <h2 className="text-gray-700 text-lg">
                        {currentUser && currentUser.fullName}
                    </h2>
                </div>
                <button className="text-gray-700 hover:text-gray-900">
                    Logout
                </button>
            </div>
            <div className="overflow-auto">
                {contacts.map((contact: Contact, index: number) => (
                    <div
                        key={contact._id}
                        className={`flex items-center p-4 cursor-pointer transition duration-300 ${
                            index === currentSelected
                                ? "bg-gray-300"
                                : "hover:bg-gray-100"
                        }`}
                        onClick={() => changeCurrentChat(index, contact)}
                    >
                        <div className="h-10 w-10 rounded-full overflow-hidden">
                            {contact.profileImage ? (
                                <img
                                    src={contact.profileImage}
                                    alt="contact profile image"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="flex items-center justify-center w-full h-full bg-gray-400 text-white">
                                    <img
                                        src="http://localhost:3000/assets/images/avatar.png"
                                        alt="contact profile image"
                                    />
                                </div>
                            )}
                        </div>
                        <h3 className="ml-4">{contact.fullName}</h3>
                    </div>
                ))}
            </div>
        </div>
    );
}
