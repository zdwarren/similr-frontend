import React from 'react';
import SlideshowContainer from './SlideshowContainer';
import WelcomeSlide from './WelcomeSlide';
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
        <OverviewSlide overviewType="personality" title="Personality Summary" />
        <OverviewSlide overviewType="career" title="Career Advice"/>
        <OverviewSlide overviewType="matchmaker" title="Matchmaker"/>
        <OverviewSlide overviewType="dating_profile" title="Dating Profile"/>
        <OverviewSlide overviewType="dnd" title="Your D&D Character"/>
        <OverviewSlide overviewType="fantasy" title="Your Fantasy Character"/>
        <InsightSlide insightCategory="Personality" title="Your Personality Traits" />
        <InsightSlide insightCategory="Career" title="Career Recommendations" />
        <InsightSlide insightCategory="Famous People" title="Famous Similarities" />
        <InsightSlide insightCategory="Hogwarts House" title="Hogwarts House" />
        <InsightSlide insightCategory="D&D Class" title="D&D Class" />
        <SimilrChartSlide />
        {/* Add more slides as necessary */}
      </SlideshowContainer>
    </>
  );
};

export default SlideshowPage;
