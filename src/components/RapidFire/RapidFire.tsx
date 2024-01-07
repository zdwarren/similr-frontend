import React, { useState, useEffect } from 'react';
import { Button, Row, Col, Spin, Progress, Popover, Form, Input, Alert } from 'antd';
import OptionDisplay from './OptionDisplay';
import HeaderComponent from '../HeaderComponent';
import { useMutation, useQuery } from 'react-query';
import { QuestionCircleOutlined, SettingOutlined } from '@ant-design/icons';
import SettingsSection from './SettingsSection';
import ThumbsFeedback from './ThumbsFeedback';
import { Link } from 'react-router-dom';

export interface OptionPair {
    id: string;
    question_type: 'standard' | 'profile_option' | 'insight';
    insight_category?: string;
    insight_area?: string;
    is_high?: boolean;    
    options?: string[];
    left: string;
    right: string;
    percent_left: number;
    left_image_url: string;
    right_image_url: string;
    left_similarity: number;
    right_similarity: number;
    l_similarity: number;
    r_similarity: number;
    prompt_template_id: string;
    prompt_template: string;
    display_text: string;
    progress: number,
    total_answered: number,
    milestone: number,
    current_accuracy: number | null;
    left_famous_username: any;
    right_famous_username: any;
};

const postUserChoice = async (userChoice: { option_pair: string; choice: string; question_type: 'standard' | 'profile_option' | 'insight'; }) => {
    const authToken = localStorage.getItem('authToken');
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    const response = await fetch(`${backendUrl}api/user-choices/`, {
        method: 'POST',
        headers: {
            'Authorization': `Token ${authToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userChoice),
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    return response.json();
};

const RapidFire: React.FC = () => {
    const username = localStorage.getItem('username') || "user";

    const [isLoadingPair, setIsLoadingPair] = useState(false);
    const [retainPrompt, setRetainPrompt] = useState(false);
    const [selectedPromptTemplateId, setSelectedPromptTemplateId] = useState<string | null>(null);
    const [showSettings, setShowSettings] = useState(false);

    const fetchNextOptionPair = async (): Promise<OptionPair> => {
        const authToken = localStorage.getItem('authToken');
        const backendUrl = process.env.REACT_APP_BACKEND_URL;
        let url = `${backendUrl}api/option-pairs/next/?retainPrompt=${retainPrompt}`;
        if (selectedPromptTemplateId) {
            url += `&promptTemplateId=${selectedPromptTemplateId}`;
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
        const data = await response.json();
        console.log("API response:", data);
        return data;
    };

    const { data: currentPair, error, refetch: refetchNextPair } = useQuery('optionPair', fetchNextOptionPair, {
        enabled: false,
        onSuccess: () => setIsLoadingPair(false),
        onError: () => setIsLoadingPair(false),
    });

    useEffect(() => {
        refetchNextPair();
    }, [refetchNextPair, selectedPromptTemplateId]);
    
    const mutation = useMutation(postUserChoice, {
        onMutate: () => {
            setIsLoadingPair(true); // Set loading state when mutation starts
        },
        onSuccess: () => {
            // Delay the next action by 500ms
            setTimeout(() => {
                refetchNextPair();
                // Make sure to set loading state back to false if necessary
            }, 10); // 500ms delay
        },
    });

    const handleChoice = (choice: 'left' | 'right' | 'skip' | string) => {
        if (!currentPair) {
            console.error('No current pair available');
            return;
        }
        
        const userChoice = {
            option_pair: currentPair.id,
            choice: choice,
            question_type: currentPair.question_type
        };
    
        mutation.mutate(userChoice);
    };

    const renderQuestion = () => {
        if (!currentPair) {
            return null; //<Spin size="large" />;
        }

        switch (currentPair.question_type) {
            case 'standard':
                return renderStandardQuestion();
            case 'profile_option':
                return renderProfileOptionQuestion();
            case 'insight':
                return renderInsight();
            default:
                return <div>Unknown question type.</div>;
        }
    };

    const renderStandardQuestion = () => {
        return (
            <>
                <Row gutter={16} justify="center" style={{ marginBottom: '10px' }}>
                    <Col xs={24} sm={24} md={20} lg={12} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ textAlign: 'center', fontSize: '20px', fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', flex: 1, marginRight: '10px' }}>
                            {currentPair?.total_answered == 0 && (
                                <Alert
                                message={<strong>Welcome {username}!</strong>}
                                description={(
                                    <>
                                        <p>
                                            Thank you for taking the time to try out Similr.ai.
                                            We hope you enjoy the questions and your report.
                                            You will recieve insights along the way as we learn more about you.
                                            Try to get to 400 questions but you can get your report early starting at 300 questions.
                                        </p>
                                        <p>
                                            Try to be honest in your answers and don't overthink the questions.
                                            You can skip if you have no preference.
                                        </p>
                                        <p>
                                            The Personal Questions will aid in generating more personal results but feel free to select "Prefer Not to Say"
                                        </p>
                                        <p>It should take about 20-30 minutes to complete.</p>
                                    </>
                                )}
                                type="success"
                                style={{ marginBottom: '20px' }}
                              />
                            )}
                            {currentPair?.display_text || currentPair?.prompt_template}
                        </div>
                    </Col>
                </Row>
                <Row justify="center" style={{ width: '100%', display: 'flex', alignItems: 'center' }}>
                    {currentPair ? (
                        <>
                            <OptionDisplay
                                option={currentPair?.left || 'Loading...'}
                                optionImageUrl={currentPair?.left_image_url || ''}
                                isLoading={isLoadingPair}
                                relativeSimilarity={currentPair?.left_similarity}
                                absoluteSimilarity={currentPair?.l_similarity}
                                historicalPercent={currentPair?.percent_left}
                                famousUsername={currentPair?.left_famous_username}
                                onClick={() => handleChoice('left')}
                            />
                             <Button size="large" type="dashed" style={{ margin: '0 -10px' }} onClick={() => handleChoice('skip')}>Skip</Button>
                            <OptionDisplay
                                option={currentPair?.right || 'Loading...'}
                                optionImageUrl={currentPair?.right_image_url || ''}
                                isLoading={isLoadingPair}
                                relativeSimilarity={currentPair?.right_similarity}
                                absoluteSimilarity={currentPair?.r_similarity}
                                historicalPercent={100 - currentPair?.percent_left}
                                famousUsername={currentPair?.right_famous_username}
                                onClick={() => handleChoice('right')}
                            />
                        </>
                    ) : (
                        <Spin size="large" />
                    )}
                </Row>
            </>
        );
    };

    const renderProfileOptionQuestion = () => {
        if (!currentPair) {
            return <div>Loading profile question...</div>;
        }
    
        // Function to handle clicking an option button
        const onOptionClick = (option: string) => {
            handleChoice(option);
        };
    
        const onTextInputSubmit = (values: any) => {
            // values is an object where keys are the names of form items
            const answerText = values.profileInput; // Assuming 'profileInput' is the name of your Form.Item
            if (answerText) {
                handleChoice(answerText);
            }
        };
    
        // Check if currentPair has options to display buttons, else display text input
        if (currentPair.options && currentPair.options.length > 0) {
            // Render buttons for each option
            return (
                <>
                    <Row justify="center" style={{ marginBottom: '10px' }}>
                        <Col span={24} style={{ textAlign: 'center', marginBottom: '20px' }}>
                            <div style={{ fontSize: '20px', fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}>
                                {currentPair.display_text || currentPair.prompt_template}
                            </div>
                        </Col>
                    </Row>
                    <Row justify="center" gutter={[0, 16]} style={{ marginBottom: '40px' }}>
                        {currentPair.options.map((option, index) => (
                            <Col key={index} span={24} style={{ display: 'flex', justifyContent: 'center' }}>
                                <Button style={{ width: '300px' }} onClick={() => onOptionClick(option)}>
                                    {option}
                                </Button>
                            </Col>
                        ))}
                    </Row>
                </>
            );
        } else {
            // Render text input for free-form response
            return (
                <>
                    <Row justify="center" style={{ marginBottom: '10px' }}>
                        <Col span={24} style={{ textAlign: 'center', marginBottom: '20px' }}>
                            <div style={{ fontSize: '20px', fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}>
                                {currentPair.display_text || currentPair.prompt_template}
                            </div>
                        </Col>
                    </Row>
                    <Row justify="center">
                        <Col span={24} style={{ display: 'flex', justifyContent: 'center' }}>
                            <Form onFinish={onTextInputSubmit}>
                                <Form.Item name="profileInput">
                                    <Input placeholder="Type your answer here" />
                                </Form.Item>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit" style={{ width: '200px' }}>
                                        Submit
                                    </Button>
                                </Form.Item>
                            </Form>
                        </Col>
                    </Row>
                </>
            );
        }
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

    const renderInsight = () => {
        if (!currentPair || currentPair.question_type !== 'insight') {
            return <div>Loading insight...</div>;
        }
    
        return (
            <>
                <Row justify="center" style={{ marginBottom: '20px' }}>
                    <Alert message="The predictions will improve as you answer more questions." type="success" style={{ fontSize: '14px' }} />
                </Row>
                <Row justify="center" style={{ marginBottom: '0px' }}>
                    <Col span={24} style={{ textAlign: 'center' }}>
                        <div style={{ marginBottom: '10px', fontSize: '22px', fontWeight: 700, fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}>
                            {generateInsightText(currentPair.is_high, currentPair.insight_category, currentPair.insight_area)}
                        </div>
                        <div style={{ fontSize: '20px', fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}>
                            {currentPair.display_text}
                        </div>
                        <Row justify="center" style={{ width: '100%', display: 'flex', alignItems: 'center' }}>
                            <OptionDisplay
                                option={currentPair?.left || 'Loading...'}
                                optionImageUrl={currentPair?.left_image_url || ''}
                                isLoading={isLoadingPair}
                                relativeSimilarity={0}
                                absoluteSimilarity={0}
                                historicalPercent={0}
                                famousUsername={null}
                                onClick={() => refetchNextPair()}
                            />
                      </Row>
                    </Col>
                </Row>
                <Row justify="center" style={{ marginBottom: '30px' }}>
                    <Button size="large" onClick={() => refetchNextPair()}>Keep Going!</Button>
                </Row>
            </>
        );
    };
    

    const helpContent = (
        <div style={{ width: '600px'}}>
            <p>Click on the image to make your choice.</p>
            <p>If you absolutely have no preference or don't understand the question, feel free to <strong>Skip</strong>. Try to answer at least 100 pairs, but the more you answer, the better!</p>
            <p>The <strong>thumbs up/down</strong> is for rating the options.  If you think it's a bad choice or confusing or the images are bad give it a thumbs down.</p>
            <p>After you've clicked it will show you the overall % for all people who have answered and it might show a famous person's selection.</p>
            <p>Once you've answered enough questions click on <strong>Profile</strong> to see your analysis!</p>
        </div>
    );
    
    // Function to toggle settings visibility
    const toggleSettings = () => {
        setShowSettings(!showSettings);
    };

    if (error) {
        return <div>Error</div>;
    }
    
    return (
        <>
            {/* <HeaderComponent /> */}
            <div style={{ padding: '20px' }}>
                {showSettings && (
                    <SettingsSection
                        retainPrompt={retainPrompt}
                        setRetainPrompt={setRetainPrompt}
                        selectedPromptTemplateId={selectedPromptTemplateId}
                        setSelectedPromptTemplateId={setSelectedPromptTemplateId} />
                )}
                <Row gutter={16} justify="center" style={{ marginBottom: '20px' }}>
                    <Col style={{ width: '50%' }}>
                        {currentPair && (
                            <Progress
                                percent={Math.round(currentPair.progress)}
                            />
                        )}
                    </Col>
                    {/* <Col xs={4} sm={6} md={8} lg={2} style={{ textAlign: 'right' }}>
                        <SettingOutlined onClick={toggleSettings} style={{ fontSize: '22px', cursor: 'pointer' }} />
                        <Popover content={helpContent} title="How to Use This Page">
                            <QuestionCircleOutlined style={{ marginLeft: '10px', cursor: 'pointer', position: 'relative', top: '-4px' }} />
                        </Popover>
                    </Col> */}
                </Row>
                {renderQuestion()}
                {currentPair && currentPair.total_answered >= 300 && (
                    <div style={{ textAlign: 'center', margin: '20px 0' }}>
                        <Link to="/results">
                            <Button size="large" type="primary">
                                Go to Results!
                            </Button>
                        </Link>
                    </div>
                )}
                {currentPair && currentPair.question_type == 'standard' && (
                    <ThumbsFeedback currentPair={currentPair} />
                )}
            </div>
        </>
    );    
};

export default RapidFire;
