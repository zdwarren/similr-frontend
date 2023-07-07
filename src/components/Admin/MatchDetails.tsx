import { Card } from 'antd';
import { MatchDetailsType } from './MatchPage';

interface MatchDetailsProps {
    match: MatchDetailsType
}

const MatchDetails: React.FC<MatchDetailsProps> = ({ match }) => {

    return (
        <Card title={`Match between ${match.username1} and ${match.username2}`}>
            <p>AI Matched By Summary: {match.ai_matched_by_summary ? 'Yes' : 'No'}</p>
            <p>AI Match Score: <b>{match.ai_match_score}</b></p>
            <p>AI Scores: {match.ai_scores.join(', ')}</p>
            <p>AI Match Score Explanation:</p>
            <p className="text-sm whitespace-pre-wrap overflow-auto">{match.ai_match_score_explanation}</p>
            <p>AI Match Summary For {match.username1}: {match.ai_match_summary_for1}</p>
            <p>AI Match Summary For {match.username2}: {match.ai_match_summary_for2}</p>
            <p>AI Date Suggested: {match.ai_date_suggested}</p>
            <p>AI Matched Time: {match.ai_matched_time}</p>
            <p>{match.username1} Rating: {match.user1_rating}</p>
            <p>{match.username1} Feedback: {match.user1_feedback}</p>
            <p>{match.username1} Response Time: {match.user1_response_time}</p>
            <p>{match.username2} Rating: {match.user2_rating}</p>
            <p>{match.username2} Feedback: {match.user2_feedback}</p>
            <p>{match.username2} Response Time: {match.user2_response_time}</p>
        </Card>
    );
};

export default MatchDetails;
