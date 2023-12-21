import React from 'react';
import { Table, Tooltip } from 'antd';

interface UserScore {
  user_name: string;
  similarity_score: number;
  top_rec_title: string;
  top_rec_description: string;
  top_rec_score: number;
}

interface UsersScoresListProps {
  usersScores: UserScore[];
}

const UsersScoresList: React.FC<UsersScoresListProps> = ({ usersScores }) => {
  // Function to format and round scores
  const formatScore = (score: number): string => (score * 1000).toFixed(0);

  const columns = [
    {
      title: 'User',
      dataIndex: 'user_name',
      key: 'user_name',
      sorter: (a: UserScore, b: UserScore) => a.user_name.localeCompare(b.user_name),
    },
    {
      title: 'Similarity Score',
      dataIndex: 'similarity_score',
      key: 'similarity_score',
      sorter: (a: UserScore, b: UserScore) => b.similarity_score - a.similarity_score,
      defaultSortOrder: 'ascend' as const,
      render: (score: number) => formatScore(score),
    },
    {
      title: 'Top Recommendation Title',
      dataIndex: 'top_rec_title',
      key: 'top_rec_title',
      sorter: (a: UserScore, b: UserScore) => a.top_rec_title.localeCompare(b.top_rec_title),
      render: (text: string, record: UserScore) => (
        <Tooltip title={record.top_rec_description}>
          {text}
        </Tooltip>
      ),
    },
    {
      title: 'Top Recommendation Score',
      dataIndex: 'top_rec_score',
      key: 'top_rec_score',
      sorter: (a: UserScore, b: UserScore) => b.top_rec_score - a.top_rec_score,
      render: (score: number) => formatScore(score),
    },
  ];

  return (
    <Table 
      dataSource={usersScores} 
      columns={columns} 
      pagination={false}  // Disable pagination
    />
  );
};

export default UsersScoresList;
