// ChatBox.tsx
import React from 'react';
import ChatHeader from './ChatHeader';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import AIInsights from './AIInsights';

interface ChatBoxProps {
    chatId: string | null;
}

const ChatBox: React.FC<ChatBoxProps> = ({ chatId }) => {
    if (chatId === null) {
        return <p>Select a chat to start messaging.</p>
    }
    return (
        <div>
            <ChatHeader chatId={chatId} />
            <ChatMessages chatId={chatId} />
            <ChatInput chatId={chatId} />
            <AIInsights chatId={chatId} />
        </div>
    );
};

export default ChatBox;
