import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { Card, Row, Col, Spin, Typography, List, Tag, Divider, Select, Popover, Tooltip, Tabs } from 'antd';
import HeaderComponent from '../HeaderComponent';
import TabPane from 'antd/es/tabs/TabPane';
import UserProfile from './UserProfile';

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
    personal_development_advice: string;
    health_advice: string;
    social_advice: string;
    education_advice: string;
    lifestyle_advice: string;
    financial_advice: string;
    creative_advice: string;
    stress_advice: string;
}


const fetchCategories = async (): Promise<string[]> => {
    const authToken = localStorage.getItem('authToken');
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    const response = await fetch(`${backendUrl}api/categories/`, {
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
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    const tagsQueryString = tags.map(tag => `tags=${encodeURIComponent(tag)}`).join('&');
    const url = `${backendUrl}api/similar-groups/${username}/?${tagsQueryString}`;
  
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
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    const tagsQueryString = tags.map(tag => `tags=${encodeURIComponent(tag)}`).join('&');
    const url = `${backendUrl}api/similar-users/${username}/?${tagsQueryString}`;
  
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
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    let url = `${backendUrl}api/recommendations/${category}/`;
  
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
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    const response = await fetch(`${backendUrl}api/user/${username}/top-bottom-words/10/`, {
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
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    const response = await fetch(`${backendUrl}api/personality-profile/`, {
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
    const { data: wordRankings, isFetching: isFetchingWordRankings } = useQuery('wordRankings', fetchWordRankings);
    
    const {
        data: personalityProfile,
        isFetching: isFetchingProfile,
    } = useQuery('personalityProfile', fetchPersonalityProfile);

    const [selectedCategory, setSelectedCategory] = useState('General Personality');
    
    // Query for Combined Recommendations and Personality Traits
    const { data: combinedRankings, isFetching: isFetchingRankings } = useQuery(
        ['rankings', selectedCategory],
        () => fetchRecommendations(selectedCategory),
        { keepPreviousData: true }
    );

    // Query for Similar Groups with proper type
    const { data: similarGroups, isFetching: isFetchingSimilarGroups } = useQuery<SimilarUser[]>(
        ['similarGroups'],
        () => fetchSimilarGroups([]),
    );

    // Query for Similar Users with proper type
    const { data: similarUsers, isFetching: isFetchingSimilarUsers } = useQuery<SimilarUser[]>(
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

    const cardStyle = {
        borderRadius: '15px', // rounded corners
        boxShadow: '0px 0px 10px rgba(0,0,0,0.1)', // shadow effect
        padding: '20px', // inner spacing
        paddingTop: '20px',
        paddingBottom: '20px',
        margin: '10px',
    };

    const tabStyle = {
        fontSize: '18px', // larger size
        fontWeight: '500' // bold text
    };

    // Define the content for each tab
    const tabItems = [
        {
            label: <span style={tabStyle}>Personality</span>,
            key: '1',
            children: <Paragraph style={{ fontSize: '16px' }}>{personalityProfile?.personality}</Paragraph>,
        },
        {
            label: <span style={tabStyle}>Career</span>,
            key: '2',
            children: <Paragraph style={{ fontSize: '16px' }}>{personalityProfile?.career}</Paragraph>,
        },
        {
            label: <span style={tabStyle}>Matchmaker</span>,
            key: '3',
            children: <Paragraph style={{ fontSize: '16px' }}>{personalityProfile?.matchmaker}</Paragraph>,
        },
        {
            label: <span style={tabStyle}>Personal Development</span>,
            key: '4',
            children: <Paragraph style={{ fontSize: '16px' }}>{personalityProfile?.personal_development_advice}</Paragraph>,
        },
        {
            label: <span style={tabStyle}>Health</span>,
            key: '5',
            children: <Paragraph style={{ fontSize: '16px' }}>{personalityProfile?.health_advice}</Paragraph>,
        },
        {
            label: <span style={tabStyle}>Social</span>,
            key: '6',
            children: <Paragraph style={{ fontSize: '16px' }}>{personalityProfile?.social_advice}</Paragraph>,
        },
        {
            label: <span style={tabStyle}>Education</span>,
            key: '7',
            children: <Paragraph style={{ fontSize: '16px' }}>{personalityProfile?.education_advice}</Paragraph>,
        },
        {
            label: <span style={tabStyle}>Lifestyle</span>,
            key: '8',
            children: <Paragraph style={{ fontSize: '16px' }}>{personalityProfile?.lifestyle_advice}</Paragraph>,
        },
        {
            label: <span style={tabStyle}>Financial</span>,
            key: '9',
            children: <Paragraph style={{ fontSize: '16px' }}>{personalityProfile?.financial_advice}</Paragraph>,
        },
        {
            label: <span style={tabStyle}>Creative</span>,
            key: '10',
            children: <Paragraph style={{ fontSize: '16px' }}>{personalityProfile?.creative_advice}</Paragraph>,
        },
        {
            label: <span style={tabStyle}>Stress</span>,
            key: '11',
            children: <Paragraph style={{ fontSize: '16px' }}>{personalityProfile?.stress_advice}</Paragraph>,
        }
    ];

        
    // Custom style for Tabs container
    const tabsStyle = {
        maxWidth: '100%', // Adjust based on your layout
        overflow: 'hidden', // Hide overflowed tabs
    };

    return (
        <>
            <HeaderComponent />
            <Row justify="center" style={{ marginTop: '10px' }}>
                <Col span={24}>
                    <Card bordered={false}>
                        <Row gutter={[30, 30]}>
                            {/* First Column: Personality Profile and Similarity with Groups */}
                            <Col span={10} style={{ marginRight: '-12px'}}>                               
                                <Row style={cardStyle}>
                                    <UserProfile />
                                </Row>
                                <Row style={{...cardStyle, display: 'flex', justifyContent: 'center', alignItems: 'center'}}> {/* Adjust height as needed */}
                                    {isFetchingProfile ? (
                                        <Spin size="large" />
                                    ) : (
                                        <div style={tabsStyle}>
                                            <Tabs tabPosition="top" defaultActiveKey="1" items={tabItems} />
                                        </div>
                                    )}
                                </Row>
                            </Col>

                            {/* Merged Column: Rankings */}
                            <Col span={6} style={cardStyle}>
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
                                {isFetchingRankings ? <Spin style={{ marginLeft: '190px', marginTop: '100px'}} size="large" /> : (
                                    <List
                                        style={{ marginTop: '7px' }}
                                        size='small'
                                        dataSource={combinedRankings}
                                        renderItem={item => (
                                            <List.Item>
                                                <Row style={{ width: '100%' }}>
                                                    <Col span={16} style={{ textAlign: 'left', fontSize: '15px' }}>
                                                    <Popover
                                                        content={item.description}
                                                        title={item.title}
                                                        trigger="hover"
                                                        overlayStyle={{ fontSize: '16px', width: '500px' }} // Set your desired width here
                                                    >
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

                            <Col span={6} style={cardStyle}>
                                <Card style={{ marginTop: '-20px'}} bordered={false}>
                                    <Tabs defaultActiveKey="1">
                                        <TabPane tab={<span style={tabStyle}>People</span>} key="1">
                                            <Divider orientation="left">Most Similr</Divider>
                                            {isFetchingSimilarUsers ? (
                                                <Spin size="small" style={{ marginLeft: 70 }} />
                                            ) : (
                                                similarUsers?.slice(0, 10).map(user => (
                                                    <Row key={user.username} style={{ width: '100%' }}>
                                                        <Col span={16} style={{ textAlign: 'left' }}>
                                                            <Tooltip title={formatName(user.name)}>
                                                                <Tag style={{ marginBottom: '4px', fontSize: '14px' }} color="green">{user.username}</Tag>
                                                            </Tooltip>
                                                        </Col>
                                                        <Col span={8} style={{ textAlign: 'right', fontWeight: 'bold' }}>
                                                            {(user.score * 100).toFixed(0)}
                                                        </Col>
                                                    </Row>
                                                ))
                                            )}

                                            <Divider orientation="left">Least Similr</Divider>
                                            {isFetchingSimilarUsers ? (
                                                <Spin size="small" style={{ marginLeft: 70 }} />
                                            ) : (
                                                similarUsers?.slice(-10).map(user => (
                                                    <Row key={user.username} style={{ width: '100%' }}>
                                                        <Col span={16} style={{ textAlign: 'left' }}>
                                                            <Tooltip title={user.name}>
                                                                <Tag style={{ marginBottom: '4px', fontSize: '14px' }} color="volcano">{formatName(user.username)}</Tag>
                                                            </Tooltip>
                                                        </Col>
                                                        <Col span={8} style={{ textAlign: 'right', fontWeight: 'bold' }}>
                                                            {(user.score * 100).toFixed(0)}
                                                        </Col>
                                                    </Row>
                                                ))
                                            )}
                                        </TabPane>
                                        <TabPane tab={<span style={tabStyle}>Groups</span>} key="2">
                                            <Divider orientation="left">Most Similr</Divider>
                                            {isFetchingSimilarGroups ? (
                                                <Spin size="small" style={{ marginLeft: 70 }} />
                                            ) : (
                                                similarGroups?.slice(0, 10).map(user => (
                                                    <Row key={user.username} style={{ width: '100%' }}>
                                                        <Col span={16} style={{ textAlign: 'left' }}>
                                                            <Tooltip title={formatName(user.name)}>
                                                                <Tag style={{ marginBottom: '4px', fontSize: '14px' }} color="green">{user.username}</Tag>
                                                            </Tooltip>
                                                        </Col>
                                                        <Col span={8} style={{ textAlign: 'right', fontWeight: 'bold' }}>
                                                            {(user.score * 100).toFixed(0)}
                                                        </Col>
                                                    </Row>
                                                ))
                                            )}

                                            <Divider orientation="left">Least Similr</Divider>
                                            {isFetchingSimilarGroups ? (
                                                <Spin size="small" style={{ marginLeft: 70 }} />
                                            ) : (
                                                similarGroups?.slice(-10).map(user => (
                                                    <Row key={user.username} style={{ width: '100%' }}>
                                                        <Col span={16} style={{ textAlign: 'left' }}>
                                                            <Tooltip title={user.name}>
                                                                <Tag style={{ marginBottom: '4px', fontSize: '14px' }} color="volcano">{formatName(user.username)}</Tag>
                                                            </Tooltip>
                                                        </Col>
                                                        <Col span={8} style={{ textAlign: 'right', fontWeight: 'bold' }}>
                                                            {(user.score * 100).toFixed(0)}
                                                        </Col>
                                                    </Row>
                                                ))
                                            )}
                                        </TabPane>
                                        <TabPane tab={<span style={tabStyle}>Words</span>} key="3">
                                                
                                            <Divider orientation="left">Top</Divider>
                                            {isFetchingWordRankings ? (
                                                <Spin size="small" style={{ marginLeft: 50 }} />
                                            ) : (
                                                wordRankings?.top_words.map(wordScore => (
                                                    <Row key={wordScore.word} style={{ width: '100%' }}>
                                                        <Col span={16} style={{ textAlign: 'left' }}>
                                                            <Tag style={{ marginBottom: '4px', fontSize: '14px' }} color="green">{wordScore.word}</Tag>
                                                        </Col>
                                                        <Col span={8} style={{ textAlign: 'right', fontWeight: 'bold' }}>
                                                            {(wordScore.similarity_score * 1000).toFixed(0)}
                                                        </Col>
                                                    </Row>
                                                ))
                                            )}

                                            <Divider orientation="left">Bottom</Divider>
                                            {isFetchingWordRankings ? (
                                                <Spin size="small" style={{ marginLeft: 50 }} />
                                            ) : (
                                                wordRankings?.bottom_words.map(wordScore => (
                                                    <Row key={wordScore.word} style={{ width: '100%' }}>
                                                        <Col span={16} style={{ textAlign: 'left' }}>
                                                            <Tag style={{ marginBottom: '4px', fontSize: '14px' }} color="volcano">{wordScore.word}</Tag>
                                                        </Col>
                                                        <Col span={8} style={{ textAlign: 'right', fontWeight: 'bold' }}>
                                                            {(wordScore.similarity_score * 1000).toFixed(0)}
                                                        </Col>
                                                    </Row>
                                                ))
                                            )}
                                        </TabPane>
                                    </Tabs>
                                </Card>
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default WhoAmI;
