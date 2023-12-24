import React, { useContext } from 'react';
import { Typography, Button, Row, Col, Image, Divider, Alert } from 'antd';
import HeaderComponent from './HeaderComponent';
import { AuthContext } from '../AuthContext';
import { Link } from 'react-router-dom';

const { Title, Paragraph } = Typography;

const Landing: React.FC = () => {
    const { isLoggedIn, username } = useContext(AuthContext);

    const renderSectionButton = (text: string) => (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <Button type="primary" size="large">
                <Link to="/signup">{text}</Link>
            </Button>
        </div>
    );

    return (
        <>
            <HeaderComponent />
            <div style={{ padding: '50px', maxWidth: '1200px', margin: '0 auto' }}>
                <Title level={1} style={{ textAlign: 'center' }}>Welcome to Similr.ai</Title>
                <Paragraph style={{ textAlign: 'center', fontSize: '18px' }}>
                    {isLoggedIn ? (
                        `Welcome back, ${username}! Discover new insights and connect with friends.`
                    ) : (
                        `Embark on an exciting journey of self-discovery and shared experiences with Similr.ai, the social app that’s redefining personal understanding and connection.`
                    )}
                </Paragraph>
                {renderSectionButton('Join Similr.ai Today!')}
                <div style={{ marginTop: '20px' }}>
                    <Alert
                        style={{ fontSize: '16px' }}
                        type='info'
                        message={
                            <span style={{ fontWeight: '700', fontSize: '18px' }}>Welcome Beta Testers!</span>
                        }
                        description={
                            <div>
                                <p>
                                    For the first time in human history, we are at a juncture where the advances in AI, natural language processing, and Large Language Models (LLMs) are making what was once thought impossible, possible. Similr.ai stands at the forefront of this technological revolution, harnessing these breakthroughs to provide personality insights that were previously impossible.
                                </p>
                                <br />
                                <p>
                                    Thank you for participating as a Beta tester for Similr.ai! Your feedback is invaluable to us. As we continue to develop and refine our platform, please be aware that you might encounter some hiccups along the way. We're dedicated to improving your experience and encourage you to share any feedback or suggestions you may have. Together, we'll make Similr.ai better for everyone!
                                </p>
                            </div>
                        }
                        showIcon
                    />
                </div>
                <Divider />
                <Row gutter={[16, 32]}>
                    <Col span={12}>
                        <Image
                            src="https://similrai-images.s3.us-east-2.amazonaws.com/similrai-landing1.png"
                            alt="Personality Analysis Visualization"
                            style={{ width: '100%' }}
                        />
                    </Col>
                    <Col span={12} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingLeft: '25px'}}>
                        <Title level={2}>Uncover the Layers of Your Personality</Title>
                        <Paragraph>
                        Explore the depths of your personality with our advanced AI analysis.
                        From uncovering hidden traits to mapping out your preferences, Similr.ai
                        provides insightful and tailored personality profiles.
                        </Paragraph>
                        {renderSectionButton('Discover Your Personality')}
                    </Col>
                </Row>
                <Divider />
                <Row gutter={[16, 32]}>
                    <Col span={12} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingRight: '25px' }}>
                        <Title level={2}>Recommendations Just for You</Title>
                        <Paragraph>
                        Step into a world of personalized recommendations spanning products, careers,
                        travel destinations, and more, all aligned with your personality.
                        </Paragraph>
                        {renderSectionButton('Explore Recommendations')}
                    </Col>
                    <Col span={12}>
                        <Image
                            src="https://similrai-images.s3.us-east-2.amazonaws.com/similrai-landing2.png"
                            alt="Personalized Recommendations"
                            style={{ width: '100%' }}
                        />
                    </Col>
                </Row>
                <Divider />
                <Row gutter={[16, 32]}>
                    <Col span={12}>
                        <Image
                            src="https://similrai-images.s3.us-east-2.amazonaws.com/similrai-landing3.png"
                            alt="Friends and Family Groups"
                            style={{ width: '100%' }}
                        />
                    </Col>
                    <Col span={12} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingLeft: '25px' }}>
                        <Title level={2}>Connect with Friends and Family</Title>
                        <Paragraph>
                        Create groups to see how you and your friends or family align and differ in personalities.
                        Understand your group's dynamics, discover similarities and differences, and deepen your
                        connections. Similr.ai makes social interactions more insightful and engaging.
                        </Paragraph>
                        {renderSectionButton('Connect with Others')}
                    </Col>
                </Row>
                <Divider />
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <Button type="primary" size="large" href="http://localhost:3000/signup">Join Similr.ai Today!</Button>
                </div>
            </div>
        </>
    );
};

export default Landing;
