import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Welcome to BestLady Supply Chain</h1>
      <p className="mt-4">Reorganizing and optimizing your supply chain with AI.</p>
      <div className="mt-8 space-x-4">
        <Link to="/products" className="bg-blue-600 text-white px-4 py-2 rounded">View Products</Link>
        <Link to="/login" className="bg-gray-200 px-4 py-2 rounded">Login</Link>
      </div>
    </div>
  );
};

export default Home;
