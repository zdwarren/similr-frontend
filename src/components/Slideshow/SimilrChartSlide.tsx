import React from 'react';
import Slide from './Slide';
import SimilrChart from '../SimilrChart/SimilrChart';
import { useQuery } from 'react-query';
import { Card } from 'antd';

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

const fetchTSNEData = async (): Promise<TSNEPoint[]> => {
    const tags = ["Famous"];
    const includeYou = true;
    const authToken = localStorage.getItem('authToken');
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
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


const SimilrChartSlide: React.FC = () => {
    const { data: chartData, isLoading, isError } = useQuery<TSNEPoint[]>('tsneDataSlide', fetchTSNEData);

    const titleStyle: React.CSSProperties = {
        fontSize: '24px', // Bigger font size for the title
        textAlign: 'center', // Center the title text
        fontWeight: 'bold', // Make the title text bold
        padding: '20px',
    };

    const containerStyle: React.CSSProperties = {
        display: 'flex',
        justifyContent: 'center', // Center children horizontally
        alignItems: 'center', // Center children vertically
        padding: '10px 0', // Some padding on top and bottom
    };
    
    const cardStyle: React.CSSProperties = {
        width: '100%', // Make card full width
    };
    
    const chartContainerStyle: React.CSSProperties = {
        border: '1px solid #ddd', // Add a border to create a box around the chart
        padding: '0px 20px',
    };
    
    const explanationTextStyle: React.CSSProperties = {
        marginTop: '0px',
        paddingBottom: '20px',
        textAlign: 'center',
        fontSize: '14px',
        fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
        maxWidth: '800px', // Set maximum width to 800px
        margin: 'auto' // Center the block itself horizontally
    };

    return (
        <Slide>
            <div style={containerStyle}>
                <div style={cardStyle}>
                    <Card 
                        style={chartContainerStyle} 
                        title={<div style={titleStyle}>Your Similarity Chart</div>}
                    >
                        <p style={explanationTextStyle}>
                            Welcome to your similarity landscape! This chart is a magical space where each dot represents a famous
                            person and you.  We've arranged everyone so that people with similar tastes, interests, and personalities
                            are closer together. Look for clusters of dots - these are like neighborhoods of similar folks. Your
                            position among these dots shows how you fit into this world of personalities. It's like a map of where
                            you stand in a sea of diverse individuals!
                        </p>
                        {isLoading && <p>Loading...</p>}
                        {isError && <p>Error fetching data.</p>}
                        {chartData && <SimilrChart data={chartData} />}
                    </Card>
                </div>
            </div>
        </Slide>
    );
};

export default SimilrChartSlide;
