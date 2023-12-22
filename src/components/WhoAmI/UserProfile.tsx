import React, { useState } from 'react';
import { Row, Col, Avatar, Typography, Tag, Button, Badge, Select, Divider, Tooltip, Spin } from 'antd';
import { CheckOutlined, EditOutlined, UserOutlined } from '@ant-design/icons';
import { useQuery } from 'react-query';

const { Title } = Typography;


interface TagValue {
    title: string;
    description: string;
    score: number;
}

interface UserProfileData {
    username: string;
    questionsAnswered: number;
    rank: string;
    personalityTags: TagValue[];
    careerTags: TagValue[];
    hogwartsHouse: TagValue;
    dnd: TagValue[];
    publicGroups: string[];
    privateGroups: string[];
}

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

    const { data: userInfo, isLoading, isFetching } = useQuery('userProfile', fetchUserProfile);

    if (isLoading || isFetching || !userInfo) {
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
        margin: '7px 5px',
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

    return (
    <>
        <Col span={7} style={{ textAlign: 'center' }}>
            <Avatar size={128} icon={<UserOutlined />} style={{ margin: '0 auto' }} />
            <Title level={4} style={{ marginTop: '10px' }}>{userInfo.username}</Title>
            <Badge 
                size='default'
                count={`${userInfo.rank} (${userInfo.questionsAnswered})`}
                style={{ padding: '0px 20px', fontSize: '14px', backgroundColor: '#faad14' }}
                title={`${userInfo.questionsAnswered} Questions Answered`}
            />
        </Col>
        <Col span={17}>
            {/* Top half for highest-ranking attributes */}
            <Row gutter={[0, 0]}>
                <Col span={24}>
                {userInfo.personalityTags.map(tag => (
                    <Tooltip title={tag.description} key={tag.title}>
                        <Badge size="small" count={(tag.score * 1000).toFixed(0)} offset={[-8, 5]} overflowCount={999} style={{ backgroundColor: '#52c41a' }}>
                            <Tag color="blue" style={largerTagStyle}>{tag.title}</Tag>
                        </Badge>
                    </Tooltip>
                ))}
                </Col>
                <Col span={24}>
                    {userInfo.careerTags.map(tag => (
                        <Tooltip title={tag.description} key={tag.title}>
                            <Badge size="small" count={(tag.score * 1000).toFixed(0)} offset={[-8, 5]} overflowCount={999} style={{ backgroundColor: '#52c41a' }}>
                                <Tag color="green" style={largerTagStyle}>{tag.title}</Tag>
                            </Badge>
                        </Tooltip>
                    ))}
                </Col>
                <Col span={24}>
                    <strong>Hogwarts House: </strong>
                    <Tooltip title={userInfo.hogwartsHouse.description} key={userInfo.hogwartsHouse.title}>
                        <Badge size="small" count={(userInfo.hogwartsHouse.score * 1000).toFixed(0)} offset={[-8, 5]} overflowCount={999} style={{ backgroundColor: '#52c41a' }}>
                            <Tag color="green" style={largerTagStyle}>{userInfo.hogwartsHouse.title}</Tag>
                        </Badge>
                    </Tooltip>
                </Col>
                <Col span={24}>
                    <strong>D&D: </strong>
                    {userInfo.dnd.map(tag => (
                        <Tooltip title={tag.description} key={tag.title}>
                            <Badge size="small" count={(tag.score * 1000).toFixed(0)} offset={[-8, 5]} overflowCount={999} style={{ backgroundColor: '#52c41a' }}>
                                <Tag color="green" style={largerTagStyle}>{tag.title}</Tag>
                            </Badge>
                        </Tooltip>
                    ))}
                </Col>
            </Row>
            <Divider />
            {/* Bottom half for groups */}
            <Row gutter={[12, 12]} style={{ marginTop: '20px' }}>
                <Col span={24}>
                    <strong>Public Groups: </strong>
                    {!isEditingGroups ?
                        userInfo.publicGroups.map(group => <Tag style={groupTagStyle} key={group}>{group}</Tag>) :
                        <Select mode="tags" style={{ width: '90%' }} placeholder="Public Groups">
                            {/* Options could be fetched or defined elsewhere */}
                        </Select>
                    }
                </Col>
                <Col span={24}>
                    <strong>Private Groups: </strong>
                    {!isEditingGroups ?
                        userInfo.privateGroups.map(group => <Tag style={groupTagStyle} key={group}>{group}</Tag>) :
                        <Select mode="tags" style={{ width: '90%' }} placeholder="Private Groups">
                            {/* Options could be fetched or defined elsewhere */}
                        </Select>
                    }
                </Col>
            </Row>
            <Row>
                <Col span={24} style={{ textAlign: 'right', marginTop: '-30px' }}>
                    <Tooltip title={isEditingGroups ? "Finish Editing" : "Edit Groups"}>
                        <Button
                            shape="circle"
                            icon={isEditingGroups ? <CheckOutlined /> : <EditOutlined />}
                            onClick={() => setIsEditingGroups(!isEditingGroups)}
                        />
                    </Tooltip>
                </Col>
            </Row>
        </Col>
    </>
    );
};

export default UserProfile;
