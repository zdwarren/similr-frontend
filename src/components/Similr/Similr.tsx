import React, { useEffect, useState } from 'react';
import { Row, Col, Select, Tooltip, Button, Spin, Popover } from 'antd';
import { Table } from 'antd';
import { useQuery } from 'react-query';
import SimilrChart from './SimilrChart';
import HeaderComponent from '../HeaderComponent';
import { QuestionCircleOutlined } from '@ant-design/icons';

const { Option } = Select;

interface TSNEPoint {
  username: string;
  x: number;
  y: number;
  z: number;
  profile: any;
  top_recommendation: {
    title: string;
    description: string;
    score: number;
  };
}

interface User {
  name: any;
  username: string;
  num_choices: number;
}

const fetchUsernames = async (): Promise<User[]> => {
  const authToken = localStorage.getItem('authToken');
  const response = await fetch('http://localhost:8000/api/usernames/', {
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

const fetchTags = async (): Promise<string[]> => {
  const authToken = localStorage.getItem('authToken');
  const response = await fetch('http://localhost:8000/api/tags/', {
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

const fetchTSNEData = async (tags: string[]): Promise<TSNEPoint[]> => {
  const authToken = localStorage.getItem('authToken');
  // Construct the tags part of the query string
  const tagsQueryString = tags.map(tag => `tags=${encodeURIComponent(tag)}`).join('&');
  const response = await fetch(`http://localhost:8000/api/tsne/?${tagsQueryString}`, {
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

const fetchSimilarUsers = async (username: string, tags: string[]) => {
  const authToken = localStorage.getItem('authToken');
  const tagsQueryString = tags.map(tag => `tags=${encodeURIComponent(tag)}`).join('&');
  const url = `http://localhost:8000/api/similar-users/${username}/?${tagsQueryString}`;

  const response = await fetch(url, {
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

const columns = [
  {
    title: 'User',
    dataIndex: 'username',
    key: 'username',
    sorter: (a: any, b: any) => a.username.localeCompare(b.username),
    render: (text: string, record: User) => {
      let name;
      if (typeof record.name === 'object' && record.name !== null) {
        name = `${record.name.first} ${record.name.last}`;
      } else if (typeof record.name === 'string') {
        name = record.name;
      } else {
        name = 'Unknown Name';
      }
      return <Tooltip title={name}>{text}</Tooltip>;
    },
  },
  {
    title: 'Similarity Score',
    dataIndex: 'score',
    key: 'score',
    render: (text: number) => (text * 100).toFixed(0),
    sorter: (a: any, b: any) => a.score - b.score,
  },
];

const Similr = () => {
  const loggedInUsername = localStorage.getItem('username');
  const [selectedUsername, setSelectedUsername] = useState<string>(loggedInUsername || '');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [fetchData, setFetchData] = useState(true);
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    // Fetch tags on component mount
    fetchTagsData();
  }, []);

  const fetchTagsData = async () => {
    try {
      const fetchedTags = await fetchTags();
      setTags(fetchedTags);
    } catch (error) {
      console.error("Error fetching tags: ", error);
    }
  };
  
  const { data: usernames, isLoading: usernamesIsLoading, error: usernamesError } = useQuery('usernames', fetchUsernames);

  // UseQuery for TSNE Data
  const tsneQuery = useQuery(['tsneData', selectedTags], () => fetchTSNEData(selectedTags), {
    enabled: fetchData
  });

  // UseQuery for Similar Users Data
  const similarQuery = useQuery(['similarData', selectedUsername, selectedTags], () => fetchSimilarUsers(selectedUsername, selectedTags), {
    enabled: fetchData
  });

  // Fetch data when selectedUsername changes
  useEffect(() => {
    if (selectedUsername) {
      setFetchData(true);
    }
  }, [selectedUsername]);

  // Reset fetchData to false after queries have been triggered
  useEffect(() => {
    if (fetchData) {
      setFetchData(false);
    }
  }, [fetchData]);

  // Handle 'Fetch Data' button click
  const handleFetchData = () => {
    setFetchData(true);
  };
  
  const helpContent = (
    <div>
      <p>This page gives you a general idea of how Similr you are to other people and what general grouping you belong in.</p>
      <br />
      <p><strong>Tags:</strong> Filter down the users using the tags. See which Stranger Things character you are most similar to! Or see which Stranger Things character another person is similr to.</p>
      <br />
      <p><strong>Similarity Table:</strong> Overall similarity of the users in the table to the user that is selected. Range goes from -100 to 100 with -100 being exact opposites and 100 being exactly the same. Anything over 50 is quite similar.</p>
      <br />
      <p><strong>2D Plot of Similarity:</strong> (Scroll Down) This attempts to plot all users on a 2D chart based on who they are closest to. It also shows the user's highest ranked trait out of ten personality traits.</p>
      <br />
      <p><strong>Note:</strong> The questions are all fairly positive and are a self-assessment so if you are near a bad person it means you have similar positive personality traits to them.</p>
    </div>
  )

  // Check for loading or error states
  if (tsneQuery.isError) return <p>Error loading TSNE data</p>;
  if (similarQuery.isError) return <p>Error loading similarity data</p>;

  return (
    <>
      <HeaderComponent />
      <div style={{ textAlign: 'center' }}>
        <div style={{ marginTop: '20px' }}>
          <Select
            mode="multiple"
            style={{ width: '500px' }}
            placeholder="Select tags"
            onChange={setSelectedTags}
            value={selectedTags}
          >
            {tags.sort().map(tag => (
              <Option key={tag} value={tag}>{tag}</Option>
            ))}
          </Select>
          <Button onClick={handleFetchData} style={{ marginLeft: '10px' }}>
            Fetch Data
          </Button>
        </div>
        <div style={{ marginTop: '20px' }}>
          <Select
            style={{ width: 300 }}
            placeholder="Select a user"
            onChange={(value) => setSelectedUsername(value)}
            value={selectedUsername} // Use value instead of defaultValue for controlled component
          >
            {usernames?.map(user => (
              <Option key={user.username} value={user.username}>
                {user.username} ({user.num_choices})
              </Option>
            ))}
          </Select>
          <Popover 
            content={helpContent} 
            title="How to Use" 
            overlayStyle={{ width: '50vw' }}
          >
            <QuestionCircleOutlined style={{ cursor: 'pointer', marginLeft: '10px', position: 'relative', top: '-4px' }} />
          </Popover>
        </div>
        <div style={{
          display: 'inline-block',
          width: '500px',
          border: '1px solid #ddd',
          borderRadius: '4px',
          padding: '10px',
          margin: '20px 0'
        }}>
          {similarQuery.isLoading ? (
            <Spin size="large" style={{ display: 'flex', justifyContent: 'center', paddingTop: '50px', paddingBottom: '50px' }} />
          ) : (
            <Table
              dataSource={similarQuery.data} 
              columns={columns} 
              rowKey={record => record.username}
              pagination={false} 
              size="small"
            />
          )}
        </div>
      </div>
      <Row gutter={[16, 16]} style={{ margin: '10px', paddingBottom: '20px' }}>
        {tsneQuery.data && (
          <Col xs={48} sm={24}>
            <div style={{ marginLeft: '10px', marginRight: '10px', marginTop: '10px', marginBottom: '0', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}>
              <SimilrChart data={tsneQuery.data} />
            </div>
          </Col>
        )}
      </Row>
    </>
  );  
};

export default Similr;
