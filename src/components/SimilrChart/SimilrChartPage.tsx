// SimilrChartPage.tsx
import React, { useEffect, useState } from 'react';
import { Row, Col, Select, Button, message, Progress, Checkbox } from 'antd';
import { useQuery } from 'react-query';
import SimilrChart from './SimilrChart';
import HeaderComponent from '../HeaderComponent';

const { Option } = Select;

interface TSNEPoint {
    username: string;
    fullname: string;
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
  

  const fetchTSNEData = async (tags: string[], includeYou: boolean): Promise<TSNEPoint[]> => {
    const authToken = localStorage.getItem('authToken');
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    // Construct the tags part of the query string
    const tagsQueryString = tags.map(tag => `tags=${encodeURIComponent(tag)}`).join('&');
    const includeYouQueryString = includeYou ? `&include_user=true` : '';
    const response = await fetch(`${backendUrl}api/tsne/?${tagsQueryString}${includeYouQueryString}`, {
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
    const [includeYou, setIncludeYou] = useState(false); // New state for checkbox
    const [tags, setTags] = useState<Tag[]>([]);
    const [fetchData, setFetchData] = useState(false);  
    const [hasTimedOut, setHasTimedOut] = useState(false);
    
    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    const [chartData, setChartData] = useState<TSNEPoint[] | null>(null); // New state to hold chart data

    // Update TSNE query to depend only on fetchData
    const tsneQuery = useQuery(['tsneData', selectedTags], () => fetchTSNEData(selectedTags, includeYou), {
      enabled: fetchData,  // Ensure query only runs when fetchData is true
      onSuccess: (data) => {
        setChartData(data);
        setFetchData(false); // Reset fetchData to false after successful fetch
        setElapsedSeconds(0); // Reset timer
        setHasTimedOut(false); // Reset timeout state
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
  
   
    useEffect(() => {
      let interval: NodeJS.Timeout;
      if (fetchData) {
        setElapsedSeconds(0); // Reset timer
        setHasTimedOut(false); // Reset timeout state
        interval = setInterval(() => {
          setElapsedSeconds(prev => {
            if (prev < 30) return prev + 1; // Increment seconds until 30
            clearInterval(interval); // Clear interval after 30 seconds
            return prev;
          });
        }, 1000); // Update every second
      }
      return () => clearInterval(interval); // Cleanup the interval
    }, [fetchData]);

    // Determine the percentage for the Progress component
    const progressPercent = (elapsedSeconds / 30) * 100;
      
      
    const handleFetchData = () => {
      if (selectedTags.length > 0) {
        setChartData(null);  // Clear existing chart data
        setFetchData(true);
        setHasTimedOut(false); // Reset timeout state
      } else {
        message.warning('Please select at least one tag before fetching data.');
      }
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
            style={{ width: '500px' }}
            placeholder="Select tags"
            onChange={setSelectedTags}
            value={selectedTags}
          >
            {tags.sort((a, b) => a.name.localeCompare(b.name)).map(tag => (
              <Option key={tag.name} value={tag.name}>{tag.name}</Option>
            ))}
          </Select>
          <Checkbox
            checked={includeYou}
            onChange={e => setIncludeYou(e.target.checked)}
            style={{ marginLeft: '10px' }}
          >
            Include You
          </Checkbox>
          <Button 
            onClick={handleFetchData} 
            style={{ marginLeft: '10px' }} 
            disabled={selectedTags.length === 0}  // Disable button if no tags are selected
          >
            Create Chart
          </Button>
        </div>
        <Row gutter={[16, 16]} style={{ margin: '10px', paddingBottom: '20px' }}>
          <Col xs={24} sm={24}>
            <div style={chartContainerStyle}>
              {tsneQuery.isFetching && !hasTimedOut ? (
                <div style={{ position: 'relative', width: 200, height: 200 }}>
                  <Progress 
                    type="circle" 
                    percent={Math.min(progressPercent, 100)} // Ensure it doesn't go over 100%
                    format={() => `${elapsedSeconds}s`} // Format as seconds
                    style={{ position: 'absolute', bottom: '100px', width: '100%', textAlign: 'center', fontSize: '14px'}}
                  />
                  <p style={{ position: 'absolute', bottom: '10px', width: '100%', textAlign: 'center', fontSize: '14px'}}>
                    This may take some time. It will timeout after 30 seconds.
                  </p>
                </div>
              ) : hasTimedOut ? (
                <p style={{ fontSize: '18px', position: 'absolute', top: '50%', transform: 'translateY(-50%)' }}>
                  Loading timed out. Please try again or modify your query.
                </p>
              ) : chartData ? (
                <SimilrChart data={chartData} />
              ) : (
                <p style={{ fontSize: '18px', position: 'absolute', top: '50%', transform: 'translateY(-50%)' }}>
                  Select at least one tag and click 'Create Chart' to display the chart.
                </p>
              )}
            </div>
          </Col>
        </Row>
      </>
    );
  };
  
  export default SimilrChartPage;