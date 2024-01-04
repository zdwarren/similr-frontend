import React from 'react';
import { useQuery } from 'react-query';
import { Card, Spin } from 'antd';
import Slide from './Slide';

interface ResultsOverview {
    headline1: string;
    headline2: string;
    headline3: string;
    paragraph1: string;
    paragraph2: string;
}

const fetchResultsOverview = async (): Promise<ResultsOverview> => {
    const authToken = localStorage.getItem('authToken');
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    const response = await fetch(`${backendUrl}api/results-overview/`, {
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

const OverviewSlide: React.FC = () => {
    const { data, isLoading, error } = useQuery<ResultsOverview>('resultsOverview', fetchResultsOverview);

    const titleStyle: React.CSSProperties = {
        fontSize: '24px', // Bigger font size for the title
        textAlign: 'center', // Center the title text
        fontWeight: 'bold', // Make the title text bold
        padding: '20px',
    };

    const contentStyle: React.CSSProperties = {
        textAlign: 'left', // Aligns the text to the left
    };

    return (
        <Slide>
            <Card title={<div style={titleStyle}>Your Personality</div>} bordered={false} style={{ width: '100%', maxWidth: '600px', margin: 'auto' }}>
                {isLoading && <Spin size="large" />}
                {data && (
                    <div style={contentStyle}>
                        <ul style={{ fontSize: '15px', fontWeight: '500' }}>
                            <li>{data.headline1}</li>
                            <li>{data.headline2}</li>
                            <li>{data.headline3}</li>
                        </ul>
                        <p style={{ fontSize: '14px' }}>{data.paragraph1}</p>
                        <p style={{ fontSize: '14px' }}>{data.paragraph2}</p>
                    </div>
                )}
            </Card>
        </Slide>
    );
};

export default OverviewSlide;
