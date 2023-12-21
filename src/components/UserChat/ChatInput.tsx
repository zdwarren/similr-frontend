import React, { useState } from 'react';
import { sendChatMessage } from '../../api/chatAPI'; // Assume you have this function defined

interface ChatInputProps {
    chatId: string;
}

const ChatInput: React.FC<ChatInputProps> = ({ chatId }) => {
    const [message, setMessage] = useState('');

    const handleSendMessage = async () => {
        await sendChatMessage(chatId, message);
        setMessage('');
    };

    return (
        <div>
            <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} />
            <button onClick={handleSendMessage}>Send</button>
        </div>
    );
};

export default ChatInput;
