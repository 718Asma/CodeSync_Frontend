import { useEffect, useState } from "react";

type ContactsProps = {
    contacts: any;
    currentUser: any;
    changeChat: any;
    loading: boolean;
};

export default function Contacts(props: ContactsProps) {
    const { contacts, currentUser, changeChat } = props;
    const [currentUserName, setCurrentUserName] = useState();
    const [currentSelected, setCurrentSelected] = useState();

    useEffect(() => {
        if (currentUser) {
            setCurrentUserName(currentUser);
        }
    }, [currentUser]);

    const changeCurrentChat = (index: any, contact: any) => {
        setCurrentSelected(index);
        changeChat(contact);
    };

    return (
        <div>
            <div className="flex justify-between items-center bg-gray-200 p-4">
                <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full overflow-hidden">
                        {currentUser && currentUser.avatarImage ? (
                            <img
                                src={currentUser.avatarImage}
                                alt=""
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="flex items-center justify-center w-full h-full bg-gray-400 text-white">
                                A
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
                {contacts.map((contact: any, index: any) => (
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
                            {contact.avatarImage ? (
                                <img
                                    src={contact.avatarImage}
                                    alt=""
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="flex items-center justify-center w-full h-full bg-gray-400 text-white">
                                    A
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
