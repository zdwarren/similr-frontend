import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import LoginForm from './components/LoginForm';
import AuthProvider from './AuthProvider';
import { AuthContext } from './AuthContext';
import Landing from './components/Landing';
import SignupForm from './components/SignupForm';
import RapidFire from './components/RapidFire/RapidFire';
import Similr from './components/Similr/Similr';
import SimpleProfile from './components/SimpleProfile/SimpleProfile';
import Recommendation from './components/Recommendations/Recommendations';
import PredictChoice from './components/PredictChoice/PredictChoice';
import TopWords from './components/TopWords/TopWords';
import MeetPeople from './components/MeetPeople/MeetPeople';
import WhoAmI from './components/WhoAmI/WhoAmI';
import Compare from './components/Compare/Compare';

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </QueryClientProvider>
  );
};

const AppRoutes: React.FC = () => {
  const { isLoggedIn, isAdmin } = useContext(AuthContext);

  React.useEffect(() => {
    console.log("isLoggedIn state in AppRoutes:", isLoggedIn);
    console.log("isAdmin state in AppRoutes:", isAdmin);
  }, [isLoggedIn, isAdmin]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={isLoggedIn ? <Navigate to="/rapidfire" /> : <Landing />} />
        {/* <Route path="/profile" element={isLoggedIn ? <SimpleProfile /> : <Navigate to="/login" />} /> */}
        <Route path="/rapidfire" element={isLoggedIn ? <RapidFire /> : <Navigate to="/login" />} />
        <Route path="/profile" element={isLoggedIn ? <WhoAmI /> : <Navigate to="/login" />} />
        <Route path="/compare" element={isLoggedIn ? <Compare /> : <Navigate to="/login" />} />
        <Route path="/similr" element={isLoggedIn ? <Similr /> : <Navigate to="/login" />} />
        <Route path="/recommendations" element={isLoggedIn ? <Recommendation /> : <Navigate to="/login" />} />
        <Route path="/predict-choice" element={isLoggedIn ? <PredictChoice /> : <Navigate to="/login" />} />
        <Route path="/topwords" element={isLoggedIn ? <TopWords /> : <Navigate to="/login" />} />
        <Route path="/meetpeople" element={isLoggedIn ? <MeetPeople /> : <Navigate to="/login" />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />
      </Routes>
    </Router>
  );
};

export default App;
