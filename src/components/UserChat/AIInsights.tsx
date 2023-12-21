import React from 'react';
import { useQuery } from 'react-query';
import { fetchAIInsights } from '../../api/chatAPI';

interface AIInsight {
    text: string;
}

interface AIInsightsProps {
    chatId: string;
}

const AIInsights: React.FC<AIInsightsProps> = ({ chatId }) => {
    const { data: insights, isLoading, error } = useQuery<AIInsight[], Error>(['aiInsights', chatId], () => fetchAIInsights(chatId), { enabled: !!chatId });

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>An error occurred...</p>;

    return (
        <div>
            {insights?.map(insight => (
                <p>{insight.text}</p>
            ))}
        </div>
    );
};

export default AIInsights;
