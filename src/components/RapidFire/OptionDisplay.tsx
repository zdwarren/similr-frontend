import React from 'react';
import { Card, Spin } from 'antd';

interface OptionDisplayProps {
    option: string;
    optionImageUrl: string;
    isLoading: boolean;
    relativeSimilarity: number;
    absoluteSimilarity: number;
    historicalPercent: number;
    famousUsername: any;
    onClick: () => void;
}

const OptionDisplay: React.FC<OptionDisplayProps> = ({
    option,
    optionImageUrl,
    isLoading,
    // relativeSimilarity,
    // absoluteSimilarity,
    historicalPercent,
    famousUsername,
    onClick }) => {
    
    // Determine the color and text based on similarity value
    // const similarityColor = relativeSimilarity >= 0 ? 'green' : 'red';
    // let similarityText = '';
    // if (relativeSimilarity < 0) {
    //     similarityText = '';
    // } else if (relativeSimilarity * 100 < 5) {
    //     similarityText = 'Toss Up';
    // } else if (relativeSimilarity * 100 > 20) {
    //     similarityText = 'Very Confident';
    // } else if (relativeSimilarity * 100 > 10) {
    //     similarityText = 'Confident';
    // } else {
    //     similarityText = 'Lean';
    // }

    const cardStyle: React.CSSProperties = {
        margin: '20px',
        width: '350px', // Fixed width
        height: '450px', // Fixed height to accommodate image/text and spinner
        display: 'flex',
        flexDirection: 'column', // Stack children vertically
        alignItems: 'center', // Horizontally center children
        justifyContent: 'center', // Vertically center children
        fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
        cursor: 'pointer',
        overflow: 'hidden', // Ensure contents don't overflow
    };

    // Container for image to reserve the space
    const imageContainerStyle: React.CSSProperties = {
        height: '300px', // Fixed height matching the max image height
        width: '100%', // Full width of the card
        backgroundColor: '#f0f0f0', // A light grey placeholder color, adjust as needed
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    };

    // Adjusted image style for consistent display
    const imageStyle: React.CSSProperties = {
        maxWidth: '100%', // Ensure it doesn't exceed container's width
        maxHeight: '100%', // Ensure it doesn't exceed container's height
        objectFit: 'cover', // Cover the area without stretching
    };

    const textStyle: React.CSSProperties = {
        textAlign: 'center',
        width: '100%',
        marginTop: '15px',
        fontSize: '18px', // Increase font size
        fontWeight: '500', // Medium font weight, you can use 600 or 700 for bolder text
    };

    const textStyle2: React.CSSProperties = {
        textAlign: 'center',
        width: '100%',
        fontSize: '16px', // Increase font size
        fontWeight: '500', // Medium font weight, you can use 600 or 700 for bolder text
        color: 'rgba(0, 0, 0, 0.88)',
        marginTop: '40px',
    };

    const similarityStyle: React.CSSProperties = {
        marginTop: '30px',
        fontSize: '14px',
        // color: similarityColor,
    };

    const spinnerContainerStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%', // Full height of card
    };

    // Function to format the name based on its type
    const formatName = (name: any) => {
        if (typeof name === 'string') {
            return name;
        } else if (typeof name === 'object' && name !== null && 'first' in name && 'last' in name) {
            return `${name.first} ${name.last}`;
        }
        return '';
    };

    let cardContent;

    if (isLoading) {
        cardContent = (
            <div style={spinnerContainerStyle}>
                <Spin size='large' />
                {option && (
                    <div style={similarityStyle}>
                        {/* <div style={{ fontSize: '14px', width: '100%', textAlign: 'center'}}>
                            {(relativeSimilarity * 1000).toFixed(0)}
                            {`  (${(absoluteSimilarity * 1000).toFixed(0)})`}
                            {similarityText && ` - ${similarityText}`}
                        </div> */}
                        {
                            (historicalPercent !== 0 && historicalPercent !== 100) && (
                                <div style={{ marginTop: '10px', fontSize: '24px', width: '100%', textAlign: 'center', color: 'rgba(0, 0, 0, 0.88)' }}>
                                {historicalPercent.toFixed(0)}%
                                <br />
                                {formatName(famousUsername)}
                                </div>
                            )
                        }
                        <p style={textStyle2}>{option}</p>
                    </div>
                )}
            </div>
        );
    } else {
        cardContent = (
            <div style={{width: '100%'}}>
                <div style={imageContainerStyle}>
                    {optionImageUrl && (
                        <img 
                            src={optionImageUrl} 
                            alt={option} 
                            style={imageStyle} 
                        />
                    )}
                </div>
                <p style={textStyle}>{option}</p>
            </div>
        );
    }

    return (
        <Card style={cardStyle} onClick={onClick}>
            {cardContent}
        </Card>
    );
};

export default OptionDisplay;