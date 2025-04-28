import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function GoogleCallback() {
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (token) {
      // Use the login method from AuthContext
      login(token)
        .then(() => {
          // Redirect to home page after successful login
          navigate('/');
        })
        .catch((error) => {
          console.error('Failed to login:', error);
          navigate('/auth');
        });
    } else {
      // Handle error case
      console.error('No token received from Google auth');
      navigate('/auth');
    }
  }, [navigate, login]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4">Processing Sign In...</h2>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
      </div>
    </div>
  );
} 