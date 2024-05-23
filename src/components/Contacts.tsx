import { useEffect, useState } from "react";
import { Avatar, ScrollArea } from "@mantine/core";

type CurrentUserInfo = {
    _id: string;
    fullName: string;
    profileImage: string;
};

type Contact = {
    _id: string;
    fullName: string;
    profileImage: string;
    online: boolean;
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
    const [currentSelected, setCurrentSelected] = useState<number>();

    useEffect(() => {
        if (currentUser) {
            setCurrentUserName(currentUser);
        }
    }, [currentUser]);

    const changeCurrentChat = (index: number, contact: Contact) => {
        setCurrentSelected(index);
        changeChat(contact);
    };

    return (
        <div className="w-full h-full flex flex-col">
            <div className="flex justify-between items-center bg-gray-200 p-4">
                <div className="flex items-center gap-4">
                    <Avatar
                        src={currentUser?.profileImage}
                        alt={currentUser?.fullName}
                        radius="xl"
                        size="lg"
                    />
                    <h2 className="text-gray-700 text-lg">
                        {currentUser?.fullName}
                    </h2>
                </div>
            </div>
            <ScrollArea className="flex-1">
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
                        <Avatar
                            src={contact.profileImage}
                            alt={contact.fullName}
                            radius="xl"
                            size="md"
                            className={`border-2 ${
                                contact.online ? "border-green-500" : ""
                            }`}
                        />
                        <h3 className="ml-4">{contact.fullName}</h3>
                    </div>
                ))}
            </ScrollArea>
        </div>
    );
}
