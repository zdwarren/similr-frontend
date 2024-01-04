import React, { ReactNode, useState } from 'react';
import { Pagination } from 'antd';

interface SlideshowContainerProps {
    children: ReactNode;
}

const SlideshowContainer: React.FC<SlideshowContainerProps> = ({ children }) => {
    const [currentSlide, setCurrentSlide] = useState(1);
    const totalSlides = React.Children.count(children);

    const onChange = (page: number) => {
        setCurrentSlide(page);
    };

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                <Pagination
                    current={currentSlide}
                    onChange={onChange}
                    total={totalSlides * 10} // Total number of slides (multiplied by 10 as each page represents 10 units)
                    pageSize={10} // Each 'page' should represent one slide
                    showSizeChanger={false} // Disable changing page size
                />
            </div>
            {React.Children.toArray(children)[currentSlide - 1]}
        </div>
    );
};

export default SlideshowContainer;
