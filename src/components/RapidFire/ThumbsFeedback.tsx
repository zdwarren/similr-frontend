import { DislikeOutlined, LikeOutlined } from "@ant-design/icons";
import { Button, Col, Row, message } from "antd";
import { OptionPair } from "./RapidFire";


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

interface ThumbsFeedbackProps {
    currentPair: OptionPair; // Use the OptionPair type here
}

// FeedbackControls Component
const ThumbsFeedback: React.FC<ThumbsFeedbackProps> = ({ currentPair }) => {
    return (
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
    );    
};

export default ThumbsFeedback;
