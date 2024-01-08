import React from 'react';
import SlideshowContainer from './SlideshowContainer';
import WelcomeSlide from './WelcomeSlide';
import HeaderComponent from '../HeaderComponent';
import SimilrChartSlide from './SimilrChartSlide';
import OverviewSlide from './OverviewSlide';
import InsightSlide from './InsightSlide';
import CompatibilitySlide from './CompatibilitySlide';
import PrivateGroupSlide from './PrivateGroupSlide';
import FeedbackSlide from './FeedbackSlide';

const SlideshowPage = () => {
  // Assuming you have the username available
  const username = localStorage.getItem('username') || "user";

  return (
    <>
      <HeaderComponent />
      <SlideshowContainer>
        <WelcomeSlide username={username} />
        <InsightSlide insightCategory="Archetype" title="Your Archetypes" isPositive={true} />
        <InsightSlide insightCategory="Motivation" title="Your Motivations" isPositive={true} />
        <InsightSlide insightCategory="General Personality" title="General Personality Traits" isPositive={true} />
        <InsightSlide insightCategory="Personality" title="Lacking in Personality Traits" isPositive={false} />
        <InsightSlide insightCategory="Personality" title="High in Personality Traits" isPositive={true} />
        <InsightSlide insightCategory="General Career" title="General Career Recommendations" isPositive={true} />
        <InsightSlide insightCategory="Career" title="Not Recommended Careers" isPositive={false} />
        <InsightSlide insightCategory="Career" title="Recommended Careers" isPositive={true} />
        <InsightSlide insightCategory="Famous Person" title="Not Famous Similarities" isPositive={false} />
        <InsightSlide insightCategory="Famous Person" title="Famous Similarities" isPositive={true} />
        <InsightSlide insightCategory="Hogwarts House" title="Hogwarts House" isPositive={true} />
        <InsightSlide insightCategory="D&D Class" title="D&D Class" isPositive={true} />
        <OverviewSlide overviewType="personality" title="Personality Summary" />
        <OverviewSlide overviewType="career" title="Career Advice"/>
        <OverviewSlide overviewType="matchmaker" title="Matchmaker"/>
        <OverviewSlide overviewType="dating_profile" title="Dating Profile"/>
        <OverviewSlide overviewType="dnd" title="Your D&D Character"/>
        <OverviewSlide overviewType="fantasy" title="Your Fantasy Character"/>
        <OverviewSlide overviewType="animal" title="What Animal Are You?"/>
        <SimilrChartSlide />
        <CompatibilitySlide />
        <PrivateGroupSlide />
        <FeedbackSlide />
      </SlideshowContainer>
    </>
  );
};

export default SlideshowPage;
