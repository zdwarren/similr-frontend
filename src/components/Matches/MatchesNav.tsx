import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { Tabs } from 'antd';
import MatchNavItem from './MatchNavItem';
import { Match } from '../../api/matchAPI';
import { fetchMatches } from '../../api/matchAPI';

const { TabPane } = Tabs;

interface MatchesNavProps {
    onMatchSelection: (matchId: string) => void;
}

const MatchesNav: React.FC<MatchesNavProps> = ({ onMatchSelection }) => {

    const [matchesToStartChat, setMatchesToStartChat] = useState<Match[]>([]);
    const [matchesWithChats, setMatchesWithChats] = useState<Match[]>([]);
    const [pendingMatches, setPendingMatches] = useState<Match[]>([]);
    const [respondedMatches, setRespondedMatches] = useState<Match[]>([]);

    const { data: matches, isLoading, error } = useQuery<Match[], Error>('matches', fetchMatches, {
        onSuccess: (matches) => {
            const newPendingMatches = matches.filter((match) => match.rating === null);
            const newRespondedMatches = matches.filter((match) => match.rating !== null && match.matchedRating === null);
            const bothResponded = matches.filter((match) => match.rating !== null && match.matchedRating !== null);
            const newMatchesToStartChat = bothResponded.filter(match => match.chatStartedTime === null);
            const newMatchesWithChats = bothResponded.filter(match => match.chatStartedTime !== null);

            setMatchesToStartChat(newMatchesToStartChat);
            setMatchesWithChats(newMatchesWithChats);
            setPendingMatches(newPendingMatches);
            setRespondedMatches(newRespondedMatches);
        }
    });

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>An error occurred...</p>;

    return (
        <Tabs defaultActiveKey="1">
            <TabPane tab="Pending" key="1">
                {pendingMatches.map((match) => (
                    <MatchNavItem key={match.id} match={match} onMatchSelection={() => onMatchSelection(match.id)} />
                ))}
            </TabPane>
            <TabPane tab="Waiting" key="2">
                {respondedMatches.map((match) => (
                    <MatchNavItem key={match.id} match={match} onMatchSelection={() => onMatchSelection(match.id)} />
                ))}
            </TabPane>
            <TabPane tab="Start Chat" key="3">
                {matchesToStartChat.map((match) => (
                    <MatchNavItem key={match.id} match={match} onMatchSelection={() => onMatchSelection(match.id)} />
                ))}
            </TabPane>
            <TabPane tab="Existing Chats" key="4">
                {matchesWithChats.map((match) => (
                    <MatchNavItem key={match.id} match={match} onMatchSelection={() => onMatchSelection(match.id)} />
                ))}
            </TabPane>
        </Tabs>
    );
};

export default MatchesNav;
