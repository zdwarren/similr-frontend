import React from 'react';
import { Layout, List, Card, Row, Col } from 'antd';
import { useQuery } from 'react-query';
import { useState } from 'react';
import ActionPanel from './ActionPanel';
import MatchDetails from './MatchDetails';
import UserProfile from './UserProfile';

const { Sider, Content } = Layout;

const match_url = 'http://localhost:8000/api/admin/matches/';

export type Match = {
    id: string;
    username1: string;
    username2: string;
};

export type MatchDetailsType = {
    id: string;
    username1: string;
    username2: string;
    ai_matched_by_summary: boolean;
    ai_match_score: number;
    ai_scores: number[];
    ai_match_score_explanation: string | null;
    ai_match_summary_for1: string | null;
    ai_match_summary_for2: string | null;
    ai_date_suggested: string | null;
    ai_matched_time: string;
    user1_rating: number | null;
    user1_feedback: string | null;
    user1_response_time: string | null;
    user2_rating: number | null;
    user2_feedback: string | null;
    user2_response_time: string | null;
};

const fetchMatches = async (): Promise<Match[]> => {
    const res = await fetch(match_url);
    return res.json();
};

const fetchMatchDetails = async (matchId: string): Promise<MatchDetailsType> => {
    const res = await fetch(`${match_url}${matchId}/`);
    return res.json();
};

const MatchPage: React.FC = () => {
    const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
    const { data: matches, isLoading: matchesLoading } = useQuery<Match[]>('matches', fetchMatches);
    const { data: matchDetails, isLoading: matchDetailsLoading } = useQuery<MatchDetailsType | undefined>(
        ['matchDetails', selectedMatch?.id],
        () => fetchMatchDetails(selectedMatch?.id!),
        { enabled: !!selectedMatch }
    );

    return (
        <Layout>
            <Sider width={250}>
                <List
                    loading={matchesLoading}
                    dataSource={matches}
                    renderItem={(match) => (
                        <List.Item>
                            <Card onClick={() => setSelectedMatch(match)}>
                                {match.username1} x {match.username2}
                            </Card>
                        </List.Item>
                    )}
                />
            </Sider>
            <Content>
                {selectedMatch && <ActionPanel match={selectedMatch} />}

                {matchDetailsLoading ? (
                    'Loading match details...'
                ) : (
                    matchDetails && (
                        <>
                            <MatchDetails match={matchDetails} />
                            <Row gutter={16}>
                                <Col span={12}>
                                    <UserProfile username={matchDetails.username1} />
                                </Col>
                                <Col span={12}>
                                    <UserProfile username={matchDetails.username2} />
                                </Col>
                            </Row>
                        </>
                    )
                )}
            </Content>
        </Layout>
    );
};

export default MatchPage;
