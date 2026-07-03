import React, { createContext, useState, useContext, useEffect } from 'react';

// Create the Context
const UserContext = createContext();

// User Provider to wrap the app and provide the user data globally
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Function to handle user login
  const login = (userData) => {
    setUser(userData);
    // Store user data in sessionStorage for persistence
    sessionStorage.setItem('user', JSON.stringify(userData));
  };

  // Function to handle user logout
  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('user');
  };

  // Check for a user in sessionStorage on component mount
  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []); // Runs only on the initial render

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to access user data
export const useUser = () => {
  return useContext(UserContext);
};
