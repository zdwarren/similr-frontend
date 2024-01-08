import React, { useState } from 'react';
import { Row, Col, Avatar, Typography, Tag, Button, Badge, Select, Tooltip, Spin, TabsProps, Tabs } from 'antd';
import { CheckOutlined, EditOutlined, UserOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import UserEnteredData from './UserEnteredData';
import Dating from './Dating';

const { Title } = Typography;

interface TagInfo {
    name: string;
    is_private: boolean;
}

interface Recommedation {
    title: string;
    description: string;
    score: number;
}

interface UserProfileData {
    username: string;
    questionsAnswered: number;
    rank: string;
    personalityRecs: Recommedation[];
    careerRecs: Recommedation[];
    hogwartsHouse: Recommedation;
    dnd: Recommedation[];
    publicGroups: string[];
    privateGroups: string[];
}

const updateTags = async (tags: {publicGroups: string[], privateGroups: string[]}): Promise<void> => {
    const authToken = localStorage.getItem('authToken');
    const backendUrl = process.env.REACT_APP_BACKEND_URL;

    const response = await fetch(`${backendUrl}api/updateTags/`, {
        method: 'POST',
        headers: {
            'Authorization': `Token ${authToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(tags),
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
};

const fetchTags = async (): Promise<TagInfo[]> => {
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
        throw new Error('Network response was not ok');
    }
    return response.json();
};

const fetchUserProfile = async (): Promise<UserProfileData> => {
    const authToken = localStorage.getItem('authToken');
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    const response = await fetch(`${backendUrl}api/userprofile/`, { // adjust the endpoint as needed
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
  
  const UserProfile = () => {
    const [isEditingGroups, setIsEditingGroups] = useState(false);
    const [editingPublicGroups, setEditingPublicGroups] = useState<string[]>([]);
    const [editingPrivateGroups, setEditingPrivateGroups] = useState<string[]>([]);

    const queryClient = useQueryClient();

    const { data: userInfo, isLoading: isLoadingUserInfo } = useQuery<UserProfileData>('userProfile', fetchUserProfile, {
        onSuccess: (data) => {
            setEditingPublicGroups(data?.publicGroups || []);
            setEditingPrivateGroups(data?.privateGroups || []);
        },
    });

    const { data: tags, isLoading: isLoadingTags } = useQuery<TagInfo[]>('tags', fetchTags);

    const mutation = useMutation<void, Error, {publicGroups: string[], privateGroups: string[]}>(updateTags, {
        onSuccess: () => {
            queryClient.setQueryData<UserProfileData>('userProfile', old => {
                const updatedUserInfo = { ...old } as UserProfileData;
                updatedUserInfo.publicGroups = editingPublicGroups; // Consider updating privateGroups as well
                updatedUserInfo.privateGroups = editingPrivateGroups
                // Implement any necessary updates or refreshes after successful mutation
                return updatedUserInfo;
            });
            setIsEditingGroups(false); // Consider resetting both state variables
        },
    });
        
    // const generateReports = async () => {
        
    //     try {
    //         const authToken = localStorage.getItem('authToken');
    //         const backendUrl = process.env.REACT_APP_BACKEND_URL;

    //         const response = await fetch(`${backendUrl}api/generate-profile-reports/`, {
    //             method: 'POST', // or 'GET' if the endpoint is designed that way
    //             headers: {
    //                 'Authorization': `Token ${authToken}`,
    //                 'Content-Type': 'application/json',
    //             },
    //             // Include any necessary data in the body, if it's a POST request
    //         });

    //         if (!response.ok) {
    //             throw new Error('Failed to generate reports');
    //         }

    //         // Refresh user profile data
    //         queryClient.invalidateQueries('userProfile');
    //         message.success('Reports generated successfully!');
    //     } catch (error) {
    //         message.error(`Failed to generate reports`);
    //     }
    // };
    
    const handleFinishEditing = () => {
        // Collect and structure both public and private groups data
        const tagsToUpdate = {
            publicGroups: editingPublicGroups,
            privateGroups: editingPrivateGroups,
        };
        mutation.mutate(tagsToUpdate); // Send the structured data to the mutation
    };
    
    const isLoading = isLoadingUserInfo || isLoadingTags;

    if (isLoading || !userInfo) {
        return (
            <Row justify="center" align="middle" style={{ height: "300px", width: "100%" }}>
                <Col>
                    <Spin size="large" />
                </Col>
            </Row>
        );

    }
        
    // Style for larger tags
    const largerTagStyle = {
        fontSize: '13px', // Increase font size
        margin: '2px 2px',
        padding: '2px 8px', // Increase padding for larger click area and visual size
        borderRadius: '7px', // Optional: for rounded corners
    };

    // Style for larger tags
    const groupTagStyle = {
        fontSize: '13px', // Increase font size
        margin: '2px 2px',
        padding: '2px 6px', // Increase padding for larger click area and visual size
        borderRadius: '7px', // Optional: for rounded corners
    };

    const publicOptions = tags
        ? [...tags] // Create a copy of the tags array
            .filter(tag => !tag.is_private) // Filter out private tags
            .sort((a, b) => a.name.localeCompare(b.name)) // Sort by name
            .map(tag => ({ // Map to the desired structure
                label: tag.name,
                value: tag.name,
            }))
        : [];

    const privateOptions = tags
        ? [...tags] // Create a copy of the tags array
            .filter(tag => tag.is_private) // Filter for private tags
            .sort((a, b) => a.name.localeCompare(b.name)) // Sort by name
            .map(tag => ({ // Map to the desired structure
                label: tag.name,
                value: tag.name,
            }))
        : [];

    // Define tabBarExtraContent with the Generate Reports button
    // const tabBarExtraContent = (
    //     <Button onClick={generateReports}>Generate Reports</Button>
    // );

    // Define the items for the tabs
    const items: TabsProps['items'] = [
        {
            label: 'Personality',
            key: '1',
            children: (
                // Personality related content
                <Row gutter={[0, 0]}>
                    <Col span={12}>
                        <Title level={5} style={{ marginTop: '0px' }}>General</Title>
                        {userInfo.personalityRecs?.slice(0, 5).map(tag => (
                            <Col span={24} key={tag.title}>
                                <Tooltip title={tag.description}>
                                    <Tag color="blue" style={largerTagStyle}>{tag.title} ({(tag.score * 1000).toFixed(0)})</Tag>
                                </Tooltip>
                            </Col>
                        ))}
                    </Col>
                    <Col span={12}>
                        <Title level={5} style={{ marginTop: '0px' }}>Specfic</Title>
                        {userInfo.personalityRecs?.slice(5, 10).map(tag => (
                            <Col span={24} key={tag.title}>
                                <Tooltip title={tag.description}>
                                    <Tag color="blue" style={largerTagStyle}>{tag.title} ({(tag.score * 1000).toFixed(0)})</Tag>
                                </Tooltip>
                            </Col>
                        ))}
                    </Col>
                </Row>
            ),
        },
        {
            label: 'Career',
            key: '2',
            children: (
                // Career related content
                <Row gutter={[0, 0]}>
                    <Col span={12}>
                        <Title level={5} style={{ marginTop: '0px' }}>General</Title>
                        {userInfo.careerRecs?.slice(0, 5).map(tag => (
                            <Col span={24} key={tag.title}>
                                <Tooltip title={tag.description}>
                                    <Tag color="green" style={largerTagStyle}>{tag.title} ({(tag.score * 1000).toFixed(0)})</Tag>
                                </Tooltip>
                            </Col>
                        ))}
                    </Col>
                    <Col span={12}>
                        <Title level={5} style={{ marginTop: '0px' }}>Specfic</Title>
                        {userInfo.careerRecs?.slice(5, 10).map(tag => (
                            <Col span={24} key={tag.title}>
                                <Tooltip title={tag.description}>
                                    <Tag color="green" style={largerTagStyle}>{tag.title} ({(tag.score * 1000).toFixed(0)})</Tag>
                                </Tooltip>
                            </Col>
                        ))}
                    </Col>
                </Row>
            ),
        },
        {
            label: 'Compatibility',
            key: '3',
            children: <Dating />,
        },
        {
            label: 'Groups',
            key: '4',
            children: (
                <>
                    <Row gutter={[12, 12]} style={{ marginTop: '10px' }}>
                        <Col span={24}>
                            <strong>Public Groups: </strong>
                            {!isEditingGroups ? (
                                userInfo.publicGroups?.sort().map(group => <Tag style={groupTagStyle} key={group}>{group}</Tag>)
                                ) : (
                                <Select
                                    mode="multiple"
                                    allowClear
                                    style={{ width: '90%' }}
                                    placeholder="Public Groups"
                                    defaultValue={editingPublicGroups.filter(group => !(tags || []).find(tag => tag.name === group)?.is_private)} 
                                    onChange={newTags => setEditingPublicGroups(newTags)}
                                    options={publicOptions} // use the publicOptions
                                />
                            )}
                        </Col>
                        <Col span={24}>
                            <strong>Private Groups: </strong>
                            {!isEditingGroups ? (
                                userInfo.privateGroups?.sort().map(group => <Tag style={groupTagStyle} key={group}>{group}</Tag>)
                                ) : (
                                <Select
                                    mode="multiple"
                                    allowClear
                                    style={{ width: '90%', zIndex: 1000 }}
                                    placeholder="Private Groups"
                                    defaultValue={userInfo.privateGroups?.filter(group => (tags || []).find(tag => tag.name === group)?.is_private)}
                                    onChange={newTags => setEditingPrivateGroups(newTags)}
                                    options={privateOptions}
                                />
                            )}
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24} style={{ textAlign: 'right', marginTop: '-30px' }}>
                            <Tooltip title={isEditingGroups ? "Finish Editing" : "Edit Groups"}>
                                <Button
                                    shape="circle"
                                    icon={isEditingGroups ? <CheckOutlined /> : <EditOutlined />}
                                    onClick={() => isEditingGroups ? handleFinishEditing() : setIsEditingGroups(true)}
                                />
                            </Tooltip>
                        </Col>
                    </Row>
                </>
            ),
        },
        // {
        //     label: 'Profile',
        //     key: '5',
        //     children: <UserEnteredData />
        // },
    ];

    // Define a function to determine rank and color
    const determineRankAndColor = (questionsAnswered: number) => {
        let rank, color;
        if (questionsAnswered < 100) {
            rank = "Novice";
            color = "#2db7f5"; // Blue
        } else if (questionsAnswered < 200) {
            rank = "Intermediate";
            color = "#f50"; // Red
        } else if (questionsAnswered < 300) {
            rank = "Bronze";
            color = "#CD7F32"; // Bronze
        } else if (questionsAnswered < 400) {
            rank = "Silver";
            color = "#c0c0c0"; // Silver
        } else {
            rank = "Gold";
            color = "#ffd700"; // Gold
        }
        return { rank, color };
    };

    // Extract the rank and color based on questionsAnswered count
    const { rank, color } = determineRankAndColor(userInfo?.questionsAnswered);

    return (
        <>
            <Col span={7} style={{ textAlign: 'center' }}>
                <Avatar size={128} icon={<UserOutlined />} style={{ margin: '0 auto' }} />
                <Title level={4} style={{ marginTop: '10px' }}>{userInfo.username}</Title>
                <Badge 
                    size='default'
                    count={`${rank} (${userInfo.questionsAnswered})`}
                    style={{ padding: '0px 20px', fontSize: '14px', backgroundColor: color }}
                    title={`${userInfo.questionsAnswered} Questions Answered`}
                />
            </Col>
            <Col span={17}>
                <Tabs size="small" defaultActiveKey="1" items={items} />
            </Col>
        </>
    );
};

export default UserProfile;
