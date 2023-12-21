// components/Matches/MatchNavItem.tsx
import React from 'react';
import { List } from 'antd';
import { Match } from '../../api/matchAPI';

interface MatchNavItemProps {
    match: Match;
    onMatchSelection: (matchId: string) => void;
}

const MatchNavItem: React.FC<MatchNavItemProps> = ({ match, onMatchSelection }) => {
    return (
        <List.Item onClick={() => onMatchSelection(match.id)}>
            <List.Item.Meta title={match.matchedUsername} />
        </List.Item>
    );
};

export default MatchNavItem;
