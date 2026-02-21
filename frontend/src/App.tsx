import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import Login from './Login';
import Dashboard from './Dashboard';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) setIsAuthenticated(true);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <>
      <Toaster position="top-right" />
      {isAuthenticated ? (
        <Dashboard onLogout={handleLogout} />
      ) : (
        <Login onLogin={() => setIsAuthenticated(true)} />
      )}
    </>
  );
}

export default App;