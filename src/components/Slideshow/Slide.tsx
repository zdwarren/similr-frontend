import React, { ReactNode } from 'react';

interface SlideProps {
  children: ReactNode;
}

const Slide: React.FC<SlideProps> = ({ children }) => {
  return (
    <div style={{ minHeight: '300px', textAlign: 'center' }}>
      {children}
    </div>
  );
};

export default Slide;
