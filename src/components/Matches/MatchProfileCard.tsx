import React from 'react';
import { Card as AntCard } from 'antd';
import { CardType } from '../../components/ProfileCreate/Card';

interface CardProps {
    card: CardType;
}

const MatchProfileCard: React.FC<CardProps> = ({ card }) => {
    return (
        <AntCard title={card.title} style={{ width: 250, height: 250 }}>
            <div className="text-sm whitespace-pre-wrap overflow-auto" style={{ overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: '7', WebkitBoxOrient: 'vertical' }}>{card.content}</div>
        </AntCard>
    );
};

export default MatchProfileCard;
