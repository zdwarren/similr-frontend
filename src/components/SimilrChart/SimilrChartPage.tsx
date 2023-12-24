// SimilrChartPage.tsx
import React, { useEffect, useState } from 'react';
import { Row, Col, Select, Spin, Button } from 'antd';
import { useQuery } from 'react-query';
import SimilrChart from './SimilrChart';
import HeaderComponent from '../HeaderComponent';

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

  interface Tag {
    name: string;
    is_private: boolean;
  }

  
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
  
  const fetchTSNEData = async (tags: string[]): Promise<TSNEPoint[]> => {
    const authToken = localStorage.getItem('authToken');
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    // Construct the tags part of the query string
    const tagsQueryString = tags.map(tag => `tags=${encodeURIComponent(tag)}`).join('&');
    const response = await fetch(`${backendUrl}api/tsne/?${tagsQueryString}`, {
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


  const SimilrChartPage = () => {
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [tags, setTags] = useState<Tag[]>([]);
    const [fetchData, setFetchData] = useState(true);
  
    const [chartData, setChartData] = useState<TSNEPoint[] | null>(null); // New state to hold chart data

    
    // UseQuery for TSNE Data
    const tsneQuery = useQuery(['tsneData', selectedTags], () => fetchTSNEData(selectedTags), {
        enabled: fetchData,
        onSuccess: (data) => {
        // Update chart data when new data is fetched successfully
        setChartData(data);
        },
    });

    useEffect(() => {
      // Fetch tags on component mount
      const fetchTagsData = async () => {
        try {
          const fetchedTags = await fetchTags();
          setTags(fetchedTags);
        } catch (error) {
          console.error("Error fetching tags: ", error);
        }
      };
  
      fetchTagsData();
    }, []);
  
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

    const chartContainerStyle: React.CSSProperties = {
        marginLeft: '10px',
        marginRight: '10px',
        marginTop: '10px',
        marginBottom: '0',
        padding: '10px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        width: '100%', // Make full width of the container
        minHeight: '700px', // Minimum height to keep the container visible
        position: 'relative', // Needed for absolute positioning of the spinner
        display: 'flex',
        justifyContent: 'center', // Center spinner horizontally
        alignItems: 'center', // Center spinner vertically
    };
    
    return (
      <>
        <HeaderComponent />
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Select
            mode="multiple"
            style={{ width: '800px' }}
            placeholder="Select tags"
            onChange={setSelectedTags}
            value={selectedTags}
          >
            {tags.map(tag => (
              <Option key={tag.name} value={tag.name}>{tag.name}</Option>
            ))}
          </Select>
          <Button onClick={handleFetchData} style={{ marginLeft: '10px' }}>
            Fetch Data
          </Button>
        </div>
        <Row gutter={[16, 16]} style={{ margin: '10px', paddingBottom: '20px' }}>
            <Col xs={24} sm={24}>
            <div style={chartContainerStyle}>
                {tsneQuery.isLoading ? (
                <Spin size="large" /> // Large spinner centered in the container
                ) : chartData ? (
                <SimilrChart data={chartData} /> // Render chart with the current data
                ) : (
                <p style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)' }}>
                    Select tags and click 'Fetch Data' to display the chart.
                </p> // Message when there's no data yet
                )}
            </div>
            </Col>
        </Row>
      </>
    );
  };
  
  export default SimilrChartPage;