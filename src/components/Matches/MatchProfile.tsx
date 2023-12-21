import React, { useEffect, useState } from 'react';
import { CardType } from '../../components/ProfileCreate/Card';
import { Row, Col } from 'antd';
import { useQuery } from 'react-query';
import MatchProfileCard from './MatchProfileCard';

import { Typography } from 'antd';
const { Title } = Typography;

interface ProfileViewProps {
    matchId: string;
}

const MatchProfile: React.FC<ProfileViewProps> = ({ matchId }) => {

    async function fetchMatchProfile(matchId: string) {
        const res = await fetch(`http://localhost:8000/api/matches/${matchId}/profile/`, {
            method: 'GET',
            headers: {
                'Authorization': `Token ${localStorage.getItem('authToken')}`,
                'Content-Type': 'application/json',
            },
        });
        if (!res.ok) {
            throw new Error('Network response was not ok');
        }
        return res.json();
    }

    const { data: cards, isError, isLoading } = useQuery<CardType[], Error>(['matchProfile', matchId], () => fetchMatchProfile(matchId));


    async function fetchUserProfile() {
        const res = await fetch(`http://localhost:8000/api/cards`, {
            method: 'GET',
            headers: {
                'Authorization': `Token ${localStorage.getItem('authToken')}`,
                'Content-Type': 'application/json',
            },
        });
        if (!res.ok) {
            throw new Error('Network response was not ok');
        }
        return res.json();
    }

    const { data: userCards, isError: isError2, isLoading: isLoading2 } = useQuery<CardType[], Error>(['userProfile', matchId], () => fetchUserProfile());


    if (isLoading || isLoading2) return <p>Loading...</p>;
    if (isError || isError2) return <p>An error occurred...</p>;

    return (
        <>
            <Title level={4}>Other Person's Profile</Title>
            <Row gutter={[16, 16]}>
                {cards?.map(card => (
                    <Col xs={24} sm={24} md={12} lg={12} xl={8} key={`${card.id}-${card.title}-${card.content}`}>
                        <MatchProfileCard card={card} />
                    </Col>
                ))}
            </Row>
            <hr style={{ padding: "20px 0" }}></hr >
            <Title level={4}>Your Profile</Title>
            <Row gutter={[16, 16]}>

                {userCards?.map(card => (
                    <Col xs={24} sm={24} md={12} lg={12} xl={8} key={`${card.id}-${card.title}-${card.content}`}>
                        <MatchProfileCard card={card} />
                    </Col>
                ))}
            </Row>
        </>
    );
};

export default MatchProfile;
