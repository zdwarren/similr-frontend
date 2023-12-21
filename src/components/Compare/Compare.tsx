import React, { useEffect, useState } from 'react';
import { Select, Card, Row, Col, Typography, Spin, Button, Checkbox } from 'antd';
import { Radar, Bar, } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend, CategoryScale, LinearScale, BarElement, ArcElement, PolarAreaController } from 'chart.js';
import HeaderComponent from '../HeaderComponent';
import Plot from 'react-plotly.js';

const { Option } = Select;
const { Title } = Typography;

// Register components for different chart types
ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend, CategoryScale, LinearScale, BarElement, ArcElement, PolarAreaController);

interface Recommendation {
    rec_id: number;
    rec_title: string;
    similarity_score: number;
}

interface GroupMemberData {
    user_id: number;
    user_name: string;
    recommendations: Recommendation[];
}

interface Dataset {
    label: string;
    data: number[];
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
}

interface ChartDataType {
    labels: string[];
    datasets: {
        label: string;
        data: number[];
        backgroundColor: string;
        borderColor: string;
        borderWidth: number;
    }[];
}

const fetchTags = async (): Promise<string[]> => {
    const authToken = localStorage.getItem('authToken');
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    const response = await fetch(`${backendUrl}api/tags/`, {
        method: 'GET',
        headers: {
        'Authorization': `Token ${authToken}`,
        'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
};

const fetchCategories = async (): Promise<string[]> => {
    const authToken = localStorage.getItem('authToken');
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    const response = await fetch(`${backendUrl}api/categories/`, {
        method: 'GET',
        headers: {
            'Authorization': `Token ${authToken}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
};

const fetchGroupRecommendations = async (url: string) => {
    const authToken = localStorage.getItem('authToken');
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${authToken}`,
        'Content-Type': 'application/json',
      },
    });
  
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  };

const heatmapLayout = {
    title: 'Group Trait Heatmap',
    xaxis: { title: 'Members' },
    yaxis: { title: 'Traits' }
};

const ComparePage = () => {
    const [selectedTag, setSelectedTag] = useState<string>('');
    const [selectedCategory, setSelectedCategory] = useState<string>('');

    const [tags, setTags] = useState<string[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [includeSelf, setIncludeSelf] = useState(false);

    const initialBarChartData: ChartDataType = {
        labels: [],
        datasets: []
    };
    
    const [barChartData, setBarChartData] = useState<ChartDataType>(initialBarChartData);
    
    const [groupRecommendations, setGroupRecommendations] = useState({
        labels: [],
        datasets: []
    });

    const [heatmapData, setHeatmapData] = useState<any[]>([]); // Add heatmap data state
    
    useEffect(() => {
        // Fetch tags and categories on component mount
        fetchTagsData();
        fetchCategoriesData();
    }, []);
    
    const fetchCategoriesData = async () => {
        try {
            const fetchedCategories = await fetchCategories();
            setCategories(fetchedCategories);
        } catch (error) {
            console.error("Error fetching categories: ", error);
        }
    };

    const fetchTagsData = async () => {
        try {
        const fetchedTags = await fetchTags();
        setTags(fetchedTags);
        } catch (error) {
        console.error("Error fetching tags: ", error);
        }
    };

    const chartColors = [
        'rgba(255, 99, 132, 0.2)', // red
        'rgba(54, 162, 235, 0.2)', // blue
        'rgba(255, 206, 86, 0.2)', // yellow
        'rgba(75, 192, 192, 0.2)', // green
        'rgba(153, 102, 255, 0.2)', // purple
        'rgba(255, 159, 64, 0.2)'  // orange
    ];
 
    const parseGroupRecommendations = (data: GroupMemberData[]) => {
        const sortedData = [...data].sort((a, b) => a.user_name.localeCompare(b.user_name));

        const labels = sortedData[0].recommendations.map((rec: Recommendation) => rec.rec_title);
        const datasets: Dataset[] = []; // Explicitly type the array
        const heatmapZ: number[][] = []; // Explicitly type the array as an array of number arrays
    
        sortedData.forEach((member: GroupMemberData, index: number) => {
            const memberData = member.recommendations.map((rec: Recommendation) => Math.round(rec.similarity_score * 1000));
            const colorIndex = index % chartColors.length; // Cycle through colors if more members than colors
            datasets.push({
                label: member.user_name,
                data: memberData,
                backgroundColor: chartColors[colorIndex],
                borderColor: chartColors[colorIndex].replace('0.2', '1'), // Adjust alpha for border color
                borderWidth: 1
            });
    
            heatmapZ.push(memberData); // Push data for heatmap
        });
    
        // Update heatmap data
        const updatedHeatmapData = [{
            x: labels,
            y: sortedData.map(member => member.user_name),
            z: heatmapZ,
            type: 'heatmap',
            colorscale: 'Viridis'
        }];
    
        setHeatmapData(updatedHeatmapData); // Set new heatmap data
    
        return { labels, datasets };
    };
    
    const parseGroupRecommendationsForBarChart = (data: GroupMemberData[]) => {
        const sortedData = [...data].sort((a, b) => a.user_name.localeCompare(b.user_name));

        const labels = sortedData.map(member => member.user_name);
    
        // Assuming each member has the same set of recommendations
        const allRecTitles = sortedData[0].recommendations.map(rec => rec.rec_title);
    
        const datasets = allRecTitles.map((recTitle, index) => {
            const colorIndex = index % chartColors.length;
            return {
                label: recTitle,
                data: sortedData.map(member => {
                    const rec = member.recommendations.find(rec => rec.rec_title === recTitle);
                    return rec ? Math.round(rec.similarity_score * 1000) : 0;
                }),
                backgroundColor: chartColors[colorIndex],
                borderColor: chartColors[colorIndex].replace('0.2', '1'),
                borderWidth: 1
            };
        });
    
        return { labels, datasets };
    };
    
    const handleFetchData = async () => {
        if (!selectedTag || !selectedCategory) {
            alert('Please select both a group and a category.');
            return;
        }
        try {
            const backendUrl = process.env.REACT_APP_BACKEND_URL;
            const url = `${backendUrl}api/group-recommendations/${selectedCategory}/${selectedTag}?includeSelf=${includeSelf}`;
            const fetchedData = await fetchGroupRecommendations(url);
            const parsedData: any = parseGroupRecommendations(fetchedData);
            setGroupRecommendations(parsedData); // parsedData should be an object with labels and datasets

            const parsedBarChartData = parseGroupRecommendationsForBarChart(fetchedData);
            setBarChartData(parsedBarChartData); // Assuming you have a state to hold this data

        } catch (error) {
            console.error("Error fetching group recommendations: ", error);
        }
    };

    const barChartOptions: any = {
        scales: {
            x: {
                stacked: false,
                grid: {
                    display: false
                }
            },
            y: {
                stacked: false,
                beginAtZero: true
            }
        },
        plugins: {
            legend: {
                display: true
            },
            tooltip: {
                enabled: true,
                mode: 'index',
                intersect: false
            }
        },
        maintainAspectRatio: false,
        responsive: true
    };

    return (
        <>
            <HeaderComponent />
            <Card>
                <Row gutter={16}>
                    <Col span={4}>
                        <Title level={4}>Select Group</Title>
                        <Select
                            style={{ width: '200px' }}
                            placeholder="Select tags"
                            onChange={setSelectedTag}
                            value={selectedTag}
                        >
                            {tags.sort().map(tag => (
                            <Option key={tag} value={tag}>{tag}</Option>
                            ))}
                        </Select>
                    </Col>
                    <Col span={4}>
                        <Title level={4}>Select Category</Title>
                        <Select
                            style={{ width: '200px' }}
                            placeholder="Select a category"
                            onChange={setSelectedCategory}
                            value={selectedCategory}
                        >
                            {categories.sort().map(category => (
                                <Option key={category} value={category}>{category}</Option>
                            ))}
                        </Select>
                    </Col>
                    <Col span={4}>
                        <Checkbox
                            checked={includeSelf}
                            onChange={e => setIncludeSelf(e.target.checked)}
                        >
                            Include Myself
                        </Checkbox>
                        <Button style={{ marginTop: '40px' }} type="primary" onClick={handleFetchData}>Fetch Data</Button>
                    </Col>
                </Row>
                
                {/* Bar Chart Row */}
                <Row gutter={[32, 32]} style={{ marginTop: '20px' }}>
                    <Col span={24}>
                        <Title level={4}>Trait Comparison</Title>
                        <div style={{ height: '400px' }}> {/* Set a fixed height for the chart container */}
                            <Bar data={barChartData} options={barChartOptions} />
                        </div>
                    </Col>
                </Row>

                {/* Radar Chart Row */}
                <Row gutter={[32, 32]} style={{ marginTop: '20px' }}>
                    <Col span={24}>
                        <Title level={4}>Personality Overlap</Title>
                        <div style={{ width: '100%', margin: '0 auto' }}>
                            {!groupRecommendations ? <Spin /> : <Radar data={groupRecommendations} />}
                        </div>
                    </Col>
                </Row>

            </Card>
            <div>
                <h2>Group Comparison Heatmap</h2>
                <Plot
                    data={heatmapData}
                    layout={heatmapLayout}
                    style={{ width: '100%' }} // Set a fixed height for the heatmap
                />
            </div>
        </>
    );
};

export default ComparePage;