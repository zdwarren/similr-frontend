import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { Select, InputNumber, Button, message, Card, Row, Col, Spin, List, Popover } from 'antd';
import HeaderComponent from '../HeaderComponent';
import { QuestionCircleOutlined } from '@ant-design/icons';

interface User {
    username: string;
    num_choices: number;
}

interface WordScore {
    word: string;
    similarity_score: number;
}

const fetchUsernames = async (): Promise<User[]> => {
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    const authToken = localStorage.getItem('authToken');
    const response = await fetch(`${backendUrl}api/usernames/`, {
        method: 'GET',
        headers: {
            'Authorization': `Token ${authToken}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const users = await response.json();
    return users.sort((a: User, b: User) => a.username.toLowerCase().localeCompare(b.username.toLowerCase()));
};

const fetchTopBottomWords = async (username: string, topX: number): Promise<{ top_words: WordScore[], bottom_words: WordScore[] }> => {
    const authToken = localStorage.getItem('authToken');
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    const response = await fetch(`${backendUrl}api/user/${username}/top-bottom-words/${topX}/`, {
        method: 'GET',
        headers: {
            'Authorization': `Token ${authToken}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
};

const TopWords = () => {
    const loggedInUsername = localStorage.getItem('username');
    const [username, setUsername] = useState<string>(loggedInUsername ? loggedInUsername : '');
    const [topX, setTopX] = useState<number>(100);
    const [topBottomWords, setTopBottomWords] = useState<{ top_words: WordScore[], bottom_words: WordScore[] } | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const { data: usernames } = useQuery('usernames', fetchUsernames);

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            const data = await fetchTopBottomWords(username, topX);
            setTopBottomWords({
                top_words: [...data.top_words].sort((a, b) => b.similarity_score - a.similarity_score),
                bottom_words: [...data.bottom_words].sort((a, b) => a.similarity_score - b.similarity_score)
            });
        } catch (error) {
            message.error('Error fetching top and bottom words.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const renderItem = (item: WordScore) => (
        <List.Item style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ flex: 1, paddingRight: '16px', fontSize: '16px' }}>{item.word}</div>
            <div style={{ width: '100px', textAlign: 'right', fontSize: '16px' }}>
                <strong>{(item.similarity_score * 1000).toFixed(0)}</strong>
            </div>
        </List.Item>
    );

    const helpContent = (
        <div>
            <p>Top and bottom score ratings for the most common 10,000 words for the selected user.</p>
            <br />
            <p>
                These scores indicate the relative similarity of each word to the user's preferences and interests.
                Try to absorb the general feel of the words versus the exact definition.
            </p>
        </div>
    );

    return (
        <>
            <HeaderComponent />
            <Row justify="center" align="middle" style={{ marginTop: '40px' }}>
                <Col span={24}>
                    <Card 
                        title={
                            <span>
                                Word Rankings by User 
                                <Popover 
                                    content={helpContent} 
                                    title="How to Use" 
                                    overlayStyle={{ width: '50vw' }}
                                >
                                    <QuestionCircleOutlined style={{ cursor: 'pointer', marginLeft: '10px', position: 'relative', top: '-4px' }} />
                                </Popover>
                            </span>
                        } 
                        bordered={false} 
                        style={{ maxWidth: '750px', margin: '0 auto'}}
                    >
                        <Select
                            style={{ width: '280px', marginRight: '10px', marginLeft: '90px' }}
                            placeholder="Select a user"
                            onChange={(value: string) => setUsername(value)}
                            value={username}
                            defaultValue={loggedInUsername}
                        >
                            {usernames?.map(user => (
                                <Select.Option key={user.username} value={user.username}>{user.username}</Select.Option>
                            ))}
                        </Select>
                        <InputNumber
                            style={{ width: '70px', marginRight: '30px' }}
                            min={5}
                            max={1000}
                            defaultValue={100}
                            onChange={(value: number | null) => {
                                if (value !== null) {
                                    setTopX(value);
                                }
                            }}
                        />
                        <Button type="primary" onClick={handleSubmit}>Fetch Rankings</Button>
                        <br /><br />
                        <Row gutter={16} justify="center">
                            <Col>
                                <Card title="Highest Ranked Words" style={{ maxWidth: '300px', margin: '0 auto', marginRight: '25px'}}>
                                    {isLoading ? (
                                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px' }}>
                                            <Spin />
                                        </div>
                                    ) : (
                                        <List
                                            dataSource={topBottomWords?.top_words}
                                            renderItem={renderItem}
                                            size='small'
                                        />
                                    )}
                                </Card>
                            </Col>
                            <Col>
                                <Card title="Lowest Ranked Words" style={{ maxWidth: '300px', margin: '0 auto', marginLeft: '25px' }}>
                                    {isLoading ? (
                                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px' }}>
                                            <Spin />
                                        </div>
                                    ) : (
                                        <List
                                            dataSource={topBottomWords?.bottom_words}
                                            renderItem={renderItem}
                                            size='small'
                                        />
                                    )}
                                </Card>
                            </Col>
                        </Row>

                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default TopWords;
