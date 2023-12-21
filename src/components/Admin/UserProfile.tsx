import { QueryFunction } from 'react-query';
import { useQuery } from 'react-query';
import { Table, List, Card } from 'antd';

const QUESTION_LIST = [
    "What are the top three values you believe are most important in a partner?",
    "What are some of your life goals? How do you plan on achieving them?",
    "How important is your career to you? How do you balance it with other aspects of your life?",
    "What kind of lifestyle do you envision for yourself in the future?",
    "What did you learn from your past relationships?",
    "What are some of the reasons why your previous relationships didn't work out?",
    "How would you describe your personality? How would your friends describe your personality?",
    "Are you more of an introvert or an extrovert?",
    "How do you handle stress or conflicts?",
    "What are your hobbies? What do you enjoy doing in your free time?",
    "Do you enjoy traveling? What are some of your favorite destinations?",
    "How important are your family and friends to you?",
    "What role do you see your family playing in your life in the future?",
    "What does a successful relationship look like to you?",
    "Are you looking for a long-term relationship or are you open to other forms of relationships?",
    "What qualities are you looking for in a partner?",
    "How do you feel about children? Would you want to have children in the future?",
    "How important is physical intimacy to you in a relationship?",
    "How do you typically express your feelings and emotions?",
    "How do you resolve disagreements or conflicts?",
];

interface UserProfileData {
    age: number;
    gender: string;
    orientation: string;
    ethnicity: string;
    personality_traits: string;
    interests: string;
    occupation: string;
    hobby: string;
    smoking_preference: string;
    alcohol_preference: string;
    dietary_preference: string;
    current_kids: string;
    profile_summary: string;
    cards: {
        title: string;
        content: string;
    }[];
    questionnaire: {
        answers: string[];
    };
}

interface UserProfileProps {
    username: string;
}

const UserProfile: React.FC<UserProfileProps> = ({ username }) => {

    const fetchProfile: QueryFunction<UserProfileData> = async ({ queryKey }) => {
        const [_key, username] = queryKey;
        const res = await fetch(`http://localhost:8000/api/admin/users/${username}/`);

        if (!res.ok) {
            throw new Error('Network response was not ok');
        }

        return res.json();
    };

    const { data: profile, isLoading } = useQuery(['profile', username], fetchProfile);

    if (isLoading || !profile) {
        return <div>Loading...</div>;
    }

    const { age, gender, orientation, ethnicity, personality_traits, interests, occupation, hobby, smoking_preference, alcohol_preference, dietary_preference, current_kids, profile_summary } = profile;

    const userData = [
        { label: "Age", value: age },
        { label: "Gender", value: gender },
        { label: "Orientation", value: orientation },
        { label: "Ethnicity", value: ethnicity },
        { label: "Personality Traits", value: personality_traits },
        { label: "Interests", value: interests },
        { label: "Occupation", value: occupation },
        { label: "Hobby", value: hobby },
        { label: "Smoking Preference", value: smoking_preference },
        { label: "Alcohol Preference", value: alcohol_preference },
        { label: "Dietary Preference", value: dietary_preference },
        { label: "Current Kids", value: current_kids },
        { label: "Profile Summary", value: profile_summary },
    ]

    return (
        <div>
            <List
                header={<div>Profile Info</div>}
                bordered
                dataSource={userData}
                renderItem={item => (
                    <List.Item>
                        <strong>{item.label}:</strong> {item.value}
                    </List.Item>
                )}
            />

            {profile.cards.map((card, index) => (
                <Card key={index} title={card.title}>
                    {card.content}
                </Card>
            ))}

            <h2>Questionnaire</h2>
            <Table
                dataSource={profile.questionnaire.answers.map((answer, index) => ({ question: QUESTION_LIST[index], answer }))}
                columns={[
                    { title: 'Question', dataIndex: 'question', key: 'question' },
                    { title: 'Answer', dataIndex: 'answer', key: 'answer' },
                ]}
            />
        </div>
    );
};

export default UserProfile;
