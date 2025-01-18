import { useState } from "react";
import { aiResponse } from "../services/messageService";

const ChatGPT = () => {
    const [prompt, setPrompt] = useState("");
    const [response, setResponse] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleChatWithAI = async () => {
        setIsLoading(true);
        try {
            const response = await aiResponse(prompt, import.meta.env.VITE_OPENAI_API_KEY);
            setResponse(response.data.message);
        } catch (error) {
            console.error("Error:", error);
            setResponse("Error occurred. Please try again.");
        }
        setIsLoading(false);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-2xl font-bold mb-4">Chat with AI</h1>
            <textarea
                rows={5}
                placeholder="Enter your prompt here..."
                className="border border-gray-300 rounded-md px-4 py-2 mb-4 w-80"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
            />
            <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
                onClick={handleChatWithAI}
                disabled={isLoading}
            >
                {isLoading ? "Loading..." : "Chat with AI"}
            </button>
            {response && (
                <div className="mt-4">
                    <h2 className="text-lg font-semibold">AI Response:</h2>
                    <p className="border border-gray-300 rounded-md px-4 py-2 w-80">
                        {response}
                    </p>
                </div>
            )}
        </div>
    );
};

export default ChatGPT;
