import React, { useState, useEffect } from 'react';
import { Button, Row, Col, Spin, Checkbox, Progress, message, Select, Popover } from 'antd';
import OptionDisplay from './OptionDisplay'; // Importing OptionDisplay
import HeaderComponent from '../HeaderComponent';
import { useMutation, useQuery } from 'react-query';
import SuggestPromptModal from './SuggestPromptModal';
import { DislikeOutlined, LikeOutlined, QuestionCircleOutlined } from '@ant-design/icons';

const { Option } = Select;

interface PromptTemplate {
    id: string;
    template_text: string;
}

interface OptionPair {
    id: string;
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
    progress: number,
    total_answered: number,
    milestone: number,
    current_accuracy: number | null;
    left_famous_username: string;
    right_famous_username: string;
};

const postUserChoice = async (userChoice: { option_pair: string; choice: string; }) => {
    const authToken = localStorage.getItem('authToken');
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    const response = await fetch(`${backendUrl}api/user-choices`, {
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

const fetchPromptTemplates = async (): Promise<PromptTemplate[]> => {
    const authToken = localStorage.getItem('authToken');
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    const response = await fetch(`${backendUrl}api/prompt-templates/`, {
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

const RapidFire: React.FC = () => {    
    const [isLoadingPair, setIsLoadingPair] = useState(false);
    const [retainPrompt, setRetainPrompt] = useState(false); // State for checkbox
    const [previousAccuracy, setPreviousAccuracy] = useState<number | null>(null);
    const [selectedPromptTemplateId, setSelectedPromptTemplateId] = useState<string | null>(null);

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
    
    useEffect(() => {
        // Check if current_accuracy is a number and not NaN
        if (currentPair && typeof currentPair.current_accuracy === 'number' && !isNaN(currentPair.current_accuracy)) {
            if (previousAccuracy !== null && currentPair.current_accuracy - previousAccuracy !== 0) {
                const accuracyChange = (currentPair.current_accuracy - previousAccuracy) * 100;
                const changeAmount = accuracyChange >= 0 ? `increased by ${accuracyChange.toFixed(2)}` : `decreased by ${(-accuracyChange).toFixed(2)}`;
                message.info(`Accuracy has ${changeAmount}%`);
            }
            // Update previousAccuracy
            setPreviousAccuracy(currentPair.current_accuracy);
        }
    }, [currentPair?.current_accuracy, currentPair, previousAccuracy]);
        
    const mutation = useMutation(postUserChoice, {
        onMutate: () => {
            setIsLoadingPair(true); // Set loading state when mutation starts
        },
        onSuccess: () => {
            refetchNextPair();
        },
    });

        
    // Inside your component
    const { data: promptTemplates } = useQuery('promptTemplates', fetchPromptTemplates);

    // Dropdown component
    const renderPromptTemplateDropdown = () => {
        return (
            <Select
                style={{ width: '100%' }}
                placeholder="Select a prompt template"
                onChange={(value: string) => setSelectedPromptTemplateId(value)}
                value={selectedPromptTemplateId}
            >
                {promptTemplates?.map(template => (
                    <Option key={template.id} value={template.id}>{template.template_text}</Option>
                ))}
            </Select>
        );
    };
        
    // Inside your component
    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleOpenModal = () => {
        setIsModalVisible(true);
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
    };
    
    const handleChoice = (choice: 'left' | 'right' | 'skip') => {
        if (!currentPair) {
            console.error('No current pair available');
            return;
        }
        
        const userChoice = {
            option_pair: currentPair.id,
            choice: choice,
        };
    
        mutation.mutate(userChoice);
    };

    const handleThumbsUp = async (type: 'prompt' | 'option', id: string) => {
        const authToken = localStorage.getItem('authToken');
        try {
            const backendUrl = process.env.REACT_APP_BACKEND_URL;
            const response = await fetch(`${backendUrl}api/${type}/${id}/thumbs-up/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${authToken}`,
                    'Content-Type': 'application/json',
                }
            });
            if (response.ok) {
                message.success(`${type.charAt(0).toUpperCase() + type.slice(1)} template thumbs UP recorded!`);
            } else {
                message.error('Failed to record thumbs up.');
            }
        } catch (error) {
            message.error('An error occurred.');
        }
    };
    
    const handleThumbsDown = async (type: 'prompt' | 'option', id: string) => {
        const authToken = localStorage.getItem('authToken');
        try {
            const backendUrl = process.env.REACT_APP_BACKEND_URL;
            const response = await fetch(`${backendUrl}api/${type}/${id}/thumbs-down/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${authToken}`,
                    'Content-Type': 'application/json',
                }
            });
            if (response.ok) {
                message.success(`${type.charAt(0).toUpperCase() + type.slice(1)} template thumbs DOWN recorded!`);
            } else {
                message.error('Failed to record thumbs down.');
            }
        } catch (error) {
            message.error('An error occurred.');
        }
    };
    
    // Popover content
    const helpContent = (
        <div>
            <p>Click <strong>Left</strong> or <strong>Right</strong> or click on the image to make your choice.</p>
            <p>If you absolutely have no preference or don't understand the question, feel free to <strong>Skip</strong>. Try to answer at least 100 pairs, but the more you answer, the better!</p>
            <br></br>
            <p>The <strong>thumbs up/down</strong> at the top is for rating the prompt template used to generate options, while the bottom thumbs up/down is for rating the options themselves.</p>
            <p>You can ignore the 'Retain this prompt template' and 'Select prompt' unless you want a specific category of questions.</p>
            <br></br>
            <p>After you've clicked it will show you the model's guess of your pick, the overall % for all people who have answered and it might show a famous person's selection!</p>
            <br></br>
            <p>The model will try to guess your answer (Toss Up, Lean, Confident, Very Confident) and should be around 65% after you've answered a few.</p>
            <br></br>
            <p><strong>It's learning about you!</strong></p>
        </div>
    );

    if (error) {
        return <div>Error</div>;
    }
    
    return (
        <>
            <HeaderComponent />
            <div style={{ padding: '20px' }}>                
                <Row gutter={16} justify="center" style={{ marginBottom: '20px' }}>
                    <Col xs={16} sm={12} md={10} lg={8}>
                        <div style={{ textAlign: 'center', fontSize: '16px', position: 'relative' }}>
                            Current Accuracy: {previousAccuracy !== null && typeof previousAccuracy === 'number'
                                ? `${(previousAccuracy * 100).toFixed(2)}%`
                                : 'N/A'}
                            <Popover content={helpContent} title="How to Use This Page">
                                <QuestionCircleOutlined style={{ marginLeft: '10px', cursor: 'pointer', position: 'relative', top: '-4px' }} />
                            </Popover>
                        </div>
                    </Col>
                </Row>
                <Row gutter={16} justify="center" style={{ marginBottom: '20px' }}>
                    <Col xs={16} sm={12} md={10} lg={8}>
                        {currentPair && (
                            <Progress
                                percent={Math.round(currentPair.progress)}
                                format={() => `${currentPair.total_answered} / ${currentPair.milestone}`}
                                showInfo={true}
                            />
                        )}
                    </Col>
                </Row>
                <Row gutter={16} justify="center" style={{ marginBottom: '20px' }}>
                    <Col xs={24} sm={16} md={12} lg={10}>
                        <div style={{ textAlign: 'center' }}>
                            <Checkbox
                                checked={retainPrompt}
                                onChange={e => setRetainPrompt(e.target.checked)}
                                style={{ marginRight: '10px' }}
                            >
                                Retain this prompt template
                            </Checkbox>
                            <Button
                                onClick={handleOpenModal}
                                size="small"
                            >
                                Suggest Prompt
                            </Button>
                        </div>
                    </Col>
                </Row>
                <Row gutter={16} justify="center" style={{ marginBottom: '20px' }}>
                    <Col xs={24} sm={16} md={12} lg={10}>
                        <div style={{ textAlign: 'center' }}>
                            {renderPromptTemplateDropdown()}
                        </div>
                    </Col>
                </Row>
                <Row gutter={16} justify="center" style={{ marginBottom: '20px' }}>
                    {/* Column for Prompt Template */}
                    <Col xs={24} sm={12} md={10} lg={10}>
                        <div style={{ textAlign: 'center', marginBottom: '10px', fontSize: '16px', fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', }}>
                            {currentPair?.prompt_template}
                        </div>
                    </Col>

                    {/* Column for Thumbs Up/Down Buttons */}
                    <Col xs={6} sm={5} md={4} lg={2}>
                        <div style={{ textAlign: 'center' }}>
                            {currentPair && (
                                <>
                                    <Button
                                        icon={<LikeOutlined />}
                                        onClick={() => handleThumbsUp('prompt', currentPair.prompt_template_id)}
                                        style={{ marginRight: '10px' }}
                                    />
                                    <Button
                                        icon={<DislikeOutlined />}
                                        onClick={() => handleThumbsDown('prompt', currentPair.prompt_template_id)}
                                    />
                                </>
                            )}
                        </div>
                    </Col>
                </Row>
                <Row gutter={16} justify="center">
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
                <Row gutter={16} justify="center" style={{ marginTop: '10px' }}>
                    <Col>
                        {currentPair && (
                            <>
                                <Button
                                    icon={<LikeOutlined />}
                                    onClick={() => handleThumbsUp('option', currentPair.id)}
                                    style={{ marginRight: '10px' }}
                                />
                                <Button
                                    icon={<DislikeOutlined />}
                                    onClick={() => handleThumbsDown('option', currentPair.id)}
                                />
                            </>
                        )}
                    </Col>
                </Row>
                <Row gutter={16} justify="center" style={{ marginTop: '20px' }}>
                    <Col>
                        <Button type="primary" onClick={() => handleChoice('left')}>Left</Button>
                    </Col>
                    <Col>
                        <Button type="default" onClick={() => handleChoice('skip')}>Skip</Button>
                    </Col>
                    <Col>
                        <Button type="primary" onClick={() => handleChoice('right')}>Right</Button>
                    </Col>
                </Row>
            </div>
            <SuggestPromptModal isVisible={isModalVisible} onClose={handleCloseModal} />
        </>
    );    
};

export default RapidFire;
