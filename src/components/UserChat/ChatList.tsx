import React from 'react';
import { useQuery } from 'react-query';
import { List, Avatar } from 'antd';
import { fetchChats } from '../../api/chatAPI'; // Assume you have this function defined

type ChatListProps = {
    selectedChatId: string | null;
    onChatSelection: (chatId: string) => void;
};

interface Chat {
    id: string;
    avatarUrl: string;
    userName: string;
    lastMessage: {
        content: string;
    };
}

const ChatList: React.FC<ChatListProps> = ({ selectedChatId, onChatSelection }) => {
    // Here, we explicitly type the fetched data as Chat[]
    const { data: chats, isLoading, error } = useQuery<Chat[], Error>('chats', fetchChats);

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>An error occurred...</p>;

    return (
        <List
            itemLayout="horizontal"
            // Explicitly type the chats data to be an array of Chat
            dataSource={chats as Chat[]}
            renderItem={(chat: Chat) => (
                <List.Item onClick={() => onChatSelection(chat.id)} style={chat.id === selectedChatId ? { backgroundColor: 'lightgray' } : undefined}>
                    <List.Item.Meta
                        avatar={<Avatar src={chat.avatarUrl} />}
                        title={chat.userName}
                        description={chat.lastMessage.content}
                    />
                </List.Item>
            )}
        />
    );
};

export default ChatList;
