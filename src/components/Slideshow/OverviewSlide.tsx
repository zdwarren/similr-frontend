import React from 'react';
import { useQuery } from 'react-query';
import { Card, Spin, Image, Col, Row } from 'antd';
import Slide from './Slide';


interface OverviewSlideProps {
    overviewType: string;
    title: string;
}

interface ResultsOverview {
    headline1: string;
    headline2: string;
    headline3: string;
    paragraph1: string;
    paragraph2: string;
    image_url: string;
}

const fetchResultsOverview = async (overviewType: string): Promise<ResultsOverview> => {
    const authToken = localStorage.getItem('authToken');
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    const response = await fetch(`${backendUrl}api/results-overview/?type=${overviewType}`, { // Include the overview type in the query params
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
    const { data, isLoading, error } = useQuery<ResultsOverview>(['resultsOverview', overviewType], () => fetchResultsOverview(overviewType));

    const titleStyle: React.CSSProperties = {
        fontSize: '24px', // Bigger font size for the title
        textAlign: 'center', // Center the title text
        fontWeight: 'bold', // Make the title text bold
        padding: '20px',
    };

    const contentStyle: React.CSSProperties = { display: 'flex', alignItems: 'flex-start' };
    const textContentStyle: React.CSSProperties = { textAlign: 'left' };
    const imageStyle: React.CSSProperties = { width: '300px', height: '300px', borderRadius: '8px' };

    return (
        <Slide>
            <Card title={<div style={titleStyle}>{title}</div>} bordered={false} style={{ width: '100%', maxWidth: '800px', margin: 'auto' }}>
                {isLoading && <Spin size="large" />}
                {data && (
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
            </Card>
        </Slide>
    );
};

export default OverviewSlide;