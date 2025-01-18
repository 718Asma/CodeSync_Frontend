import axios from "../utils/axios";

export const sendMessages = async (receiver: string, content: string) => {
    try {
        const { data } = await axios.post("/message/send", {
            receiver: receiver,
            content: content,
        });
        return data;
    } catch (error) {
        console.error("Error sending message:", error);
        throw error;
    }
};

export const getMessages = async (receiverId: string) => {
    try {
        const { data } = await axios.get(`/message/get/${receiverId}`);
        data.forEach((msg: any) => {
            const [date, time] = msg.timestamp.split("T");
            const [year, month, day] = date.split("-");
            const formattedDate = `${day}/${month}/${year}`;
            const hour = time.split(".")[0].split(":").slice(0, 2).join(":");
            msg.date = formattedDate;
            msg.time = hour;
        });
        
        return data;
    } catch (error) {
        console.error("Error getting messages:", error);
        throw error;
    }
};

export const deleteMessage = async (messageId: string) => {
    try {
        const response = await axios.delete(`/message/delete/${messageId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting message:", error);
        throw error;
    }
};

export const updateMessage = async (messageId: string, content: string) => {
    try {
        const response = await axios.put(`/message/update/${messageId}`, {
            content,
        });
        return response.data;
    } catch (error) {
        console.error("Error updating message:", error);
        throw error;
    }
};

export const aiResponse = async (prompt: string, aiKey: string) => {
    try {
        const response = await axios.post(`/message/ai`, {
            prompt,
            aiKey,
        });
        return response.data;
    } catch (error) {
        console.error("Error getting AI response:", error);
        throw error;
    }
};