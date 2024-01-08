import React, { useState } from 'react';
import { Rate, Input, Button, Form, Card } from 'antd';
import Slide from './Slide';

const { TextArea } = Input;

const FeedbackSlide = () => {
    const [rating, setRating] = useState(0);
    const [feedback, setFeedback] = useState('');

    const handleSubmit = () => {
        console.log('Submitting feedback:', { rating, feedback });
        // Here you would typically send the feedback to your backend server
        // Reset feedback form
        setRating(0);
        setFeedback('');
    };
    
    const titleStyle: React.CSSProperties = {
        fontSize: '24px', // Bigger font size for the title
        textAlign: 'center', // Center the title text
        fontWeight: 'bold', // Make the title text bold
        padding: '10px',
    };

    return (
        <Slide>
            <Card style={{ width: '100%', maxWidth: '800px', margin: 'auto' }} title={<div style={titleStyle}>Beta Feedback</div>} bordered={false}>
                <Form onFinish={handleSubmit}>
                    <Form.Item label="Rate your experience (1-5)">
                        <Rate allowHalf value={rating} onChange={setRating} />
                    </Form.Item>
                    <Form.Item label="Your feedback">
                        <TextArea rows={4} value={feedback} onChange={(e) => setFeedback(e.target.value)} />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Submit Feedback
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </Slide>
    );
};

export default FeedbackSlide;
