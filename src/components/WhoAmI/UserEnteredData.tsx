import React, { useEffect, useState } from 'react';
import { Input, Button, Row, Col, Tooltip, message } from 'antd';
import { EditOutlined, CheckOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from 'react-query';

// Interface for Demographics Section
interface Demographics {
    name: string;
    age: number;
    gender_identity: string;
    location: string;
  }
  
  // Interface for Education Section
  interface Education {
    highest_level: string;
    field_of_study: string;
  }
  
  // Interface for Work History Section
  interface WorkHistory {
    current_occupation: string;
    industry: string;
    career_goals: string;
  }
  
  // Interface for Relationship Preferences Section
  interface RelationshipPreferences {
    past_relationships: string;
    desired_traits: string;
    relationship_goals: string;
  }
  
// Define interface for the entire user profile, including demographics, education, etc.
interface UserProfile {
    demographics: Demographics;
    education: Education;
    workHistory: WorkHistory;
    relationshipPreferences: RelationshipPreferences;
}

// Fetching user profile data
const fetchUserProfile = async (): Promise<UserProfile> => {
  const authToken = localStorage.getItem('authToken');
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const response = await fetch(`${backendUrl}api/user-data-profile/`, {
      headers: new Headers({
          'Authorization': `Token ${authToken}`,
      }),
  });
  if (!response.ok) throw new Error('Network response was not ok');
  return response.json();
};

// Saving user profile data
const saveUserProfile = async (updatedProfile: UserProfile) => {
  const authToken = localStorage.getItem('authToken');
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const response = await fetch(`${backendUrl}api/save-user-data-profile/`, {
      method: 'PUT', // Or 'POST', depending on your backend
      headers: new Headers({
          'Authorization': `Token ${authToken}`,
          'Content-Type': 'application/json',
      }),
      body: JSON.stringify(updatedProfile),
  });
  if (!response.ok) throw new Error('Network response was not ok');
  return response.json();
};

const UserEnteredData = () => {
    const queryClient = useQueryClient(); // For invalidating and refetching queries
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [profileData, setProfileData] = useState<UserProfile | null>(null);

    // Fetch User Profile Data from the backend
    const { data: fetchedProfileData, isLoading, isError } = useQuery<UserProfile, Error>('userEnteredData', fetchUserProfile);

    // Update local state when the fetched data changes
    useEffect(() => {
      if (fetchedProfileData) {
          setProfileData(fetchedProfileData);
      }
    }, [fetchedProfileData]);

    // Update User Profile Data
    const mutation = useMutation(saveUserProfile, {
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries('userProfile');
            message.success('Profile updated successfully!');
            setIsEditingProfile(false);
        },
    });

    // Handle change function
    const handleProfileChange = (value: string | number | string[], section: keyof UserProfile, field: string) => {
        if (!profileData) return;
        setProfileData({
            ...profileData,
            [section]: {
                ...profileData[section],
                [field]: value,
            },
        });
    };

    // Handle save function
    const handleFinishEditingProfile = async () => {
        if (!profileData) return;
        mutation.mutate(profileData);
    };

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error fetching the user profile.</div>;
    if (!profileData) return <div>Profile data is not available.</div>;

    return (
        <Row gutter={[16, 16]}>
          {/* User Demographics */}
          <Col span={24}>
            {!isEditingProfile ? (
              <Col span={24}>
                {`${profileData.demographics?.name}, ${profileData.demographics?.age} years old, ${profileData.demographics?.gender_identity}, ${profileData.demographics?.location}`}
              </Col>
            ) : (
                <>
                <Row>
                  <Col span={8}><label>Name: </label></Col>
                  <Col span={16}>
                    <Input
                      placeholder="Name"
                      value={profileData.demographics?.name}
                      onChange={(e) => handleProfileChange(e.target.value, 'demographics', 'name')}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col span={8}><label>Age: </label></Col>
                  <Col span={16}>
                    <Input
                      placeholder="Age"
                      value={profileData.demographics?.age}
                      onChange={(e) => handleProfileChange(e.target.value, 'demographics', 'age')}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col span={8}><label>Gender Identity: </label></Col>
                  <Col span={16}>
                    <Input
                    placeholder="Gender Identity"
                    value={profileData.demographics?.gender_identity}
                    onChange={(e) => handleProfileChange(e.target.value, 'demographics', 'gender_identity')}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col span={8}><label>Location: </label></Col>
                  <Col span={16}>
                    <Input
                    placeholder="Location"
                    value={profileData.demographics?.location}
                    onChange={(e) => handleProfileChange(e.target.value, 'demographics', 'location')}
                    />
                  </Col>
                </Row>
              </>
            )}
          </Col>
    
          {/* User Education */}
          <Col span={24}>
                {!isEditingProfile ? (
                    <Col span={24}>{`${profileData.education?.highest_level} in ${profileData.education?.field_of_study}`}</Col>
                ) : (
                    <>
                        <Row>
                            <Col span={8}><label>Highest Level of Education: </label></Col>
                            <Col span={16}>
                            <Input
                                placeholder="Highest Level of Education"
                                value={profileData.education?.highest_level}
                                onChange={(e) => handleProfileChange(e.target.value, 'education', 'highest_level')}
                            />
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}><label>Field of Study: </label></Col>
                            <Col span={16}>
                            <Input
                                placeholder="Field of Study"
                                value={profileData.education?.field_of_study}
                                onChange={(e) => handleProfileChange(e.target.value, 'education', 'field_of_study')}
                            />
                            </Col>
                        </Row>
                    </>
                )}
            </Col>

            {/* User Work History */}
            <Col span={24}>
            {!isEditingProfile ? (
                <Col span={24}>
                <div>
                    {`Current Occupation: ${profileData.workHistory?.current_occupation}, Industry: ${profileData.workHistory?.industry}`}
                    <div>{`Career Goals: ${profileData.workHistory?.career_goals}`}</div>
                </div>
                </Col>
            ) : (
                <>
                <Row>
                    <Col span={8}><label>Current Occupation: </label></Col>
                    <Col span={16}>
                    <Input
                        placeholder="Current Occupation"
                        value={profileData.workHistory?.current_occupation}
                        onChange={(e) => handleProfileChange(e.target.value, 'workHistory', 'current_occupation')}
                    />
                    </Col>
                </Row>
                <Row>
                    <Col span={8}><label>Industry: </label></Col>
                    <Col span={16}>
                    <Input
                        placeholder="Industry"
                        value={profileData.workHistory?.industry}
                        onChange={(e) => handleProfileChange(e.target.value, 'workHistory', 'industry')}
                    />
                    </Col>
                </Row>
                <Row>
                    <Col span={8}><label>Career Goals: </label></Col>
                    <Col span={16}>
                    <Input
                        placeholder="Career Goals"
                        value={profileData.workHistory?.career_goals}
                        onChange={(e) => handleProfileChange(e.target.value, 'workHistory', 'career_goals')}
                    />
                    </Col>
                </Row>
                </>
            )}
            </Col>

            {/* User Relationship Preferences */}
            <Col span={24}>
                {/* User Relationship Preferences */}
                {!isEditingProfile ? (
                    <Col span={24}>
                    <div>
                        {`Past Relationships: ${profileData.relationshipPreferences?.past_relationships}`}
                        <div>{`Desired Traits: ${profileData.relationshipPreferences?.desired_traits}`}</div>
                        <div>{`Relationship Goals: ${profileData.relationshipPreferences?.relationship_goals}`}</div>
                    </div>
                    </Col>
                ) : (
                    <>
                    <Row>
                        <Col span={8}><label>Past Relationships: </label></Col>
                        <Col span={16}>
                        <Input
                            placeholder="Past Relationships"
                            value={profileData.relationshipPreferences?.past_relationships}
                            onChange={(e) => handleProfileChange(e.target.value, 'relationshipPreferences', 'past_relationships')}
                        />
                        </Col>
                    </Row>
                    <Row>
                        <Col span={8}><label>Desired Traits: </label></Col>
                        <Col span={16}>
                        <Input
                            placeholder="Desired Traits"
                            value={profileData.relationshipPreferences?.desired_traits}
                            onChange={(e) => handleProfileChange(e.target.value, 'relationshipPreferences', 'desired_traits')}
                        />
                        </Col>
                    </Row>
                    <Row>
                        <Col span={8}><label>Relationship Goals: </label></Col>
                        <Col span={16}>
                        <Input
                            placeholder="Relationship Goals"
                            value={profileData.relationshipPreferences?.relationship_goals}
                            onChange={(e) => handleProfileChange(e.target.value, 'relationshipPreferences', 'relationship_goals')}
                        />
                        </Col>
                    </Row>
                    </>
                )}
            </Col>

          {/* Edit/Save Button */}
          <Col span={24} style={{ textAlign: 'right' }}>
            <Tooltip title={isEditingProfile ? "Finish Editing" : "Edit Profile"}>
              <Button
                shape="circle"
                icon={isEditingProfile ? <CheckOutlined /> : <EditOutlined />}
                onClick={() => isEditingProfile ? handleFinishEditingProfile() : setIsEditingProfile(true)}
              />
            </Tooltip>
          </Col>
        </Row>
      );
    };
    
    export default UserEnteredData;