import React from 'react';
import { useQuery } from 'react-query';
import { Card, Carousel, Spin } from 'antd';
import Slide from './Slide';
import '../../App.css'; // Ensure the styles are imported

interface Insight {
    id: string,
    title: string;
    description: string;
    image_url: string;
    insight_area: string,
    insight_category: string,
    is_high: boolean,
}

const fetchInsights = async (): Promise<Insight[]> => {
    const authToken = localStorage.getItem('authToken');
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    const response = await fetch(`${backendUrl}api/insights/`, {
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

const generateInsightText = (isHigh: boolean | undefined, category: string | undefined, area: string | undefined) => {
    const highLowText = isHigh ? 'High' : 'Low';

    switch (category) {
        case 'Personality':
            return `You are ${highLowText} in ${area}`;
        case 'Career':
            if (isHigh)
                return `Recommended: ${area}`;
            else
                return `Not Recommended: ${area}`;
        case 'Hogwarts House':
            if (isHigh)
                return `Hogwarts House: ${area}!`;
            else
                return `Not Hogwarts House: ${area}`;
        case 'Archetype':
            if (isHigh)
                return `Archetype: ${area}`;
            else
                return `Not Archetype: ${area}`;
        case 'Hobby':
        case 'Food':
        case 'Music':
        case 'Movie':
        case 'TV':
        case 'Gift Category':
        case 'Automobile Brand':
            if (isHigh)
                return `Predicted to like ${area}`;
            else
                return `Predicted not to like ${area}`;        
        case 'Famous Person':
            return `${highLowText} Similarity to ${area}`;
        default:
            return `Your Insight in ${area}`;
    }
};    

const textStyle: React.CSSProperties = {
    textAlign: 'center',
    width: '100%',
    fontSize: '18px', // Increase font size
    fontWeight: '500', // Medium font weight, you can use 600 or 700 for bolder text
    paddingBottom: '30px'
};

// Adjust the style for each slide within the carousel for better text visibility
const slideStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px',  // Adjust based on your content
};

// Adjust the style for the image
const imageStyle: React.CSSProperties = {
    width: '500px',  // Adjust based on your preference
    height: '500px', // Adjust to control image size
    objectFit: 'cover',
    margin: 'auto'
};

const titleStyle: React.CSSProperties = {
    fontSize: '24px', // Bigger font size for the title
    textAlign: 'center', // Center the title text
    fontWeight: 'bold', // Make the title text bold
    padding: '10px',
};

const InsightSlide: React.FC = () => {
    const { data: insights, isLoading, error } = useQuery<Insight[]>('insights', fetchInsights);

    return (
        <Slide>
            <Card title={<div style={titleStyle}>Your Insight Cards</div>} bordered={false} style={{ width: '100%', maxWidth: '600px', margin: 'auto', overflow: 'hidden' }}>
                {isLoading && <Spin size="large" />}
                {insights && (
                    <Carousel autoplay autoplaySpeed={5000}>
                        {insights.map((insight, index) => (
                            <div key={index} style={slideStyle}>
                                <div style={{ marginBottom: '10px', fontSize: '22px', fontWeight: 700, fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}>
                                    {generateInsightText(insight.is_high, insight.insight_category, insight.insight_area)}
                                </div>
                                <img src={insight.image_url} alt={insight.title} style={imageStyle} />
                                <p style={textStyle}>{insight.description}</p>
                            </div>
                        ))}
                    </Carousel>
                )}
            </Card>
        </Slide>
    );
};

export default InsightSlide;
