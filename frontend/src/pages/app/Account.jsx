import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import api from '../../utils/axios';
import { logoutUser } from '../../utils/functions';

const Account = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
      });
    }
  }, [user]);

  const handleLogout = async () => {
    await logoutUser();
    navigate('/');
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.put(`/users/${user.id}`, formData);
      setUser(response.data.user);
      console.log("User updated successfully: ", response.data);
      console.log("User: ", user)
      alert('Account updated successfully!');
    } catch (err) {
      setError('Failed to update account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container px-8 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold mb-4">Account Settings</h1>
        <button className="btn bg-red-600 text-white" onClick={handleLogout}>Logout</button>
      </div>
      <form onSubmit={handleSubmit} className="max-w-md">
        <div className="mb-4">
          <label htmlFor="first_name" className="block mb-2">First Name</label>
          <input
            type="text"
            id="first_name"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="last_name" className="block mb-2">Last Name</label>
          <input
            type="text"
            id="last_name"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block mb-2">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        {error && (
          <p className="text-red-500 mb-4">
            {error}
            {setTimeout(() => setError(null), 5000)}
          </p>
        )}
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={isLoading}
        >
          {isLoading ? 'Updating...' : 'Update Account'}
        </button>
      </form>
    </div>
  );
};

export default Account;