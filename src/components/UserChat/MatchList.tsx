// MatchList.tsx
import React from 'react';
import { useQuery } from 'react-query';
import { List, Button } from 'antd';
import { Match, fetchMatches } from '../../api/matchAPI';

interface MatchListProps {
    onChatInitiation: (chatId: string) => void;
}

const MatchList: React.FC<MatchListProps> = ({ onChatInitiation }) => {
    const { data: matches, isLoading, error } = useQuery('matches', fetchMatches);

    const initiateChat = (chatId: string) => {
        onChatInitiation(chatId);
    };

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>An error occurred...</p>;

    return (
        <List
            itemLayout="horizontal"
            dataSource={matches}
            renderItem={(match: Match) => (
                <List.Item>
                    <List.Item.Meta
                        title={match.matchedUsername}
                    />
                    <Button onClick={() => initiateChat(match.id)}>Start Chat</Button>
                </List.Item>
            )}
        />
    );
};

export default MatchList;
