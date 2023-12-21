import React from 'react';
import { useQuery } from 'react-query';
import { fetchMatch } from '../../api/matchAPI';

import { Typography } from 'antd';
const { Title, Text } = Typography;

interface MatchCardProps {
    matchId: string;
}

const MatchCard: React.FC<MatchCardProps> = ({ matchId }) => {

    // Here I'm assuming that fetchMatch is a function that fetches the details of a match by its ID.
    // You would define it somewhere in your API layer.
    const { data: matchDetails, isLoading, error } = useQuery(['match', matchId], () => fetchMatch(matchId));

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading match details</div>;
    if (!matchDetails) return <div>Match does not exist</div>;

    return (
        <div>
            <Title level={4}>{matchDetails.matchedUsername}</Title>
            <p><Text strong>Your Rating:</Text> {matchDetails.rating ? matchDetails.rating : 'Not yet rated'}</p>
            <p><Text strong>Matched User's Rating:</Text> {matchDetails.matchedRating ? matchDetails.matchedRating : 'Not yet rated'}</p>
            <p><Text strong>AI Match Score:</Text> {matchDetails.aiMatchScore}</p>
            <Text strong>AI Match Summary:</Text>
            <p className="text-sm whitespace-pre-wrap overflow-auto">{matchDetails.aiMatchSummary}</p>
            <p><Text strong>Chat Started Time:</Text> {matchDetails.chatStartedTime ? matchDetails.chatStartedTime : 'Chat not started yet'}</p>
            <p><Text strong>AI Matched Time:</Text> {matchDetails.aiMatchedTime}</p>
        </div>
    );

};

export default MatchCard;
