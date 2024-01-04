import React from 'react';
import SlideshowContainer from './SlideshowContainer';
import WelcomeSlide from './WelcomeSlide';
import Slide from './Slide';
import HeaderComponent from '../HeaderComponent';
import SimilrChartSlide from './SimilrChartSlide';
import OverviewSlide from './OverviewSlide';
import InsightSlide from './InsightSlide';

const SlideshowPage = () => {
  // Assuming you have the username available
  const username = localStorage.getItem('username') || "user";

  return (
    <>
      <HeaderComponent />
      <SlideshowContainer>
        <WelcomeSlide username={username} />
        <OverviewSlide />
        <InsightSlide />
        <SimilrChartSlide />
        {/* Add more slides as necessary */}
      </SlideshowContainer>
    </>
  );
};

export default SlideshowPage;
