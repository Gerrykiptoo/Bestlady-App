import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    phone: '',
    business_name: '',
    business_type: 'retail'
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/register', formData);
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <form onSubmit={handleRegister} className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Join BestLady</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <input 
          type="text" 
          placeholder="Username" 
          onChange={(e) => setFormData({...formData, username: e.target.value})}
          className="border p-2 mb-4 w-full rounded focus:outline-blue-500"
          required
        />
        <input 
          type="email" 
          placeholder="Email" 
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          className="border p-2 mb-4 w-full rounded focus:outline-blue-500"
          required
        />
        <input 
          type="password" 
          placeholder="Password" 
          onChange={(e) => setFormData({...formData, password: e.target.value})}
          className="border p-2 mb-4 w-full rounded focus:outline-blue-500"
          required
        />
        <input 
          type="text" 
          placeholder="Phone Number" 
          onChange={(e) => setFormData({...formData, phone: e.target.value})}
          className="border p-2 mb-4 w-full rounded focus:outline-blue-500"
          required
        />
        <input 
          type="text" 
          placeholder="Business Name" 
          onChange={(e) => setFormData({...formData, business_name: e.target.value})}
          className="border p-2 mb-4 w-full rounded focus:outline-blue-500"
          required
        />
        <select 
          value={formData.business_type}
          onChange={(e) => setFormData({...formData, business_type: e.target.value})}
          className="border p-2 mb-6 w-full rounded focus:outline-blue-500 bg-white"
        >
          <option value="retail">Retail</option>
          <option value="mall">Mall</option>
          <option value="large_supermarket">Large Supermarket</option>
          <option value="chain_store">Chain Store</option>
        </select>
        <button type="submit" className="bg-blue-600 text-white p-2 w-full rounded hover:bg-blue-700 transition">
          Create Account
        </button>
      </form>
    </div>
  );
};

export default Register;
