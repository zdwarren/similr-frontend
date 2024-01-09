import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { Card, Spin, Col, Row, Select, Button, Typography, message } from 'antd';
import Slide from './Slide';

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;

interface CompatibilityReport {
    shared_interests: string[];
    potential_challenges: string[];
    summary_statement: string;
    detailed_analysis: string;
    compatibility_score: number;
    recommended_first_date: string;
}

interface User {
    username: string;
  }

const fetchUsernames = async (): Promise<User[]> => {
    const authToken = localStorage.getItem('authToken');
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
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
    return response.json().then(users => users.sort((a: User, b: User) => a.username.toLowerCase().localeCompare(b.username.toLowerCase())));
  };


const CompatibilitySlide: React.FC = () => {
    const username = localStorage.getItem('username') || "user"; // current user
    const [selectedFamousPerson, setSelectedFamousPerson] = useState<string>('');
    const [compatibilityReport, setCompatibilityReport] = useState<CompatibilityReport | null>(null);
    const [loading, setLoading] = useState(false);

    const { data: famousPeople, isLoading: isLoadingFamousPeople } = useQuery('famousPeople', fetchUsernames);

    const fetchCompatibilityReport = async () => {
        // Ensure both users are selected
        if (!selectedFamousPerson) {
          message.error("Please select two users.");
          return;
        }
    
        setLoading(true);
        const authToken = localStorage.getItem('authToken');
        const backendUrl = process.env.REACT_APP_BACKEND_URL;
    
        try {
          const response = await fetch(`${backendUrl}api/check-compatibility/`, {
            method: 'POST',
            headers: {
              'Authorization': `Token ${authToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username1: username, username2: selectedFamousPerson }),
          });
    
          if (!response.ok) {
            throw new Error('Failed to fetch compatibility report');
          }
    
          const data = await response.json();
          setCompatibilityReport(data);
          message.success('Compatibility report generated successfully!');
        } catch (error: any) {
          message.error(`Failed to fetch compatibility report: Famous person is missing matchmaker report.`);
        } finally {
          setLoading(false);
        }
      };
  // Corrected filterOption method for both Select components
  const filterOption = (input: string, option: any) =>
    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;

  const scaleCompatibilityScore = (score: number | undefined) => {
    if (!score) return 1;
    if (score <= 25) return 1; // Scores 25 or less are scaled to 1
    if (score >= 85) return 10; // Scores 85 or more are scaled to 10
  
    // Linear scaling for scores between 25 and 85
    return Math.round((score - 25) * (9 / 60) + 1); // Adjusted formula to scale between 1-10
  };
  
  // Usage in your component
  const scaledScore = scaleCompatibilityScore(compatibilityReport?.compatibility_score);

    // Add custom styles
    const titleStyle: React.CSSProperties = {
        fontSize: '24px',
        textAlign: 'center',
        fontWeight: 'bold',
        padding: '20px',
    };

    return (
        <Slide>
            <Card title={<div style={titleStyle}>Who Are You Compatible With?</div>} bordered={false} style={{ width: '100%', maxWidth: '800px', margin: 'auto' }}>
                <Spin size='large' spinning={isLoadingFamousPeople || loading}>
                    <Row justify="center" style={{ marginTop: '20px', marginBottom: '20px' }}>
                        <Col span={24} style={{ textAlign: 'center' }}>
                           <Select
                                showSearch
                                style={{ width: 200, marginRight: 8 }}
                                placeholder="Select Famous Person"
                                optionFilterProp="children"
                                onChange={(value: string) => setSelectedFamousPerson(value)}
                                filterOption={filterOption} // Use the corrected method
                            >
                                {famousPeople?.map(user => (
                                    <Option key={user.username} value={user.username}>{user.username}</Option>
                                ))}
                            </Select>
                            <Button type="primary" onClick={fetchCompatibilityReport}>Create Report</Button>
                        </Col>
                    </Row>

                    {compatibilityReport && (
                        <Card bordered={false} style={{ textAlign: 'left', width: '100%', marginTop: 10 }}>
                        <Title level={4}>Compatibility Report: {scaledScore}/10</Title>
                        <Paragraph style={{ fontSize: '15px' }}>
                        <Text style={{ fontSize: '15px' }} strong>Summary Statement:</Text> {compatibilityReport.summary_statement}
                        </Paragraph>
                        <Paragraph style={{ fontSize: '15px' }}>
                        <Text style={{ fontSize: '15px' }} strong>Detailed Analysis:</Text> {compatibilityReport.detailed_analysis}
                        </Paragraph>
                        <Text style={{ fontSize: '15px' }} strong>Shared Interests:</Text>
                        {compatibilityReport.shared_interests.length > 0 ? (
                            <ul style={{ paddingLeft: '20px' }}>  {/* Adjust padding as needed */}
                                {compatibilityReport.shared_interests.map((item: string) => (
                                <li key={item} style={{ fontSize: '15px', marginBottom: '10px' }}> {/* Adjust font size and margin as needed */}
                                    {item}
                                </li>
                                ))}
                            </ul>
                        ) : (
                            <Paragraph style={{ fontSize: '15px' }}>None</Paragraph>
                        )}

                        <Text style={{ fontSize: '15px' }} strong>Potential Challenges:</Text>
                        {compatibilityReport.potential_challenges.length > 0 ? (
                            <ul style={{ paddingLeft: '20px' }}>  {/* Adjust padding as needed */}
                                {compatibilityReport.potential_challenges.map((item: string) => (
                                <li key={item} style={{ fontSize: '15px', marginBottom: '10px' }}> {/* Adjust font size and margin as needed */}
                                    {item}
                                </li>
                                ))}
                            </ul>
                        ) : (
                            <Paragraph style={{ fontSize: '15px' }}>None</Paragraph>
                        )}
                    
                        <Paragraph style={{ fontSize: '15px' }}>
                        <Text style={{ fontSize: '15px' }} strong>Recommended First Date:</Text> {compatibilityReport.recommended_first_date}
                        </Paragraph>
                    </Card>
                    )}
                </Spin>
            </Card>
        </Slide>
    );
};
export default CompatibilitySlide;
