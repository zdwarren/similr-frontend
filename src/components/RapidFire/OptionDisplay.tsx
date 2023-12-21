import React from 'react';
import { Card, Spin } from 'antd';

interface OptionDisplayProps {
    option: string;
    optionImageUrl: string;
    isLoading: boolean;
    relativeSimilarity: number;
    absoluteSimilarity: number;
    historicalPercent: number;
    famousUsername: string;
    onClick: () => void;
}

const OptionDisplay: React.FC<OptionDisplayProps> = ({
    option,
    optionImageUrl,
    isLoading,
    relativeSimilarity,
    absoluteSimilarity,
    historicalPercent,
    famousUsername,
    onClick }) => {
    
    // Determine the color and text based on similarity value
    const similarityColor = relativeSimilarity >= 0 ? 'green' : 'red';
    let similarityText = '';
    if (relativeSimilarity < 0) {
        similarityText = '';
    } else if (relativeSimilarity * 100 < 5) {
        similarityText = 'Toss Up';
    } else if (relativeSimilarity * 100 > 20) {
        similarityText = 'Very Confident';
    } else if (relativeSimilarity * 100 > 10) {
        similarityText = 'Confident';
    } else {
        similarityText = 'Lean';
    }

    const cardStyle: React.CSSProperties = {
        margin: '20px',
        width: '100%',
        maxWidth: '300px',
        minHeight: '150px',
        display: 'flex',
        //alignItems: 'center', // Align items vertically in the center
        justifyContent: 'center', // Align items horizontally in the center
        fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
        cursor: 'pointer',
    };

    const textStyle: React.CSSProperties = {
        textAlign: 'center',
        width: '100%',
        fontSize: '16px', // Increase font size
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
        color: similarityColor,
    };

    const spinnerContainerStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%', // Full height of card
    };

    let cardContent;

    if (isLoading) {
        cardContent = (
            <div style={spinnerContainerStyle}>
                <Spin />
                {option && (
                    <div style={similarityStyle}>
                        <div style={{ fontSize: '14px', width: '100%', textAlign: 'center'}}>
                            {(relativeSimilarity * 1000).toFixed(0)}
                            {`  (${(absoluteSimilarity * 1000).toFixed(0)})`}
                            {similarityText && ` - ${similarityText}`}
                        </div>
                        {
                            (historicalPercent !== 0 && historicalPercent !== 100) && (
                                <div style={{ marginTop: '30px', fontSize: '16px', width: '100%', textAlign: 'center', color: 'rgba(0, 0, 0, 0.88)' }}>
                                {historicalPercent.toFixed(0)}%
                                <br />
                                {famousUsername}
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
            <div>
                {optionImageUrl && (
                    <img 
                        src={optionImageUrl} 
                        alt={option} 
                        style={{ width: '250px', height: '250px', marginBottom: '10px' }} 
                    />
                )}
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