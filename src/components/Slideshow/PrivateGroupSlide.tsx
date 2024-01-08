import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { Select, Button, Card, Row, Col, Spin, Popover, Image } from 'antd';
import Slide from './Slide';

const { Option, OptGroup } = Select;

interface Group {
    name: string;
    is_private: boolean;
  }

interface Insight {
    id: number;
    username: string;
    fullname: string;
    question_type: string;
    insight_area: string;
    insight_category: string;
    is_high: boolean;
    title: string;
    description: string;
    image_url: string;
    score: number;
    rank: number;
}

const fetchGroups = async (): Promise<Group[]> => {
    const authToken = localStorage.getItem('authToken');
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    const response = await fetch(`${backendUrl}api/tags/`, {
        method: 'GET',
        headers: {
            'Authorization': `Token ${authToken}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Network response was not ok while fetching groups');
    }
    return response.json();
};

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
        throw new Error('Network response was not ok while fetching categories');
    }
    let categories: string[] = await response.json();

    const allowedCategories = ["Personality", "Career", "Hogwarts House", "Archetype", "Hobby", "Food", "D&D Class", "Motivation",
                              "Movie", "Music", "TV", "Gift Category", "General Personality", "General Career"];

    categories = categories.filter(category => allowedCategories.includes(category));
    categories.push("Famous Person");
    categories.push("Animal");
    categories.push("D&D Character");
    categories.push("Fantasy Character");
    categories.push("Personality Overview");


    return categories.sort();
};

const fetchRecommendations = async (groupName: string, category: string): Promise<Insight[]> => {
    const authToken = localStorage.getItem('authToken');
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    const response = await fetch(`${backendUrl}api/result-group-recs/?tag=${encodeURIComponent(groupName)}&category=${encodeURIComponent(category)}`, {
        method: 'GET',
        headers: {
            'Authorization': `Token ${authToken}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Network response was not ok while fetching recommendations');
    }
    return response.json();
};

const categorizeGroups = (groups: Group[] | undefined) => {
    if (!groups) return { privateGroups: [], famousGroups: [] };

    const privateGroups = groups.filter(group => group.is_private)
                                .sort((a, b) => a.name.localeCompare(b.name));
    const famousGroups = groups.filter(group => !group.is_private)
                               .sort((a, b) => a.name.localeCompare(b.name));

    return { privateGroups, famousGroups };
};

const PrivateGroupSlide = () => {
    const { data: groups, isLoading: isLoadingGroups } = useQuery('groups', fetchGroups);
    const { data: categories, isLoading: isLoadingCategories } = useQuery('categories', fetchCategories);

    const overviewCategories = ["Animal", "D&D Character", "Fantasy Character", "Personality Overview"];
    const regularCategories = categories?.slice()?.filter(category => !overviewCategories.includes(category));
    
    const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [results, setResults] = useState<Insight[]>([]);
    const [loading, setLoading] = useState(false);

    const { privateGroups, famousGroups } = categorizeGroups(groups);

    const handleGetRecommendations = async () => {
        if (!selectedGroup || !selectedCategory) {
            // You might want to show an error or alert here
            console.log("Please select both a group and category");
            return;
        }

        setLoading(true);
        try {
            let recs = await fetchRecommendations(selectedGroup, selectedCategory);
            recs = recs.sort((a, b) => {
                const nameA = a.fullname || a.username; // Use fullname if it exists, else username
                const nameB = b.fullname || b.username; // Same for b
                return nameA.localeCompare(nameB); // Compare the two names
            });
            setResults(recs);
        } catch (error) {
            console.error("Error fetching recommendations:", error);
            // Handle error (maybe set an error state and display a message)
        }
        setLoading(false);
    };
    
    const textStyle: React.CSSProperties = {
        textAlign: 'center',
        width: '100%',
        fontSize: '16px', // Increase font size
        fontWeight: '500', // Medium font weight, you can use 600 or 700 for bolder text
        margin: -10,
    };

    const formatInsightText = (insight: Insight) => {
        const overviewCategories = ['Animal', 'D&D Character', 'Fantasy Character', 'Personality Overview'];
        let scoreText = "";
    
        if (insight.insight_category === 'Famous Person') {
            scoreText = ` (${(insight.score * 100).toFixed(0)})`;
        } else if (!overviewCategories.includes(insight.insight_category)) {
            scoreText = ` (${(insight.score * 1000).toFixed(0)})`;
        }
    
        return `${insight.insight_area}${scoreText}`;
    };
           
    const renderResultsGrid = () => {
        const getColSpan = () => {
            const itemCount = results.length;
            if (itemCount <= 4) return 12; // 1 x 2 layout for 1 or 2 items
            return 8; // 2 x 2 layout for 3 or 4 items
        };

        const rowStyle = { rowGap: '10px', marginBottom: '10px' };
        const colStyle = { textAlign: 'center' as const };

        const placeholderImageStyle: React.CSSProperties = {
            width: '100%',
            lineHeight: results.length <= 4 ? '365px' : '240px',
            border: '1px dashed #ccc',
            borderRadius: '8px',
            textAlign: 'center',
            color: '#ccc',
            fontSize: '16px',
            fontWeight: 'bold',
        };

         return (
            <Row gutter={[16, 16]} style={rowStyle}>
                {results.map((result, index) => (
                    <Col key={index} span={getColSpan()} style={colStyle}>
                        <Card 
                            title={result.fullname || result.username}
                            cover={
                                result.id ? 
                                <Image
                                    alt="Insight"
                                    src={result.image_url}
                                /> :
                                <div style={placeholderImageStyle}>Not Generated Yet</div>
                            }
                        >
                            {result.id ? (
                                <Popover
                                    content={
                                        <div style={{ maxWidth: '500px' }}>
                                            <p>{result.description}</p>
                                        </div>
                                    }
                                    title={(result.fullname ? result.fullname : result.username) + ": " + result.title}
                                >
                                    <p style={textStyle}>{formatInsightText(result)}</p>
                                </Popover>
                            ) : (
                                <p style={textStyle}>???</p>
                            )}
                        </Card>
                    </Col>
                ))}
            </Row>
        );
    };
        
    const titleStyle: React.CSSProperties = {
        fontSize: '24px', // Bigger font size for the title
        textAlign: 'center', // Center the title text
        fontWeight: 'bold', // Make the title text bold
        padding: '10px',
    };

    if (isLoadingGroups || isLoadingCategories) return <Spin size="large" />;

    return (
        <Slide>
            <Card style={{ width: '100%', maxWidth: '800px', margin: 'auto' }} title={<div style={titleStyle}>Compare Your Groups</div>} bordered={false}>
                <Select
                    value={selectedGroup}
                    onChange={setSelectedGroup}
                    placeholder="Select Group"
                    style={{ width: 200, marginRight: 8, marginBottom: 20 }}
                >
                    <OptGroup label="Your Private Groups">
                        {privateGroups.map(group => (
                            <Option key={group.name} value={group.name}>{group.name}</Option>
                        ))}
                    </OptGroup>
                    <OptGroup label="Famous People Groups">
                        {famousGroups.map(group => (
                            <Option key={group.name} value={group.name}>{group.name}</Option>
                        ))}
                    </OptGroup>
                </Select>

                <Select
                    value={selectedCategory}
                    onChange={setSelectedCategory}
                    placeholder="Select Category"
                    style={{ width: 200, marginRight: 8 }}
                >
                    <OptGroup label="Overview Results">
                        {overviewCategories.map((category, index) => (
                            <Option key={index + 100} value={category}>{category}</Option>
                        ))}
                    </OptGroup>
                    <OptGroup label="Categories">
                        {regularCategories?.map((category, index) => (
                            <Option key={index} value={category}>{category}</Option>
                        ))}
                    </OptGroup>
                </Select>
                <Button onClick={handleGetRecommendations} type="primary" loading={loading}>Compare</Button>
                {renderResultsGrid()}
            </Card>
        </Slide>
    );
};

export default PrivateGroupSlide;
