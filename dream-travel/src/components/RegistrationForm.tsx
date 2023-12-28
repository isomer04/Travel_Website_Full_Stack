import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const RegistrationForm = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();


  const handleRegister = async () => {
    try {
      const response = await axios.post('http://localhost:8080/register', {
        username,
        password,
      });
      
      login(response.data);
      console.log('Registration successful:', response.data);
      navigate(`/user/${response.data.username}`, { replace: true });
    } catch (error) {
      console.error('Registration failed:', error.response.data);
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        {/* <img
          className="mx-auto h-10 w-auto"
          src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
          alt="Your Company"
        /> */}
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Create an account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <Link
            to="/login"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            sign in to your account
          </Link>
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="bg-white p-6 rounded shadow mb-4">
          <h2 className="text-xl font-semibold mb-2">Registration Form</h2>
          <div >
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded mb-3"

              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              // className="mr-2 p-3 border border-gray-300 rounded w-full"
            />
            <input
              type="password"
              className="w-full p-3 border border-gray-300 rounded mb-3"

              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              // className="p-3 border border-gray-300 rounded w-full"
            />
          </div>
          <button
            onClick={handleRegister}
            className="w-full rounded-md  bg-gray-800 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;
