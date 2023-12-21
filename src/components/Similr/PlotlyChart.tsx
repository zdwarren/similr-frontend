import { Data } from 'plotly.js';
import React from 'react';
import Plot from 'react-plotly.js';

interface DataItem {
  username: string;
  x: number;
  y: number;
  z: number;
  profile: any;
}

interface SimilrChartProps {
  data: DataItem[];
}

const PlotlyChart = ({ data }: SimilrChartProps) => {
  const currentUser = localStorage.getItem('username');
  
  const traceData : Data[] = [{
    type: 'scatter',
    mode: 'text+markers', // Add 'text' to the mode to include annotations
    name: 'Users',
    x: data.map(user => user.x),
    y: data.map(user => user.y),
    marker: {
      size: 6,
      color: data.map(user => user.username === currentUser ? 'red' : 'blue')
    },
    text: data.map(user => user.username), // Annotation text
    textposition: 'top center', // Position of the annotations
    hoverinfo: 'text',
    hovertemplate: data.map(user => 
      user.profile ? `<b>${user.username}</b><br>${JSON.stringify(user.profile['basic_info'], null, 2)?.replace(/\n/g, '<br>')}` : 'No Profile Data'
    ) // Custom hover text formatting
  }];
  
  return (
    <Plot
      data={traceData}
      layout={{
        title: 'User Embeddings 2D Scatter Plot',
        autosize: true,
        xaxis: {
          title: 'X Axis',
          // other x-axis configurations
        },
        yaxis: {
          title: 'Y Axis',
          // other y-axis configurations
        },
      }}
      style={{ width: '100%', height: '100%' }}
    />
  );
};

export default PlotlyChart;
