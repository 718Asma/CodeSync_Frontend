import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { searchUsersByName } from "../services/userService";
import { getDiscussionByName } from "../services/discussionService";
import { User } from "../classes/user";
import { Discussion } from "../classes/discussion";

import { Avatar, List, ListItem, Group, Text } from "@mantine/core";

const HomeSearchBar = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [userResults, setUserResults] = useState<User[]>([]);
    const [discussionsResults, setDiscussionsResults] = useState<Discussion[]>([]);
    const token = localStorage.getItem('access_token');

    useEffect(() => {
        if (!token) {
            navigate('auth/login');
        }
    }, [token, navigate]);

    const handleSearch = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const userId = localStorage.getItem("user_id");
        setSearchTerm(event.target.value);

        if (event.target.value.length > 2) {
            try {
                const userResponse = await searchUsersByName(event.target.value);
                console.log(userResponse);

                if(userResponse){
                    if (Array.isArray(userResponse) && userResponse.length > 0) {
                        let users = userResponse;
                        users = users.filter((user: User) => user._id !== userId);
                        setUserResults(users);
                    } else {
                        console.log('No more users to fetch.');
                    }
                } else {
                    console.error('Unexpected response data:', userResponse.data);
                }

                const discussionResponse = await getDiscussionByName(event.target.value);

                if(discussionResponse){
                    if (Array.isArray(discussionResponse) && discussionResponse.length > 0) {
                        setDiscussionsResults(discussionResponse);
                    } else {
                        console.log('No more discussions to fetch.');
                    }
                } else {
                    console.error('Unexpected response data:', discussionResponse.data);
                }

            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        } else {
            setUserResults([]);
            setDiscussionsResults([]);
        }
    };

    return(
        <>
            <input
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Searching..." 
                className="search ml-4 bg-gray-400" 
                style={{ border: 'none' }}
            />
            {(userResults.length > 0 || discussionsResults.length > 0) && (
                <div
                    className="absolute z-10 shadow-lg rounded-md mt-1"
                    style={{ width: '23%', left: '55.5%', backgroundColor: '#e9e9e9' }}
                >
                    {userResults.length > 0 ? (
                        <>
                            <p style={{ color: '#a2a2a2', fontSize: '14px', paddingLeft: '2.5%' }}>Users</p>
                            <hr style={{ backgroundColor: '#e9e9e9', borderColor: '#d3d3d3' }} />
                            <List>
                                {userResults.map((user: any) => (
                                    <ListItem
                                        key={user._id}
                                        onClick={() => navigate(`/user/profile/${user._id}`)}
                                        className="cursor-pointer flex items-center space-x-2 p-2 hover:bg-white rounded-md"
                                    >
                                        <Group>
                                            <Avatar
                                                src={user.profileImage}
                                                alt="user profile"
                                                size="sm" />
                                            <Text fz="sm" fw={500}>
                                                {user.fullName}
                                            </Text>
                                        </Group>
                                    </ListItem>
                                ))}
                            </List>
                        </>
                    ) : null}
                    {discussionsResults.length > 0 ? (
                        <>
                            <p style={{ color: '#a2a2a2', fontSize: '14px', paddingLeft: '2.5%' }}>Discussions</p>
                            <hr style={{ backgroundColor: '#e9e9e9', borderColor: '#d3d3d3' }} />
                            <List>
                                {discussionsResults.map((discussion: any) => (
                                    <ListItem
                                        key={discussion._id}
                                        onClick={() => navigate(`/discussion/${discussion._id}`)}
                                        className="cursor-pointer flex items-center space-x-2 p-2 hover:bg-white rounded-md"
                                    >
                                        <Group>
                                            <Avatar
                                                src={discussion.banner}
                                                alt="discussion banner"
                                                size="sm" />
                                            <Text fz="sm" fw={500}>
                                                {discussion.title}
                                            </Text>
                                        </Group>
                                    </ListItem>
                                ))}
                            </List>
                        </>
                    ) : null}
                </div>
            )}
        </>
    );

};

export default HomeSearchBar;