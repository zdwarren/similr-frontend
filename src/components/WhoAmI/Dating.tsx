import React, { useState } from 'react';
import { Select, Button, message, Spin, Card, Typography } from 'antd';
import { useQuery } from 'react-query';

const { Title, Paragraph, Text } = Typography;

// interface CompatibilityReport {
//   shared_interests: string[];
//   potential_challenges: string[];
//   summary_statement: string;
//   detailed_analysis: string;
//   compatibility_score: string;
//   recommended_first_date: string;
// }

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

const Dating = () => {
  const [selectedUser1, setSelectedUser1] = useState<string>('');
  const [selectedUser2, setSelectedUser2] = useState<string>('');
  const [compatibilityReport, setCompatibilityReport] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const { Option } = Select;

  const { data: usernames, isLoading: isLoadingUsernames } = useQuery('usernames', fetchUsernames);

  const fetchCompatibilityReport = async () => {
    // Ensure both users are selected
    if (!selectedUser1 || !selectedUser2) {
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
        body: JSON.stringify({ username1: selectedUser1, username2: selectedUser2 }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch compatibility report');
      }

      const data = await response.json();
      setCompatibilityReport(data);
      message.success('Compatibility report generated successfully!');
    } catch (error) {
      message.error(`Failed to fetch compatibility report: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  // Corrected filterOption method for both Select components
  const filterOption = (input: string, option: any) =>
    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;

  const scaleCompatibilityScore = (score: number) => {
    if(score <= 25) return 1; // Scores 25 or less are scaled to 1
    if(score >= 85) return 10; // Scores 85 or more are scaled to 10
  
    // Linear scaling for scores between 25 and 85
    return Math.round((score - 25) * (9 / 60) + 1); // Adjusted formula to scale between 1-10
  };
  
  // Usage in your component
  const scaledScore = scaleCompatibilityScore(compatibilityReport.compatibility_score);

  return (
    <Spin size='large' spinning={isLoadingUsernames || loading}>
      <Select
        showSearch
        style={{ width: 200, marginRight: 8 }}
        placeholder="Select User 1"
        optionFilterProp="children"
        onChange={(value: string) => setSelectedUser1(value)}
        filterOption={filterOption} // Use the corrected method
      >
        {usernames?.map(user => (
          <Option key={user.username} value={user.username}>{user.username}</Option>
        ))}
      </Select>
      <Select
        showSearch
        style={{ width: 200, marginRight: 8 }}
        placeholder="Select User 2"
        optionFilterProp="children"
        onChange={(value: string) => setSelectedUser2(value)}
        filterOption={filterOption} // Use the corrected method
      >
        {usernames?.map(user => (
          <Option key={user.username} value={user.username}>{user.username}</Option>
        ))}
      </Select>
      <Button type="primary" onClick={fetchCompatibilityReport}>Create Report</Button>
      {compatibilityReport && (
        <Card bordered={false} style={{ width: '100%', marginTop: 10 }}>
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
  );
};

export default Dating;
