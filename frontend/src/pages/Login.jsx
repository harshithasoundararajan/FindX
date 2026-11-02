import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    try {
      await login(data);
      navigate(location.state?.from?.pathname || '/');
    } catch (err) {
      setError(err?.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-16">
      <div className="wrap max-w-[420px]">
        <div className="bg-white border-[1.5px] border-ink-900 rounded-[3px] shadow-card p-8">
          <h2 className="font-display text-2xl text-ink-900 mb-1.5">Welcome back</h2>
          <p className="text-[13.5px] text-ink-500 mb-6">Sign in with your KCT email to continue.</p>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <label className="block text-[12.5px] font-semibold text-ink-700 mb-1.5">Email</label>
              <input
                {...register('email', { required: 'Email is required' })}
                placeholder="you@kct.ac.in"
                className="w-full px-3 py-2.5 border-[1.5px] border-cream-200 rounded-sm text-[13.5px]"
              />
              {errors.email && <p className="text-lost text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div className="mb-5">
              <label className="block text-[12.5px] font-semibold text-ink-700 mb-1.5">Password</label>
              <input
                type="password"
                {...register('password', { required: 'Password is required' })}
                className="w-full px-3 py-2.5 border-[1.5px] border-cream-200 rounded-sm text-[13.5px]"
              />
              {errors.password && <p className="text-lost text-xs mt-1">{errors.password.message}</p>}
            </div>
            {error && <p className="text-lost text-sm mb-4">{error}</p>}
            <button type="submit" disabled={loading} className="w-full bg-maroon-700 text-white border-none py-3 font-semibold text-sm rounded-sm hover:bg-maroon-600 disabled:opacity-60 transition-colors">
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p className="text-[13px] text-ink-500 mt-5 text-center">
            New to FindX? <Link to="/register" className="text-maroon-700 font-semibold no-underline hover:underline">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
