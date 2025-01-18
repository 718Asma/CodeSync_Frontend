import axios from "../utils/axios";
import { Discussion } from "../classes/discussion";

export const getAllDiscussions = async (page: number, perPage: number): Promise<Discussion[]> => {
    try {
        const { data } = await axios.get(`/discussion/all?per_page=${perPage}&page=${page}`);
        
        if (data && Array.isArray(data.discussions)) {
            return data.discussions.map((discussion: Discussion) => ({
                ...discussion,
                banner: discussion.banner
                    ? `http://localhost:3000/${discussion.banner}`
                    : `http://localhost:3000/assets/images/dfltBanner.jpg`,
            }));
        }

        return [];
    } catch (error) {
        console.error("Error fetching all discussions:", error);
        throw new Error("Failed to fetch discussions. Please try again.");
    }
};

export const getDiscussionById = async (id: string) => {
    try {
        const { data } = await axios.get(`/discussion/id/${id}`);
        data.discussion.banner ?  data.discussion.banner = `http://localhost:3000/${data.discussion.banner}` :  data.discussion.banner = "http://localhost:3000/assets/images/dfltBanner.jpg";

        return data.discussion;
    } catch (error) {
        console.error(`Error fetching discussion with id ${id}:`, error);
        throw error;
    }
};

export const getDiscussionByName = async (name: string) => {
    try {
        const { data } = await axios.get(`/discussion/by-name?name=${name}`);

        data.discussions.map((discussion: Discussion) => {
            const bannerUrl = discussion.banner 
            ? `http://localhost:3000/${discussion.banner}`
            : "http://localhost:3000/assets/images/dfltBanner.jpg";

            discussion.banner = bannerUrl;
        });

        return data.discussions;
    } catch (error) {
        console.error(`Error fetching discussion with name ${name}:`, error);
        throw error;
    }
};

export const getDiscussionByUser = async () => {
    try {
        const { data } = await axios.get(`/discussion/user`);

        data.discussions.map((discussion: Discussion) => {
            const bannerUrl = discussion.banner 
            ? `http://localhost:3000/${discussion.banner}`
            : "http://localhost:3000/assets/images/dfltBanner.jpg";

            discussion.banner = bannerUrl;
        });

        return data.discussions;
    } catch (error) {
        console.error("Error fetching discussions by user:", error);
        throw error;
    }
};

export const createDiscussion = async (title: string, description: string) => {
    try {
        const response = await axios.post("/discussion/create", {
            title,
            description,
        });
        return response.data;
    } catch (error) {
        console.error("Error creating discussion:", error);
        throw error;
    }
};

export const changeBanner = async (banner: File, discussionId: string) => {
    try {
        const formData = new FormData();
        formData.append("banner", banner);
        formData.append("discussionId", discussionId);

        const response = await axios.put("/discussion/change-banner", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        return response.data;
    } catch (error) {
        console.error("Error changing banner:", error);
        throw error;
    }
};

export const deleteDiscussion = async (id: string) => {
    try {
        const response = await axios.delete(`/discussion/delete/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting discussion with id ${id}:`, error);
        throw error;
    }
};

export const joinLeaveDiscussion = async (id: string) => {
    try {
        const response = await axios.put(`/discussion/join_leave/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error joining/leaving discussion with id ${id}:`, error);
        throw error;
    }
};