import React, { useState } from 'react';
import { Modal, Button, Spin } from 'antd';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import AIChat from './AIChat';
import ProfileCanvas from './ProfileCanvas';
import { CardType } from "./Card";
import { Typography } from 'antd';
import HeaderComponent from '../HeaderComponent';

const { Title } = Typography;

const ProfileCreate: React.FC = () => {
    const queryClient = useQueryClient();
    const [chatHistory, setChatHistory] = useState<Array<{ role: 'assistant' | 'user', content: string }>>([]);

    const [variationCard, setVariationCard] = useState<null | CardType>(null);
    const [variationOptions, setVariationOptions] = useState<CardType[]>([]);
    const [variationModelOpen, setVariationModalOpen] = useState<boolean>(false);

    async function fetchCards() {
        const res = await fetch('http://localhost:8000/api/cards/', {
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

    const { data: cards, isError, isLoading } = useQuery('cards', fetchCards);

    async function fetchAIResponse({ message, chatHistory }: { message: string, chatHistory: Array<{ role: 'assistant' | 'user', content: string }> }) {
        const response = await fetch('http://localhost:8000/api/ai/create-profile/', {
            method: 'POST',
            headers: {
                'Authorization': `Token ${localStorage.getItem('authToken')}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message, chatHistory }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return { message: data.message, createdCard: data.created_card };
    }

    const aiResponseMutation = useMutation(fetchAIResponse, {
        onSuccess: ({ message, createdCard }) => {
            console.log(message);

            //if (!createdCard) {
            setChatHistory((oldMessages) => [...oldMessages, { role: 'assistant', content: message }]);
            //}
            queryClient.invalidateQueries('cards');
        },
    });

    const handleSendMessage = (message: string) => {
        // Add message to chat history
        setChatHistory((oldMessages) => [...oldMessages, { role: 'user', content: message }]);

        aiResponseMutation.mutate({ message, chatHistory });
    };

    function handleEdit(card: CardType): void {
        updateCardMutation.mutate(card);
    }

    async function handleDelete(card: CardType): Promise<void> {
        const res = await fetch(`http://localhost:8000/api/cards/${card.id}/`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Token ${localStorage.getItem('authToken')}`,
                'Content-Type': 'application/json',
            },
        });

        if (!res.ok) {
            throw new Error('Network response was not ok');
        }

        // Trigger a refetch of the cards to get the updated list after the deletion
        queryClient.invalidateQueries('cards');
    }

    async function handleDuplicate(card: CardType): Promise<void> {
        const res = await fetch('http://localhost:8000/api/cards/', {
            method: 'POST',
            headers: {
                'Authorization': `Token ${localStorage.getItem('authToken')}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: card.id })
        });

        if (!res.ok) {
            throw new Error('Network response was not ok');
        }

        // Trigger a refetch of the cards to get the updated list after the duplication
        queryClient.invalidateQueries('cards');
    }

    async function fetchVariations(card: CardType) {
        const res = await fetch(`http://localhost:8000/api/cards/${card.id}/variations/`, {
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

    async function updateCard(card: CardType) {
        const res = await fetch(`http://localhost:8000/api/cards/${card.id}/`, {
            method: 'PUT',
            headers: {
                'Authorization': `Token ${localStorage.getItem('authToken')}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(card),
        });
        if (!res.ok) {
            throw new Error('Network response was not ok');
        }
        return null;
    }

    const variationsMutation = useMutation(fetchVariations, {
        onSuccess: (newCards) => {
            setVariationOptions(newCards);
        },
    });

    const updateCardMutation = useMutation(updateCard, {
        onSuccess: () => {
            queryClient.invalidateQueries('cards');
        },
    });

    function handleVariations(card: null | CardType): void {
        setVariationCard(card);
        setVariationModalOpen(true);

        if (card) {
            variationsMutation.mutate(card);
        }
    }

    function handleSelectVariation(card: CardType): void {
        updateCardMutation.mutate(card);
        setVariationModalOpen(false);
        setVariationOptions([]);
    }

    return (
        <>
            <HeaderComponent />
            <div className="flex flex-col md:flex-row justify-center items-start h-screen p-4 gap-8 bg-gray-100 overflow-y-auto">
                <div className="w-full md:w-1/2 lg:w-1/3 bg-white rounded shadow p-6 overflow-y-auto h-full">
                    <AIChat
                        chatHistory={chatHistory}
                        onSendMessage={handleSendMessage}
                    />
                </div>
                <div className="w-full md:w-1/2 lg:w-1/3 bg-white rounded shadow p-6 overflow-y-auto h-full">
                    {isLoading ? <p>Loading...</p> :
                        isError ? <p>Error loading cards.</p> :
                            <ProfileCanvas
                                cards={cards} handleEdit={handleEdit} handleDelete={handleDelete} handleDuplicate={handleDuplicate} handleVariations={handleVariations} />}
                </div>
                {variationModelOpen && (
                    <Modal
                        title="Select a Variation"
                        visible={true}
                        onCancel={() => { setVariationOptions([]); setVariationModalOpen(false); }}
                        okText="Generate More"
                        onOk={() => { setVariationOptions([]); handleVariations(variationCard); }}
                    >
                        <Title level={4}>{variationCard?.title}</Title>
                        <p className="text-sm whitespace-pre-wrap overflow-auto">{variationCard?.content}</p>
                        <hr style={{ margin: '20px 0' }} />
                        {variationOptions.length === 0 ? (
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                                <Spin size="large" />
                            </div>
                        ) : (
                            variationOptions.map((card, index) => (
                                <div key={card.id}>
                                    <p className="text-sm whitespace-pre-wrap overflow-auto">{card.content}</p>
                                    <Button type="primary" size="small" style={{ margin: '10px 0 0 0' }}
                                        onClick={() => handleSelectVariation(card)}>
                                        Select Variation
                                    </Button>
                                    {index < variationOptions.length - 1 && <hr style={{ margin: '20px 0' }} />}
                                </div>
                            ))
                        )}
                    </Modal>
                )}
            </div>
        </>
    );
};

export default ProfileCreate;
