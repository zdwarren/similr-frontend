// components/Matches/Matches.tsx
import React, { useState } from 'react';
import MatchesNav from './MatchesNav';
import MatchCard from './MatchCard';
import MatchProfile from './MatchProfile';
import MatchResponse from './MatchResponse';
import HeaderComponent from '../HeaderComponent';

import { Row, Col } from 'antd';


const Matches: React.FC = () => {
    const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);

    const handleMatchSelection = (matchId: string) => {
        setSelectedMatchId(matchId);
        console.log("Set MatchId to " + matchId);
    };

    return (
        <>
            <HeaderComponent />
            <Row className="matches-layout" style={{ margin: '20px 0' }}>
                <Col span={8}>
                    <MatchesNav onMatchSelection={handleMatchSelection} />
                </Col>
                {selectedMatchId && (
                    <Col span={16}>
                        <div style={{ margin: '20px 0' }}><MatchResponse matchId={selectedMatchId} /></div>
                        <div style={{ margin: '20px 0' }}><MatchCard matchId={selectedMatchId} /></div>
                        <div style={{ margin: '20px 0' }}><MatchProfile matchId={selectedMatchId} /></div>
                    </Col>
                )}
            </Row>
        </>
    );
};

export default Matches;
