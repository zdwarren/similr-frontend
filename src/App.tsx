import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import LoginForm from './components/LoginForm';
import AuthProvider from './AuthProvider';
import { AuthContext } from './AuthContext';
import Landing from './components/Landing';
import ProfileCreate from './components/ProfileCreate/ProfileCreate';
import UserChat from './components/UserChat/UserChat';
import Matches from './components/Matches/Matches';
import SignupForm from './components/SignupForm';
import MatchPage from './components/Admin/MatchPage';

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
        <Route path="/" element={isLoggedIn ? <Navigate to="/matches" /> : <Landing />} />
        <Route path="/profile" element={isLoggedIn ? <ProfileCreate /> : <Navigate to="/login" />} />
        <Route path="/chat" element={isLoggedIn ? <UserChat /> : <Navigate to="/login" />} />
        <Route path="/matches" element={isLoggedIn ? <Matches /> : <Navigate to="/login" />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/admin" element={isAdmin ? <MatchPage /> : <Navigate to="/login" />} /> {/* Add this line */}
      </Routes>
    </Router>
  );
};

export default App;
