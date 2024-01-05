import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { Card, Spin, Image, Col, Row, Alert } from 'antd';
import Slide from './Slide';


interface OverviewSlideProps {
    overviewType: string;
    title: string;
}

interface ResultsOverview {
    headline1?: string;
    headline2?: string;
    headline3?: string;
    paragraph1?: string;
    paragraph2?: string;
    image_url?: string;
    message?: string;  // For handling loading or error messages
    isLoadingOverview?: boolean; // For handling loading state
}

// Define fetch function outside with correct type definition
async function fetchOverview(overviewType: string): Promise<ResultsOverview> {
    const authToken = localStorage.getItem('authToken');
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    const response = await fetch(`${backendUrl}api/results-overview/?type=${overviewType}`, {
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
}

const OverviewSlide: React.FC<OverviewSlideProps> = ({ overviewType, title }) => {

    const { data, isFetching, refetch } = useQuery<ResultsOverview>(
        ['resultsOverview', overviewType],  // Unique key for the query
        () => fetchOverview(overviewType),  // Fetch function
        {
            refetchInterval: (data) => (data?.isLoadingOverview ? 2000 : false), // Poll every 2 seconds only if it's loading
            refetchIntervalInBackground: true, // Continue polling even if the window/tab is not active
        }
    );
    
    const titleStyle: React.CSSProperties = {
        fontSize: '24px', // Bigger font size for the title
        textAlign: 'center', // Center the title text
        fontWeight: 'bold', // Make the title text bold
        padding: '20px',
    };

    const imageStyle: React.CSSProperties = { width: '300px', height: '300px', borderRadius: '8px' };

    return (
        <Slide>
             <Card title={<div style={titleStyle}>{title}</div>} bordered={false} style={{ width: '100%', maxWidth: '800px', margin: 'auto' }}>
                {!data?.isLoadingOverview && data?.headline1 && (
                    <Row align="top">
                        <Col span={24} style={{ textAlign: 'center' }}>
                            <h2 style={{ margin: '0' }}>{data.headline1}</h2>
                            <h4 style={{ margin: '5px 0' }}>{data.headline2}</h4>
                            <h4 style={{ marginBottom: '15px', marginTop: '0' }}>{data.headline3}</h4>
                            {data.image_url && <Image src={data.image_url} alt="Overview Image" style={imageStyle} />}
                        </Col>
                        <Col span={24}>
                            <p style={{ textAlign: 'left', fontSize: '15px' }}>{data.paragraph1}</p>
                        </Col>
                        <Col span={24}>
                            <p style={{ textAlign: 'left', fontSize: '15px' }}>{data.paragraph2}</p>
                        </Col>
                    </Row>
                )}
                {!data || data.isLoadingOverview && (
                    <Spin size="large" />
                )}
            </Card>
        </Slide>
    );
};

export default OverviewSlide;