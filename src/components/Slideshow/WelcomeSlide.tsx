import React from 'react';
import Slide from './Slide'; // Import the Slide component

interface WelcomeSlideProps {
  username: string;
}

const WelcomeSlide: React.FC<WelcomeSlideProps> = ({ username }) => {
  return (
    <Slide>
      <h1>Congratulations, {username}!</h1>
      <p>Get ready to explore your insights.</p>
    </Slide>
  );
};

export default WelcomeSlide;
