import React, { useState, useContext } from 'react';
import { Button, Form, Input, Card, Select } from 'antd';
import { AuthContext } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import { LockOutlined, UserOutlined } from '@ant-design/icons';

const { Option } = Select;

const SignupForm: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [signupCode, setSignupCode] = useState('');
    const [pathType, setPathType] = useState('');

    const authContext = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Modify to include pathType in the signup method
        authContext.signup(username, password, signupCode, pathType).then(() => navigate('/rapidfire'));
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', height: '90vh', paddingTop: '5vh', backgroundColor: '#f0f2f5' }}>
            <Card style={{ width: 400 }}>
                <h2 style={{ textAlign: 'center', fontSize: '24px', fontWeight: 'bold' }}>
                    Create Your Similr Account
                </h2>
                <Form onSubmitCapture={handleSubmit} layout="vertical">
                    <Form.Item
                        name="pathType"
                        rules={[{ required: true, message: 'Please select your Path!' }]}
                    >
                        <Select
                            placeholder="Select your Path"
                            onChange={value => setPathType(value)}
                        >
                            <Option value="personality">Personality</Option>
                            <Option disabled value="career_education">Career/Education</Option>
                            <Option disabled value="dating">Dating</Option>
                            <Option disabled value="find_new_friends">Find New Friends</Option>
                            <Option disabled value="relationship">Relationship</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="signupCode"
                        rules={[{ required: true, message: 'Please input your Signup Code!' }]}
                    >
                        <Input
                            placeholder="Beta Signup Code"
                            value={signupCode}
                            onChange={(e) => setSignupCode(e.target.value)}
                        />
                    </Form.Item>
                    <Form.Item
                        name="username"
                        rules={[{ required: true, message: 'Please input your Username!' }]}
                    >
                        <Input
                            prefix={<UserOutlined />}
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Please input your Password!' }]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                            Sign Up
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default SignupForm;
