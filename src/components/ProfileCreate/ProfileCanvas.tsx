import React from 'react';
import Card, { CardType } from './Card';
import { Row, Col } from 'antd';

// Define ProfileCanvasProps interface
interface ProfileCanvasProps {
    cards: CardType[];  // we're reusing the Card interface defined earlier
    handleEdit: (card: CardType) => void;
    handleDelete: (card: CardType) => void;
    handleDuplicate: (card: CardType) => void;
    handleVariations: (card: CardType) => void;
}

const ProfileCanvas: React.FC<ProfileCanvasProps> = ({ cards, handleEdit, handleDelete, handleDuplicate, handleVariations }) => {
    return (
        <Row gutter={[16, 16]}>
            {cards.map(card => (
                <Col xs={24} sm={24} md={12} lg={12} xl={8} key={`${card.id}-${card.title}-${card.content}`}>
                    <Card card={card} handleEdit={handleEdit} handleDelete={handleDelete}
                        handleDuplicate={handleDuplicate} handleVariations={handleVariations} />
                </Col>
            ))}
        </Row>
    );
};

export default ProfileCanvas;
