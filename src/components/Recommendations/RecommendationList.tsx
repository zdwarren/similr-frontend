import React from 'react';
import { List, Typography, Divider } from 'antd';

// Assuming 'recommendations' is an array of recommendation objects
const RecommendationsList = ({ recommendations }: { recommendations: any[] }) => {
  return (
    <>
      <Divider orientation="left">Recommendations</Divider>
      <List
        itemLayout="horizontal"
        dataSource={recommendations}
        renderItem={rec => (
          <List.Item>
            <List.Item.Meta
              title={<a href={rec.url} target="_blank" rel="noopener noreferrer">{rec.title}</a>}
              description={rec.description}
            />
            <div style={{ flexShrink: 0 }}>
              <Typography.Text type="secondary">{`Score: ${(rec.similarity_score * 1000).toFixed(0)}`}</Typography.Text>
            </div>
          </List.Item>
        )}
      />
    </>
  );
};

export default RecommendationsList;
