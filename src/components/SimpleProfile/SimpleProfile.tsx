import React from 'react';
import { useQuery, useMutation } from 'react-query';
import moment from 'moment';
import HeaderComponent from '../HeaderComponent';

import { Form, Input, Button, Select, DatePicker, Checkbox, Space, Row, Col, Tooltip, message } from 'antd';
import { UserOutlined, CalendarOutlined } from '@ant-design/icons';


interface UserData {
    name?: string;
    birthdate?: string; // or Date, depending on the format you're using
    genderIdentity?: string;
    interests?: string[];
}

const fetchUserData = async (): Promise<UserData> => {
    try {
      const authToken = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:8000/api/my-profile/', {
          method: 'GET',
          headers: {
              'Authorization': `Token ${authToken}`,
              'Content-Type': 'application/json',
          }
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      throw error; // Rethrow the error for react-query to handle
    }
  };
  
const updateUserData = async (userData: UserData): Promise<void> => {
// Update user data logic
};

const SimpleProfile = () => {
  const { Option } = Select;
  const [form] = Form.useForm();

  const { data, isLoading, error } = useQuery<UserData>('userData', fetchUserData);

  const mutation = useMutation(updateUserData, {
    onSuccess: () => {
      message.success('Profile updated successfully');
    },
    onError: (error: any) => {
      message.error(error.message || 'Error updating profile');
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error occurred</div>;

  const onFinish = (values: UserData) => {
    mutation.mutate(values);
  };
  
  // Handling potential undefined data
  if (!data) return <div>Loading...</div>; // Adjust this as per your loading/error handling strategy

  return (
    <>
      <HeaderComponent />
      <div className="form-container">
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            ...data,
            birthdate: data && data.birthdate ? moment(data.birthdate) : null,
          }}
          onFinish={onFinish}
        >
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item name="name" label="Name">
                <Input prefix={<UserOutlined />} placeholder="Enter your name" />
              </Form.Item>
            </Col>
    
            <Col span={24}>
              <Form.Item name="birthdate" label="Birthdate">
                <Space>
                  <CalendarOutlined />
                  <DatePicker style={{ width: '100%' }} />
                </Space>
              </Form.Item>
            </Col>
    
            <Col span={24}>
              <Form.Item name="gender" label="Gender Identity">
                <Select placeholder="Select your gender identity">
                  <Option value="male">Male</Option>
                  <Option value="female">Female</Option>
                  {/* ... other options */}
                </Select>
              </Form.Item>
            </Col>
    
            <Col span={24}>
              <Tooltip title="Select your interests">
                <Form.Item name="interests" label="Interests">
                  <Checkbox.Group style={{ width: '100%' }}>
                    <Row>
                      <Col span={8}><Checkbox value="music">Music</Checkbox></Col>
                      <Col span={8}><Checkbox value="sports">Sports</Checkbox></Col>
                      <Col span={8}><Checkbox value="horseback riding">Horseback Riding</Checkbox></Col>
                      {/* ... other options */}
                    </Row>
                  </Checkbox.Group>
                </Form.Item>
              </Tooltip>
            </Col>
          </Row>
    
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Update Profile
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default SimpleProfile;
