import React, { useCallback, useEffect, useState } from 'react';
import Slide from './Slide';
import Confetti from 'react-confetti';
import { Alert, Card, List, Typography } from 'antd';
const { Title, Paragraph } = Typography;

interface WelcomeSlideProps {
  username: string;
}

const WelcomeSlide: React.FC<WelcomeSlideProps> = ({ username }) => {
  const [confettiPieces, setConfettiPieces] = useState(200);
  const [triggeredOverview, setTriggeredOverview] = useState(false); // State to ensure it's only called once

  useEffect(() => {
    // Decrease confetti over time
    const decreaseConfetti = setInterval(() => {
      setConfettiPieces((prev) => Math.max(prev - 20, 0));
    }, 1000);
    return () => clearInterval(decreaseConfetti);
  }, []);


  const authToken = localStorage.getItem('authToken');  // Fetch auth token from local storage or context
  const backendUrl = process.env.REACT_APP_BACKEND_URL; // Fetch the backend URL from environment variables

  const triggerOverviewCreation = useCallback(async () => {
    setTriggeredOverview(true);
    try {
      const response = await fetch(`${backendUrl}api/trigger-overview/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${authToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
    } catch (error) {
      console.error("Error triggering overview creation: ", error);
    }
  }, [backendUrl, authToken]); // Dependencies for useCallback

  useEffect(() => {
    // Only call if it hasn't been triggered already
    if (!triggeredOverview) {
      triggerOverviewCreation();
    }
  }, [triggerOverviewCreation, triggeredOverview]); // Dependency array includes the memoized function and triggeredOverview

  // Improved text content
  const slideContents = [
    "Series of cards showing you how you rank in various aspects of personality and careers.",
    "Compare yourself with a variety of renowned personalities and intriguing fictional characters.",
    "Dive deep into personalized insights about your personality, career aspirations, and relationships.",
    "Explore tailored advice and exclusive AI-generated imagery that reflects your unique persona.",
    "Enjoy your very own D&D, fantasy, and animal characters with unique images just for you!",
    "Finally, examine a map showcasing your alignment with famous people, real and fictional."
  ];

  return (
    <Slide>
      {confettiPieces > 0 && <Confetti numberOfPieces={confettiPieces} />}
      <Card bordered={false} style={{ width: '100%', maxWidth: '700px', margin: 'auto', textAlign: 'center' }}>
        <Title style={{ textAlign: 'center', marginBottom: '30px'  }} level={3}>Congratulations, {username}!</Title>
        <Paragraph style={{ textAlign: 'left', fontSize: '15px'  }} >We're currently processing the results to provide you with a unique and insightful experience. Here's a glimpse of what's to come:</Paragraph>
        <List
          style={{ textAlign: 'left'  }}
          size="large"
          bordered={false}
          dataSource={slideContents}
          renderItem={item => <List.Item>{item}</List.Item>}
        />
      </Card>
    </Slide>
  );
};

export default WelcomeSlide;
