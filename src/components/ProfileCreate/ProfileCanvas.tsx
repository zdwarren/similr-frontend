import React from 'react';
import Card, { CardType } from './Card';
import { Button, Collapse, Dropdown, Menu } from 'antd';
import MoreOutlined from '@ant-design/icons/lib/icons/MoreOutlined';

interface ProfileCanvasProps {
    cards: CardType[];
    handleEdit: (card: CardType) => void;
    handleDelete: (card: CardType) => void;
    handleDuplicate: (card: CardType) => void;
    handleVariations: (card: CardType) => void;
}

const ProfileCanvas: React.FC<ProfileCanvasProps> = ({ cards, handleEdit, handleDelete, handleDuplicate, handleVariations }) => {
    return (
        <Collapse accordion>
            {cards.map(card => {
                const menu = (
                    <Menu>
                        <Menu.Item key="1" onClick={() => handleEdit(card)}>
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

                return (
                    <Collapse.Panel 
                        header={
                            <>
                                {card.title}
                                {/* <Dropdown overlay={menu} trigger={['click']}>
                                    <Button type="text" icon={<MoreOutlined />} />
                                </Dropdown> */}
                            </>
                        }
                        key={card.id}
                    >
                        <Card card={card} handleEdit={handleEdit} handleDelete={handleDelete} handleDuplicate={handleDuplicate} handleVariations={handleVariations} />
                    </Collapse.Panel>
                )
            })}
        </Collapse>
    );
};

export default ProfileCanvas;
