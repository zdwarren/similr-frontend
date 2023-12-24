import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { Select, Input, Button, message, Card, Row, Col, Popover } from 'antd';
import HeaderComponent from '../HeaderComponent';
import { QuestionCircleOutlined } from '@ant-design/icons';

const { Option } = Select;
const { TextArea } = Input;

// New interface for User object
interface User {
    username: string;
    num_choices: number;
}

// Fetch a list of usernames from the backend
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
    const users = await response.json();
    return users.sort((a: User, b: User) => a.username.toLowerCase().localeCompare(b.username.toLowerCase()));
  };

const PredictChoice = () => {
  const [username, setUsername] = useState('');
  const [leftOption, setLeftOption] = useState('');
  const [rightOption, setRightOption] = useState('');
  const [loading, setLoading] = useState(false);
  const [modelChoice, setModelChoice] = useState('');
  
  const [lrSimilarity, setLrSimilarity] = useState('');
  const [rlSimilarity, setRlSimilarity] = useState('');
  const [lSimilarity, setLSimilarity] = useState('');
  const [rSimilarity, setRSimilarity] = useState('');

  const { data: usernames } = useQuery('usernames', fetchUsernames);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL;
      const response = await fetch(`${backendUrl}api/predict-choice/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, left_option: leftOption, right_option: rightOption }),
      });
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      // const choice = data.choice[0].toUpperCase() + data.choice.slice(1);
      setModelChoice(data.choice);
      
      // Save similarity scores in the state
      setLrSimilarity((data.lr_similarity * 1000).toFixed(0));
      setRlSimilarity((data.rl_similarity * 1000).toFixed(0));
      setLSimilarity((data.l_similarity * 1000).toFixed(0));
      setRSimilarity((data.r_similarity * 1000).toFixed(0));

    } catch (error) {
      message.error(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const getBorderColor = (option: string) => {
    if (!modelChoice) return '';
    return modelChoice === option ? 'green' : 'red';
  };
  
  // Popover content
  const helpContent = (
    <div>
      <p>Select a user, then type in your choices for the 'Left' and 'Right' options.</p>
      <br />
      <p>The top value next to each box is the relative score, indicating the likelihood of preference compared to the other option. The bottom value is the absolute score, representing the standalone preference score for each option, independent of the other choice.</p>
    </div>
  );

  return (
      <>
          <HeaderComponent />
              <Row justify="center" align="middle" style={{ marginTop: '40px' }}>
                  <Col span={12}>
                    <Card 
                      title={
                        <span>
                          Free Form Predict User Choice 
                          <Popover 
                            content={helpContent} 
                            title="How to Use"
                            overlayStyle={{ width: '50vw' }}
                          >
                            <QuestionCircleOutlined 
                              style={{ cursor: 'pointer', marginLeft: '10px', position: 'relative', top: '-4px' }}
                            />
                          </Popover>
                        </span>
                      } 
                      bordered={false}
                    >
                      <Select
                          style={{ marginLeft: '125px', marginRight: '20px', width: '300px' }}
                          placeholder="Select a user"
                          onChange={(value) => setUsername(value)}
                          value={username}
                      >
                          {usernames?.map(user => (
                              <Option key={user.username} value={user.username}>{user.username}</Option>
                          ))}
                      </Select>
                      <Button type="primary" onClick={handleSubmit} loading={loading}>Predict Choice</Button>
                      <br /><br />
                      <Row gutter={[16, 16]} align="middle" style={{ marginTop: '20px' }}>
                          <Col span={4} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                              <div style={{ fontSize: '18px', textAlign: 'center', color: getBorderColor('right') }}>
                                  {rlSimilarity}<br/>{rSimilarity}
                              </div>
                          </Col>
                          <Col span={20}>
                              <TextArea rows={4} placeholder="Right Option" value={rightOption} onChange={e => setRightOption(e.target.value)} style={{ borderColor: getBorderColor('right') }} />
                          </Col>
                      </Row>
                      <br />
                      <Row gutter={[16, 16]} align="middle" style={{ marginTop: '20px' }}>
                          <Col span={4} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                              <div style={{ fontSize: '18px', textAlign: 'center', color: getBorderColor('left') }}>
                                  {lrSimilarity}<br/>{lSimilarity}
                              </div>
                          </Col>
                          <Col span={20}>
                              <TextArea rows={4} placeholder="Left Option" value={leftOption} onChange={e => setLeftOption(e.target.value)} style={{ borderColor: getBorderColor('left') }} />
                          </Col>
                      </Row>
                      
                  </Card>
              </Col>
          </Row>
      </>
  );
};

export default PredictChoice;