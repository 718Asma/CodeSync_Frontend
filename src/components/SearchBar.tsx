import React, { useState } from "react";
import axios from "../utils/axios";
import { TextInput, Avatar, List, ListItem, Group, Text } from "@mantine/core";

type SearchBarProps = {
    onUserSelect: (user: any) => void;
};

const SearchBar: React.FC<SearchBarProps> = ({ onUserSelect }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [results, setResults] = useState([]);

    const handleSearch = async (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
        if (event.target.value.length > 2) {
            const { data } = await axios.get(
                `/user/search-users?name=${event.target.value}`
            );
            let res = data.data;
            const userId = localStorage.getItem("user_id");
            res = res.filter((user: any) => user._id !== userId);
            for (let i = 0; i < res.length; i++) {
                if (!res[i].profileImage)
                    res[i].profileImage =
                        "http://localhost:3000/assets/images/avatar.png";
                else {
                    res[
                        i
                    ].profileImage = `http://localhost:3000/${res[i].profileImage}`;
                }
            }
            setResults(res);
        } else {
            setResults([]);
        }
    };

    const handleSelect = (user: any) => {
        user.online = false;
        onUserSelect(user);
        setSearchTerm("");
        setResults([]);
    };

    return (
        <div className="relative w-full max-w-md mx-auto mb-4">
            <TextInput
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Search users..."
                className="shadow-sm"
            />
            {results.length > 0 && (
                <div className="absolute z-10 w-full bg-white shadow-lg rounded-md mt-1">
                    <List>
                        {results.map((user: any) => (
                            <ListItem
                                key={user._id}
                                onClick={() => handleSelect(user)}
                                className="cursor-pointer flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-md"
                            >
                                <Group>
                                    <Avatar
                                        src={user.profileImage}
                                        alt="user profile"
                                        size="sm"
                                    />
                                    <Text fz="sm" fw={500}>
                                        {user.fullName}
                                    </Text>
                                    {/* <span className="ml-2">{user.fullName}</span> */}
                                </Group>
                            </ListItem>
                        ))}
                    </List>
                </div>
            )}
        </div>
    );
};

export default SearchBar;
