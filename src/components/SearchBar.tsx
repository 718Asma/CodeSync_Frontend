// components/SearchBar.tsx
import React, { useState } from "react";
import axios from "../utils/axios";

type SearchBarProps = {
    onUserSelect: (user: any) => void;
};

const SearchBar: React.FC<SearchBarProps> = ({ onUserSelect }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [results, setResults] = useState([]);
    console.log(results.length);

    const handleSearch = async (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
        if (event.target.value.length > 2) {
            const { data } = await axios.get(
                `/user/search-users?name=${event.target.value}`
            );
            let res = data.data;
            // check wether the currentUser is in the search results and remove it
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
        <div className="search-bar">
            <input
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Search users..."
                className="input"
            />
            {results.length > 0 && (
                <ul className="results-list">
                    {results.map((user: any) => (
                        <li key={user._id} onClick={() => handleSelect(user)}>
                            <img
                                src={user.profileImage}
                                className="w-8 h-8"
                                alt="user profile"
                            />
                            {user.fullName}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SearchBar;
