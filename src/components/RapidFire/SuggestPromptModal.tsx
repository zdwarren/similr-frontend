import React, { useState } from 'react';
import { Modal, Button, Input } from 'antd';
import { useMutation } from 'react-query';

const { TextArea } = Input;

interface SuggestPromptModalProps {
    isVisible: boolean;
    onClose: () => void;
}

const SuggestPromptModal: React.FC<SuggestPromptModalProps> = ({ isVisible, onClose }) => {
    const [promptText, setPromptText] = useState<string>('');

    const mutation = useMutation((newPrompt: { template_text: string }) => {
        const authToken = localStorage.getItem('authToken');
        return fetch('http://localhost:8000/api/suggest-prompt-template/', {
            method: 'POST',
            headers: {
                'Authorization': `Token ${authToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newPrompt)
        });
    });

    const handleSubmit = async () => {
        mutation.mutate({ template_text: promptText });
        onClose(); // Close the modal
    };

    return (
        <Modal
            title="Suggest a Prompt Template"
            visible={isVisible}
            onOk={handleSubmit}
            onCancel={onClose}
            okButtonProps={{ disabled: mutation.isLoading }}
        >
            <TextArea
                placeholder="Enter your prompt template suggestion"
                value={promptText}
                onChange={e => setPromptText(e.target.value)}
                autoSize={{ minRows: 4, maxRows: 10 }}
            />
        </Modal>
    );
};

export default SuggestPromptModal;
