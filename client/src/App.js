import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';

import Login from './Components/Auth/Login';
import Signup from './Components/Auth/Signup';
import ProfilePage from './Pages/ProfilePage';
import HomePage from './Pages/HomePage';
import BattlePage from './Pages/BattlePage';
import JoinTeamPage from './Pages/JoinTeamPage';
import ErrorPage from './Pages/ErrorPage';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Editor from './Components/Editor/CodeEditor';
import { UserProvider } from './Contexts/UserContext';
import ResultPage from './Components/Result/Result';
import ProtectedRoute from './Components/ProtectedRoute'; 
import PracticePage from './Pages/Practice';
import CreateContestPage from './Pages/ContestCreationPage'

function App() {
  return (
    <div className="App">
      <UserProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />

            {/* Protected Routes */}
            <Route
              path="/login"
              element={
                <GoogleOAuthProvider clientId={`47807524301-97t2ovb411oua4s6crhbbkotoiu5127r.apps.googleusercontent.com`}>
                  <Login />
                </GoogleOAuthProvider>
              }
            />
            <Route
              path="/signup"
              element={
                <GoogleOAuthProvider clientId={`47807524301-97t2ovb411oua4s6crhbbkotoiu5127r.apps.googleusercontent.com`}>
                  <Signup />
                </GoogleOAuthProvider>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/battle"
              element={
                <ProtectedRoute>
                  <BattlePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/contest/:contestId"
              element={
                <ProtectedRoute>
                  <JoinTeamPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/contest/:contestId/team/:teamId/code-editor"
              element={
                <ProtectedRoute>
                  <Editor />
                </ProtectedRoute>
              }
            />
            <Route
              path="/contest/:contestId/result/:teamId"
              element={
                <ProtectedRoute>
                  <ResultPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/practice"
              element={
                <ProtectedRoute>
                  <PracticePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                  <CreateContestPage />
              }
            />

            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </Router>
      </UserProvider>
    </div>
  );
}

export default App;
