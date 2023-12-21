import React, { useState } from 'react';
import { Form, Radio, Input, Rate, Button, Alert } from 'antd';
import { submitMatchResponse } from '../../api/matchAPI';
import { message } from 'antd';

interface MatchResponseProps {
    matchId: string;
}

const MatchResponse: React.FC<MatchResponseProps> = ({ matchId }) => {
    const [form] = Form.useForm();
    const [isMatch, setIsMatch] = useState<string | null>(null);

    const handleSubmit = async (values: any) => {
        try {
            await submitMatchResponse(matchId, values.isMatch === 'yes', values.rating, values.feedback);
            message.success("Your feedback has been submitted successfully.");
        } catch (error) {
            message.error("An error occurred while submitting your feedback. Please try again.");
        }
    };

    return (
        <Form
            form={form}
            onFinish={handleSubmit}
            onValuesChange={(changedValues) => {
                if (changedValues.isMatch !== undefined) {
                    setIsMatch(changedValues.isMatch);
                }
            }}
        >
            <Form.Item name="isMatch" label="Is it a match?">
                <Radio.Group>
                    <Radio value="yes">Yes</Radio>
                    <Radio value="no">No</Radio>
                </Radio.Group>
            </Form.Item>
            {isMatch === 'yes' && (
                <Form.Item name="rating" label="Match Rating (1-3)">
                    <Rate count={3} />
                </Form.Item>
            )}
            {isMatch && (
                <>
                    <Form.Item name="feedback" label="Feedback">
                        <Input.TextArea rows={4} placeholder="Your feedback..." />
                    </Form.Item>
                    <Alert
                        message="Your feedback and rating will only be seen by the AI to aid in improving future matches."
                        type="info"
                    />
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Submit Feedback
                        </Button>
                    </Form.Item>
                </>
            )}
        </Form>
    );
};

export default MatchResponse;
