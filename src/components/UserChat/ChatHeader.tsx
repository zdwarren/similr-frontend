import React from 'react';
import { useQuery } from 'react-query';
import { fetchChatDetails } from '../../api/chatAPI';

interface ChatHeaderProps {
    chatId: string;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ chatId }) => {
    const { data: chatDetails, isLoading, error } = useQuery(['chatDetails', chatId], () => fetchChatDetails(chatId), { enabled: !!chatId });

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>An error occurred...</p>;

    return (
        <div>
            <h2>{chatDetails?.userName}</h2>
            <img src={chatDetails?.avatarUrl} alt="Avatar" />
        </div>
    );
};

export default ChatHeader;
