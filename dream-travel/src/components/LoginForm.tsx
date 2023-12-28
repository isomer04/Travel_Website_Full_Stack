import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext.tsx';

const LoginForm = () => {
  const { login } = useAuth();
  const [inputUsername, setInputUsername] = useState(''); // Renamed from `username` to `inputUsername`
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:8080/login', {
        username: inputUsername,
        password,
      });
  
      login(response.data);
  
      console.log('Login successful:', response.data);
  
      // Store user data in localStorage
      localStorage.setItem('user', JSON.stringify(response.data));
  
      navigate(`/user/${response.data.username}`, { replace: true });
    } catch (error) {
      console.error('Login failed:', error.response.data);
    }
  };
  

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Sign in to your account
        </h2>

        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <Link
            to="/register"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            register account
          </Link>
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="bg-white p-6 rounded shadow mb-4">
          <h2 className="text-xl font-semibold mb-4">Login Form</h2>
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded mb-3"
            placeholder="Username"
            value={inputUsername}
            onChange={(e) => setInputUsername(e.target.value)}
          />
          <input
            type="password"
            className="w-full p-3 border border-gray-300 rounded mb-3"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className="w-full rounded-md bg-gray-800 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={handleLogin}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
