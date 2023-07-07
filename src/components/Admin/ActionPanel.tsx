import React from 'react';
import { Form, Input, Select, Button, Row, Col, Card } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { Match } from './MatchPage';

interface ActionPanelProps {
    match: Match;
}

interface FormValues {
    user1?: string;
    user2?: string;
    username?: string;
}

const ActionPanel: React.FC<ActionPanelProps> = ({ match }) => {


    const handleGenerateMatch = (values: FormValues) => {
        // handle generate match
        console.log(values.user1, values.user2);
    };

    const handleCreateUser = (values: FormValues) => {
        // handle create user
        console.log(values.username);
    };


    return (
        <Card title="Action Panel">
            <Form name="generateMatch" onFinish={handleGenerateMatch}>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="user1"
                            rules={[{ required: true, message: 'Please select a user' }]}
                        >
                            <Select placeholder="Select user 1" allowClear>
                                {/* Options populated with users */}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="user2"
                            rules={[{ required: true, message: 'Please select a user' }]}
                        >
                            <Select placeholder="Select user 2" allowClear>
                                {/* Options populated with users */}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Generate Match
                    </Button>
                </Form.Item>
            </Form>

            <Form name="createUser" onFinish={handleCreateUser}>
                <Form.Item
                    name="username"
                    rules={[{ required: true, message: 'Please input a username' }]}
                >
                    <Input prefix={<UserOutlined />} placeholder="Username" />
                </Form.Item>
                {/* Additional form items for user traits, secrets, etc */}
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Create User
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default ActionPanel;
