import { useState } from 'react';
import api from './api';
import toast from 'react-hot-toast';

export default function Login({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint = isRegister ? '/auth/register' : '/auth/login';
    
    try {
      const { data } = await api.post(endpoint, { email, password });
      if (!isRegister) {
        localStorage.setItem('token', data.token);
        onLogin();
        toast.success('Welcome back!');
      } else {
        toast.success('Account created! Please login.');
        setIsRegister(false);
      }
    } catch (err) {
      toast.error('Operation failed. Check credentials.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">{isRegister ? 'Register' : 'Login'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            className="w-full p-2 border rounded" 
            placeholder="Email" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
          />
          <input 
            className="w-full p-2 border rounded" 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
          />
          <button className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
            {isRegister ? 'Sign Up' : 'Sign In'}
          </button>
        </form>
        <button onClick={() => setIsRegister(!isRegister)} className="w-full text-sm text-blue-500 mt-4 underline">
          {isRegister ? 'Already have an account? Login' : 'Need an account? Register'}
        </button>
      </div>
    </div>
  );
}