import React from 'react';
import { Typography, Button, Row, Col, Image, Divider } from 'antd';
import HeaderComponent from '../HeaderComponent';

const { Title, Paragraph } = Typography;

const MeetPeople = () => {

    const renderSectionButton = (text: string, link: string) => (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <Button type="primary" size="large" href={link}>{text}</Button>
        </div>
    );

    return (
        <>
            <HeaderComponent />
            <div style={{ padding: '50px', maxWidth: '1200px', margin: '0 auto' }}>
                <Title level={1} style={{ textAlign: 'center' }}>Meet Similr People</Title>
                <Paragraph style={{ textAlign: 'center', fontSize: '18px' }}>
                    Smart Social Apps:  A future where finding like-minded individuals is not just a dream. 
                    Connect, engage, and grow with people who share your passions and personality.
                </Paragraph>
                <Divider />
                <Row gutter={[16, 32]}>
                    <Col span={12}>
                        <Image
                            src="https://similrai-images.s3.us-east-2.amazonaws.com/meet1.png"
                            alt="Connecting People"
                            style={{ width: '100%' }}
                            placeholder={
                                <div style={{ textAlign: 'center' }}>
                                    Image: A vibrant and dynamic representation of diverse people connecting through digital channels, symbolizing the power of shared interests in forging strong bonds.
                                </div>
                            }
                        />
                    </Col>
                    <Col span={12} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingLeft: '25px'}}>
                        <Title level={2}>Find Your Tribe</Title>
                        <Paragraph>
                            Discover a community that resonates with your unique personality. 
                            Our platform makes it easy to find and connect with individuals who understand you, 
                            share your hobbies, and appreciate your perspective.
                        </Paragraph>
                        {renderSectionButton('Discover Your Community', '/community-discovery')}
                    </Col>
                </Row>
                <Divider />
                <Row gutter={[16, 32]}>
                    <Col span={12} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingRight: '25px' }}>
                        <Title level={2}>Engage in Meaningful Conversations</Title>
                        <Paragraph>
                            Engage in discussions that matter. Find people who not only listen but also contribute 
                            to conversations in ways that enrich your understanding and broaden your horizons.
                        </Paragraph>
                        {renderSectionButton('Start a Conversation', '/start-conversation')}
                    </Col>
                    <Col span={12}>
                        <Image
                            src="https://similrai-images.s3.us-east-2.amazonaws.com/meet2.png"
                            alt="Meaningful Conversations"
                            style={{ width: '100%' }}
                            placeholder={
                                <div style={{ textAlign: 'center' }}>
                                    Image: A heartwarming scene of people engaged in deep conversation, 
                                    illustrating the warmth and depth of discussions that can occur between like-minded individuals.
                                </div>
                            }
                        />
                    </Col>
                </Row>
                <Divider />
                <Row gutter={[16, 32]}>
                    <Col span={12}>
                        <Image
                            src="https://similrai-images.s3.us-east-2.amazonaws.com/meet3.png"
                            alt="Expanding Horizons"
                            style={{ width: '100%' }}
                            placeholder={
                                <div style={{ textAlign: 'center' }}>
                                    Image: A creative depiction of individuals exploring and expanding their horizons 
                                    together, highlighting the journey of growth and discovery with newfound connections.
                                </div>
                            }
                        />
                    </Col>
                    <Col span={12} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingLeft: '25px' }}>
                        <Title level={2}>Expand Your Horizons</Title>
                        <Paragraph>
                            Your journey with Similr People is not just about meeting others. 
                            It’s about growing together, learning from each other, and creating experiences 
                            that enrich your life.
                        </Paragraph>
                        {renderSectionButton('Join the Journey', '/join-journey')}
                    </Col>
                </Row>
                <Divider />
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <Button type="primary" size="large">Join Us on This Journey</Button>
                </div>
            </div>
        </>
    );
};

export default MeetPeople;
