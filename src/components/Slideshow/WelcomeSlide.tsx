import React, { useEffect, useState } from 'react';
import Slide from './Slide'; // Import the Slide component
import Confetti from 'react-confetti';
import { Card, List } from 'antd';

interface WelcomeSlideProps {
  username: string;
}

const WelcomeSlide: React.FC<WelcomeSlideProps> = ({ username }) => {
  const [confettiPieces, setConfettiPieces] = useState(200); // Start with 200 pieces of confetti

  useEffect(() => {
    const decreaseConfetti = setInterval(() => {
      setConfettiPieces((prev) => Math.max(prev - 20, 0)); // Decrease by 20 pieces until 0
    }, 1000); // Adjust this interval to control how fast the confetti disappears

    return () => clearInterval(decreaseConfetti); // Cleanup the interval
  }, []);

  const slideContents = [
    "Uncover deep insights about your personality, career, relationships, and more.",
    "See how you compare with famous personalities or fictional characters.",
    "Discover tailored recommendations and suggestions for your personal growth."
  ];

  return (
    <Slide>
      {confettiPieces > 0 && <Confetti numberOfPieces={confettiPieces} />}
      <Card title={`Congratulations, ${username}!`} bordered={false} style={{ width: '100%', maxWidth: '600px', margin: 'auto', textAlign: 'center' }}>
        <p>Get ready to embark on a journey of self-discovery! Here's what to expect:</p>
        <List
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
