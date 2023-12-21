// UserChat.tsx
import React, { useState } from 'react';
import ChatList from './ChatList';
import ChatBox from './ChatBox';
import MatchList from './MatchList';
import HeaderComponent from '../HeaderComponent';

const UserChat: React.FC = () => {
    const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

    const handleChatSelection = (chatId: string) => {
        setSelectedChatId(chatId);
    };

    const handleChatInitiation = (chatId: string) => {
        setSelectedChatId(chatId);
    };

    return (
        <>
            <HeaderComponent />
            <div className="chat-app">
                <MatchList onChatInitiation={handleChatInitiation} />
                <ChatList selectedChatId={selectedChatId} onChatSelection={handleChatSelection} />
                {selectedChatId && <ChatBox chatId={selectedChatId} />}
            </div>
        </>
    );
}

export default UserChat;
