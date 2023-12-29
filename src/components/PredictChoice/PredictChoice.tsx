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

interface OptionType {
  title: string;
  description: string;
}

// New interface for PairedOptionType
interface PairedOptionType extends OptionType {
  score: number;
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
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<OptionType[]>(new Array(5).fill({ title: '', description: '' }));
  const [pairedOptions, setPairedOptions] = useState<PairedOptionType[]>([]);
  const [scores, setScores] = useState<number[]>([]);
  const [jsonInput, setJsonInput] = useState('');
  const { data: usernames } = useQuery('usernames', fetchUsernames);

  const loadJson = () => {
    try {
      const jsonData = JSON.parse(jsonInput);
      if (Array.isArray(jsonData)) {
        if (jsonData.every(obj => obj.title && obj.description)) {
          const newOptions = jsonData as OptionType[]; // cast it to the correct type
  
          // Update both options and pairedOptions
          setOptions(newOptions);
          const newPairedOptions = newOptions.map(option => ({ ...option, score: 0 })); // initialize scores as 0
          setPairedOptions(newPairedOptions);
        } else {
          message.error("Each JSON object must have 'title' and 'description' fields.");
        }
      } else {
        message.error("JSON must be an array of objects with 'title' and 'description' fields.");
      }
    } catch (error) {
      message.error("Invalid JSON: " + error);
    }
  };  

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL;
      const bodyContent = {
        username,
        options: options,
      };
      const response = await fetch(`${backendUrl}api/predict-choice/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyContent),
      });
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setScores(data.scores);

      // Pair options with their scores and sort
      const newPairedOptions: PairedOptionType[] = options.map((option, index) => ({
        ...option,
        score: data.scores[index] || 0,
      })).sort((a, b) => b.score - a.score);

      setPairedOptions(newPairedOptions); // Update paired options with scores

    } catch (error) {
      message.error(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  // Function to add a new option
  const addOption = () => {
    setOptions([...options, { title: '', description: '' }]);
  };

  const updateOption = (index: number, value: string, field: keyof OptionType) => {
    const updatedOptions = options.map((option, idx) => (
      idx === index ? { ...option, [field]: value } : option
    ));
    setOptions(updatedOptions);
  };

    
  // Popover content
  const helpContent = (
    <div>
      <p>Ranks free form text to see user preferences.</p>
      <br></br>
      <p>Use ChatGPT to generate JSON list of titles and descriptions.  Or just enter some options and select a user.</p>
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
                      <Row justify="center" style={{ margin: '20px 0' }}>
                        <Col span={12}>
                          <TextArea
                            rows={4}
                            placeholder="Enter JSON here"
                            value={jsonInput}
                            onChange={(e) => setJsonInput(e.target.value)}
                          />
                        </Col>
                      </Row>
                      <Row justify="center" style={{ margin: '10px 0' }}>
                        <Col>
                          <Button onClick={loadJson}>Load JSON</Button>
                        </Col>
                      </Row>
                      <br /><br />
                      {
                        pairedOptions.map((option, index) => (
                          <Row gutter={[16, 16]} align="middle" key={index}>
                            <Col span={24}>
                              {/* Score now to the left of the title */}
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                                <div style={{ fontSize: '17px', fontWeight: 'bold' }}>
                                  {option.score ? `${(option.score * 1000).toFixed(0)} - ` : ''}  {option.title}
                                </div>
                              </div>
                              <TextArea
                                rows={2}
                                value={option.description}
                                onChange={(e) => updateOption(index, e.target.value, 'description')}
                                style={{ marginBottom: '10px', borderColor: option.score ? 'green' : undefined }}
                              />
                            </Col>
                          </Row>
                        ))
                      }
                  </Card>
              </Col>
          </Row>
      </>
  );
};

export default PredictChoice;