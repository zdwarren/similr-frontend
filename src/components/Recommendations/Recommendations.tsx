import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { Select, Spin, Popover } from 'antd';
import HeaderComponent from '../HeaderComponent';
import RecommendationsList from './RecommendationList';
import UsersScoresList from './UsersScoresList';
import { QuestionCircleOutlined } from '@ant-design/icons';

const { Option } = Select;

// New interface for User object
interface User {
  username: string;
  num_choices: number;
}

// Fetch a list of usernames from the backend
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
  const users = await response.json();
  return users.sort((a: User, b: User) => a.username.toLowerCase().localeCompare(b.username.toLowerCase()));
};

const fetchCategories = async (): Promise<string[]> => {
  const authToken = localStorage.getItem('authToken');
  const response = await fetch('http://localhost:8000/api/categories/', {
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

// Fetch recommendations based on the selected category and optional username
const fetchRecommendations = async (category: string, username?: string): Promise<any> => {
  const authToken = localStorage.getItem('authToken');
  let url = `http://localhost:8000/api/recommendations/${category}/`;

  // If a username is provided, append it as a query parameter
  if (username) {
    url += `?username=${encodeURIComponent(username)}`;
  }

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

const fetchCategoryRecommendations = async (category: string): Promise<any> => {
  const authToken = localStorage.getItem('authToken');
  const response = await fetch(`http://localhost:8000/api/categories/${category}/`, {
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


const fetchUsersScores = async (recommendation: string): Promise<any> => {
  const authToken = localStorage.getItem('authToken');
  const response = await fetch(`http://localhost:8000/api/recommendation-user-scores/${recommendation}/`, {
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

const Recommendation: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedRecommendation, setSelectedRecommendation] = useState<string>('');
  const [categoryRecommendations, setCategoryRecommendations] = useState<any[]>([]);
  const [username, setUsername] = useState('');
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    fetchCategories().then(setCategories).catch(console.error);
  }, []);

  const { data: usernames } = useQuery('usernames', fetchUsernames);

  const { data: recommendations, isLoading, error } = useQuery(
    ['recommendations', selectedCategory, username],
    () => fetchRecommendations(selectedCategory, username),
    { enabled: !!selectedCategory }
  );
  
  // New Query for fetching users scores
  const { isLoading: isLoadingUsersScores, data: usersScoresData } = useQuery(
    ['userScores', selectedRecommendation],
    () => fetchUsersScores(selectedRecommendation),
    { enabled: !!selectedRecommendation }
  );

  // Fetch general recommendations based on selected category
  const handleGeneralCategoryChange = async (value: string) => {
    setSelectedCategory(value);
  };

  // Fetch category-specific recommendations for the 'Select a Recommendation' dropdown
  const handleSpecificCategoryChange = async (value: string) => {
    const categoryRecs = await fetchCategoryRecommendations(value);
    setCategoryRecommendations(categoryRecs);
  };

  const handleRecommendationChange = (value: string) => {
    setSelectedRecommendation(value);
    // Optionally, fetch users and their scores immediately upon selection
  };
  
  const helpContent = (
    <div>
      <p>On the left, you can select recommendations ranked for a single user.  If the user is blank it will default to you.</p>
      <br />
      <p>On the right, you can select a category and a recommendation from that category and see how each user ranks for that recommendation. The table also shows that user's highest ranked recommendation for that category.</p>
      <br />
      <p>If you select both, you will need to scroll down to see the users' ranks for a single recommendation.</p>
      <br />
      <p><strong>How did the model do with your recommendations?  With your personality profile?</strong></p>
    </div>
  );

  return (
    <>
      <HeaderComponent />
      <div style={{ padding: '20px' }}>
      <Select
          placeholder="Select a category"
          style={{ width: 200, marginBottom: '20px' }}
          onChange={handleGeneralCategoryChange}
        >
          {categories.sort().map(category => (
            <Option key={category} value={category}>{category}</Option>
          ))}
        </Select>
        <Select
            style={{ width: 200, marginLeft: '5px' }}
            placeholder="Select a user"
            onChange={(value) => setUsername(value)}
            value={username}
        >
            {usernames?.map(user => (
            <Option key={user.username} value={user.username}>{user.username}</Option>
            ))}
        </Select>

        <Select
          placeholder="Select a category"
          style={{ width: 200, marginLeft: '40px', marginBottom: '20px' }}
          onChange={handleSpecificCategoryChange}
        >
          {categories.sort().map(category => (
            <Option key={category} value={category}>{category}</Option>
          ))}
        </Select>

        <Select
          placeholder="Select a Recommendation"
          style={{ width: 300, marginBottom: '20px', marginLeft: '5px' }}
          onChange={handleRecommendationChange}
          value={selectedRecommendation}
        >
          {categoryRecommendations.map(rec => (
            <Option key={rec.id} value={rec.id}>{rec.title}</Option>
          ))}
        </Select>
        <Popover 
          content={helpContent} 
          title="How to Use" 
          overlayStyle={{ width: '50vw' }}
        >
          <QuestionCircleOutlined style={{ cursor: 'pointer', marginLeft: '10px', position: 'relative', top: '-4px' }} />
        </Popover>

        {isLoading && <Spin />}

        {!isLoading && !error && (
          <RecommendationsList recommendations={recommendations} />
        )}

        {/* New Section to Display User Scores */}
        {!isLoadingUsersScores && usersScoresData && (
          <UsersScoresList usersScores={usersScoresData} />
        )}
      </div>
    </>
  );
};

export default Recommendation;
