import { Button, Checkbox, Col, Row, Select } from "antd";
import { useState } from "react";
import { useQuery } from "react-query";
import SuggestPromptModal from "./SuggestPromptModal";

const { Option } = Select;

interface PromptTemplate {
    id: string;
    template_text: string;
}

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


// Define an interface for the component's props
interface SettingsSectionProps {
    retainPrompt: boolean;
    setRetainPrompt: (value: boolean) => void;
    selectedPromptTemplateId: string | null;
    setSelectedPromptTemplateId: (value: string) => void;
}

// SettingsSection Component
const SettingsSection: React.FC<SettingsSectionProps> = ({
    retainPrompt,
    setRetainPrompt,
    selectedPromptTemplateId,
    setSelectedPromptTemplateId,
}) => {
    
    const [isModalVisible, setIsModalVisible] = useState(false);            
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
        
    const handleOpenModal = () => {
        setIsModalVisible(true);
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
    };

    return (
        <>
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
            <SuggestPromptModal isVisible={isModalVisible} onClose={handleCloseModal} />
        </>
    );    
};

export default SettingsSection;
