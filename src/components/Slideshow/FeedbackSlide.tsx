import React, { useState } from 'react';
import { Rate, Input, Button, Form, Card, Checkbox, message } from 'antd';
import Slide from './Slide';
import { useMutation } from 'react-query';

const { TextArea } = Input;

const submitFeedback = async (feedbackData: any) => {
    const authToken = localStorage.getItem('authToken');
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    const response = await fetch(`${backendUrl}api/submit-feedback/`, {
        method: 'POST',
        headers: {
            'Authorization': `Token ${authToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedbackData),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to submit feedback');
    }
    return response.json();
};

const FeedbackSlide = () => {
    const [rating, setRating] = useState(0);
    const [recommendationRating, setRecommendationRating] = useState(0);
    const [feedback, setFeedback] = useState('');
    const [questionsFeedback, setQuestionsFeedback] = useState('');
    const [resultsFeedback, setResultsFeedback] = useState('');
    const [learnedSomething, setLearnedSomething] = useState(0);
    const [accuracyRating, setAccuracyRating] = useState(0);
    const [interestInGroupFeatures, setInterestInGroupFeatures] = useState(false);
    const [interestInRelationshipFeatures, setInterestInRelationshipFeatures] = useState(false);
    const [additionalFocusAreas, setAdditionalFocusAreas] = useState('');
    
    const mutation = useMutation(submitFeedback, {
        onSuccess: () => {
            message.success("Feedback submitted successfully.  Thank You!")
        },
        onError: (error: any) => {
            // Handle error, show error message, etc.
            message.error("Feedback unable to be submitted.  :(  Please try back later or go bug Zac to fix it!")
            console.error(error);
        },
    });

    const handleSubmit = () => {
        const feedbackData = {
            overall_experience_rating: rating,
            recommendation_rating: recommendationRating,
            general_feedback: feedback,
            questions_feedback: questionsFeedback,
            results_feedback: resultsFeedback,
            learned_something_rating: learnedSomething,
            results_accuracy_rating: accuracyRating,
            interest_in_group_features: interestInGroupFeatures,
            interest_in_relationship_features: interestInRelationshipFeatures,
            additional_focus_areas: additionalFocusAreas
        };
        
        mutation.mutate(feedbackData);

        // Reset state
        setRating(0);
        setRecommendationRating(0);
        setFeedback('');
        setQuestionsFeedback('');
        setResultsFeedback('');
        setLearnedSomething(0);
        setAccuracyRating(0);
        setInterestInGroupFeatures(false);
        setInterestInRelationshipFeatures(false);
        setAdditionalFocusAreas('');
    };

    const titleStyle: any = {
        fontSize: '24px',
        textAlign: 'center',
        fontWeight: 'bold',
        padding: '10px',
    };

    return (
        <Slide>
            <Card style={{ width: '100%', maxWidth: '800px', margin: 'auto' }} title={<div style={titleStyle}>Beta Feedback</div>} bordered={false}>
                <Form onFinish={handleSubmit} layout="vertical">
                    <Form.Item label="Rate your overall experience (1-5)">
                        <Rate allowHalf value={rating} onChange={setRating} />
                    </Form.Item>
                    <Form.Item label="Would you recommend it to a friend? (1-5)">
                        <Rate allowHalf value={recommendationRating} onChange={setRecommendationRating} />
                    </Form.Item>
                    <Form.Item label="How much did you learn about yourself? (1-5)">
                        <Rate allowHalf value={learnedSomething} onChange={setLearnedSomething} />
                    </Form.Item>
                    <Form.Item label="Rate the accuracy of the results (1-5)">
                        <Rate allowHalf value={accuracyRating} onChange={setAccuracyRating} />
                    </Form.Item>
                    <Form.Item label="Feedback on the questions">
                        <TextArea 
                            rows={3} 
                            value={questionsFeedback} 
                            onChange={(e) => setQuestionsFeedback(e.target.value)}
                            placeholder="What did you think about the questions? Were they clear and relevant?" 
                        />
                    </Form.Item>
                    <Form.Item label="Feedback on the results">
                        <TextArea 
                            rows={3} 
                            value={resultsFeedback} 
                            onChange={(e) => setResultsFeedback(e.target.value)}
                            placeholder="How did you find the results? Were they insightful and accurate?" 
                        />
                    </Form.Item>
                    <Form.Item label="What else would you like the results to focus on?">
                        <TextArea
                            rows={2}
                            value={additionalFocusAreas}
                            onChange={e => setAdditionalFocusAreas(e.target.value)}
                        />
                    </Form.Item>
                    <Form.Item>
                        <Checkbox checked={interestInGroupFeatures} onChange={e => setInterestInGroupFeatures(e.target.checked)}>
                            I would like more features focused on group dynamics
                        </Checkbox>
                    </Form.Item>
                    <Form.Item>
                        <Checkbox checked={interestInRelationshipFeatures} onChange={e => setInterestInRelationshipFeatures(e.target.checked)}>
                            I'm interested in a feature that evaluates relationships (both partners create profiles)
                        </Checkbox>
                    </Form.Item>
                    <Form.Item label="General feedback">
                        <TextArea 
                            rows={4} 
                            value={feedback} 
                            onChange={(e) => setFeedback(e.target.value)}
                            placeholder="Any other comments or suggestions?" 
                        />
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
