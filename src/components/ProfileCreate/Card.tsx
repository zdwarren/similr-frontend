import React, { useState } from 'react';
import { Menu, Dropdown, Button, Card as AntCard, Input, Row, Col, Modal } from 'antd';
import { MoreOutlined } from '@ant-design/icons';
import styled from 'styled-components';

export interface CardType {
    id: string;
    title: string;
    content: string;
}

interface CardProps {
    card: CardType;
    handleEdit: (card: CardType) => void;
    handleDelete: (card: CardType) => void;
    handleDuplicate: (card: CardType) => void;
    handleVariations: (card: CardType) => void;
}

// Define the styled component for TextArea
const FullHeightTextArea = styled(Input.TextArea)`
    height: calc(100% - 38px);
    margin-bottom: 10px;
`;

const Card: React.FC<CardProps> = ({ card, handleEdit, handleDelete, handleDuplicate, handleVariations }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(card.title);
    const [content, setContent] = useState(card.content);

    const [isModalVisible, setIsModalVisible] = useState(false);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
    };

    const menu = (
        <Menu>
            <Menu.Item key="1" onClick={() => setIsEditing(true)}>
                Edit
            </Menu.Item>
            <Menu.Item key="2" onClick={() => handleDuplicate(card)}>
                Duplicate
            </Menu.Item>
            <Menu.Item key="3" onClick={() => handleVariations(card)}>
                Variations
            </Menu.Item>
            <Menu.Item key="4" onClick={() => handleDelete(card)}>
                Delete
            </Menu.Item>
        </Menu>
    );

    const handleSave = () => {
        handleEdit({ ...card, title, content });
        setIsEditing(false);
    };

    const handleCancel = () => {
        setTitle(card.title);
        setContent(card.content);
        setIsEditing(false);
    };

    if (isEditing) {
        return (
            <AntCard
                className="m-4 bg-white shadow-lg overflow-auto"
                style={{ width: 250, height: 250, boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)', display: 'flex', flexDirection: 'column' }}
                bodyStyle={{ padding: 10, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
            >
                <div>
                    <Input
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        style={{ marginBottom: '5px' }}
                    />
                    <FullHeightTextArea
                        value={content}
                        onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setContent(e.target.value)}
                        autoSize={{ minRows: 8, maxRows: 8 }}
                    />
                </div>
                <Row justify="end" gutter={16}>
                    <Col>
                        <Button onClick={handleSave} type="primary">Save</Button>
                    </Col>
                    <Col>
                        <Button onClick={handleCancel}>Cancel</Button>
                    </Col>
                </Row>
            </AntCard>
        );
    }

    return (
        <div>
            <AntCard
                className="m-4 bg-white shadow-lg overflow-auto"
                style={{ width: 250, height: 250, boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)' }}
                bodyStyle={{ padding: 10 }}
                title={title}
                extra={
                    <Dropdown overlay={menu} trigger={['click']}>
                        <Button type="text" icon={<MoreOutlined />} onClick={e => e.preventDefault()} />
                    </Dropdown>
                }
            >
                <div className="text-sm whitespace-pre-wrap overflow-auto" style={{ overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: '7', WebkitBoxOrient: 'vertical' }}>{content}</div>
                <a href="#" onClick={showModal} style={{ textDecoration: 'none', color: 'blue' }}>show more</a>
            </AntCard>

            <Modal title={title} visible={isModalVisible} onCancel={handleModalCancel} footer={[null]}>
                <p className="text-sm whitespace-pre-wrap overflow-auto">{content}</p>
            </Modal>
        </div>
    );

};

export default Card;
