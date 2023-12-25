import React, { useState, useEffect } from 'react';
import { Button, Row, Col, Spin, Checkbox, Progress, message, Select, Popover } from 'antd';
import OptionDisplay from './OptionDisplay'; // Importing OptionDisplay
import HeaderComponent from '../HeaderComponent';
import { useMutation, useQuery } from 'react-query';
import SuggestPromptModal from './SuggestPromptModal';
import { DislikeOutlined, LikeOutlined, QuestionCircleOutlined, SettingOutlined } from '@ant-design/icons';

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
    display_text: string;
    progress: number,
    total_answered: number,
    milestone: number,
    current_accuracy: number | null;
    left_famous_username: any;
    right_famous_username: any;
};

const postUserChoice = async (userChoice: { option_pair: string; choice: string; }) => {
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
    // const [previousAccuracy, setPreviousAccuracy] = useState<number | null>(null);
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
    
    // useEffect(() => {
    //     // Check if current_accuracy is a number and not NaN
    //     if (currentPair && typeof currentPair.current_accuracy === 'number' && !isNaN(currentPair.current_accuracy)) {
    //         if (previousAccuracy !== null && currentPair.current_accuracy - previousAccuracy !== 0) {
    //             const accuracyChange = (currentPair.current_accuracy - previousAccuracy) * 100;
    //             const changeAmount = accuracyChange >= 0 ? `increased by ${accuracyChange.toFixed(2)}` : `decreased by ${(-accuracyChange).toFixed(2)}`;
    //             message.info(`Accuracy has ${changeAmount}%`);
    //         }
    //         // Update previousAccuracy
    //         setPreviousAccuracy(currentPair.current_accuracy);
    //     }
    // }, [currentPair?.current_accuracy, currentPair, previousAccuracy]);
        
    const mutation = useMutation(postUserChoice, {
        onMutate: () => {
            setIsLoadingPair(true); // Set loading state when mutation starts
        },
        onSuccess: () => {
            // Delay the next action by 500ms
            setTimeout(() => {
                refetchNextPair();
                // Make sure to set loading state back to false if necessary
            }, 1000); // 500ms delay
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
        <div style={{ width: '600px'}}>
            <p>Click on the image to make your choice.</p>
            <br></br>
            <p>If you absolutely have no preference or don't understand the question, feel free to <strong>Skip</strong>. Try to answer at least 100 pairs, but the more you answer, the better!</p>
            <br></br>
            <p>The <strong>thumbs up/down</strong> is for rating the options.  If you think it's a bad choice or confusing or the images are bad give it a thumbs down.</p>
            <br></br>
            <p>After you've clicked it will show you the overall % for all people who have answered and it might show a famous person's selection.</p>
            <br></br>
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
            <HeaderComponent />
            <div style={{ padding: '20px' }}>
                {showSettings && (
                    <Row gutter={16} justify="center" style={{ marginBottom: '20px' }}>
                        <Col xs={24} sm={16} md={12} lg={10}>
                            <div style={{ background: '#f0f2f5', padding: '20px', borderRadius: '8px' }}>
                                <Checkbox
                                    checked={retainPrompt}
                                    onChange={e => setRetainPrompt(e.target.checked)}
                                >
                                    Retain this prompt template
                                </Checkbox>
                                <Button
                                    onClick={handleOpenModal}
                                    size="small"
                                >
                                    Suggest Prompt
                                </Button>
                                <div style={{ marginTop: '10px' }}>
                                    {renderPromptTemplateDropdown()}
                                </div>
                            </div>
                        </Col>
                    </Row>
                )}
                {/* <Row gutter={16} justify="center" style={{ marginBottom: '20px' }}>
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
                </Row> */}
                <Row gutter={16} justify="center" style={{ marginBottom: '20px' }}>
                    <Col xs={2} sm={2} md={2} lg={2}>
                    </Col>
                    <Col xs={20} sm={18} md={16} lg={12}>
                        {currentPair && (
                            <Progress
                                percent={Math.round(currentPair.progress)}
                                format={() => `${currentPair.total_answered} / ${currentPair.milestone}`}
                                showInfo={true}
                            />
                        )}
                    </Col>
                    <Col xs={4} sm={6} md={8} lg={2} style={{ textAlign: 'right' }}>
                        <SettingOutlined onClick={toggleSettings} style={{ fontSize: '22px', cursor: 'pointer' }} />
                        <Popover content={helpContent} title="How to Use This Page">
                                <QuestionCircleOutlined style={{ marginLeft: '10px', cursor: 'pointer', position: 'relative', top: '-4px' }} />
                        </Popover>
                    </Col>
                </Row>
                <Row gutter={16} justify="center" style={{ marginBottom: '10px' }}>
                    {/* Column for Prompt Template */}
                    <Col xs={24} sm={24} md={20} lg={11} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
     
                        {/* Div for Centered Text directly above Option Displays */}
                        <div style={{ textAlign: 'center', fontSize: '20px', fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', flex: 1, marginRight: '10px' }}>
                            {currentPair?.display_text || currentPair?.prompt_template}
                        </div>

                        {/* Div for Thumbs Up/Down Buttons aligned to right
                        <div>
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
                        </div> */}
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
                <Row gutter={64} justify="center" style={{ marginTop: '20px' }}>
                    {/* <Col>
                        <Button type="primary" onClick={() => handleChoice('left')}>Left</Button>
                    </Col> */}
                    {/* <Col>
                        <Button type="default" onClick={() => handleChoice('skip')}>Skip</Button>
                    </Col> */}
                    {/* <Col>
                        <Button type="primary" onClick={() => handleChoice('right')}>Right</Button>
                    </Col> */}
                </Row>
                <Row gutter={16} justify="center" style={{ marginTop: '0px' }}>
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
            </div>
            <SuggestPromptModal isVisible={isModalVisible} onClose={handleCloseModal} />
        </>
    );    
};

export default RapidFire;
