import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { Card, Row, Col, Spin, Typography, List, Tag, Divider, Select, Popover, Tooltip } from 'antd';
import HeaderComponent from '../HeaderComponent';

const { Option } = Select;

const { Title, Paragraph } = Typography;


interface Recommendation {
    title: string;
    description: string; 
    similarity_score: number;
    url: string;
}

interface WordScore {
    word: string;
    similarity_score: number;
}

interface SimilarUser {
    username: string;
    name: string;
    score: number;
}

interface Recommendation {
    title: string;
    description: string;
    similarity_score: number;
}

interface PersonalityProfile {
    personality: string;
    career: string;
    matchmaker: string;
}

const fetchCategories = async (): Promise<string[]> => {
    const authToken = localStorage.getItem('authToken');
    const response = await fetch('http://localhost:8000/api/categories/', {
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

const fetchSimilarGroups = async (tags: string[]): Promise<SimilarUser[]> => {
    const username = localStorage.getItem('username');
    const authToken = localStorage.getItem('authToken');
    const tagsQueryString = tags.map(tag => `tags=${encodeURIComponent(tag)}`).join('&');
    const url = `http://localhost:8000/api/similar-groups/${username}/?${tagsQueryString}`;
  
    const response = await fetch(url, {
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

const fetchSimilarUsers = async (tags: string[]): Promise<SimilarUser[]> => {
    const username = localStorage.getItem('username');
    const authToken = localStorage.getItem('authToken');
    const tagsQueryString = tags.map(tag => `tags=${encodeURIComponent(tag)}`).join('&');
    const url = `http://localhost:8000/api/similar-users/${username}/?${tagsQueryString}`;
  
    const response = await fetch(url, {
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

// Fetch recommendations based on the selected category and optional username
const fetchRecommendations = async (category: string, username?: string): Promise<Recommendation[]> => {
    const authToken = localStorage.getItem('authToken');
    let url = `http://localhost:8000/api/recommendations/${category}/`;
  
    // If a username is provided, append it as a query parameter
    if (username) {
      url += `?username=${encodeURIComponent(username)}`;
    }
  
    const response = await fetch(url, {
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

const fetchWordRankings = async (): Promise<{ top_words: WordScore[], bottom_words: WordScore[] }> => {
    const username = localStorage.getItem('username');
    const authToken = localStorage.getItem('authToken');
    const response = await fetch(`http://localhost:8000/api/user/${username}/top-bottom-words/10/`, {
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

const fetchPersonalityProfile = async (): Promise<PersonalityProfile> => {
    const authToken = localStorage.getItem('authToken');
    const response = await fetch('http://localhost:8000/api/personality-profile/', {
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

const WhoAmI = () => {
    const { data: wordRankings, isLoading: isLoadingWordRankings } = useQuery('wordRankings', fetchWordRankings);
    
    const {
        data: personalityProfile,
        isLoading: isLoadingProfile,
    } = useQuery('personalityProfile', fetchPersonalityProfile);

    const [selectedCategory, setSelectedCategory] = useState('General Personality');
    
    // Query for Combined Recommendations and Personality Traits
    const { data: combinedRankings, isLoading: isLoadingRankings } = useQuery(
        ['rankings', selectedCategory],
        () => fetchRecommendations(selectedCategory),
        { keepPreviousData: true }
    );

    // Query for Similar Groups with proper type
    const { data: similarGroups, isLoading: isLoadingSimilarGroups } = useQuery<SimilarUser[]>(
        ['similarGroups'],
        () => fetchSimilarGroups([]),
    );

    // Query for Similar Users with proper type
    const { data: similarUsers, isLoading: isLoadingSimilarUsers } = useQuery<SimilarUser[]>(
        ['similarUsers'],
        () => fetchSimilarUsers([]),
    );

    const [categories, setCategories] = useState<string[]>([]);
    
    // Fetch categories on component mount
    useEffect(() => {
        fetchCategories().then(setCategories).catch(console.error);
    }, []);

    // Function to format the name based on its type
    const formatName = (name: any) => {
        if (typeof name === 'object' && name !== null) {
            return `${name.first} ${name.last}`;
        } else if (typeof name === 'string') {
            return name;
        } else {
            return 'Unknown Name';
        }
    };


    return (
        <>
            <HeaderComponent />
            <Row justify="center" style={{ marginTop: '40px' }}>
                <Col span={24}>
                    <Card bordered={false}>
                        <Row gutter={[30, 30]}>
                            {/* First Column: Personality Profile and Similarity with Groups */}
                            <Col span={7}>
                                <Row>
                                    {/* Show spinners if a new request is out for the profile */}
                                    {isLoadingProfile ? (
                                        <Spin style={{ marginLeft: '190px', marginTop: '100px'}} size="large" />
                                    ) : (
                                        <>
                                            {/* Existing code to display the profile */}
                                            <Title level={3}>Personality Profile</Title>
                                            <Paragraph>{personalityProfile?.personality}</Paragraph>
                                            <Title level={3}>Career Summary</Title>
                                            <Paragraph>{personalityProfile?.career}</Paragraph>
                                            <Title level={3}>Matchmaker Summary</Title>
                                            <Paragraph>{personalityProfile?.matchmaker}</Paragraph>
                                        </>
                                    )}
                                </Row>
                            </Col>

                            {/* Merged Column: Rankings */}
                            <Col span={5}>
                                <Row justify="space-between" align="middle">
                                    <Col>
                                        <Title level={4} style={{ marginBottom: 0 }}>Rankings</Title>
                                    </Col>
                                    <Col>
                                    <Select 
                                        style={{ width: 200 }}
                                        onChange={setSelectedCategory}
                                        value={selectedCategory}
                                    >
                                        {categories.sort().map(category => (
                                            <Option key={category} value={category}>{category}</Option>
                                        ))}
                                    </Select>
                                    </Col>
                                </Row>
                                {isLoadingRankings ? <Spin style={{ marginLeft: '190px', marginTop: '100px'}} size="large" /> : (
                                    <List
                                    style={{ marginTop: '7px' }}
                                        size='small'
                                        dataSource={combinedRankings}
                                        renderItem={item => (
                                            <List.Item>
                                                <Row style={{ width: '100%' }}>
                                                    <Col span={16} style={{ textAlign: 'left', fontSize: '15px' }}>
                                                        <Popover content={item.description} title={item.title} trigger="hover">
                                                            {item.title}
                                                        </Popover>
                                                    </Col>
                                                    <Col span={8} style={{ textAlign: 'right', fontWeight: 'bold' }}>
                                                        {(item.similarity_score * 1000).toFixed(0)}
                                                    </Col>
                                                </Row>
                                            </List.Item>
                                        )}
                                    />
                                    )}
                            </Col>

                            {/* Third Column: Similar Groups */}
                            <Col span={4}>
                                <Title level={4}>Similr Groups</Title>

                                <Divider orientation="left">Most Similr</Divider>
                                {isLoadingSimilarGroups ? (
                                    <Spin size="small" style={{ marginLeft: 50 }} />
                                ) : (
                                    similarGroups?.slice(0, 10).map(user => (
                                        <Row key={user.username} style={{ width: '100%' }}>
                                            <Col span={16} style={{ textAlign: 'left' }}>
                                                <Tooltip title={formatName(user.name)}>
                                                    <Tag color="green">{user.username}</Tag>
                                                </Tooltip>
                                            </Col>
                                            <Col span={8} style={{ textAlign: 'right', fontWeight: 'bold' }}>
                                                {(user.score * 100).toFixed(0)}
                                            </Col>
                                        </Row>
                                    ))
                                )}

                                <Divider orientation="left">Least Similr</Divider>
                                {isLoadingSimilarGroups ? (
                                    <Spin size="small" style={{ marginLeft: 50 }} />
                                ) : (
                                    similarGroups?.slice(-10).map(user => (
                                        <Row key={user.username} style={{ width: '100%' }}>
                                            <Col span={16} style={{ textAlign: 'left' }}>
                                                <Tooltip title={user.name}>
                                                    <Tag color="volcano">{formatName(user.username)}</Tag>
                                                </Tooltip>
                                            </Col>
                                            <Col span={8} style={{ textAlign: 'right', fontWeight: 'bold' }}>
                                                {(user.score * 100).toFixed(0)}
                                            </Col>
                                        </Row>
                                    ))
                                )}
                            </Col>

                            {/* Fourth Column: Similar Users */}
                            <Col span={4}>
                                <Title level={4}>Similr Users</Title>

                                <Divider orientation="left">Most Similr</Divider>
                                {isLoadingSimilarUsers ? (
                                    <Spin size="small" style={{ marginLeft: 50 }} />
                                ) : (
                                    similarUsers?.slice(0, 10).map(user => (
                                        <Row key={user.username} style={{ width: '100%' }}>
                                            <Col span={16} style={{ textAlign: 'left' }}>
                                                <Tooltip title={formatName(user.name)}>
                                                    <Tag color="green">{user.username}</Tag>
                                                </Tooltip>
                                            </Col>
                                            <Col span={8} style={{ textAlign: 'right', fontWeight: 'bold' }}>
                                                {(user.score * 100).toFixed(0)}
                                            </Col>
                                        </Row>
                                    ))
                                )}

                                <Divider orientation="left">Least Similr</Divider>
                                {isLoadingSimilarUsers ? (
                                    <Spin size="small" style={{ marginLeft: 50 }} />
                                ) : (
                                    similarUsers?.slice(-10).map(user => (
                                        <Row key={user.username} style={{ width: '100%' }}>
                                            <Col span={16} style={{ textAlign: 'left' }}>
                                                <Tooltip title={user.name}>
                                                    <Tag color="volcano">{formatName(user.username)}</Tag>
                                                </Tooltip>
                                            </Col>
                                            <Col span={8} style={{ textAlign: 'right', fontWeight: 'bold' }}>
                                                {(user.score * 100).toFixed(0)}
                                            </Col>
                                        </Row>
                                    ))
                                )}
                            </Col>

                            {/* Fifth Column: Word Rankings */}
                            <Col span={4}>
                                <Title level={4}>Word Rankings</Title>

                                <Divider orientation="left">Top Words</Divider>
                                {isLoadingWordRankings ? (
                                    <Spin size="small" style={{ marginLeft: 50 }} />
                                ) : (
                                    wordRankings?.top_words.map(wordScore => (
                                        <Row key={wordScore.word} style={{ width: '100%' }}>
                                            <Col span={16} style={{ textAlign: 'left' }}>
                                                <Tag color="green">{wordScore.word}</Tag>
                                            </Col>
                                            <Col span={8} style={{ textAlign: 'right', fontWeight: 'bold' }}>
                                                {(wordScore.similarity_score * 1000).toFixed(0)}
                                            </Col>
                                        </Row>
                                    ))
                                )}

                                <Divider orientation="left">Bottom Words</Divider>
                                {isLoadingWordRankings ? (
                                    <Spin size="small" style={{ marginLeft: 50 }} />
                                ) : (
                                    wordRankings?.bottom_words.map(wordScore => (
                                        <Row key={wordScore.word} style={{ width: '100%' }}>
                                            <Col span={16} style={{ textAlign: 'left' }}>
                                                <Tag color="volcano">{wordScore.word}</Tag>
                                            </Col>
                                            <Col span={8} style={{ textAlign: 'right', fontWeight: 'bold' }}>
                                                {(wordScore.similarity_score * 1000).toFixed(0)}
                                            </Col>
                                        </Row>
                                    ))
                                )}
                            </Col>

                        </Row>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default WhoAmI;
