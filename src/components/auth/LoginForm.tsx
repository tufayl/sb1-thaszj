import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Loader2, AlertCircle, Info } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export default function LoginForm() {
  const navigate = useNavigate();
  const login = useAuthStore(state => state.login);
  const [isLoading, setIsLoading] = useState(false);
  const [showDemoLogin, setShowDemoLogin] = useState(false);
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await login(credentials.email, credentials.password);
      
      if (success) {
        navigate('/');
      } else {
        setError('Invalid email or password');
        setShowDemoLogin(true);
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError('Authentication failed. Try using demo credentials below.');
      setShowDemoLogin(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = (type: 'admin' | 'manager') => {
    setCredentials({
      email: type === 'admin' ? 'admin@example.com' : 'manager@example.com',
      password: type === 'admin' ? 'admin123' : 'manager123'
    });
    setError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}

          {showDemoLogin && (
            <div className="rounded-md bg-blue-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Info className="h-5 w-5 text-blue-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">
                    Demo Credentials
                  </h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <button
                      type="button"
                      onClick={() => handleDemoLogin('admin')}
                      className="block hover:underline"
                    >
                      • Admin: admin@example.com / admin123
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDemoLogin('manager')}
                      className="block hover:underline mt-1"
                    >
                      • Manager: manager@example.com / manager123
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="input pl-10"
                  placeholder="Email address"
                  value={credentials.email}
                  onChange={(e) => {
                    setCredentials(prev => ({
                      ...prev,
                      email: e.target.value
                    }));
                    setError('');
                  }}
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="input pl-10"
                  placeholder="Password"
                  value={credentials.password}
                  onChange={(e) => {
                    setCredentials(prev => ({
                      ...prev,
                      password: e.target.value
                    }));
                    setError('');
                  }}
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          <div>
            <button 
              type="submit" 
              className="btn btn-primary w-full flex items-center justify-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}