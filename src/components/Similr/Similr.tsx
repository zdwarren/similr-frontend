import React, { useEffect, useState } from 'react';
import { Select, Tooltip, Button, Spin, Popover } from 'antd';
import { Table } from 'antd';
import { useQuery } from 'react-query';
import HeaderComponent from '../HeaderComponent';
import { QuestionCircleOutlined } from '@ant-design/icons';

const { Option } = Select;

interface User {
  name: any;
  username: string;
  num_choices: number;
}

interface Tag {
  name: string;
  is_private: boolean;
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

const fetchTags = async (): Promise<Tag[]> => {
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

const fetchSimilarUsers = async (username: string, tags: string[]) => {
  const authToken = localStorage.getItem('authToken');
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const tagsQueryString = tags.map(tag => `tags=${encodeURIComponent(tag)}`).join('&');
  const url = `${backendUrl}api/similar-users/${username}/?${tagsQueryString}`;

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
    title: 'Similr Score',
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
  const [tags, setTags] = useState<Tag[]>([]);

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
  
  const { data: usernames } = useQuery('usernames', fetchUsernames);

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
            {tags.sort((a, b) => a.name.localeCompare(b.name)).map(tag => (
              <Option key={tag.name} value={tag.name}>{tag.name}</Option>
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
          width: '400px',
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
    </>
  );  
};

export default Similr;
