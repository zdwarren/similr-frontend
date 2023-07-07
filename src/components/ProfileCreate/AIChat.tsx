// AIChat.tsx
import { useState, useEffect, useRef } from 'react';

interface AIChatProps {
    chatHistory: Array<{ role: 'assistant' | 'user', content: string }>;
    onSendMessage: (message: string) => void;
}

const AIChat: React.FC<AIChatProps> = ({ chatHistory, onSendMessage }) => {
    const [message, setMessage] = useState('');
    const chatEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        if (chatEndRef.current !== null) {
            chatEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }

    useEffect(scrollToBottom, [chatHistory]);

    const handleSendMessage = () => {
        onSendMessage(message);
        setMessage('');
    };

    // Default first message from the assistant
    const initialAssistantMessage = {
        role: 'assistant',
        content: (
            `Hello and welcome!\n\nI'm here to help you create your profile. We're going ` +
            `to design a set of profile cards that best represent you. Each card will ` +
            `contain information about a specific part of your life, for instance, ` +
            `your hobbies, your job, your favorite books, or your life goals. ` +
            `You can decide what information to include, and I will only add a card when you confirm it.\n\n` +
            `Let's start with a basic 'About Me' card. Could you tell me a little bit ` +
            `about yourself? Like your age, gender, and any other general information ` +
            `you're comfortable sharing or feel free to start with any kind of card or ask for suggestions.`
        ),
    };

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-2xl font-semibold mb-4">AI Chat</h1>
            <div className="AIChatInterface p-4 bg-gray-100 rounded">
                <div className="ChatHistory overflow-y-scroll h-96 border-b-2 border-gray-300 mb-2">
                    {[initialAssistantMessage, ...chatHistory].map((message, index) => (
                        <div key={index} className={`${message.role === 'assistant' ? 'text-blue-500' : 'text-green-500'} mb-2`}>
                            <pre className="whitespace-pre-wrap">{message.content}</pre>
                        </div>
                    ))}
                    <div ref={chatEndRef} />
                </div>
                <div className="ChatInput flex">
                    <input
                        type="text"
                        placeholder="Type a message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="flex-grow border rounded p-2 mr-2"
                    />
                    <button
                        onClick={handleSendMessage}
                        className="bg-blue-500 text-white rounded p-2"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AIChat;
