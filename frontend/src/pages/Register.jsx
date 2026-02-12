import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await fetch('/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      navigate('/login');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B0B14] px-6">
      <div className="max-w-md w-full bg-[#1A1D24] p-8 rounded-xl shadow-lg">
        <h1 className="text-4xl font-bold text-cyan-400 mb-6 text-center">Create Account</h1>

        {error && (
          <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-gray-300 mb-2 font-medium">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-xl bg-[#0f121a] text-white shadow-inner shadow-cyan-500/40 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-gray-300 mb-2 font-medium">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-xl bg-[#0f121a] text-white shadow-inner shadow-cyan-500/40 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
              placeholder="********"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-gray-300 mb-2 font-medium">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-xl bg-[#0f121a] text-white shadow-inner shadow-cyan-500/40 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
              placeholder="********"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-cyan-400 to-teal-700 font-extrabold rounded-2xl text-[#0f1117] shadow-lg shadow-cyan-500/70 hover:from-cyan-300 hover:to-teal-600 hover:scale-105 transition-transform duration-300"
          >
            Register
          </button>
        </form>

        <p className="mt-6 text-gray-400 text-center">
          Already have an account?{' '}
          <a href="/login" className="text-cyan-400 hover:underline">
            Log In
          </a>
        </p>
      </div>
    </div>
  );
}

export default Register; 