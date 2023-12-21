import React, { useEffect, useState } from 'react';
import { Scatter } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title,
                  Tooltip, Legend, ScatterController, ScatterDataPoint } from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';
import { ChartDataset } from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ScatterController,
  annotationPlugin
);

type Score = {
  title: string;
  score: number;
};

interface DataItem {
  username: string;
  x: number;
  y: number;
  profile: any;
  top_recommendation: {
    title: string;
    description: string;
    score: number;
  };
}

interface SimilrChartProps {
  data: DataItem[];
}

const SimilrChart = ({ data }: SimilrChartProps) => {
  const currentUser = localStorage.getItem('username');
  const [legendItems, setLegendItems] = useState<{ title: string, color: string }[]>([]);

  // Create a map of usernames to profile data
  const profileMap = new Map<string, any>();
  data.forEach(item => profileMap.set(item.username, item.profile));

  // const colorMap: any = {
  //   'Sanguine': 'rgba(255, 159, 64, ',   // Warm, vibrant orange
  //   'Choleric': 'rgba(255, 99, 132, ',   // Bold, lively pink
  //   'Melancholic': 'rgba(153, 102, 255, ', // Deep, thoughtful purple
  //   'Phlegmatic': 'rgba(75, 192, 192, '   // Calm, soothing teal
  // };

//   const colorMap: any = {
//     'Neuroticism': 'rgba(255, 99, 132, ',   // Dark Violet
//     'Extraversion': 'rgba(255, 193, 7, ',   // Bright Yellow
//     'Openness': 'rgba(64, 224, 208, ',      // Turquoise
//     'Agreeableness': 'rgba(60, 179, 113, ', // Medium Sea Green
//     'Conscientiousness': 'rgba(0, 0, 128, ' // Navy Blue
// };

  // const colorMap: any = {
  //   'Philosophical': 'rgba(255, 99, 132, ',
  //   'Introverted': 'rgba(255, 99, 132, ',
  //   'Empathetic': 'rgba(255, 99, 132, ',

  //   'Adventurous': 'rgba(54, 162, 235, ',
  //   'Creative': 'rgba(54, 162, 235, ',
  //   'Extroverted': 'rgba(54, 162, 235, ',
  //   'Assertive':  'rgba(54, 162, 235, ',

  //   'Analytical': 'rgba(153, 102, 255, ',
  //   'Realistic':  'rgba(153, 102, 255, ',

  //   'Optimistic': 'rgba(54, 235, 140, ',
  // };

   const colorMap: any = {
    'Philosophical': 'rgba(255, 99, 132, ',
    'Adventurous': 'rgba(54, 162, 235, ',
    'Assertive': 'rgba(255, 206, 86, ',
    'Empathetic': 'rgba(75, 192, 192, ',
    'Analytical': 'rgba(153, 102, 255, ',
    'Creative': 'rgba(255, 159, 64, ',
    'Realistic': 'rgba(201, 203, 207, ',
    'Optimistic': 'rgba(54, 235, 140, ',
    'Introverted': 'rgba(10, 10, 10, ',
    'Extroverted': 'rgba(162, 54, 135, ',
  //   // 'Marketing and Communication': 'rgba(255, 99, 132, ',
  //   // 'Legal Profession': 'rgba(54, 162, 235, ',
  //   // 'Science and Research': 'rgba(255, 206, 86, ',
  //   // 'Public Service': 'rgba(75, 192, 192, ',
  //   // 'Engineering': 'rgba(153, 102, 255, ',
  //   // 'Business and Finance': 'rgba(255, 159, 64, ',
  //   // 'Arts and Entertainment': 'rgba(201, 203, 207, ',
  //   // 'Education': 'rgba(54, 235, 140, ',
  //   // 'Technology': 'rgba(10, 10, 10, ',
  //   // 'Healthcare': 'rgba(162, 154, 235, '
   };
  
  // Create datasets
  const datasets: ChartDataset<'scatter', ScatterDataPoint[]>[] = data.map(user => {
    const baseColor = colorMap[user.top_recommendation.title] || 'rgba(0, 0, 0, '; // Fallback color
    const opacity = 1; //Math.min(user.top_recommendation.score * 2000000, 1); // Adjust opacity based on score
    const color = `${baseColor}${opacity})`;

    return {
      label: user.username,
      data: [{ x: user.x, y: user.y }],
      backgroundColor: user.username === currentUser ? 'rgba(255, 99, 132, 0.5)' : color,
      pointRadius: 5
    };
  });

  const annotations = data.map(user => ({
    type: 'label' as const,
    content: user.username,
    xValue: user.x,
    yValue: user.y,
    backgroundColor: 'transparent',
    font: {
      size: 12
    },
    position: 'end' as const, // Change this to a simple string
    xAdjust: -5,
    yAdjust: 14
  }));

  const chartData = {
    datasets: datasets
  };

  const options = {
    plugins: {
      legend: {
        display: false // Add this line to hide the legend
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.dataset.label || '';
            const profile = profileMap.get(label) ? profileMap.get(label)['basic_info'] : null;
      
            if (!profile) return 'No Profile Data';
      
            const profileLines = Object.entries(profile).map(([key, value]) => {
              if (key === 'scores' && Array.isArray(value)) {
                // Check if value is an array and cast it to Score[]
                const scores = value as Score[];
                return scores.map(score => `${score.title}: ${score.score}`).join('\n');
              } else if (typeof value === 'object' && value !== null) {
                // Handle objects
                return `${key}: ${Object.values(value).join(', ')}`;
              }
              // Handle other types
              return `${key}: ${value}`;
            });
      
            return profileLines;
          }
        },
      },
      annotation: {
        annotations: annotations
      }
    },
    scales: {
      x: {
        type: 'linear' as const,
        position: 'bottom' as const,
        min: 0,
        max: 100
      },
      y: {
        type: 'linear' as const,
        position: 'left' as const,
        min: 0,
        max: 100
      },
    },
  };

  // Custom Legend
  const CustomLegend = () => (
    <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '10px' }}>
      {Object.entries(colorMap).map(([title, color]) => (
        <div key={title} style={{ display: 'flex', alignItems: 'center', marginRight: '15px', marginBottom: '5px' }}>
          <span style={{ display: 'inline-block', width: '20px', height: '20px', backgroundColor: `${color}1)`, marginRight: '10px' }}></span>
          <span>{title}</span>
        </div>
      ))}
    </div>
  );

  return (
    <>
      <CustomLegend />
      <Scatter data={chartData} options={options} />    
    </>
  );
};

export default SimilrChart;
