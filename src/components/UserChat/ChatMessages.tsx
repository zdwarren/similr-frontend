import React from 'react';
import { useQuery } from 'react-query';
import { fetchChatMessages } from '../../api/chatAPI';

interface Message {
    sender: {
        avatarUrl: string;
        userName: string;
    };
    content: string;
}

interface ChatMessagesProps {
    chatId: string;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ chatId }) => {
    const { data: messages, isLoading, error } = useQuery<Message[], Error>(['chatMessages', chatId], () => fetchChatMessages(chatId), { enabled: !!chatId });

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>An error occurred...</p>;

    return (
        <div>
            {messages?.map(message => (
                <p>{message.content}</p>
            ))}
        </div>
    );
};

export default ChatMessages;
